import Foreseen from '../src';
import freshInstance from './freshInstance';
import { TestPluginA } from './TestPluginA';

let instance: Foreseen;
let plugin;

beforeAll(() => {
  instance = freshInstance();
  // plugin = new TestPluginA(instance);
});

describe('plugins', () => {
  it('can be added', async () => {
    instance.addPlugins(TestPluginA);
    // @ts-ignore
    expect(instance?.plugins).toHaveProperty(TestPluginA.name);
    plugin = instance.plugins[TestPluginA.name];
  });

  // it('is connected when added', () => {
  //   expect(plugin.connect).toBeCalledTimes(1)
  // })

  it('can declare functions when added', () => {
    expect(plugin.registerFunctions).toBeCalledTimes(1)
  })

  it('can be removed', async () => {
    instance.removePlugin(TestPluginA.name);
    // @ts-ignore
    expect(instance?.plugins).not.toHaveProperty(TestPluginA.name)
  });

  it('is disposed when removed', () => {
    expect(plugin.dispose).toBeCalledTimes(1)
  })
});