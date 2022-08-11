import { load, YAMLNode } from 'yaml-ast-parser';
import type * as THREE from 'three'
import compute, { Functions } from './compute';
import { YAMLMappingsToObject } from './normalize';
import { geometryArguments } from './geometryArguments';
import { materialArguments } from './materialArguments';
import { lightArguments } from './lightArguments';
import { camerasArguments } from './camerasArguments';
import { Camera, Light, Material, MeshesObject } from './types';
import tokenize from './tokenize';
import processDirective, { parseName, ProcessorName } from './processDirective';
import Pluggable from './Pluggable';
import Controls from './Controls';
import type ForeseenPlugin from './plugins/ForeseenPlugin';

const computeString = (str: string, data: any = {}, fns: Functions = {}): number => {
  const tokens = tokenize(str);
  return compute(tokens, data, fns);
}

const objectIsEmpty = (obj: any) => {
  return Object.keys(obj || {}).length === 0
}

const ucFirst = (str: string) => {
  return (str || '').charAt(0).toUpperCase() + str.slice(1)
}

const pickValues = (obj: any, names: string[]) => {
  return names.map(name => obj[name])
}

const groupDefaultTypes = {
  cameras: 'perspective',
  lights: 'spot',
  meshes: 'box',
}

const groupToClass = {
  cameras: 'camera',
  lights: 'light',
  meshes: 'geometry',
}

const groupClassName = (group: 'cameras' | 'lights' | 'meshes', type = groupDefaultTypes[group]) => `${ucFirst(type)}${ucFirst(groupToClass[group])}`

const createInstance = (group: 'cameras' | 'lights' | 'meshes', info: object, lib: typeof THREE) => {
  const {
    type,
    ...rest
  } = info as { type: string, [key: string]: any }

  const className = groupClassName(group, type)
  const Class = lib[className]
  if (!Class) return null;

  let instance: THREE.Camera | THREE.Light | THREE.Mesh = null

  if (group === 'cameras') {
    const args = pickValues(rest, camerasArguments[type])
    instance = new Class(...args)
  }

  if (group === 'lights') {
    const args = pickValues(rest, lightArguments[type])
    instance = new Class(...args)
  }

  if (group === 'meshes') {
    const args = pickValues(rest, geometryArguments[type])
    const geometry = new Class(...args)
    instance = new lib.Mesh(geometry, rest.material)
  }
  return instance
}

const originalStats = {
  fps: 0,
  frames: 0,
  stamp: 0,
  lastFrameRenderTime: 0
}


class ForeseenEvent<D = any> extends CustomEvent<D> {
}

interface ForeseenEventMap {
  'startrenderloop': ForeseenEvent;
  'stoprenderloop': ForeseenEvent;
  'startanimation': ForeseenEvent;
  'pauseanimation': ForeseenEvent;
  'resumeanimation': ForeseenEvent;
  'stopanimation': ForeseenEvent;
  'prerender': ForeseenEvent;
  'render': ForeseenEvent;
}

export type EventName = keyof ForeseenEventMap;

export const getMeshParameters = (mesh: THREE.Mesh) => {
  // @ts-ignore
  return mesh.geometry?.parameters || {}
}

export const meshHasOutdatedParameters = (mesh: THREE.Mesh, info: any) => {
  const params = getMeshParameters(mesh)
  const paramNames = Object.keys(params);
  for (let p = 0; p < paramNames.length; p += 1) {
    const key = paramNames[p]
    if (typeof info[key] !== 'undefined' && info[key] !== params[key]) {
      return true;
    }
  }
  return false;
}

