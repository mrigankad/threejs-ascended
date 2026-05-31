import {
	AmbientLight,
	DirectionalLight,
	Group,
	HemisphereLight
} from '../../build/three.module.js';

/**
 * Adds a sensible default three-point-ish lighting rig to a scene.
 *
 * One of the most common beginner pain points with three.js is an empty
 * looking scene: meshes added with lit materials (e.g. `MeshStandardMaterial`)
 * appear black because no lights were added. This helper provides reasonable
 * defaults so geometry is visible immediately, while still being tweakable.
 *
 * The lights are grouped so they can be removed in one call. The returned group
 * is added to the scene and also returned for further adjustment or disposal.
 *
 * @param {Object} scene - The scene (or any `Object3D`) to add the lights to.
 * @param {Object} [options]
 * @param {number} [options.intensity=1] - Overall multiplier applied to every
 * light's intensity.
 * @param {number} [options.skyColor=0xffffff] - Hemisphere sky color.
 * @param {number} [options.groundColor=0x444444] - Hemisphere ground color.
 * @param {number} [options.keyColor=0xffffff] - Key (main directional) color.
 * @param {Array<number>} [options.keyPosition] - `[x, y, z]` position of the key light.
 * @return {Group} The group containing the created lights.
 */
function addStudioLighting( scene, {
	intensity = 1,
	skyColor = 0xffffff,
	groundColor = 0x444444,
	keyColor = 0xffffff,
	keyPosition = [ 5, 10, 7.5 ]
} = {} ) {

	const group = new Group();
	group.name = 'AscendedStudioLighting';

	const hemisphere = new HemisphereLight( skyColor, groundColor, 1 * intensity );
	group.add( hemisphere );

	const ambient = new AmbientLight( 0xffffff, 0.3 * intensity );
	group.add( ambient );

	const key = new DirectionalLight( keyColor, 2 * intensity );
	key.position.set( keyPosition[ 0 ], keyPosition[ 1 ], keyPosition[ 2 ] );
	group.add( key );

	const fill = new DirectionalLight( 0xffffff, 0.6 * intensity );
	fill.position.set( - keyPosition[ 0 ], keyPosition[ 1 ] * 0.5, - keyPosition[ 2 ] );
	group.add( fill );

	scene.add( group );

	return group;

}

export { addStudioLighting };
