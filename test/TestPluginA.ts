import ForeseenPlugin from '../src/plugins/ForeseenPlugin';

export class TestPluginA extends ForeseenPlugin {
  get name() {
    return 'test-a';
  }

  registerFunctions = jest.fn(() => {
    return {
      add: jest.fn((a, b) => a + b),
      subtract: jest.fn((a, b) => a - b)
    };
  })

  connect = jest.fn();

  dispose = jest.fn();
}