export class Foreseen extends Pluggable<ForeseenPlugin> {
  constructor(lib: typeof THREE, input: string) {
    super()
    this.#lib = lib
    this.#scene = new lib.Scene()
    this.#clock = new lib.Clock(false)
    this.#canvas = document.createElement('canvas');

    const dom = document.createElement('div');
    dom.className = 'foreseen';
    dom.appendChild(this.#canvas);

    this.#domElement = dom;

    this.#controls = new Controls(this);

    this.update(input)
  }

  #controls: Controls;

  #domElement: HTMLDivElement;

  #canvas: HTMLCanvasElement;

  #input: string;

  #rawYAML: ReturnType<typeof YAMLMappingsToObject> | object | null;

  #ast: YAMLNode;

  #definition: any;

  #lib: typeof THREE;

  #functions: Functions = {};

  #data: {
    now: number;
    startTime: number;
    isRendering: boolean;
    stats: typeof originalStats;
    [k: string]: any;
  } = {
      now: 0,
      startTime: 0,
      isRendering: false,
      stats: { ...originalStats },
    };

  #scene: THREE.Scene;

  #clock: THREE.Clock;

  #animationDuration: number = 0;

  renderers: { [name: string]: THREE.WebGLRenderer } = {};

  cameras: { [name: string]: Camera } = {};

  lights: { [name: string]: Light } = {};

  materials: { [name: string]: Material } = {};

  meshes: { [name: string]: any } = {};

  #afrId: number | undefined;

  #stats = { ...originalStats };

  addPlugins(...plugins: (typeof ForeseenPlugin)[]): this {
    super.addPlugins(...plugins);
    plugins.forEach(({ name }) => {
      const plugin = this.plugins[name];
      if (typeof plugin.registerFunctions === 'function') {
        const pluginFunctions = plugin.registerFunctions();
        Object.assign(this.#functions, (typeof pluginFunctions === 'function' ? pluginFunctions() : pluginFunctions) || {});
      }
      const dom = plugin.domElement;
      if (dom) {
        this.#domElement.querySelector('dialog .controls-content')?.appendChild(dom);
      }
      this.#plugins[plugin.name] = plugin
    })
    return this;
  }

  removePlugin(name: string) {
    const plugin = this.#plugins[name];
    if (!plugin) return this;

    if (typeof plugin?.dispose === 'function') plugin.dispose()
    const dom = plugin.domElement;
    if (dom) this.#domElement.querySelector('dialog .controls-content').removeChild(dom);

    delete this.#plugins[name]
    return this;
  }

  #plugins: { [name: string]: any } = {};

  get plugins() {
    return this.#plugins
  }

  #triggerEvent(event: EventName, ...args: any[]) {
    const fn = this[`on${event}`];
    if (typeof fn === 'function') fn();
    this.dispatchEvent(new CustomEvent(event, { detail: args }));
    return this;
  }

  get scene() {
    return this.#scene
  }

  get defaultRenderer() {
    return this.renderers[Object.keys(this.renderers)[0]]
  }

  get domElement() {
    return this.#domElement
  }

  get defaultCamera() {
    return this.cameras[Object.keys(this.cameras)[0]]
  }

  get defaultMaterial() {
    return this.materials[Object.keys(this.materials)[0]]
  }

  get isRendering() {
    return this.#afrId !== undefined
  }

  get isRunning() {
    return this.#clock.running
  }

  get elapsedTime() {
    return this.#clock.elapsedTime
  }

  get startTime() {
    return this.#clock.startTime
  }

  get data() {
    return Object.freeze({
      ...this.#data,
      stats: this.#stats,
      now: this.elapsedTime,
      startTime: this.startTime,
      animationDuration: this.#animationDuration,
      animationProgress: this.#animationDuration && this.elapsedTime
        ? this.elapsedTime / this.#animationDuration
        : 0,
      isRendering: this.isRendering,
    })
  }

  get yamlObject() {
    return this.#rawYAML;
  }

  get input() {
    return this.#input;
  }

  setSizeFromContainer(container: HTMLElement = this.#domElement.parentNode as HTMLElement) {
    const el = this.#canvas;
    if (container) {
      el.style.display = 'none'
      el.width = container.clientWidth
      el.height = container.clientHeight
      el.style.display = 'block'

      this.defaultRenderer.setSize(el.width, el.height)
      if (this.defaultCamera.type === 'PerspectiveCamera') {
        this.defaultCamera.aspect = el.width / el.height
        this.defaultCamera.updateProjectionMatrix()
      }
    }

    return this.render()
  }

