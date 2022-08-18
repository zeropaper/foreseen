import * as monaco from 'monaco-editor';

import defaultDemo from '../demos/default.yml?raw';
import sunglassesDemo from '../demos/sunglasses.yml?raw';
import forMaschaDemo from '../demos/for-mascha.yml?raw';
import microphoneDemo from '../demos/microphone.yml?raw';

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
  sunglassesDemo,
  forMaschaDemo,
  microphoneDemo,
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
  console.info('instance ready', instance.ready);
  if (editor) {
    editor.setValue(defaultDemo);
    instance.content = defaultDemo;
  }
});

window.addEventListener('load', () => {
  console.info('window load', instance.ready);

  editor = monaco.editor.create(editorContainer, {
    wordWrap: 'on',
    automaticLayout: true,
    value: instance.content,
    language: 'yaml'
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
})

window.instance = instance;
