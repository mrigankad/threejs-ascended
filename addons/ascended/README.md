# Ascended helpers

Convenience utilities built on top of three.js, addressing the most common
boilerplate and beginner pain points. These live outside `src/`, so they never
conflict when pulling upstream three.js updates.

> Built on [three.js](https://github.com/mrdoob/three.js) by mrdoob and
> contributors. MIT licensed.

## Why

Research into common three.js friction points consistently surfaces two issues:

1. **Setup boilerplate** — a basic scene needs ~15–20 lines (renderer, camera,
   scene, resize handling, render loop) before anything appears.
2. **"Nothing shows up"** — meshes with lit materials render black because no
   lights were added.

This layer targets both directly.

## Usage

```js
import { SceneApp, addStudioLighting } from 'threejs-ascended/addons/ascended';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'threejs-ascended';

const app = new SceneApp( { container: document.querySelector( '#app' ) } );

addStudioLighting( app.scene );

const cube = new Mesh( new BoxGeometry(), new MeshStandardMaterial( { color: 0x3399ff } ) );
app.scene.add( cube );

app.onUpdate( ( delta ) => { cube.rotation.y += delta; } );
app.start();
```

## API

### `new SceneApp(config?)`
Bootstraps `renderer`, `scene`, `camera` (all public), automatic resize, and a
render loop.

- `config.container` – element to render into (default `document.body`)
- `config.fov` / `config.near` / `config.far` – camera settings
- `config.antialias` – renderer antialiasing (default `true`)
- `app.onUpdate(cb)` – register a per-frame callback `(delta, elapsed)`; returns
  an unsubscribe function
- `app.start()` / `app.stop()` / `app.dispose()`

### `addStudioLighting(scene, options?)`
Adds a sensible hemisphere + ambient + key/fill directional rig so lit materials
are visible immediately. Returns the light `Group` (removable in one call).

### `addOrbitControls(app, options?)` → `Promise<OrbitControls>`
One-line orbit controls for a `SceneApp`: wires three.js `OrbitControls` to the
camera and canvas, enables damping, and auto-updates each frame. `OrbitControls`
is loaded dynamically, so it's only pulled in when used.

- `options.enableDamping` (default `true`), `options.dampingFactor` (default `0.05`)
- `options.target` – `{ x, y, z }` point to orbit around

### `loadGLTF(url, options?)` → `Promise<GLTF>`
Promise-based glTF/GLB loading via three.js `GLTFLoader`, with optional DRACO
decompression.

- `options.dracoPath` – decoder path to enable DRACO (e.g. the gstatic CDN)
- `options.onProgress` – progress callback

### `disposeObject(object)` → `number`
Recursively frees GPU resources (geometries, materials, and their textures) for
an object and its descendants — three.js does not do this automatically when you
remove objects. Returns the number of `dispose()` calls made.

### `Loop(callback, options?)` and `ResizeManager(config, options?)`
The lower-level building blocks used by `SceneApp`, exported for direct use and
fully unit-tested (browser APIs are injectable).

## Tests

```bash
npm run test-ascended
```
