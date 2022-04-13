# foreseen

Experiment to create a YAML like ThreeJS scene, rendering description document

## API

Returns an object with:
- `renderers`: an array of `THREE.WebGLRenderer` instances.  
  If the `renderers` of the YAML document is missing or empty, a default one is created.  
  TODO: add note about `renderer.domElement`
- `cameras`:
- `materials`:
- `lights`:
- `objects`:

## Local development

1. git clone <git url>
2. cd forseen
3. `npm install`
4. run tests in watch mode: `npm test -- --watch`