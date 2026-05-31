/**
 * A small `requestAnimationFrame` loop wrapper that provides delta time
 * (seconds since the previous frame) and start/stop control.
 *
 * The actual scheduler is injectable so the loop can be unit-tested without a
 * browser. In a browser it defaults to `requestAnimationFrame` /
 * `cancelAnimationFrame`.
 */
class Loop {

	/**
	 * @param {Function} callback - Called every frame with the delta time in
	 * seconds and the total elapsed time in seconds: `(delta, elapsed) => {}`.
	 * @param {Object} [options]
	 * @param {Function} [options.requestFrame] - Scheduler, defaults to
	 * `requestAnimationFrame`.
	 * @param {Function} [options.cancelFrame] - Canceller, defaults to
	 * `cancelAnimationFrame`.
	 * @param {Function} [options.now] - Returns the current time in
	 * milliseconds, defaults to `performance.now`.
	 */
	constructor( callback, { requestFrame, cancelFrame, now } = {} ) {

		this.callback = callback;

		this._request = requestFrame || ( ( cb ) => requestAnimationFrame( cb ) );
		this._cancel = cancelFrame || ( ( id ) => cancelAnimationFrame( id ) );
		this._now = now || ( () => performance.now() );

		this._running = false;
		this._frameId = null;
		this._lastTime = 0;
		this._elapsed = 0;

	}

	/**
	 * Whether the loop is currently running.
	 *
	 * @type {boolean}
	 * @readonly
	 */
	get running() {

		return this._running;

	}

	/**
	 * Starts the loop. Calling start while already running is a no-op.
	 *
	 * @return {Loop} A reference to this loop.
	 */
	start() {

		if ( this._running ) return this;

		this._running = true;
		this._lastTime = this._now();

		const tick = () => {

			if ( ! this._running ) return;

			const time = this._now();
			const delta = ( time - this._lastTime ) / 1000;
			this._lastTime = time;
			this._elapsed += delta;

			if ( this.callback ) this.callback( delta, this._elapsed );

			this._frameId = this._request( tick );

		};

		this._frameId = this._request( tick );

		return this;

	}

	/**
	 * Stops the loop.
	 *
	 * @return {Loop} A reference to this loop.
	 */
	stop() {

		this._running = false;

		if ( this._frameId !== null ) {

			this._cancel( this._frameId );
			this._frameId = null;

		}

		return this;

	}

}

export { Loop };
