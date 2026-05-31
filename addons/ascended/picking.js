import { Raycaster, Vector2 } from '../../build/three.module.js';

/**
 * Click/pointer picking for a {@link SceneApp}. Register callbacks per object
 * and they fire when that object (or one of its descendants) is clicked.
 *
 * Raycasting from screen coordinates is fiddly to set up by hand (normalized
 * device coordinates, the camera, intersection tests). `PointerPicker` wraps it
 * into a simple `on( object, callback )` API.
 */
class PointerPicker {

	/**
	 * @param {Object} app - A {@link SceneApp} (uses `renderer` and `camera`).
	 * @param {Object} [options]
	 * @param {Object} [options.raycaster] - Injectable raycaster (for testing).
	 * @param {string} [options.eventType='click'] - DOM event to listen for.
	 */
	constructor( app, { raycaster, eventType = 'click' } = {} ) {

		this.app = app;
		this.raycaster = raycaster || new Raycaster();
		this.pointer = new Vector2();
		this.eventType = eventType;

		this._targets = new Map(); // Object3D -> Set<callback>
		this._domElement = app.renderer.domElement;
		this._onEvent = ( event ) => this.handleEvent( event );

	}

	/**
	 * Registers a callback for clicks on `object` (or its descendants).
	 *
	 * @param {Object} object - The `Object3D` to make interactive.
	 * @param {Function} callback - Called with the closest `Intersection`.
	 * @return {Function} An unsubscribe function.
	 */
	on( object, callback ) {

		if ( ! this._targets.has( object ) ) this._targets.set( object, new Set() );
		this._targets.get( object ).add( callback );

		return () => {

			const set = this._targets.get( object );
			if ( ! set ) return;
			set.delete( callback );
			if ( set.size === 0 ) this._targets.delete( object );

		};

	}

	/**
	 * Computes normalized device coordinates from a pointer event relative to a
	 * bounding rect. Exposed for testing.
	 *
	 * @param {Object} event - Has `clientX` / `clientY`.
	 * @param {Object} rect - Has `left`, `top`, `width`, `height`.
	 * @return {Vector2} The updated `pointer`.
	 */
	setPointerFromEvent( event, rect ) {

		this.pointer.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		this.pointer.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		return this.pointer;

	}

	/**
	 * Performs the raycast for an event and dispatches to matching callbacks.
	 *
	 * @param {Object} event - The pointer event.
	 */
	handleEvent( event ) {

		const rect = this._domElement.getBoundingClientRect();
		this.setPointerFromEvent( event, rect );

		this.raycaster.setFromCamera( this.pointer, this.app.camera );

		const objects = [ ...this._targets.keys() ];
		if ( objects.length === 0 ) return;

		const hits = this.raycaster.intersectObjects( objects, true );

		for ( const hit of hits ) {

			// Walk up from the hit object to the nearest registered ancestor.
			let node = hit.object;
			while ( node ) {

				const callbacks = this._targets.get( node );
				if ( callbacks ) {

					for ( const cb of callbacks ) cb( hit );
					return; // closest match handled

				}

				node = node.parent;

			}

		}

	}

	/**
	 * Starts listening for pointer events.
	 *
	 * @return {PointerPicker} A reference to this picker.
	 */
	start() {

		if ( this._domElement && this._domElement.addEventListener ) {

			this._domElement.addEventListener( this.eventType, this._onEvent );

		}

		return this;

	}

	/**
	 * Stops listening for pointer events.
	 *
	 * @return {PointerPicker} A reference to this picker.
	 */
	stop() {

		if ( this._domElement && this._domElement.removeEventListener ) {

			this._domElement.removeEventListener( this.eventType, this._onEvent );

		}

		return this;

	}

}

/**
 * Convenience: creates and starts a {@link PointerPicker} for the app and
 * exposes `app.onClick( object, callback )`.
 *
 * @param {Object} app - A {@link SceneApp}.
 * @param {Object} [options] - Forwarded to {@link PointerPicker}.
 * @return {PointerPicker} The started picker.
 */
function addPicking( app, options ) {

	const picker = new PointerPicker( app, options ).start();

	app.picker = picker;
	app.onClick = ( object, callback ) => picker.on( object, callback );

	return picker;

}

export { PointerPicker, addPicking };
