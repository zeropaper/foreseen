import ForeseenPlugin from '../src/plugins/ForeseenPlugin';

export class TestPluginA extends ForeseenPlugin {
  readonly name = 'test-a';

  registerFunctions = jest.fn(() => {
    return {
      add: jest.fn((a, b) => a + b),
      subtract: jest.fn((a, b) => a - b)
    };
  })

  connect = jest.fn((instance) => { });

  dispose = jest.fn();
}
