/**
 * Captures the current frame of a {@link SceneApp} as an image data URL, and
 * optionally triggers a download.
 *
 * The scene is re-rendered immediately before reading the pixels so the capture
 * is correct even if the renderer was created without `preserveDrawingBuffer`.
 *
 * @param {Object} app - A {@link SceneApp} (uses `renderer`, `scene`, `camera`).
 * @param {Object} [options]
 * @param {string} [options.mimeType='image/png'] - Output image type.
 * @param {number} [options.quality] - Quality `[0,1]` for lossy types (e.g. jpeg).
 * @param {boolean} [options.download=false] - Trigger a browser download.
 * @param {string} [options.fileName='screenshot.png'] - Download file name.
 * @param {Document} [options.doc] - Document used to create the download link
 * (injectable for testing). Defaults to the global `document`.
 * @return {string} The image data URL.
 */
function screenshot( app, options = {} ) {

	const {
		mimeType = 'image/png',
		quality,
		download = false,
		fileName = 'screenshot.png',
		doc
	} = options;

	// Ensure the back buffer holds the latest frame before reading it.
	app.renderer.render( app.scene, app.camera );

	const canvas = app.renderer.domElement;
	const dataURL = canvas.toDataURL( mimeType, quality );

	if ( download ) {

		const ownerDoc = doc || ( typeof document !== 'undefined' ? document : null );

		if ( ownerDoc ) {

			const link = ownerDoc.createElement( 'a' );
			link.href = dataURL;
			link.download = fileName;
			link.click();

		}

	}

	return dataURL;

}

export { screenshot };
