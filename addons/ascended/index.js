/**
 * three.js Ascended - helper layer.
 *
 * Convenience utilities built on top of three.js that address common
 * boilerplate and beginner pain points. These are additive and live outside
 * `src/`, so they never conflict with upstream three.js updates.
 *
 * @module ascended
 */

export { SceneApp } from './SceneApp.js';
export { Loop } from './Loop.js';
export { ResizeManager } from './ResizeManager.js';
export { addStudioLighting } from './lighting.js';
export { disposeObject } from './dispose.js';
export { addOrbitControls } from './controls.js';
export { loadGLTF } from './loaders.js';
