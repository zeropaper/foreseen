import Foreseen from '../src';
import freshInstance from './freshInstance';

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

  it('has default values', () => {
    expect(instance).toHaveProperty('materials.customMaterial.type', 'MeshStandardMaterial');
    expect(instance).toHaveProperty('materials.customMaterial.transparent', false);
    expect(instance).toHaveProperty('materials.customMaterial.emissiveIntensity', 1);
    expect(instance).toHaveProperty('materials.customMaterial.emissive.r', 0);
    expect(instance).toHaveProperty('materials.customMaterial.emissive.g', 0);
    expect(instance).toHaveProperty('materials.customMaterial.emissive.b', 0);
    expect(instance).toHaveProperty('materials.customMaterial.roughness', 1);
    expect(instance).toHaveProperty('materials.customMaterial.metalness', 0);
    expect(instance).toHaveProperty('materials.customMaterial.color.r', 1);
    expect(instance).toHaveProperty('materials.customMaterial.color.g', 1);
    expect(instance).toHaveProperty('materials.customMaterial.color.b', 1);
  });

  it('changes values', () => {
    instance.update(`variables:
    ei: 1
materials:
  customMaterial:
    emissiveIntensity: 0.5 * $ei
    emissive: 0x0000ff`)
    expect(instance).toHaveProperty('materials.customMaterial.emissiveIntensity', 0.5);
    // @ts-ignore
    console.info('emissive', instance.materials.customMaterial);
    expect(instance).toHaveProperty('materials.customMaterial.emissive.r', 0);
    expect(instance).toHaveProperty('materials.customMaterial.emissive.g', 0);
    expect(instance).toHaveProperty('materials.customMaterial.emissive.b', 1);
  });
});
