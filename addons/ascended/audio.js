import {
	Audio,
	AudioListener,
	AudioLoader,
	PositionalAudio
} from '../../build/three.module.js';

/**
 * Loads an audio file and returns a ready-to-play three.js audio source,
 * handling the `AudioListener` setup that is easy to forget.
 *
 * A single `AudioListener` is lazily created and attached to the app camera
 * (reused across calls). Pass `positional: true` to get a `PositionalAudio`
 * source you can attach to a mesh for 3D spatial sound.
 *
 * @param {Object} app - A {@link SceneApp} (uses `camera`).
 * @param {string} url - URL of the audio file.
 * @param {Object} [options]
 * @param {boolean} [options.positional=false] - Create `PositionalAudio`.
 * @param {boolean} [options.loop=false] - Loop playback.
 * @param {number} [options.volume=1] - Initial volume.
 * @param {boolean} [options.autoplay=false] - Play once loaded (requires a
 * resumed `AudioContext`, i.e. after a user gesture).
 * @param {number} [options.refDistance=1] - Positional reference distance.
 * @return {Promise<Object>} Resolves with the `Audio` or `PositionalAudio` source.
 */
async function loadAudio( app, url, options = {} ) {

	const {
		positional = false,
		loop = false,
		volume = 1,
		autoplay = false,
		refDistance = 1
	} = options;

	if ( ! app._audioListener ) {

		app._audioListener = new AudioListener();
		app.camera.add( app._audioListener );

	}

	const listener = app._audioListener;
	const sound = positional ? new PositionalAudio( listener ) : new Audio( listener );

	const buffer = await new AudioLoader().loadAsync( url );

	sound.setBuffer( buffer );
	sound.setLoop( loop );
	sound.setVolume( volume );
	if ( positional && typeof sound.setRefDistance === 'function' ) sound.setRefDistance( refDistance );

	if ( autoplay ) sound.play();

	return sound;

}

export { loadAudio };