  setSize(width: number, height: number) {
    const el = this.#canvas;
    el.width = width
    el.height = height

    this.defaultRenderer.setSize(width, height)
    if (this.defaultCamera.type === 'PerspectiveCamera') {
      this.defaultCamera.aspect = width / height
      this.defaultCamera.updateProjectionMatrix()
    }

    return this.render()
  }

  // TODO: extend EventTarget / EventEmitter?
  onstartrenderloop: () => void = () => { };

  onstoprenderloop: () => void = () => { };

  onstartanimation: () => void = () => { };

  onpauseanimation: () => void = () => { };

  onresumeanimation: () => void = () => { };

  onstopanimation: () => void = () => { };

  onprerender: () => void = () => { };

  onrender: () => void = () => { };

  addIfNotInScene(object: THREE.Object3D) {
    if (!object.name) {
      console.warn('Object has no name and will not be added to the scene', object)
      return;
    }
    if (!this.#scene.getObjectByName(object.name)) {
      this.#scene.add(object)
    }
  }

  removeFromScene(instance: any) {
    this.#scene.remove(instance)
    if (instance.type === 'Mesh') {
      instance.geometry.dispose()
    }
  }

  // TODO: use the `yaml` package instead and avoid the need for this
  #yamlToObject() {
    this.#rawYAML = YAMLMappingsToObject(this.#ast?.mappings || []) || {};
    const raw = this.#rawYAML;

    const rawVars = raw?.variables || {};
    const data = this.data
    const variables = Object.keys(rawVars).reduce((obj, name) => {
      let value = rawVars[name];
      if (typeof value === 'string') {
        value = this.computeExpression(value, {
          ...data,
          ...obj,
        })
      }
      obj[name] = value;
      return obj;
    }, {});
    this.#data = { ...this.#data, ...variables };

    const obj = {
      ...raw,
      renderers: objectIsEmpty(raw?.renderers) ? {
        defaultRenderer: {}
      } : raw.renderers,
      cameras: objectIsEmpty(raw?.cameras) ? {
        defaultCamera: {
          type: 'perspective',
          position: {
            x: 15,
            y: 15,
            z: 15,
          },
          lookAt: {
            x: 0,
            y: 0,
            z: 0,
          }
        }
      } : raw.cameras,
      lights: objectIsEmpty(raw?.lights) ? {
        defaultLight: {
          type: 'spot',
          position: {
            x: 15,
            y: 15,
            z: 15,
          },
          lookAt: {
            x: 0,
            y: 0,
            z: 0,
          }
        }
      } : raw.lights,
      materials: objectIsEmpty(raw?.materials) ? {
        defaultMaterial: {}
      } : raw.materials,
      meshes: objectIsEmpty(raw?.meshes) ? {
        defaultMesh: {}
      } : raw.meshes,
    };

    ['cameras', 'lights', 'materials', 'meshes', 'renderers'].forEach((group) => {
      Object.keys(obj?.[group] || {}).forEach((name) => {
        if (!name.startsWith('+')) return;
        const definition = obj[group][name];
        delete obj[group][name];
        const [operation, options] = parseName(name);
        const complete = {
          ...options,
          ...definition,
        };
        obj[group] = {
          ...obj[group],
          ...processDirective(operation, complete, obj[group]),
        };
      });
    });

    ['cameras', 'lights', 'meshes'].forEach((group) => {
      Object.keys(obj?.[group] || {}).forEach((name) => {
        ['position', 'rotation', 'scale'].forEach((prop) => {
          ['x', 'y', 'z'].forEach((axis) => {
            if (typeof obj?.[group]?.[name]?.[prop] === 'undefined') return
            let value = obj[group][name][prop]?.[axis] || 0;

            if (typeof value === 'string') {
              value = this.computeExpression(value)
            }

            if (prop === 'rotation') {
              value *= (Math.PI / 180)
            }

            obj[group][name][prop] = obj[group][name][prop] || {};
            obj[group][name][prop][axis] = value
          });
        });
      });
    });

