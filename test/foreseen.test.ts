import { diff } from 'deep-object-diff';
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
      expect(instance.toJSON()).toMatchSnapshot();
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
        expect(instance).toHaveProperty('clock');
        expect(instance).toHaveProperty('clock.running', false);
        expect(instance).toHaveProperty('clock.elapsedTime', 0);
        expect(instance).toHaveProperty('clock.startTime', 0);
        // const original = instance.data;
        expect(instance).toHaveProperty('data.now', 0);
        instance.clock.start();
        expect(instance).toHaveProperty('clock.running', true);

        await waitMs(1000);
        instance.clock.getElapsedTime();

        expect(instance.data.now).toBeGreaterThanOrEqual(1);
        expect(instance.data.now).toBeLessThanOrEqual(2);

        // console.info(JSON.stringify(diff(original, instance.data), null, 2), instance.data);
        expect(instance.clock.elapsedTime).toBeGreaterThan(0);
        expect(instance.clock.startTime).toBeGreaterThan(0);
        expect(instance).toHaveProperty('isRendering', false);
      })
    })

    describe('rendering', () => {
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
        // console.info(JSON.stringify(diff(original, instance.data), null, 2), instance.data);
        expect(instance).toHaveProperty('isRendering', true);
        expect(() => instance.stopRenderLoop()).not.toThrow();
        expect(instance).toHaveProperty('isRendering', false);
      })
    })

    describe('cameras', () => {
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
        it.skip('is orientated with default values', () => {
          expect(instance.cameras).toHaveProperty('defaultCamera.target.postion.x', 0);
          expect(instance.cameras).toHaveProperty('defaultCamera.target.postion.y', 0);
          expect(instance.cameras).toHaveProperty('defaultCamera.target.postion.z', 0);
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
        it.skip('is orientated with default values', () => {
          expect(instance.lights).toHaveProperty('defaultLight.target.postion.x', 0);
          expect(instance.lights).toHaveProperty('defaultLight.target.postion.y', 0);
          expect(instance.lights).toHaveProperty('defaultLight.target.postion.z', 0);
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

    describe('materials', () => { })

    describe('meshes', () => { })
  })
})