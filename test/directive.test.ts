import Foreseen from '../src';
import processDirective, { parseName, parseOptions } from '../src/processDirective';
import freshInstance from './freshInstance';

let instance: Foreseen;

beforeEach(() => {
  instance = freshInstance();
});

describe('+copy', () => {
  describe('parseSpecialArguments', () => {
    it.each([
      ['copy', ['name'], { name: 'name', count: 1 }],
    ])('parse "%s" arguments (%j) to %j', (operation, args, expected) => {
      expect(parseOptions(<any>operation, args)).toEqual(expected);
    });
  });

  describe('parseSpecialName', () => {
    it.each([
      ['+copy', ['copy', {}]],
      ['+copy (name, 3)', ['copy', { name: 'name', count: 3 }]],
      ['+copy(name, 5)', ['copy', { name: 'name', count: 5 }]],
      ['+copy name', ['copy', { name: 'name', count: 1 }]],
    ])('parses %j', (name, expected) => {
      expect(parseName(name)).toEqual(expected);
    });
  });

  describe('processSpecial', () => {
    it('does simple copies', () => {
      const obj = {
        meshes: {
          box: { position: { x: 1 } },
          '+copy': {
            count: 12,
            name: 'box',
          },
        },
      };
      expect(processDirective('copy', obj.meshes['+copy'], obj.meshes))
        .toStrictEqual({
          'box-1': obj.meshes.box,
          'box-2': obj.meshes.box,
          'box-3': obj.meshes.box,
          'box-4': obj.meshes.box,
          'box-5': obj.meshes.box,
          'box-6': obj.meshes.box,
          'box-7': obj.meshes.box,
          'box-8': obj.meshes.box,
          'box-9': obj.meshes.box,
          'box-10': obj.meshes.box,
          'box-11': obj.meshes.box,
          'box-12': obj.meshes.box,
        });
    });

    it('does copies with alterations', () => {
      const obj = {
        meshes: {
          box: { position: { x: 1 } },
          '+copy': {
            count: 2,
            name: 'box',
            position: {
              x: `_index + 1`,
            },
          },
        },
      };
      expect(processDirective('copy', obj.meshes['+copy'], obj.meshes))
        .toStrictEqual({
          'box-1': { position: { x: '1 + 1' } },
          'box-2': { position: { x: '2 + 1' } },
        });
    });
  });

  describe('instance', () => {
    it('does updates properly', () => {
      instance.update(`variables:
  dist: 2
meshes:
  box: {}
  +copy:
    name: box
    count: 3
    position:
      x: (_index + 1) * $dist
      `);

      let object = instance.toObject();

      expect(object).toHaveProperty('meshes.box');
      expect(object).toHaveProperty('meshes.box-1');
      expect(object).toHaveProperty('meshes.box-1.position.x', 4);
      expect(object).toHaveProperty('meshes.box-3');
      expect(object).toHaveProperty('meshes.box-3.position.x', 8);

      instance.update(`variables:
  dist: 1
meshes:
  planeMesh: {}
  +copy( planeMesh, 3):
    position:
      y: (_index + 1) * $dist
    
  box: {}
  +copy <unsued>:
    name: box
    count: 2
    position:
      x: (_index + 1) * $dist
    `);

      object = instance.toObject();

      expect(object).toHaveProperty('meshes.planeMesh');
      expect(object).toHaveProperty('meshes.planeMesh-1');
      expect(object).toHaveProperty('meshes.planeMesh-1.position.y', 2);
      expect(object).toHaveProperty('meshes.planeMesh-3');
      expect(object).toHaveProperty('meshes.planeMesh-3.position.y', 4);

      expect(object).toHaveProperty('meshes.box');
      expect(object).toHaveProperty('meshes.box-1');
      expect(object).toHaveProperty('meshes.box-1.position.x', 2);
      expect(object).not.toHaveProperty('meshes.box-3');
    });
  });
});