    Object.keys(obj.meshes || {}).forEach((name) => {
      Object.keys(obj.meshes[name] || {}).forEach((prop) => {
        if (['position', 'rotation', 'scale'].includes(prop)) return;
        let value = obj.meshes[name][prop] || 0;

        if (typeof value === 'string') {
          value = this.computeExpression(value)
        }

        obj.meshes[name][prop] = value
      });
    });

    return obj
  }

  update(input: string) {
    if (this.#input === input) return this

    this.#input = input
    this.#ast = load(input)
    return this.#update()
  }

  #update() {
    const previous = this.#definition;
    this.#definition = this.#yamlToObject()
    return this
      .#removeOutdated(previous)
      .#ensureRenderers(previous?.renderers)
      .#ensureCameras(previous?.cameras)
      .#ensureMaterials(previous?.materials)
      .#ensureLights(previous?.lights)
      .#ensureMeshes(previous?.meshes)
      .#applyUpdates();
  }

  #applyProps(instance: any, object: any, exceptions = ['position', 'rotation', 'scale', 'color', 'type']) {
    if (!instance) return;

    Object.keys(object).forEach(key => {
      if (exceptions.includes(key)) return;
      const isMesh = instance.type === 'Mesh';

      let propType = typeof (isMesh
        ? instance.geometry.parameters[key]
        : instance[key]);
      if (propType === 'undefined' || propType === 'function') return;

      if (typeof object[key] === 'function'
        || typeof object[key] === 'undefined'
        || object[key].constructor === 'Object') {
        return;
      }

      try {
        if (isMesh) {
          if (propType === 'boolean') {
            instance.geometry.parameters[key] = !!object[key]
          } else {
            instance.geometry.parameters[key] = object[key]
          }
          return;
        }
        if (propType === 'boolean') {
          instance[key] = !!object[key]
        } else {
          instance[key] = object[key]
        }
      } catch (e) {
        console.warn(`Could not set ${key} to ${instance.name || instance.type}`, e)
      }
    })
  }

  #removeOutdated(previous: { [k: string]: any }) {
    ['renderers', 'cameras', 'lights', 'materials', 'meshes'].forEach((group) => {
      const groupObj = this[group];
      const info = this.#definition[group];
      Object.keys(groupObj).forEach((name) => {
        if (info?.[name] && previous?.[name]?.type === info[name]?.type) return

        if (['cameras', 'lights', 'meshes'].includes(group)) {
          const instance = groupObj[name];
          this.removeFromScene(instance)
        }

        delete this[group][name]
      })
    })

    return this
  }

  #ensureRenderers(previous: {
    [key: string]: any;
  } = {}) {
    const obj = this.#definition
    Object.keys(obj.renderers || {}).forEach((name) => {
      if (this.renderers[name]) return;
      const instance = new this.#lib.WebGLRenderer({
        antialias: true,
        alpha: true,
      })
      if (instance?.shadowMap) instance.shadowMap.enabled = true
      this.renderers[name] = instance
    })
    return this
  }

  #ensureCameras(previous: {
    type?: keyof typeof camerasArguments;
    [key: string]: any;
  } = {}) {
    const obj = this.#definition
    Object.keys(obj.cameras || {}).forEach((name) => {
      const info = obj.cameras[name]
      const { type = 'perspective' } = info
      const Class = this.#lib[`${ucFirst(type)}Camera`]
      if (!Class) {
        if (this.cameras[name]) this.addIfNotInScene(this.cameras[name])
        return
      }
      const defaultCanvas = this.defaultRenderer?.domElement
      if (!defaultCanvas) return;
      const instance = this.cameras[name] || new Class(75, defaultCanvas.width / defaultCanvas.height, 0.1, 1000)
      instance.name = `camera.${name}`
      instance.position.set(info.position?.x || 15, info.position?.y || 15, info.position?.z || 15)
      instance?.lookAt(info.lookAt?.x || 0, info.lookAt?.y || 0, info.lookAt?.z || 0)
      this.cameras[name] = instance
      this.addIfNotInScene(instance)
    })
    return this
  }

  #ensureLights(previous: {
    [key: string]: {
      type?: keyof typeof lightArguments;
      color?: string | number;
      intensity?: number;
      [key: string]: any;
    };
  } = {}) {
    const obj = this.#definition
    Object.keys(obj.lights || {}).forEach((name) => {
      const info = obj.lights[name]
      const { type = 'spot' } = info
      const Class = this.#lib[`${ucFirst(type)}Light`]
      if (!Class) {
        if (this.lights[name]) this.addIfNotInScene(this.lights[name])
        return
      }
      const args = pickValues(info, lightArguments[type])
      const instance = this.lights[name] || new Class(...args)
      instance.name = `lights.${name}`
      instance.position.set(info.position?.x || 15, info.position?.y || 15, info.position?.z || 15)
      instance?.lookAt(info.lookAt?.x || 0, info.lookAt?.y || 0, info.lookAt?.z || 0)
      this.lights[name] = instance
      this.addIfNotInScene(instance)
    })
    return this
  }

  #ensureMaterials(previous: {
    [key: string]: {
      type?: keyof typeof materialArguments,
      color?: string | number,
      [key: string]: any
    }
  } = {}) {
    const obj = this.#definition;
    Object.keys(obj.materials || {}).forEach((name) => {
      const info = obj.materials[name]
      const { type = 'meshStandard', ...params } = info
      const Class = this.#lib[`${ucFirst(type)}Material`]
      if (!Class) return;
      const instance = this.materials[name] || new Class(params)
      this.materials[name] = instance
    })
    return this
  }

  #ensureMeshes(previous: MeshesObject = {}) {
    const obj = this.#definition
    Object.keys(obj?.meshes || {}).forEach((name) => {
      const info = obj.meshes[name]
      const {
        type = 'box',
        material: materialName = name,
      } = info || {}

      let material;
      if (typeof materialName === 'string') {
        material = this.materials[materialName]
          ? this.materials[materialName]
          : this.defaultMaterial
      } else {
        material = this.defaultMaterial
      }

      let found = this.meshes[name];
      if (found) {
        if (found.material.uuid !== material.uuid) {
          found.material = material
        }

        if (meshHasOutdatedParameters(found, info)) {
          this.removeFromScene(found)
          found = null
        }
      }

      const instance = found
        ? found
        : createInstance('meshes', {
          ...info,
          type,
          material,
        }, this.#lib)
      instance.name = instance.name || `meshes.${name}`
      this.meshes[name] = instance;
      this.addIfNotInScene(instance)
    })
    return this
  }

  toObject() {
    return this.#definition
  }

  toJSON() {
    return this.#definition
  }

  computeExpression(value: string, data: any = null): number {
    try {
      return computeString(value, data || this.data, this.#functions)
    } catch (e) {
      console.warn('Could not compute expression "%s"', value, e.stack);
      return 0;
    }
  }

  #applyUpdates() {
    const definition = this.#definition;
    ['materials', 'cameras', 'lights', 'meshes'].forEach(group => {
      Object.keys(definition?.[group] || {}).forEach(name => {

        if (group === 'materials') {
          const instance = this[group]?.[name];
          this.#applyProps(instance, definition[group][name])
        }

        if (group === 'materials' || group === 'lights') {
          const instance = this[group]?.[name];
          // @ts-ignore
          if (instance?.color) {
            // @ts-ignore
            instance?.color.set(definition[group][name].color)
          }
        }

        if (group === 'cameras' || group === 'lights') {
          const instance = this[group]?.[name];
          this.#applyProps(instance, definition[group][name])
          const { x = 15, y = 15, z = 15 } = definition?.[group]?.[name]?.position || {}
          instance?.position?.set(x, y, z)

          if (typeof instance?.lookAt === 'function' && definition[group][name]) {
            const {
              lookAt: {
                x = 0,
                y = 0,
                z = 0,
              } = {},
            } = definition[group][name]
            instance?.lookAt(x, y, z)
          }
        }

        if (group === 'meshes') {
          const instance = this[group]?.[name];
          if (!instance) {
            console.warn('missing instance', name)
            return;
          }
          this.#applyProps(instance, definition[group][name]);
          ['position', 'rotation', 'scale'].forEach((prop) => {
            if (!instance?.[prop]) return;

            const args = [];
            ['x', 'y', 'z'].forEach((axis) => {
              const fromDefinition = definition?.[group]?.[name]?.[prop]?.[axis]
              const defaultValue = prop === 'scale' ? 1 : 0
              args.push(typeof fromDefinition === 'number'
                ? fromDefinition
                : defaultValue)
            });
            instance?.[prop]?.set(...args)
          });
        }

        if (group === 'lights' || group === 'meshes') {
          const instance = this[group]?.[name];
          instance.castShadow = definition[group][name]?.castShadow || false
          instance.receiveShadow = definition[group][name]?.receiveShadow || false
        }
      });
    });
    return this;
  }

  render(time: DOMHighResTimeStamp = 0) {
    this.#afrId = undefined
    this.#triggerEvent('prerender')
    const started = performance.now()
    this.#clock.getElapsedTime()

    this.#update()

    const scene = this.#scene
    const clock = this.#clock
    clock.getDelta()
    const destCtx = this.#canvas.getContext('2d')

    destCtx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    // TODO: pre-renderer-scene hook
    Object.keys(this.renderers).forEach((rendererName) => {
      const renderer = this.renderers[rendererName]
      const rendererCamera = this.#definition.renderers[rendererName]?.camera || rendererName
      const camera = this.cameras[rendererCamera] || this.defaultCamera

      // TODO: pre-renderer-render hook
      if (scene && camera) renderer?.render(scene, camera)

      const leftPrct = 0;
      const topPrct = 0;

      const { width: dw, height: dh } = this.#canvas;
      const { width: sw, height: sh } = renderer.domElement;
      destCtx.drawImage(
        renderer.domElement,
        0,
        0,
        sw,
        sh,
        leftPrct * 0.01 * dw,
        topPrct * 0.01 * dh,
        sw,
        sh
      );

      // TODO: post-renderer-render hook
    })
    const ended = performance.now()
    this.#stats.lastFrameRenderTime = ended - started
    this.#stats.frames += 1;
    const ms = 500;
    if (ended - this.#stats.stamp >= ms) {
      this.#stats.fps = this.#stats.frames / (ended - this.#stats.stamp) * 1000
      this.#stats.stamp = ended
      this.#stats.frames = 0
    }
    this.#triggerEvent('render')
    return this;
  }

  startRenderLoop(restartClock = true) {
    if (this.#afrId) return this
    this.#triggerEvent('startrenderloop')

    this.#stats = { ...originalStats }
    const request = (time) => {
      this.render(time)
      this.#afrId = requestAnimationFrame(request)
    }

    if (restartClock) {
      this.#clock.stop()
      this.#clock.start()
    }

    request(0)
    return this
  }

  stopRenderLoop() {
    this.#triggerEvent('stoprenderloop')
    if (this.#afrId) cancelAnimationFrame(this.#afrId)
    this.#afrId = undefined
    return this
  }

  startAnimation() {
    this.#triggerEvent('startanimation')
    this.#clock.start()
    return this;
  }

  pauseAnimation() {
    this.#triggerEvent('pauseanimation')
    this.#clock.running = false
    return this;
  }

  resumeAnimation() {
    this.#triggerEvent('resumeanimation')
    this.#clock.running = true
    return this;
  }

  stopAnimation() {
    this.#triggerEvent('stopanimation')
    this.#clock.stop()
    return this;
  }
}

export default Foreseen