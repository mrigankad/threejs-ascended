/**
 * Recursively disposes the GPU resources owned by an `Object3D` and its
 * descendants: geometries, materials, and any textures referenced by those
 * materials.
 *
 * three.js does not free GPU memory automatically when you remove objects from
 * a scene, which is a frequent source of memory leaks. This helper walks the
 * subtree and calls the appropriate `dispose()` methods.
 *
 * It does NOT remove the object from its parent; do that separately if needed.
 *
 * @param {Object} object - The root `Object3D` (or anything with `traverse`).
 * @return {number} The number of `dispose()` calls made (useful for testing).
 */
function disposeObject( object ) {

	let disposed = 0;

	const disposeMaterial = ( material ) => {

		// Dispose any texture-like values referenced by the material.
		for ( const key of Object.keys( material ) ) {

			const value = material[ key ];

			if ( value && typeof value === 'object' && typeof value.dispose === 'function' && value.isTexture ) {

				value.dispose();
				disposed ++;

			}

		}

		if ( typeof material.dispose === 'function' ) {

			material.dispose();
			disposed ++;

		}

	};

	const handle = ( node ) => {

		if ( node.geometry && typeof node.geometry.dispose === 'function' ) {

			node.geometry.dispose();
			disposed ++;

		}

		if ( node.material ) {

			if ( Array.isArray( node.material ) ) {

				node.material.forEach( disposeMaterial );

			} else {

				disposeMaterial( node.material );

			}

		}

	};

	if ( typeof object.traverse === 'function' ) {

		object.traverse( handle );

	} else {

		handle( object );

	}

	return disposed;

}

export { disposeObject };
