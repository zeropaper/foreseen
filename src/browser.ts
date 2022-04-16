import Ajv from "ajv/dist/2020"
import * as monaco from 'monaco-editor';
import Foreseen from './index'

import schema from './schema.json'

const ajv = new Ajv()

const { $schema, ...schemaAjv } = schema

// validate is a type guard for MyData - type is inferred from schema type
const validate = ajv.compile(schemaAjv)


// @ts-ignore
if (typeof window !== 'undefined' && typeof window.Foreseen === 'undefined') {
  // @ts-ignore
  window.Foreseen = Foreseen;
}

// @ts-ignore
const input = window.input || document.querySelector('#input')
// @ts-ignore
const container = window.container || document.querySelector('#container')

const instance = new Foreseen(input.value);
container.appendChild(instance.defaultRenderer.domElement)
instance.render();

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const handleChange = () => {
  console.info('change', validate(input.value))
  instance.update(input.value)
}

const handleResize = () => {
  instance.defaultRenderer.setSize(container.clientWidth, container.clientHeight)
  if (instance.defaultCamera.type === 'PerspectiveCamera') {
    instance.defaultCamera.aspect = container.clientWidth / container.clientHeight
    instance.defaultCamera?.updateProjectionMatrix()
  }
}

window.addEventListener('load', () => {
  editor = monaco.editor.create(container, {
    value: input.value,
    language: 'yaml'
  });
  editor.onKeyUp(() => {
    input.value = editor.getValue()
    handleChange()
  })
  input.style.display = 'none'
  handleChange()
  handleResize()
})
window.addEventListener('resize', handleResize)
input.addEventListener('keyup', handleChange)