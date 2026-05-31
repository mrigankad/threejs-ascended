import { test } from 'node:test';
import assert from 'node:assert/strict';

import { screenshot } from '../screenshot.js';
import { memoizeLoader } from '../cache.js';
import { loadTexture } from '../texture.js';
import { addStats } from '../stats.js';

test( 'screenshot renders, returns a data URL, and can trigger a download', () => {

	let renders = 0;
	const app = {
		renderer: { domElement: { toDataURL: ( type ) => `data:${type};base64,AAAA` }, render() {} },
		scene: {},
		camera: {}
	};
	app.renderer.render = () => { renders ++; };

	// basic capture
	const url = screenshot( app );
	assert.equal( renders, 1, 'renders before capture' );
	assert.ok( url.startsWith( 'data:image/png' ) );

	// download path with an injected document
	let clicked = null;
	const fakeDoc = {
		createElement: () => {
			const el = {};
			el.click = () => { clicked = { href: el.href, download: el.download }; };
			return el;
		}
	};

	const jpg = screenshot( app, { mimeType: 'image/jpeg', download: true, fileName: 'shot.jpg', doc: fakeDoc } );
	assert.ok( jpg.startsWith( 'data:image/jpeg' ) );
	assert.equal( clicked.download, 'shot.jpg' );
	assert.equal( clicked.href, jpg );

} );

test( 'memoizeLoader deduplicates by key and evicts on failure', async () => {

	let calls = 0;
	const loader = memoizeLoader( async ( key ) => { calls ++; return `loaded:${key}`; } );

	const [ a, b ] = await Promise.all( [ loader( 'x' ), loader( 'x' ) ] );
	assert.equal( a, 'loaded:x' );
	assert.equal( b, 'loaded:x' );
	assert.equal( calls, 1, 'same key loads once' );

	await loader( 'y' );
	assert.equal( calls, 2, 'different key loads again' );

	loader.clear();
	await loader( 'x' );
	assert.equal( calls, 3, 'cleared cache reloads' );

	// failure should evict so a retry re-runs the loader
	let failCalls = 0;
	const flaky = memoizeLoader( async () => { failCalls ++; throw new Error( 'boom' ); } );
	await assert.rejects( flaky( 'z' ) );
	await assert.rejects( flaky( 'z' ) );
	assert.equal( failCalls, 2, 'rejected entry is evicted and retried' );

} );

test( 'texture and stats expose async helper functions', () => {

	assert.equal( typeof loadTexture, 'function' );
	assert.equal( typeof addStats, 'function' );
	assert.equal( loadTexture.constructor.name, 'AsyncFunction' );
	assert.equal( addStats.constructor.name, 'AsyncFunction' );

} );
