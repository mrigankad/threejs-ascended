/**
 * Loads a glTF / GLB model and resolves with the parsed result.
 *
 * Wraps three.js's `GLTFLoader` addon with a promise-based API and optional,
 * lazily-configured DRACO mesh decompression. The loader modules are imported
 * dynamically so this module only pulls in `examples/jsm` when actually used.
 *
 * @param {string} url - URL of the `.gltf` or `.glb` file.
 * @param {Object} [options]
 * @param {string} [options.dracoPath] - If set, enables DRACO decompression
 * using decoder files served from this path (e.g.
 * `'https://www.gstatic.com/draco/v1/decoders/'`).
 * @param {function(ProgressEvent):void} [options.onProgress] - Progress callback.
 * @return {Promise<Object>} Resolves with the loaded glTF object (its `.scene`
 * holds the renderable graph).
 */
async function loadGLTF( url, options = {} ) {

	const { dracoPath, onProgress } = options;

	const { GLTFLoader } = await import( '../../examples/jsm/loaders/GLTFLoader.js' );
	const loader = new GLTFLoader();

	if ( dracoPath ) {

		const { DRACOLoader } = await import( '../../examples/jsm/loaders/DRACOLoader.js' );
		const draco = new DRACOLoader();
		draco.setDecoderPath( dracoPath );
		loader.setDRACOLoader( draco );

	}

	return loader.loadAsync( url, onProgress );

}

export { loadGLTF };
