/**
 * Adds orbit controls to a {@link SceneApp} in one call.
 *
 * Wraps three.js's `OrbitControls` addon: it wires the controls to the app's
 * camera and canvas, enables damping by default, and registers a per-frame
 * `controls.update()` on the app's render loop so damping works without extra
 * boilerplate.
 *
 * `OrbitControls` is imported dynamically so this module stays free of the
 * `examples/jsm` dependency until actually used (and remains importable in
 * non-browser environments).
 *
 * @param {Object} app - A {@link SceneApp} instance (uses `camera`, `renderer`,
 * and `onUpdate`).
 * @param {Object} [options]
 * @param {boolean} [options.enableDamping=true] - Smooth, inertial movement.
 * @param {number} [options.dampingFactor=0.05] - Damping strength.
 * @param {Object} [options.target] - `{ x, y, z }` point to orbit around.
 * @return {Promise<Object>} Resolves with the created `OrbitControls` instance.
 */
async function addOrbitControls( app, options = {} ) {

	const {
		enableDamping = true,
		dampingFactor = 0.05,
		target
	} = options;

	const { OrbitControls } = await import( '../../examples/jsm/controls/OrbitControls.js' );

	const controls = new OrbitControls( app.camera, app.renderer.domElement );
	controls.enableDamping = enableDamping;
	controls.dampingFactor = dampingFactor;

	if ( target ) controls.target.set( target.x, target.y, target.z );

	controls.update();

	// Keep damping responsive each frame.
	app.onUpdate( () => controls.update() );

	// Expose for convenience.
	app.controls = controls;

	return controls;

}

export { addOrbitControls };
