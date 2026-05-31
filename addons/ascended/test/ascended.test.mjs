import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Loop } from '../Loop.js';
import { ResizeManager } from '../ResizeManager.js';
import { SceneApp } from '../SceneApp.js';
import { addStudioLighting } from '../lighting.js';

test( 'Loop reports delta time and respects start/stop', () => {

	let scheduled = null;
	let cancelled = false;
	let clock = 0;

	const loop = new Loop( ( delta ) => { loop._lastDelta = delta; }, {
		requestFrame: ( cb ) => { scheduled = cb; return 42; },
		cancelFrame: () => { cancelled = true; },
		now: () => clock
	} );

	assert.equal( loop.running, false );

	loop.start();
	assert.equal( loop.running, true );
	assert.equal( typeof scheduled, 'function' );

	// advance the clock by 16ms and run one frame
	clock = 16;
	scheduled();
	assert.ok( Math.abs( loop._lastDelta - 0.016 ) < 1e-9, 'delta is seconds' );

	loop.stop();
	assert.equal( loop.running, false );
	assert.equal( cancelled, true );

	// starting twice is a no-op (scheduler not called again synchronously)
	loop.start();
	const before = scheduled;
	loop.start();
	assert.equal( scheduled, before );

} );

test( 'ResizeManager updates camera aspect and renderer size', () => {

	let projectionUpdates = 0;
	let lastSize = null;
	let lastPixelRatio = null;

	const camera = { aspect: 1, updateProjectionMatrix() { projectionUpdates ++; } };
	const renderer = {
		setSize( w, h, updateStyle ) { lastSize = { w, h, updateStyle }; },
		setPixelRatio( r ) { lastPixelRatio = r; }
	};

	let size = { width: 800, height: 400 };
	const rm = new ResizeManager(
		{ container: {}, camera, renderer },
		{ measure: () => size, maxPixelRatio: 2 }
	);

	rm.update();
	assert.equal( camera.aspect, 2 );
	assert.equal( projectionUpdates, 1 );
	assert.deepEqual( lastSize, { w: 800, h: 400, updateStyle: false } );
	assert.ok( lastPixelRatio <= 2 );

	// zero-sized container must not produce a NaN aspect
	size = { width: 0, height: 0 };
	rm.update();
	assert.equal( camera.aspect, 2, 'aspect unchanged on zero size' );

} );

test( 'SceneApp wires updates to render and disposes cleanly', () => {

	let renders = 0;
	let disposed = false;

	const fakeRenderer = {
		domElement: null,
		render() { renders ++; },
		setSize() {},
		setPixelRatio() {},
		dispose() { disposed = true; }
	};

	const app = new SceneApp( {
		container: null,
		createRenderer: () => fakeRenderer
	} );

	let updates = 0;
	const off = app.onUpdate( ( delta ) => { updates ++; assert.equal( typeof delta, 'number' ); } );

	app._tick( 0.016, 0.016 );
	assert.equal( updates, 1 );
	assert.equal( renders, 1 );

	off();
	app._tick( 0.016, 0.032 );
	assert.equal( updates, 1, 'unsubscribed callback does not run' );
	assert.equal( renders, 2, 'render still happens' );

	app.dispose();
	assert.equal( disposed, true );

} );

test( 'addStudioLighting adds a removable light group to the scene', () => {

	const scene = new SceneApp( { container: null, createRenderer: () => ( { domElement: null, render() {}, setSize() {}, setPixelRatio() {} } ) } ).scene;

	const group = addStudioLighting( scene, { intensity: 1 } );

	assert.equal( group.name, 'AscendedStudioLighting' );
	assert.ok( group.children.length >= 3, 'has multiple lights' );
	assert.ok( scene.children.includes( group ), 'group added to scene' );

	scene.remove( group );
	assert.equal( scene.children.includes( group ), false );

} );
