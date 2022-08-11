import type ForeseenPlugin from './plugins/ForeseenPlugin';

export default class Pluggable<PInst extends ForeseenPlugin> extends EventTarget {
  #plugins: { [name: string]: PInst; } = {};

  get plugins() {
    return this.#plugins;
  }

  addPlugins(...plugins: (new (inst: Pluggable<PInst>) => PInst)[]) {
    plugins.forEach(Plugin => {
      const found = this.#plugins[Plugin.name];
      if (found) {
        return;
      }

      const plugin = new Plugin(this);
      this.#plugins[Plugin.name] = plugin;
    });
    return this;
  }

  removePlugin(name: string) {
    const plugin = this.#plugins[name];
    if (!plugin) {
      return this;
    }

    if (typeof plugin?.dispose === 'function') {
      plugin.dispose();
    }

    delete this.#plugins[name];
    return this;
  }
}
