import { load, YAMLScalar, YAMLSequence, YAMLNode } from 'yaml-ast-parser';
import type * as THREE from 'three'


export interface YAMLMapping extends YAMLNode {
  key: YAMLScalar;
  value: YAMLNode & Partial<YAMLSequence>;
}

const objectIsEmpty = (obj: any) => {
  return Object.keys(obj || {}).length === 0 // && obj.constructor === Object
}

const ucFirst = (str: string) => {
  return (str || '').charAt(0).toUpperCase() + str.slice(1)
}

const pickValues = (obj: any, names: string[]) => {
  return names.map(name => obj[name])
}

const lightArguments = {
  ambient: ['color', 'intensity'],
  directional: ['color', 'intensity'],
  hemisphere: ['skyColor', 'groundColor', 'intensity'],
  point: ['color', 'intensity', 'distance', 'decay'],
  areaRect: ['color', 'intensity', 'width', 'height'],
  spot: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'],
}

const geometryArguments = {
  box: ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'],
  capsule: ['radius', 'length', 'capSubdivisions', 'radialSegments'],
  circle: ['radius', 'segments', 'thetaStart', 'thetaLength'],
  cone: ['radius', 'height', 'radialSegments', 'heightSegments', 'openEnded', 'thetaStart', 'thetaLength'],
  cylinder: ['radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded', 'thetaStart', 'thetaLength'],
  dodecahedron: ['radius', 'detail'],
  // extrude: ['shape', 'options'],
  icosahedron: ['radius', 'detail'],
  // lathe: ['points', 'segments', 'phiStart', 'phiLength'],
  octahedron: ['radius', 'detail'],
  parametric: ['func', 'slices', 'stacks'],
  plane: ['width', 'height', 'widthSegments', 'heightSegments'],
  polyhedron: ['vertices', 'indices', 'radius', 'detail'],
  ring: ['innerRadius', 'outerRadius', 'thetaSegments', 'phiSegments', 'thetaStart', 'thetaLength'],
  // shape: ['shape', 'options'],
  sphere: ['radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength'],
  tetrahedron: ['radius', 'detail'],
  text: ['text', 'parameters'],
  torus: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc'],
  torusKnot: ['radius', 'tube', 'tubularSegments', 'radialSegments', 'p', 'q'],
  tube: ['path', 'tubularSegments', 'radius', 'radiusSegments', 'closed'],
}

const materialArguments = {
  basic: ['color', 'map', 'lightMap', 'specularMap', 'envMap', 'combine', 'reflectivity', 'refractionRatio', 'fog'],
  lambert: ['color', 'map', 'lightMap', 'specularMap', 'envMap', 'combine', 'reflectivity', 'refractionRatio', 'fog'],
  phong: ['color', 'map', 'lightMap', 'specularMap', 'envMap', 'combine', 'reflectivity', 'refractionRatio', 'shininess', 'fog'],
  standard: ['color', 'roughness', 'metalness', 'map', 'lightMap', 'specularMap', 'envMap', 'combine', 'reflectivity', 'refractionRatio', 'fog'],
}

type Camera = THREE.PerspectiveCamera | THREE.OrthographicCamera
type Light = THREE.AmbientLight | THREE.SpotLight | THREE.DirectionalLight | THREE.HemisphereLight
type Material = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | THREE.MeshToonMaterial | THREE.MeshNormalMaterial | THREE.MeshDepthMaterial | THREE.MeshDistanceMaterial | THREE.MeshBasicMaterial | THREE.LineBasicMaterial | THREE.LineDashedMaterial | THREE.PointsMaterial | THREE.SpriteMaterial | THREE.ShaderMaterial
// type Mesh = THREE.Mesh | THREE.Group

class Foreseen {
  constructor(input?: string) {
    this.update(input)
  }

  #input: string;

  #ast: YAMLNode;

  #object: any;

  #scene: THREE.Scene;

  #clock: THREE.Clock;

  #renderers: { [name: string]: THREE.WebGLRenderer } = {};

  #cameras: { [name: string]: Camera } = {};

