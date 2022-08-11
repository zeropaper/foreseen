import Foreseen from './index';

const elementName = 'foreseen-component';
const template = document.createElement('template');
template.innerHTML = `
<style>
  :host, :host *, :host *:before, :host *:after {
    box-sizing: border-box;
  }
  :host {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .foreseen-dom {
    z-index: 50;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }
</style>

<div class="foreseen-dom"></div>
`;

async function forseen3DLibLoader(): Promise<any> {
  if (typeof window !== 'undefined' && typeof window.THREE !== 'undefined') {
    return window.THREE;
  }
  return import(/* webpackChunkName: "three" */ 'three');
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

    shadow.appendChild(template.content.cloneNode(true));

    this.#resizeObserver = new ResizeObserver(entries => {
      console.info('resize triggered', entries);
      this.resize();
    });
    this.#resizeObserver.observe(this.#root.host);

    forseen3DLibLoader().then((THREE) => {
      this.#foreseen = new Foreseen(THREE, '');
      this.#foreseen.domElement.classList.add('foreseen-dom');
      this.#$('.foreseen-dom').replaceWith(this.#foreseen.domElement);
      this.resize();
      this.#whenReady.forEach(fn => fn());
    });
  }

  #resizeObserver: ResizeObserver;

  #content = '';

  #root: ShadowRoot;

  #foreseen: Foreseen | null = null;

  #$$(selector) {
    return this.#root.querySelectorAll(selector);
  }

  #$(selector) {
    return this.#root.querySelector(selector);
  }

  #whenReady: Function[] = [];

  get ready() {
    return !!this.#foreseen;
  }

  get isRunning() {
    return !!this.#foreseen && this.#foreseen.isRunning;
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
      this.#whenReady.push(() => {
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
      this.#whenReady.push(() => {
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
      this.#whenReady.push(() => {
        this.content = value;
      });
      return;
    }
    this.#content = value;
    this.#foreseen.update(value).render();
  }

  resize() {
    if (!this.#foreseen) return;
    const {
      defaultRenderer,
      defaultCamera,
      domElement: el,
    } = this.#foreseen;
    el.style.display = 'none'
    el.width = this.#root.host.clientWidth
    el.height = this.#root.host.clientHeight
    el.style.display = 'block'

    defaultRenderer.setSize(el.width, el.height)
    if (defaultCamera.type === 'PerspectiveCamera') {
      defaultCamera.aspect = el.width / el.height
      defaultCamera.updateProjectionMatrix()
    }
    this.#foreseen.render();
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }
}

customElements.define(elementName, ForeseenWC, ForeseenWC.options);
