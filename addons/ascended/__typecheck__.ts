// Compile-only smoke test for the Ascended type declarations. Never executed —
// `tsc --noEmit` against this file verifies the public API types are sound.

import {
	SceneApp,
	addStudioLighting,
	addOrbitControls,
	loadGLTF,
	loadTexture,
	setEnvironment,
	screenshot,
	memoizeLoader,
	addStats,
	disposeObject,
	addPicking,
	loadAudio,
	Loop,
	ResizeManager
} from './index.js';

import { Mesh } from 'three';

async function check(): Promise<void> {

	const app = new SceneApp( { fov: 60, antialias: true } );

	const unsubscribe = app.onUpdate( ( delta: number, elapsed: number ): void => {

		app.camera.rotation.y += delta * 0.001 * elapsed;

	} );
	unsubscribe();

	addStudioLighting( app.scene, { intensity: 1.2 } );
	await addOrbitControls( app, { enableDamping: true } );
	await addStats( app );
	await setEnvironment( app, 'env.hdr', { background: true } );

	const gltf = await loadGLTF( 'model.glb', { dracoPath: '/draco/' } );
	app.scene.add( gltf.scene );

	const texture = await loadTexture( 'color.png' );
	void texture;

	await loadAudio( app, 'sfx.mp3', { positional: true, volume: 0.5 } );

	const mesh = new Mesh();
	app.scene.add( mesh );

	const picker = addPicking( app );
	picker.on( mesh, ( hit ) => void hit );

	const url: string = screenshot( app, { download: true } );
	void url;

	const cachedLoad = memoizeLoader( loadGLTF );
	await cachedLoad( 'model.glb' );
	cachedLoad.clear();

	const count: number = disposeObject( app.scene );
	void count;

	void Loop;
	void ResizeManager;

}

void check;
