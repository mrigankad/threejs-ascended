# Changelog — three.js Ascended

This fork tracks [three.js](https://github.com/mrdoob/three.js) (MIT, by mrdoob
and contributors) and adds a small convenience layer on top. Only differences
from upstream are listed here.

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
