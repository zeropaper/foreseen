import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeAll(() => {
  instance = freshInstance();
});

describe('computed values', () => {
  it('can be expressed as a string for a property', () => {
    instance.update(`meshes:
  plane:
    rotation:
      x: -90
      z: $now * 100 % 90`);
    instance.render();
    expect(instance).toHaveProperty('meshes.plane.rotation.x', -90 * (Math.PI / 180))
    expect(instance).toHaveProperty('meshes.plane.rotation.y', 0)
  });

  it.skip('can have different results', async () => {
    instance.update(`meshes:
  plane:
    rotation:
      x: -90
      z: $now * 100 % 90`);

    instance.startRenderLoop().startAnimation();

    await waitMs();
    expect(instance.meshes).toHaveProperty('plane')
    expect(instance.meshes).toHaveProperty('plane.rotation.x', -90 * (Math.PI / 180));
    expect(instance.meshes?.plane?.rotation.y).not.toBe(0);

    instance.stopRenderLoop().stopAnimation();
  })
});
