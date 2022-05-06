# Foreseen

Experiment to create a YAML like ThreeJS scene, rendering description document

## Goals

**Draft**

1. Provide a way to create an animate ThreeJS scene from a description document
   and interactions or signals (like microphone, MIDI devices, ...).
2. Provide an browser environment with an editor that can beused to edit the
   description document and live update of the ThreeJS scene.

### Considerations

**TODO:** write about no `eval` in the description document instructions

## Local development

1. `git clone <git url>`
2. `cd foreseen`
3. `npm install`
4. run tests in watch mode: `npm test -- --watch`

### Browser

You can also run `npm run dev` to start a local server.  
The app it serves is a simple web page with an editor and
some debug information.

You can also run `npm run docs` to build a statically servable 
bundle (and use something like `npx http-server docs/` to serve it).  
This is the way https://zeropaper.github.io/foreseen is built.
