import Stats from 'stats.js';
import type Foreseen from '..';
import ForeseenPlugin from './ForeseenPlugin';

export default class StatsPlugin extends ForeseenPlugin {
  constructor(foreseen: Foreseen) {
    super(foreseen);
    this.#el = document.createElement('div');
    this.#stats = new Array(3).fill(null).map((_, i) => {
      const stats = new Stats();
      stats.showPanel(i);
      stats.dom.style.position = 'relative';
      this.#el.appendChild(stats.dom)
      return stats;
    });

    foreseen.addEventListener('prerender', this.prerenderListener);
    foreseen.addEventListener('render', this.renderListener);
    foreseen.controls.append(this.#el);
  }

  #el: HTMLDivElement;

  #stats: Stats[] = [];

  prerenderListener() {
    this.#stats.forEach((stats) => stats.begin());
  }

  renderListener() {
    this.#stats.forEach((stats) => stats.end());
  }

  get ready(): boolean {
    return true
  }

  dispose(): void {
    const { parent: foreseen } = this;
    foreseen.controls.remove(this.#el);
    foreseen.removeEventListener('prerender', this.prerenderListener);
    foreseen.removeEventListener('render', this.renderListener);
  }
}
