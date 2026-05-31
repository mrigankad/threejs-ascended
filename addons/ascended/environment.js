import { PMREMGenerator } from '../../build/three.module.js';

/**
 * Loads an equirectangular HDR (`.hdr`) image and applies it as the scene's
 * image-based lighting environment, producing realistic reflections and
 * ambient light on physical materials.
 *
 * Setting up IBL in three.js normally means manually wiring `RGBELoader` and
 * `PMREMGenerator` and remembering to dispose both. This helper does all of
 * that and resolves with the prefiltered environment map.
 *
 * `RGBELoader` is imported dynamically so this module only pulls in
 * `examples/jsm` when actually used.
 *
 * @param {Object} app - A {@link SceneApp} (uses `renderer` and `scene`).
 * @param {string} url - URL of the `.hdr` equirectangular image.
 * @param {Object} [options]
 * @param {boolean} [options.background=false] - Also use the map as the scene
 * background.
 * @param {function(ProgressEvent):void} [options.onProgress] - Progress callback.
 * @return {Promise<Object>} Resolves with the prefiltered environment `Texture`.
 */
async function setEnvironment( app, url, options = {} ) {

	const { background = false, onProgress } = options;

	const { RGBELoader } = await import( '../../examples/jsm/loaders/RGBELoader.js' );

	const hdr = await new RGBELoader().loadAsync( url, onProgress );

	const pmrem = new PMREMGenerator( app.renderer );
	pmrem.compileEquirectangularShader();

	const envMap = pmrem.fromEquirectangular( hdr ).texture;

	app.scene.environment = envMap;
	if ( background ) app.scene.background = envMap;

	hdr.dispose();
	pmrem.dispose();

	return envMap;

}

export { setEnvironment };
