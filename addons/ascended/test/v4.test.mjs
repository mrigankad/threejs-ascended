import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PointerPicker } from '../picking.js';
import { loadAudio } from '../audio.js';

function makeApp() {

	const listeners = {};
	return {
		camera: {},
		renderer: {
			domElement: {
				getBoundingClientRect: () => ( { left: 0, top: 0, width: 200, height: 100 } ),
				addEventListener: ( type, fn ) => { listeners[ type ] = fn; },
				removeEventListener: ( type ) => { delete listeners[ type ]; }
			}
		},
		_listeners: listeners
	};

}

test( 'PointerPicker computes centered NDC from a pointer event', () => {

	const app = makeApp();
	const picker = new PointerPicker( app, { raycaster: { setFromCamera() {}, intersectObjects: () => [] } } );

	const rect = { left: 0, top: 0, width: 200, height: 100 };
	picker.setPointerFromEvent( { clientX: 100, clientY: 50 }, rect ); // center
	assert.ok( Math.abs( picker.pointer.x - 0 ) < 1e-9 );
	assert.ok( Math.abs( picker.pointer.y - 0 ) < 1e-9 );

	picker.setPointerFromEvent( { clientX: 200, clientY: 0 }, rect ); // top-right
	assert.equal( picker.pointer.x, 1 );
	assert.equal( picker.pointer.y, 1 );

} );

test( 'PointerPicker dispatches to the registered object and its ancestors', () => {

	const app = makeApp();

	const parent = { parent: null };
	const child = { parent };

	// Raycaster returns a hit on the CHILD; the callback is on the PARENT.
	const fakeRaycaster = {
		setFromCamera() {},
		intersectObjects: () => [ { object: child, distance: 1 } ]
	};

	const picker = new PointerPicker( app, { raycaster: fakeRaycaster } );

	let got = null;
	picker.on( parent, ( hit ) => { got = hit; } );

	picker.handleEvent( { clientX: 10, clientY: 10 } );
	assert.ok( got, 'parent callback fired from a child hit' );
	assert.equal( got.distance, 1 );

} );

test( 'PointerPicker on() returns a working unsubscribe', () => {

	const app = makeApp();
	const target = { parent: null };
	const fakeRaycaster = { setFromCamera() {}, intersectObjects: () => [ { object: target } ] };
	const picker = new PointerPicker( app, { raycaster: fakeRaycaster } );

	let calls = 0;
	const off = picker.on( target, () => { calls ++; } );

	picker.handleEvent( {} );
	off();
	picker.handleEvent( {} );

	assert.equal( calls, 1, 'callback not invoked after unsubscribe' );

} );

test( 'PointerPicker start/stop wires the DOM listener', () => {

	const app = makeApp();
	const picker = new PointerPicker( app, { raycaster: { setFromCamera() {}, intersectObjects: () => [] } } );

	picker.start();
	assert.equal( typeof app._listeners.click, 'function' );

	picker.stop();
	assert.equal( app._listeners.click, undefined );

} );

test( 'loadAudio is an async helper function', () => {

	assert.equal( typeof loadAudio, 'function' );
	assert.equal( loadAudio.constructor.name, 'AsyncFunction' );

} );
