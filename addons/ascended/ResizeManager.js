/**
 * Keeps a renderer and a perspective camera in sync with the size of a DOM
 * container. On every observed resize it updates the camera aspect ratio and
 * the renderer drawing buffer size, and re-applies the device pixel ratio.
 *
 * The measuring and observation hooks are injectable so the core sizing logic
 * can be unit-tested without a browser.
 */
class ResizeManager {

	/**
	 * @param {Object} config
	 * @param {HTMLElement} config.container - Element whose size the canvas tracks.
	 * @param {Object} config.camera - A camera exposing `aspect` and
	 * `updateProjectionMatrix()` (e.g. `PerspectiveCamera`).
	 * @param {Object} config.renderer - A renderer exposing `setSize()` and
	 * `setPixelRatio()` (e.g. `WebGLRenderer`).
	 * @param {Object} [options]
	 * @param {Function} [options.measure] - Returns `{ width, height }` for the
	 * container. Defaults to reading `clientWidth` / `clientHeight`.
	 * @param {number} [options.maxPixelRatio=2] - Clamp for `devicePixelRatio`.
	 */
	constructor( { container, camera, renderer }, { measure, maxPixelRatio = 2 } = {} ) {

		this.container = container;
		this.camera = camera;
		this.renderer = renderer;
		this.maxPixelRatio = maxPixelRatio;

		this._measure = measure || ( () => ( {
			width: container.clientWidth,
			height: container.clientHeight
		} ) );

		this._observer = null;
		this._onWindowResize = () => this.update();

	}

	/**
	 * Reads the current container size and applies it to the camera and
	 * renderer. Safe to call manually at any time.
	 *
	 * @return {ResizeManager} A reference to this manager.
	 */
	update() {

		const { width, height } = this._measure();

		// Guard against a zero-sized container (e.g. display:none) which would
		// produce a NaN aspect ratio.
		if ( width === 0 || height === 0 ) return this;

		const pixelRatio = Math.min(
			typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1,
			this.maxPixelRatio
		);

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setPixelRatio( pixelRatio );
		this.renderer.setSize( width, height, false );

		return this;

	}

	/**
	 * Starts observing the container for size changes. Uses `ResizeObserver`
	 * when available, otherwise falls back to the window `resize` event.
	 *
	 * @return {ResizeManager} A reference to this manager.
	 */
	start() {

		this.update();

		if ( typeof ResizeObserver !== 'undefined' ) {

			this._observer = new ResizeObserver( () => this.update() );
			this._observer.observe( this.container );

		} else if ( typeof window !== 'undefined' ) {

			window.addEventListener( 'resize', this._onWindowResize );

		}

		return this;

	}

	/**
	 * Stops observing the container.
	 *
	 * @return {ResizeManager} A reference to this manager.
	 */
	stop() {

		if ( this._observer ) {

			this._observer.disconnect();
			this._observer = null;

		} else if ( typeof window !== 'undefined' ) {

			window.removeEventListener( 'resize', this._onWindowResize );

		}

		return this;

	}

}

export { ResizeManager };
