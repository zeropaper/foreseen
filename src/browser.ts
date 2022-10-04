import type * as monaco from 'monaco-editor';

import defaultDemo from '../demos/default.yml?raw';
import groupsDemo from '../demos/groups.yml?raw';
import sunglassesDemo from '../demos/sunglasses.yml?raw';

import Foreseen from './index'
import UserMediaPlugin from './plugins/UserMediaPlugin'
import MousePlugin from './plugins/MousePlugin'
import StatsPlugin from './plugins/StatsPlugin'
import './web-component';
import type { ForeseenWC } from './web-component';

declare global {
  interface Window {
    Foreseen?: typeof Foreseen;
    demoSelectorContainer: HTMLElement;
    editorContainer: HTMLElement;

    instance?: ForeseenWC;
  }
}

if (typeof window !== 'undefined' && typeof window.Foreseen === 'undefined') {
  window.Foreseen = Foreseen;
}

const {
  demoSelectorContainer,
  editorContainer,
} = window;

const demos = {
  defaultDemo,
  groupsDemo,
  sunglassesDemo,
}
const demoNames = Object.keys(demos)

const instance = document.querySelector('foreseen-component') as ForeseenWC;
instance.addPlugins(UserMediaPlugin, MousePlugin, StatsPlugin);

instance.addEventListener('ready', () => {
  instance.startRenderLoop();
  instance.startAnimation();
});

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const handleChange = () => {
  instance.content = editor?.getValue() || '';
}

const demoSelector: HTMLSelectElement = document.createElement('select');
demoSelector.addEventListener('change', function () {
  const demo = demos[this.value as keyof typeof demos]
  editor?.setValue(demo)
  instance.content = demo;
});

demoNames.forEach((name, n) => {
  const option = document.createElement('option')
  option.value = name
  option.textContent = name.replace(/Demo$/, '')
  option.selected = n === 0
  demoSelector.appendChild(option)
});

demoSelectorContainer.appendChild(demoSelector)

instance.addEventListener('ready', () => {
  if (editor) {
    editor.setValue(defaultDemo);
  }
  instance.content = defaultDemo;
});

window.addEventListener('load', () => {
  import('./custom-monaco').then(({ monaco }) => {
    editor = monaco.editor.create(editorContainer, {
      wordWrap: 'on',
      automaticLayout: true,
      value: instance.content,
      language: 'yaml',
      insertSpaces: true,
      tabSize: 2,
    });

    editor.onKeyUp(handleChange);

    // bragger mode
    editor.addCommand(
      monaco.KeyCode.F4,
      function () {
        document.body.classList.toggle('bragger');
        editorContainer.style.width = '';
        editorContainer.style.height = '';
        editor?.layout()
      }
    );

    // // animation toggle
    // editor.addCommand(
    //   monaco.KeyCode.F6,
    //   handlePauseResume
    // );

    editor.setValue(defaultDemo);
    instance.content = defaultDemo;
  });
})

window.instance = instance;
