import type { Foreseen } from './index';

import cssModule from './Controls.module.css';
import { x } from './icons';

const { locals: classNames } = cssModule;

const controlsHTML = `
<style>${cssModule.toString()}</style>

<header class="${classNames.header}">
  <h1>Foreseen</h1>

  <button
    class="${classNames.close} close"
    type="button"
    title="Close controls"
  >
    ${x}
  </button>
</header>

<main class="${classNames.main}">
  <div class="${classNames.stats} stats"></div>
  <div class="${classNames.content} content"></div>
</main>
`;

export default class Controls {
  constructor(foreseen: Foreseen) {
    this.#foreseen = foreseen;

    const dialog = document.createElement('dialog');
    dialog.classList.add(classNames.root);
    dialog.innerHTML = controlsHTML;
    foreseen.domElement.style.position = 'relative';
    this.#dialog = dialog;

    this.#$('button.close').addEventListener('click', () => {
      this.open = false;
    });

    foreseen.domElement.addEventListener('dblclick', () => {
      this.open = !this.open;
    });

    foreseen.domElement.appendChild(dialog);

    this.open = true;
  }

  #foreseen: Foreseen;

  #dialog: HTMLDialogElement;

  #$(selector: string) {
    return this.#dialog.querySelector(selector);
  }

  get open() {
    return this.#dialog.open;
  }

  set open(value: boolean) {
    this.#dialog.open = value;
    this.#dialog.style.display = value ? 'flex' : 'none';
  }

  append(element: HTMLElement) {
    this.#$('.content').appendChild(element);
  }

  appendElement(tagName: string, className: string) {
    const el = document.createElement(tagName);
    el.classList.add(className);
    this.append(el);
    return el;
  }
}
