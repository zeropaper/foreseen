/// <reference path="../Global.d.ts" />
import * as monaco from 'monaco-editor';
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

const demos = {
  defaultDemo,
  forMaschaDemo,
}
const demoNames = Object.keys(demos)

const instance = new Foreseen(window.THREE, demos[demoNames[0]]);
canvasContainer.appendChild(instance.domElement)

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const handleChange = () => {
  instance.update(editor?.getValue()).render()
}

const handleResize = () => {
  instance.defaultRenderer.domElement.style.display = 'none'
  instance.defaultRenderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight)
  instance.defaultRenderer.domElement.style.display = 'block'
  if (instance.defaultCamera.type === 'PerspectiveCamera') {
    instance.defaultCamera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight
    instance.defaultCamera?.updateProjectionMatrix()
  }
  instance.render()
}

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
  instance.render()
  instance.startRenderLoop().clock.start();
})
window.addEventListener('resize', handleResize)

const renderingButton = document.createElement('button');
renderingButton.textContent = `rendering: ${instance.data.isRendering}`;
renderingButton.addEventListener('click', () => {
  if (instance.data.isRendering) {
    instance.stopRenderLoop()
  } else {
    instance.startRenderLoop();
  }
  renderingButton.textContent = `rendering: ${instance.data.isRendering}`;
})

const clockButton = document.createElement('button');
clockButton.textContent = `clock: ${instance.clock.running}`;
clockButton.addEventListener('click', () => {
  if (instance.clock.running) {
    instance.clock.stop();
  } else {
    instance.clock.start();
  }
  clockButton.textContent = `clock: ${instance.clock.running}`;
});
controlsContainer.append(renderingButton)
controlsContainer.append(clockButton)

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

// @ts-ignore
window.scene = instance.scene;
// @ts-ignore
window.meshes = instance.meshes;
// @ts-ignore
window.instance = instance;
