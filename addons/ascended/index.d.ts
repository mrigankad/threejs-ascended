import type {
	Group,
	Object3D,
	PerspectiveCamera,
	Scene,
	Texture,
	WebGLRenderer
} from 'three';

/**
 * Per-frame callback receiving delta and total elapsed time in seconds.
 */
export type UpdateCallback = ( delta: number, elapsed: number ) => void;

export interface SceneAppConfig {
	container?: HTMLElement | null;
	fov?: number;
	near?: number;
	far?: number;
	antialias?: boolean;
	createRenderer?: ( config: SceneAppConfig ) => WebGLRenderer;
}

export class SceneApp {
	constructor( config?: SceneAppConfig );
	container: HTMLElement | null;
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	/** Present after `addOrbitControls`. */
	controls?: unknown;
	/** Present after `addStats`. */
	stats?: unknown;
	/** Registers a per-frame callback; returns an unsubscribe function. */
	onUpdate( callback: UpdateCallback ): () => void;
	start(): this;
	stop(): this;
	dispose(): void;
}

export interface LoopOptions {
	requestFrame?: ( cb: () => void ) => number;
	cancelFrame?: ( id: number ) => void;
	now?: () => number;
}

export class Loop {
	constructor( callback: UpdateCallback, options?: LoopOptions );
	readonly running: boolean;
	start(): this;
	stop(): this;
}

export interface ResizeManagerConfig {
	container: HTMLElement;
	camera: { aspect: number; updateProjectionMatrix(): void };
	renderer: { setSize( w: number, h: number, updateStyle?: boolean ): void; setPixelRatio( r: number ): void };
}

export interface ResizeManagerOptions {
	measure?: () => { width: number; height: number };
	maxPixelRatio?: number;
}

export class ResizeManager {
	constructor( config: ResizeManagerConfig, options?: ResizeManagerOptions );
	update(): this;
	start(): this;
	stop(): this;
}

export interface StudioLightingOptions {
	intensity?: number;
	skyColor?: number;
	groundColor?: number;
	keyColor?: number;
	keyPosition?: [ number, number, number ];
}

export function addStudioLighting( scene: Object3D, options?: StudioLightingOptions ): Group;

export interface OrbitControlsOptions {
	enableDamping?: boolean;
	dampingFactor?: number;
	target?: { x: number; y: number; z: number };
}

export function addOrbitControls( app: SceneApp, options?: OrbitControlsOptions ): Promise<any>;

export interface LoadGLTFOptions {
	dracoPath?: string;
	onProgress?: ( event: ProgressEvent ) => void;
}

export function loadGLTF( url: string, options?: LoadGLTFOptions ): Promise<any>;

export interface LoadTextureOptions {
	colorSpace?: string;
	onProgress?: ( event: ProgressEvent ) => void;
}

export function loadTexture( url: string, options?: LoadTextureOptions ): Promise<Texture>;

export interface SetEnvironmentOptions {
	background?: boolean;
	onProgress?: ( event: ProgressEvent ) => void;
}

export function setEnvironment( app: SceneApp, url: string, options?: SetEnvironmentOptions ): Promise<Texture>;

export interface ScreenshotOptions {
	mimeType?: string;
	quality?: number;
	download?: boolean;
	fileName?: string;
	doc?: Document;
}

export function screenshot( app: SceneApp, options?: ScreenshotOptions ): string;

export type MemoizedLoader<F extends ( key: string, ...rest: any[] ) => any> =
	( ( ...args: Parameters<F> ) => Promise<Awaited<ReturnType<F>>> ) & {
		clear(): void;
		cache: Map<string, Promise<Awaited<ReturnType<F>>>>;
	};

export function memoizeLoader<F extends ( key: string, ...rest: any[] ) => any>( loadFn: F ): MemoizedLoader<F>;

export interface AddStatsOptions {
	parent?: HTMLElement;
}

export function addStats( app: SceneApp, options?: AddStatsOptions ): Promise<any>;

export function disposeObject( object: Object3D ): number;

export interface PointerPickerOptions {
	raycaster?: unknown;
	eventType?: string;
}

export class PointerPicker {
	constructor( app: SceneApp, options?: PointerPickerOptions );
	on( object: Object3D, callback: ( intersection: any ) => void ): () => void;
	setPointerFromEvent( event: { clientX: number; clientY: number }, rect: { left: number; top: number; width: number; height: number } ): unknown;
	handleEvent( event: { clientX: number; clientY: number } ): void;
	start(): this;
	stop(): this;
}

export function addPicking( app: SceneApp, options?: PointerPickerOptions ): PointerPicker;

export interface LoadAudioOptions {
	positional?: boolean;
	loop?: boolean;
	volume?: number;
	autoplay?: boolean;
	refDistance?: number;
}

export function loadAudio( app: SceneApp, url: string, options?: LoadAudioOptions ): Promise<any>;
