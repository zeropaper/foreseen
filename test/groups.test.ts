import { Group } from 'three';
import Foreseen from '../src';
import freshInstance from './freshInstance';
// import waitMs from './waitMs';

let instance: Foreseen;

beforeEach(() => {
  instance = freshInstance();
});

describe('group', () => {
  it('can be created', async () => {
    instance.update(`meshes:
  groupA:
    position:
      y: 7
      z: 5
    type: group
    children:
      box1:
        width: 2
        position:
          x: 3
      box2:
        width: 2
        position:
          x: 6
  groupB:
    position:
      y: 5
    children:
      box3:
        width: 5
        position:
          x: 2
      box4:
        height: 3
        position:
          x: 8`);

    const object = instance.toObject();
    expect(instance).toHaveProperty('meshes.groupA');
    expect(instance).toHaveProperty('meshes.groupA.type', 'Group');
    expect(instance).toHaveProperty('meshes.groupA.children');
    expect(instance).toHaveProperty('meshes.groupB');
    expect(instance).toHaveProperty('meshes.groupB.type', 'Group');
    expect(instance).toHaveProperty('meshes.groupB.children');

    expect(instance.meshes.groupA).toBeInstanceOf(Group);
    expect(instance.meshes.groupA).toHaveProperty('name', 'meshes.groupA');
    expect(instance.meshes.groupA).toHaveProperty('parent.type', 'Scene');
    expect(instance.meshes.groupA).toHaveProperty('children.length', 2);
    expect(instance.meshes.groupB).toBeInstanceOf(Group);
    expect(instance.meshes.groupB).toHaveProperty('name', 'meshes.groupB');
    expect(instance.meshes.groupB).toHaveProperty('parent.type', 'Scene');
    expect(instance.meshes.groupB).toHaveProperty('children.length', 2);

    expect(object).not.toHaveProperty('meshes.groupA.position.x');
    expect(object).toHaveProperty('meshes.groupA.position.y', 7);
    expect(object).toHaveProperty('meshes.groupA.position.z', 5);
    expect(instance.meshes.groupA).toHaveProperty('position.x', 0);
    expect(instance.meshes.groupA).toHaveProperty('position.y', 7);
    expect(instance.meshes.groupA).toHaveProperty('position.z', 5);

    expect(object).not.toHaveProperty('meshes.groupB.position.x');
    expect(object).toHaveProperty('meshes.groupB.position.y', 5);
    expect(object).not.toHaveProperty('meshes.groupB.position.z');
    expect(instance.meshes.groupB).toHaveProperty('position.x', 0);
    expect(instance.meshes.groupB).toHaveProperty('position.y', 5);
    expect(instance.meshes.groupB).toHaveProperty('position.z', 0);

    expect(Object.keys(instance.meshes)).toEqual([
      'groupA',
      'groupA.box1',
      'groupA.box2',
      'groupB',
      'groupB.box3',
      'groupB.box4',
    ]);

    const boxes = [
      instance.scene.getObjectByName('meshes.groupA.box1'),
      instance.scene.getObjectByName('meshes.groupA.box2'),
      instance.meshes.groupB.getObjectByName('meshes.groupB.box3'),
      instance.meshes.groupB.getObjectByName('meshes.groupB.box4'),
    ];
    expect(boxes[0]).toBeTruthy();
    expect(boxes[1]).toBeTruthy();
    expect(boxes[2]).toBeTruthy();
    expect(boxes[3]).toBeTruthy();

    expect(boxes[0]).toHaveProperty('name', 'meshes.groupA.box1');
    expect(object).toHaveProperty('meshes.groupA.children.box1.position.x', 3);
    expect(object).not.toHaveProperty('meshes.groupA.children.box1.position.y');
    expect(object).not.toHaveProperty('meshes.groupA.children.box1.position.z');
    expect(object).toHaveProperty('meshes.groupA.children.box1.width', 2);
    expect(boxes[0]).toHaveProperty('position.x', 3);
    expect(boxes[0]).toHaveProperty('position.y', 0);
    expect(boxes[0]).toHaveProperty('position.z', 0);
    expect(boxes[0]).toHaveProperty('geometry.parameters.width', 2);

    expect(boxes[1]).toHaveProperty('name', 'meshes.groupA.box2');
    expect(boxes[1]).toHaveProperty('position.x', 6);
    expect(boxes[1]).toHaveProperty('position.y', 0);
    expect(boxes[1]).toHaveProperty('position.z', 0);
    expect(boxes[1]).toHaveProperty('geometry.parameters.width', 2);
  });

  it('can be updated with its children', async () => {
    instance.update(`meshes:
  groupA:
    position:
      y: 7
      z: 5
    children:
      box1:
        width: 2
        position:
          x: 3
      box2:
        width: 2
        position:
          x: 6`);

    const initialObject = instance.toObject();
    expect(initialObject).toHaveProperty('meshes.groupA.position.y', 7);
    expect(initialObject).toHaveProperty('meshes.groupA.position.z', 5);
    expect(initialObject).toHaveProperty('meshes.groupA.children.box1.width', 2);
    expect(initialObject).toHaveProperty('meshes.groupA.children.box1.position.x', 3);
    expect(initialObject).toHaveProperty('meshes.groupA.children.box2.width', 2);
    expect(initialObject).toHaveProperty('meshes.groupA.children.box2.position.x', 6);

    expect(instance.meshes).toHaveProperty('groupA');
    expect(instance.meshes).toHaveProperty('groupA.position.y', 7);
    expect(instance.meshes).toHaveProperty('groupA.position.z', 5);

    let boxes = [
      instance.scene.getObjectByName('meshes.groupA.box1'),
      instance.scene.getObjectByName('meshes.groupA.box2'),
    ];
    expect(boxes[0]).toBeTruthy();
    expect(boxes[1]).toBeTruthy();

    expect(boxes[0]).toHaveProperty('position.x', 3);
    expect(boxes[0]).toHaveProperty('position.y', 0);
    expect(boxes[0]).toHaveProperty('position.z', 0);

    expect(boxes[1]).toHaveProperty('position.x', 6);
    expect(boxes[1]).toHaveProperty('position.y', 0);
    expect(boxes[1]).toHaveProperty('position.z', 0);

    instance.update(`meshes:
  groupA:
    position:
      y: 3
    children:
      box1:
        width: 1
        position:
          x: 6
      box2:
        width: 4
        position:
          x: 12`);

    const updatedObject = instance.toObject();
    expect(updatedObject).toHaveProperty('meshes.groupA.position.y', 3);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box1.width', 1);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box1.position.x', 6);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box2.width', 4);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box2.position.x', 12);

    expect(instance.meshes).toHaveProperty('groupA.position.y', 3);
    expect(instance.meshes).toHaveProperty('groupA.position.z', 0);

    boxes = [
      instance.scene.getObjectByName('meshes.groupA.box1'),
      instance.scene.getObjectByName('meshes.groupA.box2'),
    ];
    expect(boxes[0]).toHaveProperty('position.x', 6);
    expect(boxes[0]).toHaveProperty('position.y', 0);
    expect(boxes[0]).toHaveProperty('position.z', 0);

    expect(boxes[1]).toHaveProperty('position.x', 12);
    expect(boxes[1]).toHaveProperty('position.y', 0);
    expect(boxes[1]).toHaveProperty('position.z', 0);
  });

  it('can receive new children', async () => {
    instance.update(`meshes:
  groupA:
    position:
      y: 7
      z: 5
    children:
      box1:
        width: 2
        position:
          x: 3`);

    const initialObject = instance.toObject();
    expect(initialObject).toHaveProperty('meshes.groupA.position.y', 7);
    expect(initialObject).toHaveProperty('meshes.groupA.position.z', 5);
    expect(initialObject).toHaveProperty('meshes.groupA.children.box1.width', 2);
    expect(initialObject).toHaveProperty('meshes.groupA.children.box1.position.x', 3);
    expect(initialObject).not.toHaveProperty('meshes.groupA.children.box2');

    expect(instance.meshes).toHaveProperty('groupA');
    expect(instance.meshes).toHaveProperty('groupA.position.y', 7);
    expect(instance.meshes).toHaveProperty('groupA.position.z', 5);

    let boxes = [
      instance.scene.getObjectByName('meshes.groupA.box1'),
      instance.scene.getObjectByName('meshes.groupA.box2'),
    ];
    expect(boxes[0]).toBeTruthy();
    expect(boxes[1]).toBeFalsy();

    expect(boxes[0]).toHaveProperty('position.x', 3);
    expect(boxes[0]).toHaveProperty('position.y', 0);
    expect(boxes[0]).toHaveProperty('position.z', 0);

    instance.update(`meshes:
  groupA:
    position:
      y: 3
    children:
      box1:
        width: 1
        position:
          x: 6
      box2:
        width: 4
        position:
          x: 12`);

    const updatedObject = instance.toObject();
    expect(updatedObject).toHaveProperty('meshes.groupA.position.y', 3);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box1.width', 1);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box1.position.x', 6);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box2.width', 4);
    expect(updatedObject).toHaveProperty('meshes.groupA.children.box2.position.x', 12);

    boxes = [
      instance.scene.getObjectByName('meshes.groupA.box1'),
      instance.scene.getObjectByName('meshes.groupA.box2'),
    ];
    expect(boxes[0]).toBeTruthy();
    expect(boxes[1]).toBeTruthy();

    expect(instance.meshes).toHaveProperty('groupA.position.y', 3);
    expect(instance.meshes).toHaveProperty('groupA.position.z', 0);

    expect(boxes[0]).toHaveProperty('position.x', 6);
    expect(boxes[0]).toHaveProperty('position.y', 0);
    expect(boxes[0]).toHaveProperty('position.z', 0);

    expect(boxes[1]).toHaveProperty('position.x', 12);
    expect(boxes[1]).toHaveProperty('position.y', 0);
    expect(boxes[1]).toHaveProperty('position.z', 0);
  });

  it('handles child removal', async () => {
    instance.update(`meshes:
  groupA:
    position:
      y: 7
      z: 5
    children:
      box1:
        width: 2
        position:
          x: 3
      box2:
        width: 4
        position:
          x: 12`);

    expect(instance.scene.getObjectByName('meshes.groupA.box1')).toBeTruthy();
    expect(instance.scene.getObjectByName('meshes.groupA.box2')).toBeTruthy();

    instance.update(`meshes:
  groupA:
    position:
      y: 3
    children:
      box1:
        width: 1
        position:
          x: 6`);

    expect(instance.scene.getObjectByName('meshes.groupA.box1')).toBeTruthy();
    expect(instance.scene.getObjectByName('meshes.groupA.box2')).toBeFalsy();
  });

  it('can be nested', async () => {
    instance.update(`variables:
  var: 1
meshes:
  star:
    type: sphere
    radius: 5 * $var
  planetA:
    children:
      body:
        type: sphere
        radius: 3
        position:
          x: 10
      moons:
        children:
          moon1:
            position:
              x: 10
            children:
              body:
                position:
                  x: 6
                type: sphere
                radius: 1
          moon2:
            position:
              x: 4.5 * $var
            children:
              body:
                type: sphere
                radius: 0.5`);

    const info = instance.toObject();
    expect(info).toHaveProperty('meshes.star.radius', 5);
    expect(info).toHaveProperty('meshes.planetA.children.body');
    expect(info).toHaveProperty('meshes.planetA.children.moons');
    expect(info).toHaveProperty('meshes.planetA.children.moons.children.moon1');
    expect(info).toHaveProperty('meshes.planetA.children.moons.children.moon1.children.body');
    expect(info).toHaveProperty('meshes.planetA.children.moons.children.moon2.children.body');

    expect(info).toHaveProperty('meshes.planetA.children.body.position.x', 10);
    expect(info).toHaveProperty('meshes.planetA.children.moons.children.moon1.position.x', 10);
    expect(info).toHaveProperty('meshes.planetA.children.moons.children.moon2.position.x', 4.5);

    const planetAPlan = instance.scene.getObjectByName('meshes.planetA');
    const planetABody = instance.scene.getObjectByName('meshes.planetA.body');
    const moonsPlan = instance.scene.getObjectByName('meshes.planetA.moons');
    const moon1Plan = instance.scene.getObjectByName('meshes.planetA.moons.moon1');
    const moon1Body = instance.scene.getObjectByName('meshes.planetA.moons.moon1.body');
    const moon2Plan = instance.scene.getObjectByName('meshes.planetA.moons.moon2');
    const moon2Body = instance.scene.getObjectByName('meshes.planetA.moons.moon2.body');

    expect(planetAPlan).toBeTruthy();
    expect(planetABody).toBeTruthy();
    expect(moonsPlan).toBeTruthy();
    expect(moon1Plan).toBeTruthy();
    expect(moon1Body).toBeTruthy();
    expect(moon2Plan).toBeTruthy();
    expect(moon2Body).toBeTruthy();

    expect(moon1Plan).toHaveProperty('position.x', 10);
    expect(moon1Body).toHaveProperty('position.x', 6);

    expect(moon2Plan).toHaveProperty('position.x', 4.5);
    expect(moon2Body).toHaveProperty('position.x', 0);


    instance.update(`variables:
  var: 2
meshes:
  star:
    type: sphere
    radius: 5 * $var
  planetA:
    children:
      body:
        type: sphere
        radius: 3
        position:
          x: 10
      moons:
        children:
          moon1:
            position:
              x: 10
            children:
              body:
                position:
                  x: 6
                type: sphere
                radius: 1
          moon2:
            position:
              x: 4.5 * $var
            children:
              body:
                type: sphere
                radius: 0.5 * $var`);
    const updated = instance.toObject();
    expect(updated).toHaveProperty('meshes.star.radius', 10);
    expect(instance.scene.getObjectByName('meshes.planetA.moons.moon2')).toHaveProperty('position.x', 9);
    expect(instance.scene.getObjectByName('meshes.planetA.moons.moon2.body')).toHaveProperty('geometry.parameters.radius', 1);
  });
});
