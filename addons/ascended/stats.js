/**
 * Adds an FPS / frame-time performance overlay to the page and updates it on
 * the {@link SceneApp} render loop.
 *
 * Wraps three.js's `stats.module.js` addon, imported dynamically so it is only
 * pulled in when used.
 *
 * @param {Object} app - A {@link SceneApp} (uses `onUpdate`).
 * @param {Object} [options]
 * @param {HTMLElement} [options.parent] - Element to append the panel to.
 * Defaults to `document.body`.
 * @return {Promise<Object>} Resolves with the `Stats` instance (its `.dom` is
 * the panel element).
 */
async function addStats( app, options = {} ) {

	const { parent } = options;

	const { default: Stats } = await import( '../../examples/jsm/libs/stats.module.js' );

	const stats = new Stats();

	const host = parent || ( typeof document !== 'undefined' ? document.body : null );
	if ( host ) host.appendChild( stats.dom );

	app.onUpdate( () => stats.update() );
	app.stats = stats;

	return stats;

}

export { addStats };
