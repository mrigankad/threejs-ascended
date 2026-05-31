import {
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from '../../build/three.module.js';
import { Loop } from './Loop.js';
import { ResizeManager } from './ResizeManager.js';

/**
 * A thin convenience wrapper that collapses the common three.js bootstrapping
 * boilerplate (renderer, scene, camera, automatic resize handling and a render
 * loop) into a few lines.
 *
 * ```js
 * import { SceneApp } from 'threejs-ascended/addons/ascended';
 *
 * const app = new SceneApp( { container: document.body } );
 * app.scene.add( myMesh );
 * app.onUpdate( ( delta ) => { myMesh.rotation.y += delta; } );
 * app.start();
 * ```
 *
 * It intentionally stays minimal: `scene`, `camera` and `renderer` are public
 * so anything three.js can do is still directly available.
 */
class SceneApp {

	/**
	 * @param {Object} [config]
	 * @param {HTMLElement} [config.container] - Element to render into. Defaults
	 * to `document.body`.
	 * @param {number} [config.fov=50] - Perspective camera field of view.
	 * @param {number} [config.near=0.1] - Camera near plane.
	 * @param {number} [config.far=2000] - Camera far plane.
	 * @param {boolean} [config.antialias=true] - Renderer antialiasing.
	 * @param {Function} [config.createRenderer] - Factory returning a renderer,
	 * injectable for testing. Receives the resolved config.
	 */
	constructor( config = {} ) {

		const {
			container = ( typeof document !== 'undefined' ? document.body : null ),
			fov = 50,
			near = 0.1,
			far = 2000,
			antialias = true,
			createRenderer
		} = config;

		/**
		 * The DOM element being rendered into.
		 *
		 * @type {?HTMLElement}
		 */
		this.container = container;

		/**
		 * The scene graph root.
		 *
		 * @type {Scene}
		 */
		this.scene = new Scene();

		/**
		 * The main camera.
		 *
		 * @type {PerspectiveCamera}
		 */
		this.camera = new PerspectiveCamera( fov, 1, near, far );
		this.camera.position.set( 0, 0, 5 );

		/**
		 * The renderer.
		 *
		 * @type {WebGLRenderer}
		 */
		this.renderer = createRenderer
			? createRenderer( config )
			: new WebGLRenderer( { antialias } );

		if ( container && this.renderer.domElement ) {

			container.appendChild( this.renderer.domElement );

		}

		this._updateCallbacks = [];

		this._resize = new ResizeManager( {
			container,
			camera: this.camera,
			renderer: this.renderer
		} );

		this._loop = new Loop( ( delta, elapsed ) => this._tick( delta, elapsed ) );

	}

	/**
	 * Registers a per-frame callback. Multiple callbacks run in registration
	 * order and each receives `(delta, elapsed)` in seconds.
	 *
	 * @param {Function} callback - The update callback.
	 * @return {Function} An unsubscribe function.
	 */
	onUpdate( callback ) {

		this._updateCallbacks.push( callback );

		return () => {

			const index = this._updateCallbacks.indexOf( callback );
			if ( index !== - 1 ) this._updateCallbacks.splice( index, 1 );

		};

	}

	_tick( delta, elapsed ) {

		for ( const callback of this._updateCallbacks ) {

			callback( delta, elapsed );

		}

		this.renderer.render( this.scene, this.camera );

	}

	/**
	 * Starts automatic resizing and the render loop.
	 *
	 * @return {SceneApp} A reference to this app.
	 */
	start() {

		this._resize.start();
		this._loop.start();

		return this;

	}

	/**
	 * Stops the render loop and resize observation, without disposing GPU
	 * resources.
	 *
	 * @return {SceneApp} A reference to this app.
	 */
	stop() {

		this._loop.stop();
		this._resize.stop();

		return this;

	}

	/**
	 * Stops everything and releases the renderer and its DOM element.
	 */
	dispose() {

		this.stop();

		this._updateCallbacks.length = 0;

		if ( this.renderer.domElement && this.renderer.domElement.parentNode ) {

			this.renderer.domElement.parentNode.removeChild( this.renderer.domElement );

		}

		if ( typeof this.renderer.dispose === 'function' ) this.renderer.dispose();

	}

}

export { SceneApp };
