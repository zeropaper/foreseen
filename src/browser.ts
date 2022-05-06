import * as monaco from 'monaco-editor';
import Foreseen from './index'

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

// if (module.hot) {
//   module.hot.accept('./index.js', function () {
//     console.log('Accepting the updated printMe module!');
//     printMe();
//   })
// }