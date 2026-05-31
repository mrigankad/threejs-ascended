# Changelog — three.js Ascended

This fork tracks [three.js](https://github.com/mrdoob/three.js) (MIT, by mrdoob
and contributors) and adds a small convenience layer on top. Only differences
from upstream are listed here.

## [1.3.0]

Based on **three.js r184**.

### Added
- `setEnvironment(app, url, options)` — one-call HDR image-based lighting
  (RGBELoader + PMREMGenerator + disposal), with optional background.
- **TypeScript declarations** (`addons/ascended/index.d.ts`) for the whole helper
  layer, wired via the package `exports` `types` condition.
- `SYNC.md` — guide for merging upstream three.js releases and resolving the
  expected rebrand conflicts.

## [1.2.0]

Based on **three.js r184**.

### Added
- `loadTexture(url, options)` — promise-based texture loading with correct
  color-space defaults (`SRGBColorSpace`), avoiding washed-out color maps.
- `screenshot(app, options)` — capture the current frame to a data URL, with
  optional download.
- `memoizeLoader(loadFn)` — loader-agnostic promise cache (dedupes by URL,
  evicts failures for retry).
- `addStats(app)` — FPS / frame-time overlay wired to the render loop.

## [1.1.0]

Based on **three.js r184**.

### Added
- `addOrbitControls(app, options)` — one-line OrbitControls wired to a `SceneApp`
  with damping and per-frame auto-update (OrbitControls loaded dynamically).
- `loadGLTF(url, options)` — promise-based glTF/GLB loading with optional DRACO.
- `disposeObject(object)` — recursive GPU-resource cleanup (geometries, materials,
  textures), addressing three.js's lack of automatic disposal.
- `example.html` now demonstrates orbit controls.

## [1.0.0]

Based on **three.js r184**.

### Added
- **`addons/ascended/` helper layer** (`threejs-ascended/addons/ascended`):
  - `SceneApp` — one-line bootstrap of renderer + scene + camera + automatic
    resize + render loop, addressing three.js setup boilerplate.
  - `addStudioLighting(scene)` — sensible default lighting rig so lit materials
    are visible immediately (the common "nothing shows up" beginner issue).
  - `Loop` and `ResizeManager` — lower-level, dependency-injectable, unit-tested
    building blocks.
  - Demo: `addons/ascended/example.html`.
  - Tests: `npm run test-ascended`.

### Changed
- Rebranded package/repo as `threejs-ascended` ("three.js Ascended"). The
  original three.js `LICENSE` (MIT) and attribution are preserved unchanged.

### Notes
- To pull upstream three.js updates: `git fetch upstream && git merge upstream/dev`.
  Expect conflicts in `package.json` / `README.md` from the rebrand; keep the
  Ascended values for the renamed fields.
