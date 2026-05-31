/**
 * Wraps an async loader function with a promise cache keyed by the first
 * argument (typically a URL). Repeated requests for the same key share a single
 * in-flight or resolved promise, so an asset is only fetched/decoded once.
 *
 * three.js loaders do not deduplicate concurrent requests for the same URL;
 * this is a lightweight, loader-agnostic way to add that.
 *
 * ```js
 * import { memoizeLoader, loadGLTF } from 'threejs-ascended/addons/ascended';
 *
 * const loadModel = memoizeLoader( loadGLTF );
 * const [ a, b ] = await Promise.all( [ loadModel( url ), loadModel( url ) ] ); // one fetch
 * ```
 *
 * Rejected promises are evicted so a failed load can be retried.
 *
 * @param {Function} loadFn - An async (or promise-returning) loader. Its first
 * argument is used as the cache key.
 * @return {Function} A memoized loader with `.clear()` and a `.cache` Map.
 */
function memoizeLoader( loadFn ) {

	const cache = new Map();

	const memoized = ( key, ...rest ) => {

		if ( cache.has( key ) ) return cache.get( key );

		const promise = Promise.resolve().then( () => loadFn( key, ...rest ) );

		// Evict on failure so the next call can retry.
		promise.catch( () => {

			if ( cache.get( key ) === promise ) cache.delete( key );

		} );

		cache.set( key, promise );

		return promise;

	};

	/**
	 * Clears all cached entries.
	 */
	memoized.clear = () => cache.clear();

	memoized.cache = cache;

	return memoized;

}

export { memoizeLoader };
