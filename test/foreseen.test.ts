import * as THREE from 'three';
import Foreseen from '../src';
import { getFixtureContentSync } from './getFixtureContent';

const yamlFixture = getFixtureContentSync('references');

const waitMs = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

const MockedLib = { ...THREE }

// @ts-ignore
MockedLib.WebGLRenderer = class {
  constructor(_params: any) {
    this.#el = document.createElement('canvas')
  }

  #el: HTMLCanvasElement;

  get domElement() {
    return this.#el;
  }

  render = jest.fn();
} as unknown as THREE.WebGL1Renderer

describe('Foreseen', () => {
  describe('instanciations', () => {
    it('does not throw', () => {
      let instance;
      expect(() => instance = new Foreseen(MockedLib, '')).not.toThrow();
    })
  })

  describe('instance', () => {
    let instance;
    beforeAll(() => {
      instance = new Foreseen(MockedLib, '');
    })

    it('has a default renderer', () => {
      expect(instance).toHaveProperty('renderers');
      expect(instance).toHaveProperty('defaultRenderer');
    })

    it('has a default camera', () => {
      expect(instance).toHaveProperty('cameras');
      expect(instance).toHaveProperty('cameras.defaultCamera');
      expect(instance).toHaveProperty('defaultCamera');
      expect(instance).toHaveProperty('defaultCamera.name', 'camera.defaultCamera');
    })

    describe('clock', () => {
      it('can be started', async () => {
        expect(instance).toHaveProperty('isRendering', false);
        expect(instance).not.toHaveProperty('clock');
        expect(instance).toHaveProperty('isRunning', false);
        expect(instance).toHaveProperty('elapsedTime', 0);
        expect(instance).toHaveProperty('startTime', 0);
        // const original = instance.data;
        expect(instance).toHaveProperty('data.now', 0);
        instance.startAnimation();
        expect(instance).toHaveProperty('isRunning', true);

        await waitMs(1000);
        instance.render();

        expect(instance.data.now).toBeGreaterThanOrEqual(1);
        expect(instance.data.now).toBeLessThanOrEqual(2);

        expect(instance.elapsedTime).toBeGreaterThan(0);
        expect(instance.startTime).toBeGreaterThan(0);
        expect(instance).toHaveProperty('isRendering', false);
      })
    })

    describe('event handlers', () => {
      beforeEach(() => {
        instance = new Foreseen(MockedLib, '');
        instance.onstartrenderloop = jest.fn()
        instance.onstoprenderloop = jest.fn()
        instance.onstartanimation = jest.fn()
        instance.onpauseanimation = jest.fn()
        instance.onresumeanimation = jest.fn()
        instance.onstopanimation = jest.fn()
        instance.onprerender = jest.fn()
        instance.onrender = jest.fn()
      })

      describe('onstartrenderloop', () => {
        it('is called when starting the render loop', async () => {
          expect(instance.onstartrenderloop).toHaveBeenCalledTimes(0)
          instance
            .startRenderLoop();
          expect(instance.onstartrenderloop).toHaveBeenCalledTimes(1)
        })
      })

      describe('onstoprenderloop', () => {
        it('is called when stopping the render loop', async () => {
          expect(instance.onstoprenderloop).toHaveBeenCalledTimes(0)
          instance
            .startRenderLoop()
            .stopRenderLoop();
          expect(instance.onstoprenderloop).toHaveBeenCalledTimes(1)
        })
      })

      describe('onstartanimation', () => {
        it('is called when starting the animation', async () => {
          expect(instance.onstartanimation).toHaveBeenCalledTimes(0)
          instance
            .startAnimation();
          expect(instance.onstartanimation).toHaveBeenCalledTimes(1)
        })
      })

      describe('onpauseanimation', () => {
        it('is called is called when pausing animation', async () => {
          expect(instance.onpauseanimation).toHaveBeenCalledTimes(0)
          instance
            .startAnimation()
            .pauseAnimation();
          expect(instance.onpauseanimation).toHaveBeenCalledTimes(1)
        })
      })

      describe('onresumeanimation', () => {
        it('is called when the animation is resumed', async () => {
          expect(instance.onresumeanimation).toHaveBeenCalledTimes(0)
          instance
            .startAnimation()
            .pauseAnimation()
            .resumeAnimation();
          expect(instance.onresumeanimation).toHaveBeenCalledTimes(1)
        })
      })

      describe('onstopanimation', () => {
        it('is called when stopping the animation', async () => {
          expect(instance.onstopanimation).toHaveBeenCalledTimes(0)
          instance
            .startAnimation()
            .stopAnimation();
          expect(instance.onstopanimation).toHaveBeenCalledTimes(1)
        })
      })

      describe('onprerender', () => {
        it('is called when rendering', async () => {
          expect(instance.onprerender).toHaveBeenCalledTimes(0)
          instance
            .render();
          expect(instance.onprerender).toHaveBeenCalledTimes(1)
        })

        it('is called several times when rendering loops', async () => {
          expect(instance.onprerender).toHaveBeenCalledTimes(0)
          instance
            .startRenderLoop();
          await waitMs(50)
          expect(instance.onprerender).toHaveBeenCalled()
          expect(instance.onprerender.mock.calls.length).toBeGreaterThan(2)
        })
      })

      describe('onrender', () => {
        it('is called when rendering', async () => {
          expect(instance.onrender).toHaveBeenCalledTimes(0)
          instance
            .render();
          expect(instance.onrender).toHaveBeenCalledTimes(1)
        })

        it('is called several times when rendering loops', async () => {
          expect(instance.onrender).toHaveBeenCalledTimes(0)
          instance
            .startRenderLoop();
          await waitMs(50)
          expect(instance.onrender).toHaveBeenCalled()
          expect(instance.onrender.mock.calls.length).toBeGreaterThan(2)
        })
      })
    })

    describe('rendering', () => {
      beforeAll(() => {
        instance = new Foreseen(MockedLib, '');
      })
      it('can be started individually', () => {
        expect(instance).toHaveProperty('isRendering', false);
        expect(() => instance.startRenderLoop()).not.toThrow();
        expect(instance).toHaveProperty('isRendering', true);
      })

      it('can be stopped individually', () => {
        expect(instance).toHaveProperty('isRendering', true);
        expect(() => instance.stopRenderLoop()).not.toThrow();
        expect(instance).toHaveProperty('isRendering', false);
      })

      it('provides statistics in data', async () => {
        expect(instance).toHaveProperty('isRendering', false);
        expect(() => instance.startRenderLoop()).not.toThrow();
        // const original = instance.data;
        await waitMs(1000);
        expect(instance).toHaveProperty('isRendering', true);
        expect(() => instance.stopRenderLoop()).not.toThrow();
        expect(instance).toHaveProperty('isRendering', false);
      })
    })

    describe('cameras', () => {
      beforeAll(() => {
        instance = new Foreseen(MockedLib, '');
      })
      describe('default', () => {
        it('is created when nothing is provided', () => {
          expect(instance).toHaveProperty('cameras');
          expect(instance.cameras).toHaveProperty('defaultCamera');
          expect(instance.cameras).toHaveProperty('defaultCamera.type', 'PerspectiveCamera');
        })
        it('is positioned with default values', () => {
          expect(instance.cameras).toHaveProperty('defaultCamera.position.x', 15);
          expect(instance.cameras).toHaveProperty('defaultCamera.position.y', 15);
          expect(instance.cameras).toHaveProperty('defaultCamera.position.z', 15);
        })
        it('is orientated with default values', () => {
          const passedVector = new THREE.Vector3();
          const returnedVector = instance.cameras.defaultCamera.getWorldDirection(passedVector);
          expect(returnedVector).toHaveProperty('x', -0.5773502691896257);
          expect(returnedVector).toHaveProperty('y', -0.5773502691896257);
          expect(returnedVector).toHaveProperty('z', -0.5773502691896261);
          expect(passedVector).toHaveProperty('x', -0.5773502691896257);
          expect(passedVector).toHaveProperty('y', -0.5773502691896257);
          expect(passedVector).toHaveProperty('z', -0.5773502691896261);
        })
      })
      describe('custom', () => {
        it('can be created', () => {
          instance.update(`cameras:
  customCamera: {}`)
          expect(instance.cameras).toHaveProperty('customCamera');
          expect(instance.cameras).toHaveProperty('customCamera.type', 'PerspectiveCamera');
        })
        it('is positioned with default values', () => {
          expect(instance.cameras).toHaveProperty('customCamera.position.x', 15);
          expect(instance.cameras).toHaveProperty('customCamera.position.y', 15);
          expect(instance.cameras).toHaveProperty('customCamera.position.z', 15);
        })
      })
    })

    describe('lights', () => {
      beforeAll(() => {
        instance = new Foreseen(MockedLib, '');
      })
      describe('default', () => {
        it('is created when nothing is provided', () => {
          expect(instance).toHaveProperty('lights');
          expect(instance.lights).toHaveProperty('defaultLight');
          expect(instance.lights).toHaveProperty('defaultLight.type', 'SpotLight');
        })
        it('is positioned with default values', () => {
          expect(instance.lights).toHaveProperty('defaultLight.position.x', 15);
          expect(instance.lights).toHaveProperty('defaultLight.position.y', 15);
          expect(instance.lights).toHaveProperty('defaultLight.position.z', 15);
        })
        it('is orientated with default values', () => {
          const passedVector = new THREE.Vector3();
          const returnedVector = instance.lights.defaultLight.getWorldDirection(passedVector);
          expect(returnedVector).toHaveProperty('x', 0.5773502691896257);
          expect(returnedVector).toHaveProperty('y', 0.5773502691896257);
          expect(returnedVector).toHaveProperty('z', 0.5773502691896261);
          expect(passedVector).toHaveProperty('x', 0.5773502691896257);
          expect(passedVector).toHaveProperty('y', 0.5773502691896257);
          expect(passedVector).toHaveProperty('z', 0.5773502691896261);
        })
        it('is scaled with default values', () => {
          expect(instance.lights).toHaveProperty('defaultLight.scale.x', 1);
          expect(instance.lights).toHaveProperty('defaultLight.scale.y', 1);
          expect(instance.lights).toHaveProperty('defaultLight.scale.z', 1);
        })
      })
      describe('custom', () => {
        it('can be created', () => {
          instance.update(`lights:
  customLight: {}`)
          expect(instance.lights).toHaveProperty('customLight');
          expect(instance.lights).toHaveProperty('customLight.type', 'SpotLight');
          instance.update(`lights:
  customLight:
    type: ambient`)
          expect(instance.lights).toHaveProperty('customLight');
          expect(instance.lights).toHaveProperty('customLight.type', 'AmbientLight');
        })
      })
    })

    describe('materials', () => {
      beforeAll(() => {
        instance = new Foreseen(MockedLib, '');
      })
      describe('default', () => {
        it('is created when nothing is provided', () => {
          expect(instance).toHaveProperty('materials');
          expect(instance.materials).toHaveProperty('defaultMaterial');
          expect(instance.materials).toHaveProperty('defaultMaterial.type', 'MeshStandardMaterial');
        })
        it('is positioned with default values', () => {
          expect(instance.materials).toHaveProperty('defaultMaterial.color.r', 1);
          expect(instance.materials).toHaveProperty('defaultMaterial.color.g', 1);
          expect(instance.materials).toHaveProperty('defaultMaterial.color.b', 1);
        })
        it('is scaled with default values', () => {
          expect(instance.materials).toHaveProperty('defaultMaterial.emissiveIntensity', 1);
        })
      })
      describe('custom', () => {
        it('can be created', () => {
          instance.update(`materials:
  customMaterial: {}`)
          expect(instance.materials).toHaveProperty('customMaterial');
          expect(instance.materials).toHaveProperty('customMaterial.type', 'MeshStandardMaterial');
        })
        it('is positioned with default values', () => {
          expect(instance.materials).toHaveProperty('customMaterial.color.r', 1);
          expect(instance.materials).toHaveProperty('customMaterial.color.g', 1);
          expect(instance.materials).toHaveProperty('customMaterial.color.b', 1);
        })
        it('is scaled with default values', () => {
          expect(instance.materials).toHaveProperty('customMaterial.emissiveIntensity', 1);
        })
      })
    })

    describe('meshes', () => {
      beforeAll(() => {
        instance = new Foreseen(MockedLib, '');
      })
      describe('default', () => {
        it('is created when nothing is provided', () => {
          expect(instance).toHaveProperty('meshes');
          expect(instance.meshes).toHaveProperty('defaultMesh');
          expect(instance.meshes).toHaveProperty('defaultMesh.type', 'Mesh');
        })
        it('uses a default material when not specified', () => {
          expect(instance.meshes).toHaveProperty('defaultMesh.material.uuid', instance.materials.defaultMaterial.uuid);
        })
        it('is positioned with default values', () => {
          expect(instance.meshes).toHaveProperty('defaultMesh.position.x', 0);
          expect(instance.meshes).toHaveProperty('defaultMesh.position.y', 0);
          expect(instance.meshes).toHaveProperty('defaultMesh.position.z', 0);
        })
        it('is scaled with default values', () => {
          expect(instance.meshes).toHaveProperty('defaultMesh.scale.x', 1);
          expect(instance.meshes).toHaveProperty('defaultMesh.scale.y', 1);
          expect(instance.meshes).toHaveProperty('defaultMesh.scale.z', 1);
        })
        it('is rotated with default values', () => {
          expect(instance.meshes).toHaveProperty('defaultMesh.rotation.x', 0);
          expect(instance.meshes).toHaveProperty('defaultMesh.rotation.y', 0);
          expect(instance.meshes).toHaveProperty('defaultMesh.rotation.z', 0);
        })
      })
      describe('custom', () => {
        it('can be created', () => {
          instance.update(`meshes:
  customMesh: {}`)
          expect(instance.meshes).toHaveProperty('customMesh');
          expect(instance.meshes).toHaveProperty('customMesh.type', 'Mesh');
        })
        it('uses a default material when not specified', () => {
          expect(instance.meshes).toHaveProperty('customMesh.material.uuid', instance.materials.defaultMaterial.uuid);
        })
        it('uses a material that the same name when not specified', () => {
          instance.update(`materials:
  defaultMaterial: {}
  customMesh: {}
meshes:
  customMesh: {}`)
          expect(Object.keys(instance.materials)).toEqual(['defaultMaterial', 'customMesh'])
          expect(instance.meshes).toHaveProperty('customMesh.material.uuid', instance.materials.customMesh.uuid);
        })
        it('is positioned with default values', () => {
          expect(instance.meshes).toHaveProperty('customMesh.position.x', 0);
          expect(instance.meshes).toHaveProperty('customMesh.position.y', 0);
          expect(instance.meshes).toHaveProperty('customMesh.position.z', 0);
        })
        it('is scaled with default values', () => {
          expect(instance.meshes).toHaveProperty('customMesh.scale.x', 1);
          expect(instance.meshes).toHaveProperty('customMesh.scale.y', 1);
          expect(instance.meshes).toHaveProperty('customMesh.scale.z', 1);
        })
      })

      describe('update', () => {
        it('recreates the mesh when something else than position, rotation or scale is updated', () => {
          instance.update(`meshes:
  box:
    width: 1
    height: 1
    depth: 1`)
          expect(instance.meshes).toHaveProperty('box');
          const boxBefore = instance.meshes.box;
          expect(boxBefore).toHaveProperty('uuid');
          const uuidBefore = boxBefore.uuid;
          expect(boxBefore).toHaveProperty('type', 'Mesh');
          expect(boxBefore).toHaveProperty('geometry');
          expect(boxBefore).toHaveProperty('geometry.type', 'BoxGeometry');
          expect(boxBefore).toHaveProperty('geometry.parameters');
          expect(boxBefore).toHaveProperty('geometry.parameters.width', 1);
          expect(boxBefore).toHaveProperty('geometry.parameters.height', 1);
          expect(boxBefore).toHaveProperty('geometry.parameters.depth', 1);

          instance.update(`meshes:
  box:
    width: 2
    height: 2
    depth: 2`)
          expect(instance.meshes).toHaveProperty('box');
          const boxAfter = instance.meshes.box;
          expect(boxAfter).toHaveProperty('uuid');
          const uuidAfter = boxAfter.uuid;
          expect(uuidAfter).not.toBe(uuidBefore);
          expect(boxAfter).toHaveProperty('type', 'Mesh');
          expect(boxAfter).toHaveProperty('geometry');
          expect(boxAfter).toHaveProperty('geometry.type', 'BoxGeometry');
          expect(boxAfter).toHaveProperty('geometry.parameters');
          expect(boxAfter).toHaveProperty('geometry.parameters.width', 2);
          expect(boxAfter).toHaveProperty('geometry.parameters.height', 2);
          expect(boxAfter).toHaveProperty('geometry.parameters.depth', 2);
        })

        it('recreates the mesh when something else than position, rotation or scale is updated by a variable value change', async () => {
          instance.update(`meshes:
  box:
    width: $now`)
          const start = instance.data.now;
          expect(instance.meshes).toHaveProperty('box');
          const boxBefore = instance.meshes.box;
          expect(boxBefore).toHaveProperty('uuid');
          const uuidBefore = boxBefore.uuid;
          expect(boxBefore).toHaveProperty('type', 'Mesh');
          expect(boxBefore).toHaveProperty('geometry');
          expect(boxBefore).toHaveProperty('geometry.type', 'BoxGeometry');
          expect(boxBefore).toHaveProperty('geometry.parameters');
          expect(boxBefore).toHaveProperty('geometry.parameters.width', start);
          expect(boxBefore).toHaveProperty('geometry.parameters.height', 1);
          expect(boxBefore).toHaveProperty('geometry.parameters.depth', 1);

          instance.startAnimation();
          await waitMs()
          instance.stopAnimation().render();
          expect(instance.data.now).toBeGreaterThan(start)

          expect(instance.meshes).toHaveProperty('box');
          const boxAfter = instance.meshes.box;
          expect(boxAfter).toHaveProperty('uuid');
          const uuidAfter = boxAfter.uuid;
          expect(uuidAfter).not.toBe(uuidBefore);
          expect(boxAfter).toHaveProperty('type', 'Mesh');
          expect(boxAfter).toHaveProperty('geometry');
          expect(boxAfter).toHaveProperty('geometry.type', 'BoxGeometry');
          expect(boxAfter).toHaveProperty('geometry.parameters');
          expect(boxAfter).toHaveProperty('geometry.parameters.width', instance.data.now);
          expect(boxAfter).toHaveProperty('geometry.parameters.height', 1);
          expect(boxAfter).toHaveProperty('geometry.parameters.depth', 1);
        })
      })
    })
  })

  describe('computed values', () => {
    let instance;

    beforeAll(() => {
      instance = new Foreseen(MockedLib, '');
    })

    it('can be expressed as a string for a property', () => {
      instance.update(`meshes:
  plane:
    rotation:
      x: -90
      z: $now * 100 % 90`);
      instance.render();
      expect(instance.meshes.plane.rotation.x).toBe(-90 * (Math.PI / 180));
      expect(instance.meshes.plane.rotation.y).toBe(0);
    });

    it.skip('can have different results', async () => {
      instance.update(`meshes:
  plane:
    rotation:
      x: -90
      z: $now * 100 % 90`);

      instance.startRenderLoop().startAnimation();

      await waitMs();
      instance.render();
      expect(instance.meshes).toHaveProperty('plane')
      expect(instance.meshes).toHaveProperty('plane.rotation.x', -90 * (Math.PI / 180));
      expect(instance.meshes?.plane?.rotation.y).not.toBe(0);

      instance.stopRenderLoop().stopAnimation();
    })
  });

  describe('variables', () => {
    let instance;

    beforeEach(() => {
      instance = new Foreseen(MockedLib, '');
    })

    it('can hold named values that can be in expressions', () => {
      instance.update(`variables:
  exampleA: 1
  exampleB: 2
  exampleC: $now * 100
  exampleD: $exampleA + $exampleB + $exampleC
meshes:
  box:
    position:
      x: $exampleA
      y: $exampleB
      z: $exampleD`);
      const data = instance.data;
      expect(data).toHaveProperty('exampleA', 1);
      expect(data).toHaveProperty('exampleB', 2);
      expect(data).toHaveProperty('exampleC', 0);
      expect(data).toHaveProperty('exampleD', 3);
      instance.render();
      expect(instance.meshes.box.position.x).toBe(1);
      expect(instance.meshes.box.position.y).toBe(2);
      expect(instance.meshes.box.position.z).toBe(3);
    })

    it('works with that too', async () => {
      let shiftX = -10;
      let shiftY = -5;
      instance.update(`variables:
  shiftX: ${shiftX}
  shiftY: ${shiftY}
meshes:
  b1:
    position:
      x: $shiftX
      y: $shiftY
  b2:
    position:
      x: $shiftX
      y: $shiftY + 1
  b3:
    position:
      x: $shiftX
      y: $shiftY + 2
  b4:
    position:
      x: $shiftX
      y: $shiftY + 3
  b5:
    position:
      x: $shiftX
      y: $shiftY + 4
  b6:
    position:
      x: $shiftX
      y: $shiftY + 5
  b7:
    position:
      x: $shiftX
      y: $shiftY + 6
`)
      instance.render();
      let data = instance.data;
      expect(data).toHaveProperty('shiftX', shiftX);
      expect(data).toHaveProperty('shiftY', shiftY);

      let obj = instance.toObject();
      expect(obj).toHaveProperty('variables.shiftX', shiftX);
      expect(obj).toHaveProperty('variables.shiftY', shiftY);

      expect(obj).toHaveProperty('meshes.b1.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b1.position.y', shiftY);
      expect(instance.meshes.b1.position.x).toBe(shiftX);
      expect(instance.meshes.b1.position.y).toBe(shiftY);

      expect(obj).toHaveProperty('meshes.b2.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b2.position.y', shiftY + 1);
      expect(instance.meshes.b2.position.x).toBe(shiftX);
      expect(instance.meshes.b2.position.y).toBe(shiftY + 1);

      expect(obj).toHaveProperty('meshes.b3.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b3.position.y', shiftY + 2);
      expect(instance.meshes.b3.position.x).toBe(shiftX);
      expect(instance.meshes.b3.position.y).toBe(shiftY + 2);

      expect(obj).toHaveProperty('meshes.b4.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b4.position.y', shiftY + 3);
      expect(instance.meshes.b4.position.x).toBe(shiftX);
      expect(instance.meshes.b4.position.y).toBe(shiftY + 3);

      expect(obj).toHaveProperty('meshes.b5.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b5.position.y', shiftY + 4);
      expect(instance.meshes.b5.position.x).toBe(shiftX);
      expect(instance.meshes.b5.position.y).toBe(shiftY + 4);

      expect(obj).toHaveProperty('meshes.b6.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b6.position.y', shiftY + 5);
      expect(instance.meshes.b6.position.x).toBe(shiftX);
      expect(instance.meshes.b6.position.y).toBe(shiftY + 5);

      expect(obj).toHaveProperty('meshes.b7.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b7.position.y', shiftY + 6);
      expect(instance.meshes.b7.position.x).toBe(shiftX);
      expect(instance.meshes.b7.position.y).toBe(shiftY + 6);

      // await waitMs();

      shiftY = -2;
      instance.update(`variables:
  shiftX: ${shiftX}
  shiftY: ${shiftY}
meshes:
  b1:
    position:
      x: $shiftX
      y: $shiftY
  b2:
    position:
      x: $shiftX
      y: $shiftY + 1
  b3:
    position:
      x: $shiftX
      y: $shiftY + 2
  b4:
    position:
      x: $shiftX
      y: $shiftY + 3
  b5:
    position:
      x: $shiftX
      y: $shiftY + 4
  b6:
    position:
      x: $shiftX
      y: $shiftY + 5
  b7:
    position:
      x: $shiftX
      y: $shiftY + 6
`)
      await waitMs();

      data = instance.data;
      instance.render();
      obj = instance.toObject();

      expect(data).toHaveProperty('shiftX', shiftX);
      expect(data).toHaveProperty('shiftY', shiftY);
      expect(instance.toObject()).toHaveProperty('variables.shiftX', shiftX);
      expect(instance.toObject()).toHaveProperty('variables.shiftY', shiftY);

      expect(obj).toHaveProperty('meshes.b1.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b1.position.y', shiftY);
      expect(instance.meshes.b1.position.x).toBe(shiftX);
      expect(instance.meshes.b1.position.y).toBe(shiftY);

      expect(obj).toHaveProperty('meshes.b2.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b2.position.y', shiftY + 1);
      expect(instance.meshes.b2.position.x).toBe(shiftX);
      expect(instance.meshes.b2.position.y).toBe(shiftY + 1);

      expect(obj).toHaveProperty('meshes.b3.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b3.position.y', shiftY + 2);
      expect(instance.meshes.b3.position.x).toBe(shiftX);
      expect(instance.meshes.b3.position.y).toBe(shiftY + 2);

      expect(obj).toHaveProperty('meshes.b4.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b4.position.y', shiftY + 3);
      expect(instance.meshes.b4.position.x).toBe(shiftX);
      expect(instance.meshes.b4.position.y).toBe(shiftY + 3);

      expect(obj).toHaveProperty('meshes.b5.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b5.position.y', shiftY + 4);
      expect(instance.meshes.b5.position.x).toBe(shiftX);
      expect(instance.meshes.b5.position.y).toBe(shiftY + 4);

      expect(obj).toHaveProperty('meshes.b6.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b6.position.y', shiftY + 5);
      expect(instance.meshes.b6.position.x).toBe(shiftX);
      expect(instance.meshes.b6.position.y).toBe(shiftY + 5);

      expect(obj).toHaveProperty('meshes.b7.position.x', shiftX);
      expect(obj).toHaveProperty('meshes.b7.position.y', shiftY + 6);
      expect(instance.meshes.b7.position.x).toBe(shiftX);
      expect(instance.meshes.b7.position.y).toBe(shiftY + 6);
    })
  })
})