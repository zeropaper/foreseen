import THREE from 'three';
import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeAll(() => {
  instance = freshInstance();
});

describe('default', () => {
  it('is created when nothing is provided', () => {
    expect(instance).toHaveProperty('materials');
    expect(instance).toHaveProperty('materials.defaultMaterial');
    expect(instance).toHaveProperty('materials.defaultMaterial.type', 'MeshStandardMaterial');
  });
  it('is positioned with default values', () => {
    expect(instance).toHaveProperty('materials.defaultMaterial.color.r', 1);
    expect(instance).toHaveProperty('materials.defaultMaterial.color.g', 1);
    expect(instance).toHaveProperty('materials.defaultMaterial.color.b', 1);
  });
  it('is scaled with default values', () => {
    expect(instance).toHaveProperty('materials.defaultMaterial.emissiveIntensity', 1);
  });
});
describe('custom', () => {
  it('can be created', () => {
    instance.update(`materials:
  customMaterial: {}`)
    expect(instance).toHaveProperty('materials.customMaterial');
    expect(instance).toHaveProperty('materials.customMaterial.type', 'MeshStandardMaterial');
  });
  it('is positioned with default values', () => {
    expect(instance).toHaveProperty('materials.customMaterial.color.r', 1);
    expect(instance).toHaveProperty('materials.customMaterial.color.g', 1);
    expect(instance).toHaveProperty('materials.customMaterial.color.b', 1);
  });
  it('is scaled with default values', () => {
    expect(instance).toHaveProperty('materials.customMaterial.emissiveIntensity', 1);
  });
});
