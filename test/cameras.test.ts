import * as THREE from 'three';
import Foreseen from '../src';
import freshInstance from './freshInstance';

let instance: Foreseen;

beforeAll(() => {
  instance = freshInstance();
});

describe('default', () => {
  it('is created when nothing is provided', () => {
    expect(instance).toHaveProperty('lights');
    expect(instance).toHaveProperty('lights.defaultLight');
    expect(instance).toHaveProperty('lights.defaultLight.type', 'SpotLight');
  });
  it('is positioned with default values', () => {
    expect(instance).toHaveProperty('lights.defaultLight.position.x', 15);
    expect(instance).toHaveProperty('lights.defaultLight.position.y', 15);
    expect(instance).toHaveProperty('lights.defaultLight.position.z', 15);
  });
  it('is orientated with default values', () => {
    const passedVector = new THREE.Vector3();
    const returnedVector = instance.lights.defaultLight.getWorldDirection(passedVector);
    expect(returnedVector).toHaveProperty('x', 0.5773502691896257);
    expect(returnedVector).toHaveProperty('y', 0.5773502691896257);
    expect(returnedVector).toHaveProperty('z', 0.5773502691896261);
    expect(passedVector).toHaveProperty('x', 0.5773502691896257);
    expect(passedVector).toHaveProperty('y', 0.5773502691896257);
    expect(passedVector).toHaveProperty('z', 0.5773502691896261);
  });
  it('is scaled with default values', () => {
    expect(instance).toHaveProperty('lights.defaultLight.scale.x', 1);
    expect(instance).toHaveProperty('lights.defaultLight.scale.y', 1);
    expect(instance).toHaveProperty('lights.defaultLight.scale.z', 1);
  });
});
describe('custom', () => {
  it('can be created', () => {
    instance.update(`lights:
  customLight: {}`)
    expect(instance).toHaveProperty('lights.customLight');
    expect(instance).toHaveProperty('lights.customLight.type', 'SpotLight');
    instance.update(`lights:
  customLight:
    type: ambient`)
    expect(instance).toHaveProperty('lights.customLight');
    expect(instance).toHaveProperty('lights.customLight.type', 'AmbientLight');
  });
});
