import * as THREE from 'three';
import Foreseen from '../src';

const MockedLib = { ...THREE };

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
} as unknown as THREE.WebGL1Renderer;

export { MockedLib };

export default function freshInstance() {
  const instance = new Foreseen(MockedLib, '');
  instance.onstartrenderloop = jest.fn();
  instance.onstoprenderloop = jest.fn();
  instance.onstartanimation = jest.fn();
  instance.onpauseanimation = jest.fn();
  instance.onresumeanimation = jest.fn();
  instance.onstopanimation = jest.fn();
  instance.onprerender = jest.fn();
  instance.onrender = jest.fn();
  return instance;
}
