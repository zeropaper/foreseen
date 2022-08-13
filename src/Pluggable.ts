import type ForeseenPlugin from './plugins/ForeseenPlugin';

export default class Pluggable extends EventTarget {
  addPlugins(...Plugins: (typeof ForeseenPlugin)[]) {
    Plugins.forEach(Plugin => {
      const found = this.#plugins[Plugin.name];

      if (found) return;

      const plugin = new Plugin(this as any);

      this.#plugins[Plugin.name] = plugin;
    });
    return this;
  }

  removePlugin(name: string) {
    const plugin = this.#plugins[name];
    if (!plugin) return this;

    if (typeof plugin.dispose === 'function') plugin.dispose();

    delete this.#plugins[name];
    return this;
  }

  #plugins: { [name: string]: ForeseenPlugin; } = {};

  get plugins() {
    return this.#plugins;
  }
}
