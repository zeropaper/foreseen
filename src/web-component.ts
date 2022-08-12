import Foreseen from './index';
import ForeseenPlugin from './plugins/ForeseenPlugin';

const elementName = 'foreseen-component';
const template = document.createElement('template');
template.innerHTML = `
<style>
  :host, :host *, :host *:before, :host *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .foreseen-dom {}
</style>

<div class="foreseen-dom"></div>
`;

async function forseen3DLibLoader(): Promise<any> {
  if (typeof window !== 'undefined' && typeof window.THREE !== 'undefined') {
    return window.THREE;
  }
  return import(/* webpackChunkName: "three" */ 'three');
}

class ForeseenWCReadyEvent extends Event {
  constructor() {
    super('ready');
  }
}

interface ForeseenWCEventMap {
  'ready': ForeseenWCReadyEvent;
}

export class ForeseenWC extends HTMLElement {
  static options: ElementDefinitionOptions = {}

  static get observedAttributes() {
    return ['editor'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.#root = shadow;
    this.#content = this.#root.host.textContent.trim();

    this.resize = this.resize.bind(this);

    shadow.appendChild(template.content.cloneNode(true));

    forseen3DLibLoader().then((THREE) => {
      this.#foreseen = new Foreseen(THREE, '');
      this.#foreseen.domElement.classList.add('foreseen-dom');
      this.#$('.foreseen-dom').replaceWith(this.#foreseen.domElement);
      this.resize();
      this.dispatchEvent(new ForeseenWCReadyEvent());
    });
  }

  #content = '';

  #root: ShadowRoot;

  #foreseen: Foreseen | null = null;

  #$$(selector) {
    return this.#root.querySelectorAll(selector);
  }

  #$(selector) {
    return this.#root.querySelector(selector);
  }

  get ready() {
    return !!this.#foreseen;
  }

  get isRunning() {
    return !!this.#foreseen && this.#foreseen.isRunning;
  }

  addEventListener<K extends keyof ForeseenWCEventMap>(type: K, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    super.addEventListener(type, listener, options);
  }

  addPlugins(...plugins: (typeof ForeseenPlugin)[]) {
    if (!this.ready) {
      this.addEventListener('ready', () => this.addPlugins(...plugins), { once: true });
      return;
    }
    this.#foreseen.addPlugins(...plugins);
  }

  startRenderLoop(restartClock = true) {
    this.#foreseen?.startRenderLoop(restartClock);
  }

  stopRenderLoop() {
    this.#foreseen?.stopRenderLoop();
  }

  startAnimation() {
    this.#foreseen?.startAnimation();
  }

  pauseAnimation() {
    this.#foreseen?.pauseAnimation();
  }

  resumeAnimation() {
    this.#foreseen?.resumeAnimation();
  }

  stopAnimation() {
    this.#foreseen?.stopAnimation();
  }

  get data() {
    return this.#foreseen?.data;
  }

  set onprerender(value) {
    if (!this.ready) {
      this.addEventListener('ready', () => {
        this.onprerender = value;
      });
      return;
    }
    this.#foreseen.onprerender = value;
  }

  get onprerender() {
    return this.#foreseen?.onprerender;
  }

  set onrender(value) {
    if (!this.ready) {
      this.addEventListener('ready', () => {
        this.onrender = value;
      });
      return;
    }
    this.#foreseen.onrender = value;
  }

  get onrender() {
    return this.#foreseen?.onrender;
  }

  get content() {
    return this.#content;
  }

  set content(value: string) {
    if (!this.ready) {
      this.addEventListener('ready', () => {
        this.content = value;
      });
      return;
    }
    this.#content = value;
    this.#foreseen.update(value).render();
  }

  resize() {
    this.#foreseen?.setSizeFromContainer(this);
  }

  connectedCallback() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resize);
    }
  }

  disconnectedCallback() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resize);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }
}

customElements.define(elementName, ForeseenWC, ForeseenWC.options);
