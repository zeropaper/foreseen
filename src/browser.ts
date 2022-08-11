/// <reference path="../Global.d.ts" />
import * as monaco from 'monaco-editor';
import Stats from 'stats.js';
import Foreseen from './index'
import UserMediaPlugin from './plugins/usermedia'
import * as THREE from 'three';

import defaultDemo from '../demos/default.yml';
import sunglassesDemo from '../demos/sunglasses.yml';
import forMaschaDemo from '../demos/for-mascha.yml';
import microphoneDemo from '../demos/microphone.yml';

import './web-component';
import type { ForeseenWC } from './web-component';

// @ts-ignore
if (typeof window !== 'undefined' && typeof window.Foreseen === 'undefined') {
  // @ts-ignore
  window.Foreseen = Foreseen;
}

// @ts-ignore
const canvasContainer = window.canvasContainer || document.querySelector('main')
// @ts-ignore
const demoSelectorContainer = window.demoSelectorContainer || document.querySelector('#demoSelectorContainer')
// @ts-ignore
const editorContainer = window.editorContainer || document.querySelector('#editorContainer')
// @ts-ignore
const controlsContainer = window.controlsContainer || document.querySelector('#controlsContainer')
// @ts-ignore
const debugContainer = window.debugContainer || document.querySelector('#debugContainer')

const allStats = new Array(3).fill(null).map((_, i) => {
  const stats = new Stats();
  stats.showPanel(i);
  stats.dom.style.position = 'absolute';
  stats.dom.style.top = `${i * 48}px`;
  canvasContainer.appendChild(stats.dom)
  return stats;
});

const demos = {
  defaultDemo,
  sunglassesDemo,
  forMaschaDemo,
  microphoneDemo,
}
const demoNames = Object.keys(demos)

const instance = document.querySelector('foreseen-component') as ForeseenWC;
instance.addPlugins(UserMediaPlugin, MousePlugin);

instance.addEventListener('ready', () => {
  instance.startRenderLoop();
  instance.startAnimation();
});

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const handleChange = () => {
  instance.content = editor?.getValue();
}

const restartClockCheckbox = document.createElement('input');
restartClockCheckbox.type = 'checkbox';

const renderingButton = document.createElement('button');
renderingButton.addEventListener('click', () => {
  if (instance.data.isRendering) {
    instance.stopRenderLoop()
  } else {
    instance.startRenderLoop(restartClockCheckbox.checked);
  }
  renderingButton.textContent = `render loop: ${instance.data.isRendering}`;
})

const handleStartStop = () => {
  if (instance.isRunning) {
    instance.stopAnimation();
  } else {
    instance.startAnimation();
  }
  startStopButton.textContent = instance.isRunning ? 'stop' : 'start';
}
const startStopButton = document.createElement('button');
startStopButton.addEventListener('click', handleStartStop);

const handlePauseResume = () => {
  if (instance.isRunning) {
    instance.pauseAnimation();
  } else {
    instance.resumeAnimation();
  }
  pauseResumeButton.textContent = instance.isRunning ? 'pause' : 'resume';
}
const pauseResumeButton = document.createElement('button');
pauseResumeButton.addEventListener('click', handlePauseResume);

controlsContainer.append(renderingButton)
controlsContainer.append(restartClockCheckbox)
controlsContainer.append(startStopButton)
controlsContainer.append(pauseResumeButton)

const demoSelector: HTMLSelectElement = document.createElement('select');
demoSelector.addEventListener('change', ({ target }: Event & { target: HTMLSelectElement }) => {
  const demo = demos[target.value]
  editor.setValue(demo)
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

setInterval(() => {
  debugContainer.textContent = JSON.stringify(instance.data, null, 2)
}, 1000)

window.addEventListener('load', () => {
  instance.content = defaultDemo;

  editor = monaco.editor.create(editorContainer, {
    wordWrap: 'on',
    automaticLayout: true,
    value: instance.content,
    language: 'yaml'
  });

  editor.onKeyUp(handleChange);
  handleChange();

  // bragger mode
  editor.addCommand(
    monaco.KeyCode.F4,
    function () {
      document.body.classList.toggle('bragger');
      editorContainer.style.width = null;
      editorContainer.style.height = null;
      editor.layout()
    }
  );

  // // animation toggle
  // editor.addCommand(
  //   monaco.KeyCode.F6,
  //   handlePauseResume
  // );
})

// @ts-ignore
window.scene = instance.scene;
// @ts-ignore
window.meshes = instance.meshes;
// @ts-ignore
window.instance = instance;
