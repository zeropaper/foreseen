import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeAll(() => {
  instance = freshInstance();
});

describe('clock', () => {
  it('can be started', async () => {
    expect(instance).toHaveProperty('isRendering', false);
    expect(instance).not.toHaveProperty('clock');
    expect(instance).toHaveProperty('isRunning', false);
    expect(instance).toHaveProperty('elapsedTime', 0);
    expect(instance).toHaveProperty('startTime', 0);
    // const original = instance.data;
    expect(instance).toHaveProperty('data.now', 0);
    instance.startAnimation();
    expect(instance).toHaveProperty('isRunning', true);

    await waitMs(1000);
    instance.render();

    expect(instance.data.now).toBeGreaterThanOrEqual(1);
    expect(instance.data.now).toBeLessThanOrEqual(2);

    expect(instance.elapsedTime).toBeGreaterThan(0);
    expect(instance.startTime).toBeGreaterThan(0);
    expect(instance).toHaveProperty('isRendering', false);
  });
});