  #lights: { [name: string]: Light } = {};

  #materials: { [name: string]: Material } = {};

  #meshes: { [name: string]: any } = {};

  #afrId: number | undefined;

  get scene() {
    return this.#scene
  }

  get clock() {
    return this.#clock
  }

  get renderers() {
    return this.#renderers
  }

  get cameras() {
    return this.#cameras
  }

  get lights() {
    return this.#lights
  }

  get materials() {
    return this.#materials
  }

  get meshes() {
    return this.#meshes
  }

  get defaultRenderer() {
    return this.#renderers[Object.keys(this.#renderers)[0]]
  }

  get defaultCamera() {
    return this.#cameras[Object.keys(this.#cameras)[0]]
  }

  get defaultMaterial() {
    return this.#materials[Object.keys(this.#materials)[0]]
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

  update(input: string) {
    if (this.#input === input) return this
    this.#input = input
    this.#scene = new window.THREE.Scene()
    this.#clock = new window.THREE.Clock()
    this.#ast = load(input)
    return this.#toObject().reset()
  }

  #toObject() {
    const previous = this.#object
    const itemsMapper = (item) => typeof item.value.valueObject !== 'undefined' ? item?.value?.valueObject : item?.value?.value;

    const mappingsReducer = (obj, {
      key: { value: key },
      value: valueNode,
    }: YAMLMapping) => {
      if (valueNode?.items) {
        obj[key] = valueNode.items.map(itemsMapper)
        return obj
      }

      if (valueNode?.mappings) {
        obj[key] = valueNode.mappings.reduce(mappingsReducer, {})
        return obj
      }

      if (!valueNode) return {}

      obj[key] = typeof valueNode.valueObject !== 'undefined'
        ? valueNode.valueObject
        : valueNode.value
      return obj
    };

    this.#object = this.#ast?.mappings?.reduce(mappingsReducer, {}) || {}
    return this
  }

  reset() {
    const scene = this.#scene;
    const obj = this.toObject(true)

    const currentRenderers = Object.keys(this.#renderers)
    const newRenderers = Object.keys(obj.renderers)
    currentRenderers.forEach((name) => {
      if (!newRenderers.includes(name)) {
        this.#renderers[name].dispose()
        delete this.#renderers[name]
      }
    })
    Object.keys(obj.renderers).forEach((name) => {
      if (this.#renderers[name]) return;
      console.info('create renderer', name)
      this.#renderers[name] = new window.THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      })
    })


    const currentCameras = Object.keys(this.#cameras)
    const newCameras = Object.keys(obj.cameras)
    currentCameras.forEach((name) => {
      if (!newCameras.includes(name)) {
        this.#cameras[name].parent.remove(this.#cameras[name])
        delete this.#cameras[name]
      }
    })
    Object.keys(obj.cameras).forEach((name) => {
      const info = obj.cameras[name]
      const { type = 'perspective' } = info
      const Class = window.THREE[`${ucFirst(type)}Camera`]
      if (!Class) return;
      const defaultCanvas = this.defaultRenderer.domElement
      const instance = this.#cameras[name] || new Class(75, defaultCanvas.width / defaultCanvas.height, 0.1, 1000)
      instance.position.set(info.position?.x || 15, info.position?.y || 15, info.position?.z || 15)
      instance?.lookAt(info.lookAt?.x || 0, info.lookAt?.y || 0, info.lookAt?.z || 0)
      this.#cameras[name] = instance
      scene.add(instance)
    })

    const currentLights = Object.keys(this.#lights)
    const newLights = Object.keys(obj.lights)
    currentLights.forEach((name) => {
      if (!newLights.includes(name)) {
        this.#lights[name].parent.remove(this.#lights[name])
        delete this.#lights[name]
      }
    })
    Object.keys(obj.lights).forEach((name) => {
      const info = obj.lights[name]
      const { type = 'spot' } = info
      const Class = window.THREE[`${ucFirst(type)}Light`]
      if (!Class) return;
      const args = pickValues(info, lightArguments[type])
      const instance = this.#lights[name] || new Class(...args)
      instance.position.set(info.position?.x || 15, info.position?.y || 15, info.position?.z || 15)
      instance?.lookAt(info.lookAt?.x || 0, info.lookAt?.y || 0, info.lookAt?.z || 0)
      this.#lights[name] = instance
      scene.add(instance)
    })

    const currentMaterials = Object.keys(this.#materials)
    const newMaterials = Object.keys(obj.materials)
    currentMaterials.forEach((name) => {
      if (!newMaterials.includes(name)) {
        delete this.#materials[name]
      }
    })
    Object.keys(obj.materials).forEach((name) => {
      const info = obj.materials[name]
      const { type = 'meshStandard', ...params } = info
      const Class = window.THREE[`${ucFirst(type)}Material`]
      if (!Class) return;
      const instance = this.#materials[name] || new Class(params)
      this.#materials[name] = instance
    })

    const currentMeshes = Object.keys(this.#meshes)
    const newMeshes = Object.keys(obj.meshes)
    currentMeshes.forEach((name) => {
      if (!newMeshes.includes(name)) {
        this.#meshes[name].parent.remove(this.#meshes[name])
        delete this.#meshes[name]
      }
    })
    Object.keys(obj.meshes).forEach((name) => {
      const info = obj.meshes[name]
      const {
        type = 'box',
        material: materialName = name,
      } = info
      const Class = window.THREE[`${ucFirst(type)}Geometry`]
      if (!Class) return;
      const args = pickValues(info, geometryArguments[type])
      const geometry = new Class(...args)
      const instance = new window.THREE.Mesh(geometry, this.#materials[materialName] || this.defaultMaterial)
      instance.position.set(info.position?.x || 0, info.position?.y || 0, info.position?.z || 0)
      this.#meshes[name] = instance
      scene.add(instance)
    })

    // console.info('reset', JSON.stringify(obj, null, 2), this.#meshes?.cylinder?.geometry)
    // console.info('reset', {
    //   renderers: this.#renderers,
    //   cameras: this.#cameras,
    //   lights: this.#lights,
    //   materials: this.#materials,
    //   meshes: this.#meshes,
    // })

    this.#scene = scene
    return this
  }

  toObject(withDefaults: boolean = false) {
    if (withDefaults) {
      const obj = this.#object
      return {
        ...obj,
        renderers: objectIsEmpty(obj?.renderers) ? {
          defaultRenderer: {}
        } : obj.renderers,
        cameras: objectIsEmpty(obj?.cameras) ? {
          defaultCamera: {}
        } : obj.cameras,
        lights: objectIsEmpty(obj?.lights) ? {
          defaultLight: {}
        } : obj.lights,
        materials: objectIsEmpty(obj?.materials) ? {
          defaultMaterial: {}
        } : obj.materials,
        meshes: objectIsEmpty(obj?.meshes) ? {
          defaultMesh: {}
        } : obj.meshes,
      }
    }
    return this.#object
  }

  toJSON() {
    return this.toObject()
  }

  #renderAnimationFrame(time: DOMHighResTimeStamp) {
    this.#afrId = undefined
    // TODO: pre-renderer-scene hook
    Object.keys(this.#renderers).forEach((rendererName) => {
      const renderer = this.#renderers[rendererName]
      const rendererCamera = this.toObject(true).renderers[rendererName]?.camera || rendererName
      const camera = this.#cameras[rendererCamera] || this.defaultCamera
      const scene = this.#scene
      const clock = this.#clock

      clock.getDelta()

      // TODO: pre-renderer-render hook
      renderer.render(scene, camera)
      // TODO: post-renderer-render hook
    })
    // TODO: post-renderer-scene hook
  }

  render() {
    if (this.#afrId) return this
    // if (this.#clock.running)
    const request = (time) => {
      this.#renderAnimationFrame(time)
      this.render()
    }
    this.#afrId = requestAnimationFrame(request)
    return this
  }

  stop() {
    if (this.#afrId) cancelAnimationFrame(this.#afrId)
    this.#afrId = undefined
    return this
  }
}

export default Foreseen