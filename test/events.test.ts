import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeEach(() => {
  instance = freshInstance();
});

describe('onstartrenderloop', () => {
  it('is called when starting the render loop', async () => {
    expect(instance.onstartrenderloop).toHaveBeenCalledTimes(0)
    instance
      .startRenderLoop();
    expect(instance.onstartrenderloop).toHaveBeenCalledTimes(1)
  });
});

describe('onstoprenderloop', () => {
  it('is called when stopping the render loop', async () => {
    expect(instance.onstoprenderloop).toHaveBeenCalledTimes(0)
    instance
      .startRenderLoop()
      .stopRenderLoop();
    expect(instance.onstoprenderloop).toHaveBeenCalledTimes(1)
  });
});

describe('onstartanimation', () => {
  it('is called when starting the animation', async () => {
    expect(instance.onstartanimation).toHaveBeenCalledTimes(0)
    instance
      .startAnimation();
    expect(instance.onstartanimation).toHaveBeenCalledTimes(1)
  });
});

describe('onpauseanimation', () => {
  it('is called is called when pausing animation', async () => {
    expect(instance.onpauseanimation).toHaveBeenCalledTimes(0)
    instance
      .startAnimation()
      .pauseAnimation();
    expect(instance.onpauseanimation).toHaveBeenCalledTimes(1)
  });
});

describe('onresumeanimation', () => {
  it('is called when the animation is resumed', async () => {
    expect(instance.onresumeanimation).toHaveBeenCalledTimes(0)
    instance
      .startAnimation()
      .pauseAnimation()
      .resumeAnimation();
    expect(instance.onresumeanimation).toHaveBeenCalledTimes(1)
  });
});

describe('onstopanimation', () => {
  it('is called when stopping the animation', async () => {
    expect(instance.onstopanimation).toHaveBeenCalledTimes(0)
    instance
      .startAnimation()
      .stopAnimation();
    expect(instance.onstopanimation).toHaveBeenCalledTimes(1)
  });
});

describe('onprerender', () => {
  it('is called when rendering', async () => {
    expect(instance.onprerender).toHaveBeenCalledTimes(0)
    instance
      .render();
    expect(instance.onprerender).toHaveBeenCalledTimes(1)
  });

  it('is called several times when rendering loops', async () => {
    expect(instance.onprerender).toHaveBeenCalledTimes(0)
    instance
      .startRenderLoop();
    await waitMs(50)
    expect(instance.onprerender).toHaveBeenCalled()
    // @ts-ignore
    expect(instance.onprerender.mock.calls.length).toBeGreaterThan(2)
  });
});

describe('onrender', () => {
  it('is called when rendering', async () => {
    expect(instance.onrender).toHaveBeenCalledTimes(0)
    instance
      .render();
    expect(instance.onrender).toHaveBeenCalledTimes(1)
  });

  it('is called several times when rendering loops', async () => {
    expect(instance.onrender).toHaveBeenCalledTimes(0)
    instance
      .startRenderLoop();
    await waitMs(50)
    expect(instance.onrender).toHaveBeenCalled()
    // @ts-ignore
    expect(instance.onrender.mock.calls.length).toBeGreaterThan(2)
  });
});