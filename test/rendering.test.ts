import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeAll(() => {
  instance = freshInstance();
});

describe('rendering', () => {
  it('can be started individually', () => {
    expect(instance).toHaveProperty('isRendering', false);
    expect(() => instance.startRenderLoop()).not.toThrow();
    expect(instance).toHaveProperty('isRendering', true);
  });

  it('can be stopped individually', () => {
    expect(instance).toHaveProperty('isRendering', true);
    expect(() => instance.stopRenderLoop()).not.toThrow();
    expect(instance).toHaveProperty('isRendering', false);
  });

  it('provides statistics in data', async () => {
    expect(instance).toHaveProperty('isRendering', false);
    expect(() => instance.startRenderLoop()).not.toThrow();
    // const original = instance.data;
    await waitMs(1000);
    expect(instance).toHaveProperty('isRendering', true);
    expect(() => instance.stopRenderLoop()).not.toThrow();
    expect(instance).toHaveProperty('isRendering', false);
  });
});
