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
const input = window.input || document.querySelector('#input')
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

const instance = new Foreseen(window.THREE, input.value);
canvasContainer.appendChild(instance.domElement)

setInterval(() => {
  debugContainer.textContent = JSON.stringify(instance.data, null, 2)
}, 1000)

// @ts-ignore
window.scene = instance.scene;
// @ts-ignore
window.meshes = instance.meshes;
// @ts-ignore
window.instance = instance;

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const handleChange = () => {
  instance.update(input.value).render()
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
    automaticLayout: true,
    value: input.value,
    language: 'yaml'
  });
  const layoutInfo = editor.getLayoutInfo()
  editorContainer.style.width = `${layoutInfo.width}px`;
  editorContainer.style.height = `${layoutInfo.height}px`;

  editor.onKeyUp(() => {
    input.value = editor.getValue()
    handleChange()
  })
  input.style.display = 'none'
  handleChange()
  handleResize()
  instance.render()
  instance.startRenderLoop().clock.start();
})
window.addEventListener('resize', handleResize)
input.addEventListener('keyup', handleChange)

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


const demos = {
  defaultDemo,
  forMaschaDemo,
}
const demoNames = Object.keys(demos)
const demoSelector: HTMLSelectElement = document.createElement('select');
demoSelector.addEventListener('change', ({ target }: Event & { target: HTMLSelectElement }) => {
  const demo = demos[target.value]
  console.info('demo selector changed', target.value, demo)
  input.value = demo
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

// if (module.hot) {
//   module.hot.accept('./index.js', function () {
//     console.log('Accepting the updated printMe module!');
//     printMe();
//   })
// }