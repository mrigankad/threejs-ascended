import { TextureLoader, SRGBColorSpace } from '../../build/three.module.js';

/**
 * Loads a texture and resolves with it, applying a correct color space.
 *
 * A very common three.js mistake is forgetting to set `texture.colorSpace`,
 * which makes color/albedo maps look washed out or too dark. This helper
 * defaults to `SRGBColorSpace` (the right choice for color maps); pass
 * `NoColorSpace` for data maps such as normal, roughness or metalness maps.
 *
 * @param {string} url - URL of the image.
 * @param {Object} [options]
 * @param {string} [options.colorSpace=SRGBColorSpace] - Color space to assign.
 * @param {function(ProgressEvent):void} [options.onProgress] - Progress callback.
 * @return {Promise<Object>} Resolves with the loaded `Texture`.
 */
async function loadTexture( url, options = {} ) {

	const { colorSpace = SRGBColorSpace, onProgress } = options;

	const loader = new TextureLoader();
	const texture = await loader.loadAsync( url, onProgress );

	texture.colorSpace = colorSpace;

	return texture;

}

export { loadTexture };
