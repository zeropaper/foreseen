/// <reference path="../Global.d.ts" />
import * as monaco from 'monaco-editor';
import Stats from 'stats.js';
import Foreseen from './index'

import defaultDemo from '../demos/default.yml';
import forMaschaDemo from '../demos/for-mascha.yml';

// @ts-ignore
if (typeof window !== 'undefined' && typeof window.Foreseen === 'undefined') {
  // @ts-ignore
  window.Foreseen = Foreseen;
}

// @ts-ignore
const canvasContainer = window.canvasContainer || document.querySelector('#canvasContainer')
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
  forMaschaDemo,
}
const demoNames = Object.keys(demos)

const instance = new Foreseen(window.THREE, demos[demoNames[0]]);
instance.onprerender = () => allStats.forEach((stats) => stats.begin())
instance.onrender = () => allStats.forEach((stats) => stats.end())
canvasContainer.appendChild(instance.domElement)

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const handleChange = () => {
  instance.update(editor?.getValue()).render()
}

const handleResize = () => {
  const { domElement: el } = instance;
  el.style.display = 'none'
  el.width = canvasContainer.clientWidth
  el.height = canvasContainer.clientHeight
  el.style.display = 'block'

  instance.defaultRenderer.setSize(el.width, el.height)
  if (instance.defaultCamera.type === 'PerspectiveCamera') {
    instance.defaultCamera.aspect = el.width / el.height
    instance.defaultCamera.updateProjectionMatrix()
  }

  instance.render()
}

const restartClockCheckbox = document.createElement('input');
restartClockCheckbox.type = 'checkbox';

const renderingButton = document.createElement('button');
renderingButton.textContent = `rendering: ${instance.data.isRendering}`;
renderingButton.addEventListener('click', () => {
  if (instance.data.isRendering) {
    instance.stopRenderLoop()
  } else {
    instance.startRenderLoop(restartClockCheckbox.checked);
  }
  renderingButton.textContent = `rendering: ${instance.data.isRendering}`;
})

const startStopButton = document.createElement('button');
startStopButton.addEventListener('click', () => {
  if (instance.isRunning) {
    instance.stopAnimation();
  } else {
    instance.startAnimation();
  }
  startStopButton.textContent = instance.isRunning ? 'stop' : 'start';
});

const pauseResumeButton = document.createElement('button');
pauseResumeButton.addEventListener('click', () => {
  if (instance.isRunning) {
    instance.pauseAnimation();
  } else {
    instance.resumeAnimation();
  }
  pauseResumeButton.textContent = instance.isRunning ? 'pause' : 'resume';
});

controlsContainer.append(renderingButton)
controlsContainer.append(restartClockCheckbox)
controlsContainer.append(startStopButton)
controlsContainer.append(pauseResumeButton)

const demoSelector: HTMLSelectElement = document.createElement('select');
demoSelector.addEventListener('change', ({ target }: Event & { target: HTMLSelectElement }) => {
  const demo = demos[target.value]
  editor.setValue(demo)
  instance.update(demo).render()
})
demoNames.forEach((name, n) => {
  const option = document.createElement('option')
  option.value = name
  option.textContent = name.replace(/Demo$/, '')
  option.selected = n === 0
  demoSelector.appendChild(option)
})
demoSelectorContainer.appendChild(demoSelector)

setInterval(() => {
  debugContainer.textContent = JSON.stringify(instance.data, null, 2)
}, 1000)

window.addEventListener('load', () => {
  editor = monaco.editor.create(editorContainer, {
    wordWrap: 'on',
    automaticLayout: true,
    value: instance.input,
    language: 'yaml'
  });
  const layoutInfo = editor.getLayoutInfo()
  editorContainer.style.width = `${layoutInfo.width}px`;
  editorContainer.style.height = `${layoutInfo.height}px`;

  editor.onKeyUp(handleChange)
  handleChange()
  handleResize()
  instance.startRenderLoop()
  startStopButton.textContent = instance.isRunning ? 'stop' : 'start';
  pauseResumeButton.textContent = instance.isRunning ? 'pause' : 'resume';
})
window.addEventListener('resize', handleResize)

// @ts-ignore
window.scene = instance.scene;
// @ts-ignore
window.meshes = instance.meshes;
// @ts-ignore
window.instance = instance;
