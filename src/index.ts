import { load, YAMLNode } from 'yaml-ast-parser';
import type * as THREE from 'three'
// import { diff } from 'deep-object-diff';
import compute from './compute';
import { YAMLMappingsToObject } from './normalize';
import { geometryArguments } from './geometryArguments';
import { materialArguments } from './materialArguments';
import { lightArguments } from './lightArguments';
import { camerasArguments } from './camerasArguments';
import { Camera, Light, Material, MeshesObject } from './types';
import tokenize from './tokenize';

const computeString = (str: string, data: any = {}, api: {
  [k: string]: (...args: any[]) => any;
} = {}): number => {
  const tokens = tokenize(str);
  return compute(tokens, data);
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

const applyProps = (instance: any, object: any, exceptions = ['position', 'rotation', 'scale', 'color']) => {
  Object.keys(object).forEach(key => {
    if (exceptions.includes(key)) return;

    const propType = typeof instance[key];
    if (propType === 'undefined' || propType === 'function') return;

    if (typeof object[key] === 'function'
      || typeof object[key] === 'undefined'
      || object[key].constructor === 'Object') {
      return;
    }

    try {
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

class Foreseen {
  constructor(lib: typeof THREE, input: string) {
    this.#lib = lib
    this.#scene = new lib.Scene()
    this.#clock = new lib.Clock()
    this.update(input)
  }

  #input: string;

  #ast: YAMLNode;

  #object: any;

  #lib: typeof THREE;

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

  get scene() {
    return this.#scene
  }

  get clock() {
    return this.#clock
  }

  get defaultRenderer() {
    return this.renderers[Object.keys(this.renderers)[0]]
  }

  get domElement() {
    return this.defaultRenderer.domElement
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

  addIfNoInScene(object: THREE.Object3D) {
    if (!object.name) throw new Error('Missing object name')
    if (!this.#scene.getObjectByName(object.name)) {
      this.#scene.add(object)
    }
  }

  removeFromScene(object: THREE.Object3D) {
    this.#scene.remove(object)
  }

  #computeValue() {
    const raw = YAMLMappingsToObject(this.#ast?.mappings || []) || {};

    const rawVars = raw?.variables || {};
    const variables = Object.keys(rawVars).reduce((obj, name) => {
      let value = rawVars[name];
      if (typeof value === 'string') {
        value = this.computeNumber(value, {
          ...this.#data,
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
        defaultCamera: {}
      } : raw.cameras,
      lights: objectIsEmpty(raw?.lights) ? {
        defaultLight: {}
      } : raw.lights,
      materials: objectIsEmpty(raw?.materials) ? {
        defaultMaterial: {}
      } : raw.materials,
      meshes: objectIsEmpty(raw?.meshes) ? {
        defaultMesh: {}
      } : raw.meshes,
    };

    ['cameras', 'lights', 'meshes'].forEach((group) => {
      Object.keys(obj?.[group] || {}).forEach((name) => {
        ['position', 'rotation', 'scale'].forEach((prop) => {
          ['x', 'y', 'z'].forEach((axis) => {
            if (typeof obj?.[group]?.[name]?.[prop]?.[axis] === 'undefined') return
            let value = obj[group][name][prop][axis]

            if (typeof value === 'string') {
              value = this.computeNumber(value)
            }

            if (prop === 'rotation') {
              value *= (Math.PI / 180)
            }

            obj[group][name][prop][axis] = value
          });
        });
      });
    });

    return obj
  }

  update(input: string) {
    if (this.#input === input) return this
    this.#input = input
    this.#ast = load(input)
    const previous = this.#object;
    this.#object = this.#computeValue()

    this.#removeOutdated(previous)

    return this
      .#createRenderers(previous?.renderers)
      .#createCameras(previous?.cameras)
      .#createMaterials(previous?.materials)
      .#createLights(previous?.lights)
      .#createMeshes(previous?.meshes);
  }

  #removeOutdated(previous: { [k: string]: any }) {
    ['renderers', 'cameras', 'lights', 'materials', 'meshes'].forEach((group) => {
      const groupObj = this[group];
      const info = this.#object[group];
      Object.keys(groupObj).forEach((name) => {
        if (info?.[name] && previous?.[name]?.type === info[name]?.type) return

        if (['cameras', 'lights', 'meshes'].includes(group)) {
          this.#scene.remove(groupObj[name])
        }

        delete this[group][name]
      })
    })
  }

  #createRenderers(previous: {
    [key: string]: any;
  } = {}) {
    const obj = this.#object
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

  #createCameras(previous: {
    type?: keyof typeof camerasArguments;
    [key: string]: any;
  } = {}) {
    const scene = this.#scene;
    const obj = this.#object
    Object.keys(obj.cameras || {}).forEach((name) => {
      const info = obj.cameras[name]
      const { type = 'perspective' } = info
      const Class = this.#lib[`${ucFirst(type)}Camera`]
      if (!Class) {
        if (this.cameras[name]) this.addIfNoInScene(this.cameras[name])
        return
      }
      const defaultCanvas = this.defaultRenderer?.domElement
      if (!defaultCanvas) return;
      const instance = this.cameras[name] || new Class(75, defaultCanvas.width / defaultCanvas.height, 0.1, 1000)
      instance.name = `camera.${name}`
      instance.position.set(info.position?.x || 15, info.position?.y || 15, info.position?.z || 15)
      instance?.lookAt(info.lookAt?.x || 0, info.lookAt?.y || 0, info.lookAt?.z || 0)
      this.cameras[name] = instance
      this.addIfNoInScene(instance)
    })
    return this
  }

  #createLights(previous: {
    [key: string]: {
      type?: keyof typeof lightArguments;
      color?: string | number;
      intensity?: number;
      [key: string]: any;
    };
  } = {}) {
    const scene = this.#scene;
    const obj = this.#object
    Object.keys(obj.lights || {}).forEach((name) => {
      const info = obj.lights[name]
      const { type = 'spot' } = info
      const Class = this.#lib[`${ucFirst(type)}Light`]
      if (!Class) {
        if (this.lights[name]) this.addIfNoInScene(this.lights[name])
        return
      }
      const args = pickValues(info, lightArguments[type])
      const instance = this.lights[name] || new Class(...args)
      instance.name = `lights.${name}`
      instance.position.set(info.position?.x || 15, info.position?.y || 15, info.position?.z || 15)
      instance?.lookAt(info.lookAt?.x || 0, info.lookAt?.y || 0, info.lookAt?.z || 0)
      this.lights[name] = instance
      this.addIfNoInScene(instance)
    })
    return this
  }

  #createMaterials(previous: {
    [key: string]: {
      type?: keyof typeof materialArguments,
      color?: string | number,
      [key: string]: any
    }
  } = {}) {
    const obj = this.#object;
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

  #createMeshes(previous: MeshesObject = {}) {
    const obj = this.#object
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
      if (found && found.material.uuid !== material.uuid) {
        found.material = material
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
      this.addIfNoInScene(instance)
    })
    return this
  }

  toObject() {
    return this.#object
  }

  toJSON() {
    return this.#object
  }

  computeNumber(value: string, data: any = null): number {
    return computeString(value, data || this.data)
  }

  #applyUpdates() {
    const raw = this.#object;
    // console.group('applying updates');
    ['materials', 'cameras', 'lights', 'meshes'].forEach(group => {
      // console.group(group);
      Object.keys(raw?.[group] || {}).forEach(name => {
        if (group === 'materials') {
          const instance = this[group]?.[name];
          applyProps(instance, raw[group][name])
        }

        if (group === 'materials' || group === 'lights') {
          const instance = this[group]?.[name];
          // @ts-ignore
          if (instance?.color) {
            // @ts-ignore
            instance?.color.set(raw[group][name].color)
          }
        }

        if (group === 'cameras' || group === 'lights') {
          const instance = this[group]?.[name];
          applyProps(instance, raw[group][name])
          const { x = 15, y = 15, z = 15 } = raw?.[group]?.[name]?.position || {}
          instance?.position?.set(x, y, z)

          if (typeof instance?.lookAt === 'function' && raw[group][name]) {
            const {
              lookAt: {
                x = 0,
                y = 0,
                z = 0,
              } = {},
            } = raw[group][name]
            instance.lookAt(x, y, z)
          }
        }

        if (group === 'meshes') {
          const instance = this[group]?.[name];
          applyProps(instance, raw[group][name]);
          ['position', 'rotation', 'scale'].forEach((prop) => {
            const args = [];
            ['x', 'y', 'z'].forEach((axis) => {
              const value = raw?.[group]?.[name]?.[prop]?.[axis]
                || instance?.[prop]?.[axis]
                || 0
              args.push(value || instance?.[prop]?.[axis] || 0)
              if (typeof instance !== 'undefined') {
                instance[prop][axis] = value
              }
            });
            instance?.[prop]?.set(...args)
          });
        }

        if (group === 'lights' || group === 'meshes') {
          const instance = this[group]?.[name];
          instance.castShadow = raw[group][name]?.castShadow || false
          instance.receiveShadow = raw[group][name]?.receiveShadow || false
        }
      });
      // console.groupEnd();
    });
    // console.groupEnd();
  }

  render(time: DOMHighResTimeStamp = 0) {
    this.#afrId = undefined
    const started = performance.now()

    this.#object = this.#computeValue();
    this.#applyUpdates();

    // TODO: pre-renderer-scene hook
    Object.keys(this.renderers).forEach((rendererName) => {
      const renderer = this.renderers[rendererName]
      const rendererCamera = this.#object.renderers[rendererName]?.camera || rendererName
      const camera = this.cameras[rendererCamera] || this.defaultCamera
      const scene = this.#scene
      const clock = this.#clock

      clock.getDelta()

      // TODO: pre-renderer-render hook
      renderer.render(scene, camera)
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
    // TODO: post-renderer-scene hook
    return this;
  }

  startRenderLoop(restartClock = true) {
    if (this.#afrId) return this

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
    if (this.#afrId) cancelAnimationFrame(this.#afrId)
    this.#afrId = undefined
    return this
  }
}

export default Foreseen