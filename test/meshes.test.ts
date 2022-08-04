import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeAll(() => {
  instance = freshInstance();
});

describe('default', () => {
  it('is created when nothing is provided', () => {
    expect(instance).toHaveProperty('meshes');
    expect(instance).toHaveProperty('meshes.defaultMesh');
    expect(instance).toHaveProperty('meshes.defaultMesh.type', 'Mesh');
  });
  it('uses a default material when not specified', () => {
    expect(instance).toHaveProperty('meshes.defaultMesh.material.uuid', instance.materials.defaultMaterial.uuid);
  });
  it('is positioned with default values', () => {
    expect(instance).toHaveProperty('meshes.defaultMesh.position.x', 0);
    expect(instance).toHaveProperty('meshes.defaultMesh.position.y', 0);
    expect(instance).toHaveProperty('meshes.defaultMesh.position.z', 0);
  });
  it('is scaled with default values', () => {
    expect(instance).toHaveProperty('meshes.defaultMesh.scale.x', 1);
    expect(instance).toHaveProperty('meshes.defaultMesh.scale.y', 1);
    expect(instance).toHaveProperty('meshes.defaultMesh.scale.z', 1);
  });
  it('is rotated with default values', () => {
    expect(instance).toHaveProperty('meshes.defaultMesh.rotation.x', 0);
    expect(instance).toHaveProperty('meshes.defaultMesh.rotation.y', 0);
    expect(instance).toHaveProperty('meshes.defaultMesh.rotation.z', 0);
  });
});

describe('custom', () => {
  it('can be created', () => {
    instance.update(`meshes:
  customMesh: {}`)
    expect(instance).toHaveProperty('meshes.customMesh');
    expect(instance).toHaveProperty('meshes.customMesh.type', 'Mesh');
  });
  it('uses a default material when not specified', () => {
    expect(instance).toHaveProperty('meshes.customMesh.material.uuid', instance.materials.defaultMaterial.uuid);
  });
  it('uses a material that the same name when not specified', () => {
    instance.update(`materials:
  defaultMaterial: {}
  customMesh: {}
meshes:
  customMesh: {}`)
    expect(Object.keys(instance.materials)).toEqual(['defaultMaterial', 'customMesh'])
    expect(instance).toHaveProperty('meshes.customMesh.material.uuid', instance.materials.customMesh.uuid);
  });
  it('is positioned with default values', () => {
    expect(instance).toHaveProperty('meshes.customMesh.position.x', 0);
    expect(instance).toHaveProperty('meshes.customMesh.position.y', 0);
    expect(instance).toHaveProperty('meshes.customMesh.position.z', 0);
  });
  it('is scaled with default values', () => {
    expect(instance).toHaveProperty('meshes.customMesh.scale.x', 1);
    expect(instance).toHaveProperty('meshes.customMesh.scale.y', 1);
    expect(instance).toHaveProperty('meshes.customMesh.scale.z', 1);
  });
});

describe('update', () => {
  it('recreates the mesh when something else than position, rotation or scale is updated', () => {
    instance.update(`meshes:
  box:
    width: 1
    height: 1
    depth: 1`)
    expect(instance).toHaveProperty('meshes.box');
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
    expect(instance).toHaveProperty('meshes.box');
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
  });

  it('recreates the mesh when something else than position, rotation or scale is updated by a variable value change', async () => {
    instance.update(`meshes:
  box:
    width: $now`);
    const start = instance.data.now;
    expect(instance).toHaveProperty('meshes.box');
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

    expect(instance).toHaveProperty('meshes.box');
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
  });
});
