import type { Foreseen } from './index';

import { x } from './icons';

// the style element created by the usage of import
// will be added to the head of the document,
// this is not going to work well when it is
// within the shadow root of a web component
// import classNames from './Controls.module.css';

// using the "raw" and adding it later as the content
// of a style element that can be added wherever fits
import rawStyles from './Controls.module.css?raw';

enum classNames {
  dialog = 'fs-ctrls',
  close = 'fs-ctrls-close',
  header = 'fs-ctrls-header',
  main = 'fs-ctrls-main',
  stats = 'fs-ctrls-stats',
  content = 'fs-ctrls-content',
}

const controlsHTML = `
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
  <div class="${classNames.content} content"></div>
</main>
`;

export default class Controls {
  constructor(foreseen: Foreseen) {
    const dialog = document.createElement('dialog');
    dialog.classList.add(classNames.dialog);
    dialog.innerHTML = controlsHTML;
    foreseen.domElement.style.position = 'relative';
    this.#dialog = dialog;

    const style = document.createElement('style');
    style.textContent = rawStyles;
    style.id = 'controls-styles';
    foreseen.domElement.appendChild(style);

    this.#$('button.close')?.addEventListener('click', () => {
      this.open = false;
    });

    foreseen.domElement.addEventListener('dblclick', () => {
      this.open = !this.open;
    });

    foreseen.domElement.appendChild(dialog);

    this.open = false;
  }

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
    this.#$('.content')?.appendChild(element);
  }

  remove(element: HTMLElement) {
    this.#$('.content')?.removeChild(element);
  }

  appendElement(tagName: string, className: string) {
    const el = document.createElement(tagName);
    el.classList.add(className);
    this.append(el);
    return el;
  }
}
