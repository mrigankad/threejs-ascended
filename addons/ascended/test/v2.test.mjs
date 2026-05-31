import { test } from 'node:test';
import assert from 'node:assert/strict';

import { disposeObject } from '../dispose.js';
import { addOrbitControls } from '../controls.js';
import { loadGLTF } from '../loaders.js';

test( 'disposeObject disposes geometry, material and textures of a subtree', () => {

	const makeTexture = () => ( { isTexture: true, disposed: false, dispose() { this.disposed = true; } } );
	const makeMaterial = ( textures = {} ) => ( {
		disposed: false,
		dispose() { this.disposed = true; },
		...textures
	} );

	const tex = makeTexture();
	const childMat = makeMaterial( { map: tex } );

	const child = {
		geometry: { disposed: false, dispose() { this.disposed = true; } },
		material: childMat,
		children: []
	};

	const root = {
		geometry: { disposed: false, dispose() { this.disposed = true; } },
		material: [ makeMaterial(), makeMaterial() ],
		children: [ child ],
		traverse( cb ) { cb( this ); this.children.forEach( ( c ) => cb( c ) ); }
	};

	const count = disposeObject( root );

	assert.equal( root.geometry.disposed, true );
	assert.equal( root.material[ 0 ].disposed, true );
	assert.equal( root.material[ 1 ].disposed, true );
	assert.equal( child.geometry.disposed, true );
	assert.equal( childMat.disposed, true );
	assert.equal( tex.disposed, true, 'texture on material disposed' );

	// 2 geometries + 3 materials + 1 texture = 6 dispose calls
	assert.equal( count, 6 );

} );

test( 'disposeObject handles a single node without traverse', () => {

	const node = {
		geometry: { disposed: false, dispose() { this.disposed = true; } },
		material: { disposed: false, dispose() { this.disposed = true; } }
	};

	const count = disposeObject( node );
	assert.equal( count, 2 );
	assert.equal( node.geometry.disposed, true );
	assert.equal( node.material.disposed, true );

} );

test( 'controls and loaders expose async helper functions', () => {

	// These dynamically import examples/jsm at call time; here we only assert
	// the public shape so the module graph stays browser-only for the heavy deps.
	assert.equal( typeof addOrbitControls, 'function' );
	assert.equal( typeof loadGLTF, 'function' );
	assert.equal( addOrbitControls.constructor.name, 'AsyncFunction' );
	assert.equal( loadGLTF.constructor.name, 'AsyncFunction' );

} );
