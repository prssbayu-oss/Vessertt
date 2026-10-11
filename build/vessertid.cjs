/**
 * VessertID — The Social Media Engine & Creative Asset Architecture
 * Version: 2026.1.0
 * (c) 2026 VessertID Creative Studio
 * All rights reserved.
 */

// [animation/AnimationClip.js]
class AnimationClip {
	constructor( name = '', duration = - 1, tracks = [] ) {
		this.name = name;
		this.tracks = tracks;
		this.duration = duration;
		if ( this.duration < 0 ) {
			this.resetDuration();
		}
	}

	resetDuration() {
		const tracks = this.tracks;
		let maxDuration = 0;
		for ( let i = 0; i < tracks.length; i ++ ) {
			const track = tracks[ i ];
			const trackDuration = track.times[ track.times.length - 1 ];
			if ( trackDuration > maxDuration ) maxDuration = trackDuration;
		}
		this.duration = maxDuration;
		return this;
	}
}



// [animation/AnimationMixer.js]

class AnimationMixer extends EventDispatcher {
	constructor( root ) {
		super();
		this.root = root;
		this.time = 0;
		this.actions = [];
	}

	update( deltaTime ) {
		this.time += deltaTime;
		for ( let i = 0; i < this.actions.length; i ++ ) {
			this.actions[ i ].update( deltaTime );
		}
		return this;
	}

	clipAction( clip ) {
		// Registers clip to root
		return clip;
	}
}



// [animation/KeyframeTrack.js]

class KeyframeTrack {
	constructor( name, times, values, interpolation ) {
		this.name = name;
		this.times = times;
		this.values = values;
		this.InterpolantFactoryMethod = LinearInterpolant;
	}

	getInterpolant() {
		return new this.InterpolantFactoryMethod( this.times, this.values, this.getValueSize() );
	}

	getValueSize() {
		return this.values.length / this.times.length;
	}
}



// [animation/tracks/NumberKeyframeTrack.js]

class NumberKeyframeTrack extends KeyframeTrack {
	constructor( name, times, values ) {
		super( name, times, values );
		this.ValueTypeName = 'number';
	}
}



// [animation/tracks/VectorKeyframeTrack.js]

class VectorKeyframeTrack extends KeyframeTrack {
	constructor( name, times, values ) {
		super( name, times, values );
		this.ValueTypeName = 'vector';
	}
}



// [audio/AudioContext.js]
let _context = null;

const AudioContext = {
	getContext() {
		if ( _context === null && typeof window !== 'undefined' ) {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if ( AudioCtx ) {
				_context = new AudioCtx();
			}
		}
		return _context;
	},

	setContext( value ) {
		_context = value;
	}
};



// [audio/AudioEngine.js]
/**
 * AudioEngine manages retention sounds, backsound tracks, and SFX chimes.
 */
class AudioEngine {

	constructor() {

		this.context = null;
		this.masterGain = null;
		this.buffers = new Map();

	}

	init() {

		if ( ! this.context && typeof window !== 'undefined' ) {

			const AudioCtx = window.AudioContext || window.webkitAudioContext;

			if ( AudioCtx ) {

				this.context = new AudioCtx();
				this.masterGain = this.context.createGain();
				this.masterGain.connect( this.context.destination );

			}

		}

	}

	setMasterVolume( volume ) {

		if ( this.masterGain && this.context ) {

			this.masterGain.gain.setValueAtTime( Math.max( 0, Math.min( 1, volume ) ), this.context.currentTime );

		}

		return this;

	}

	async loadSound( name, url ) {

		this.init();

		if ( this.buffers.has( name ) ) {

			return this.buffers.get( name );

		}

		const response = await fetch( url );
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.context.decodeAudioData( arrayBuffer );

		this.buffers.set( name, audioBuffer );
		return audioBuffer;

	}

	play( name, options = {} ) {

		this.init();

		const buffer = this.buffers.get( name );

		if ( ! buffer ) {

			console.warn( `AudioEngine: Buffer '${name}' not loaded` );
			return null;

		}

		const source = this.context.createBufferSource();
		const gain = this.context.createGain();

		source.buffer = buffer;
		source.loop = options.loop || false;

		const vol = options.volume !== undefined ? options.volume : 1.0;
		gain.gain.setValueAtTime( vol, this.context.currentTime );

		source.connect( gain );
		gain.connect( this.masterGain );

		source.start( 0 );
		return source;

	}

}



// [audio/AudioListener.js]

class AudioListener {
	constructor() {
		this.context = AudioContext.getContext();
		if ( this.context ) {
			this.gain = this.context.createGain();
			this.gain.connect( this.context.destination );
		}
	}

	getInput() {
		return this.gain;
	}

	setMasterVolume( value ) {
		if ( this.gain ) {
			this.gain.gain.setTargetAtTime( value, this.context.currentTime, 0.01 );
		}
		return this;
	}

	getMasterVolume() {
		return this.gain ? this.gain.gain.value : 0;
	}
}



// [audio/AudioSource.js]

class AudioSource {
	constructor( listener ) {
		this.listener = listener;
		this.context = listener.context;
		this.gainNode = this.context ? this.context.createGain() : null;
		if ( this.gainNode ) {
			this.gainNode.connect( listener.getInput() );
		}
		this.buffer = null;
		this.source = null;
		this.isPlaying = false;
		this.loop = false;
	}

	setBuffer( audioBuffer ) {
		this.buffer = audioBuffer;
		return this;
	}

	play( delay = 0 ) {
		if ( ! this.context || ! this.buffer ) return this;
		this.source = this.context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.loop = this.loop;
		this.source.connect( this.gainNode );
		this.source.start( this.context.currentTime + delay );
		this.isPlaying = true;
		return this;
	}

	stop() {
		if ( this.source ) {
			this.source.stop();
			this.isPlaying = false;
		}
		return this;
	}

	setVolume( volume ) {
		if ( this.gainNode ) {
			this.gainNode.gain.setValueAtTime( volume, this.context.currentTime );
		}
		return this;
	}
}



// [audio/DopamineTrigger.js]
class DopamineTrigger {
	constructor( audioEngine ) {
		this.audioEngine = audioEngine;
		this.cues = new Map();
	}

	registerCue( name, audioBuffer ) {
		this.cues.set( name, audioBuffer );
	}

	trigger( name, options = {} ) {
		const buf = this.cues.get( name );
		if ( buf && this.audioEngine ) {
			this.audioEngine.playBuffer( buf, options );
		}
	}
}



// [constants.js]
const REVISION = '2026.1';

/**
 * Platform aspect ratio presets for Social Media Canvas.
 * @constant
 * @type {Object}
 */
const AspectRatios = {
	REELS_TIKTOK_9_16: { width: 1080, height: 1920, ratio: '9:16', name: 'Vertical Reel/Shorts/TikTok' },
	CAROUSEL_FEED_4_5: { width: 1080, height: 1350, ratio: '4:5',  name: 'Instagram Portrait Carousel' },
	SQUARE_FEED_1_1:   { width: 1080, height: 1080, ratio: '1:1',  name: 'Square Feed' },
	YOUTUBE_16_9:      { width: 1920, height: 1080, ratio: '16:9', name: 'YouTube Landscape' },
	THUMBNAIL_16_9:    { width: 1280, height: 720,  ratio: '16:9', name: 'YouTube Thumbnail' },
	HEADER_X_3_1:      { width: 1500, height: 500,  ratio: '3:1',  name: 'X / Twitter Header' },
	BANNER_LINKEDIN:   { width: 1584, height: 396,  ratio: '4:1',  name: 'LinkedIn Banner' }
};

/**
 * Standard Safe Zones for UI overlays on social media platforms.
 * @constant
 * @type {Object}
 */
const SafeZones = {
	VERTICAL_9_16: {
		top: 150,     // Platform search / back icon safe area
		bottom: 220,  // Audio ticker / caption safe area
		right: 120,   // Action column (like, comment, share)
		left: 40
	},
	PORTRAIT_4_5: {
		top: 40,
		bottom: 40,
		right: 40,
		left: 40
	}
};

/**
 * Layer classification types.
 * @constant
 * @type {Object}
 */
const LayerTypes = {
	BACKGROUND: 'background',
	MEDIA: 'media',
	OVERLAY: 'overlay',
	TYPOGRAPHY: 'typography',
	AUDIO: 'audio',
	BRAND: 'brand',
	MOTION: 'motion'
};


// [core/Clock.js]
class Clock {
	constructor( autoStart = true ) {
		this.autoStart = autoStart;
		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;
		this.running = false;
	}

	start() {
		this.startTime = performance.now();
		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;
	}

	stop() {
		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;
	}

	getElapsedTime() {
		this.getDelta();
		return this.elapsedTime;
	}

	getDelta() {
		let diff = 0;
		if ( this.autoStart && ! this.running ) this.start();
		if ( this.running ) {
			const newTime = performance.now();
			diff = ( newTime - this.oldTime ) / 1000;
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}
		return diff;
	}
}



// [core/Composition.js]

class Composition extends Object2D {
	constructor( width = 1080, height = 1920, duration = 15.0 ) {
		super();
		this.isComposition = true;
		this.viewport = new Viewport( width, height );
		this.duration = duration;
		this.currentTime = 0;
	}

	setTime( time ) {
		this.currentTime = Math.max( 0, Math.min( this.duration, time ) );
		this.dispatchEvent( { type: 'timeupdate', time: this.currentTime } );
	}
}



// [core/EventDispatcher.js]
class EventDispatcher {
	addEventListener( type, listener ) {
		if ( this._listeners === undefined ) this._listeners = {};
		const listeners = this._listeners;
		if ( listeners[ type ] === undefined ) listeners[ type ] = [];
		if ( listeners[ type ].indexOf( listener ) === - 1 ) listeners[ type ].push( listener );
	}

	hasEventListener( type, listener ) {
		if ( this._listeners === undefined ) return false;
		const listeners = this._listeners;
		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
	}

	removeEventListener( type, listener ) {
		if ( this._listeners === undefined ) return;
		const listeners = this._listeners;
		const listenerArray = listeners[ type ];
		if ( listenerArray !== undefined ) {
			const index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) listenerArray.splice( index, 1 );
		}
	}

	dispatchEvent( event ) {
		if ( this._listeners === undefined ) return;
		const listeners = this._listeners;
		const listenerArray = listeners[ event.type ];
		if ( listenerArray !== undefined ) {
			event.target = this;
			const array = listenerArray.slice( 0 );
			for ( let i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, event );
			}
			event.target = null;
		}
	}
}



// [core/Layer.js]

/**
 * Base Layer class representing an element on the Social Canvas.
 */
class Layer {

	constructor( options = {} ) {

		this.id = options.id || 'layer_' + Math.random().toString( 36 ).substr( 2, 9 );
		this.name = options.name || 'Unnamed Layer';
		this.type = options.type || LayerTypes.MEDIA;
		this.visible = options.visible !== false;
		this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
		this.zIndex = options.zIndex || 0;
		this.blendMode = options.blendMode || 'source-over';

		this.position = { x: options.x || 0, y: options.y || 0 };
		this.scale = { x: options.scaleX || 1, y: options.scaleY || 1 };
		this.rotation = options.rotation || 0;

	}

	setOpacity( opacity ) {

		this.opacity = Math.max( 0, Math.min( 1, opacity ) );
		return this;

	}

	setPosition( x, y ) {

		this.position.x = x;
		this.position.y = y;
		return this;

	}

	setScale( x, y ) {

		this.scale.x = x;
		this.scale.y = y !== undefined ? y : x;
		return this;

	}

	setRotation( angleDegrees ) {

		this.rotation = angleDegrees;
		return this;

	}

	setVisible( visible ) {

		this.visible = visible;
		return this;

	}

}



// [core/MediaLayer.js]

/**
 * MediaLayer handles raster and vector graphic assets.
 */
class MediaLayer extends Layer {

	constructor( src = '', options = {} ) {

		super( { ...options, type: LayerTypes.MEDIA } );

		this.src = src;
		this.image = null;
		this.isLoaded = false;
		this.fit = options.fit || 'cover';

	}

	async load() {

		if ( typeof window === 'undefined' ) return this;

		return new Promise( ( resolve, reject ) => {

			const img = new Image();
			img.crossOrigin = 'anonymous';

			img.onload = () => {

				this.image = img;
				this.isLoaded = true;
				resolve( this );

			};

			img.onerror = ( err ) => {

				reject( new Error( `Failed to load asset image: ${this.src}` ) );

			};

			img.src = this.src;

		} );

	}

}



// [core/Node.js]

class Node extends EventDispatcher {
	constructor() {
		super();
		this.isNode = true;
		this.id = MathUtils.generateUUID();
		this.name = '';
		this.parent = null;
		this.children = [];
	}

	add( object ) {
		if ( object === this ) return this;
		if ( object && object.isNode ) {
			if ( object.parent !== null ) object.parent.remove( object );
			object.parent = this;
			this.children.push( object );
			object.dispatchEvent( { type: 'added' } );
		}
		return this;
	}

	remove( object ) {
		const index = this.children.indexOf( object );
		if ( index !== - 1 ) {
			object.parent = null;
			this.children.splice( index, 1 );
			object.dispatchEvent( { type: 'removed' } );
		}
		return this;
	}

	traverse( callback ) {
		callback( this );
		const children = this.children;
		for ( let i = 0, l = children.length; i < l; i ++ ) {
			children[ i ].traverse( callback );
		}
	}
}



// [core/Object2D.js]

class Object2D extends Node {
	constructor() {
		super();
		this.isObject2D = true;
		this.position = new Vector2();
		this.scale = new Vector2( 1, 1 );
		this.rotation = 0;
		this.matrix = new Matrix3();
		this.matrixWorld = new Matrix3();
		this.visible = true;
		this.zIndex = 0;
		this.opacity = 1.0;
		this.blendMode = 'source-over';
	}

	updateMatrix() {
		const c = Math.cos( this.rotation );
		const s = Math.sin( this.rotation );
		this.matrix.set(
			c * this.scale.x, - s * this.scale.y, this.position.x,
			s * this.scale.x,   c * this.scale.y, this.position.y,
			0,                  0,                1
		);
	}

	updateWorldMatrix() {
		this.updateMatrix();
		if ( this.parent && this.parent.isObject2D ) {
			this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );
		} else {
			this.matrixWorld.copy( this.matrix );
		}
		for ( let i = 0; i < this.children.length; i ++ ) {
			if ( this.children[ i ].isObject2D ) this.children[ i ].updateWorldMatrix();
		}
	}
}



// [core/SafeZone.js]

class SafeZone {
	constructor( width = 1080, height = 1920, margins = { top: 150, bottom: 220, left: 40, right: 120 } ) {
		this.width = width;
		this.height = height;
		this.margins = margins;
		this.bounds = new Box2(
			new Vector2( margins.left, margins.top ),
			new Vector2( width - margins.right, height - margins.bottom )
		);
	}

	isSafe( x, y ) {
		return this.bounds.containsPoint( new Vector2( x, y ) );
	}
}



// [core/SocialCanvas.js]

/**
 * SocialCanvas acts as the primary composition viewport and renderer.
 */
class SocialCanvas {

	constructor( options = {} ) {

		this.preset = options.preset || AspectRatios.REELS_TIKTOK_9_16;
		this.width = options.width || this.preset.width;
		this.height = options.height || this.preset.height;
		this.duration = options.duration || 15.0; // In seconds for motion/reels

		this.layers = [];

		if ( typeof document !== 'undefined' ) {

			this.domElement = document.createElement( 'canvas' );
			this.domElement.width = this.width;
			this.domElement.height = this.height;
			this.ctx = this.domElement.getContext( '2d' );

		} else {

			this.domElement = null;
			this.ctx = null;

		}

	}

	setPreset( preset ) {

		this.preset = preset;
		this.width = preset.width;
		this.height = preset.height;

		if ( this.domElement ) {

			this.domElement.width = this.width;
			this.domElement.height = this.height;

		}

		return this;

	}

	add( layer ) {

		if ( this.layers.indexOf( layer ) === - 1 ) {

			this.layers.push( layer );
			this.layers.sort( ( a, b ) => a.zIndex - b.zIndex );

		}

		return this;

	}

	remove( layer ) {

		const index = this.layers.indexOf( layer );

		if ( index !== - 1 ) {

			this.layers.splice( index, 1 );

		}

		return this;

	}

	render() {

		if ( ! this.ctx ) return;

		this.ctx.clearRect( 0, 0, this.width, this.height );

		for ( let i = 0; i < this.layers.length; i ++ ) {

			const layer = this.layers[ i ];

			if ( ! layer.visible ) continue;

			this.ctx.save();
			this.ctx.globalAlpha = layer.opacity;
			this.ctx.globalCompositeOperation = layer.blendMode;

			this.ctx.translate( layer.position.x, layer.position.y );

			if ( layer.rotation !== 0 ) {

				this.ctx.rotate( ( layer.rotation * Math.PI ) / 180 );

			}

			this.ctx.scale( layer.scale.x, layer.scale.y );

			// Render Media Layer
			if ( layer.image && layer.isLoaded ) {

				this.ctx.drawImage( layer.image, 0, 0, this.width, this.height );

			}

			// Render Typography Layer
			if ( layer.text ) {

				this.ctx.font = `${layer.fontWeight} ${layer.fontSize}px '${layer.fontFamily}', sans-serif`;
				this.ctx.textAlign = layer.align;
				this.ctx.textBaseline = 'middle';

				if ( layer.strokeWidth > 0 && layer.strokeColor ) {

					this.ctx.strokeStyle = layer.strokeColor;
					this.ctx.lineWidth = layer.strokeWidth;
					this.ctx.strokeText( layer.text, this.width / 2, this.height / 2 );

				}

				this.ctx.fillStyle = layer.color;
				this.ctx.fillText( layer.text, this.width / 2, this.height / 2 );

			}

			this.ctx.restore();

		}

	}

	toDataURL( format = 'image/png', quality = 0.95 ) {

		this.render();
		return this.domElement ? this.domElement.toDataURL( format, quality ) : '';

	}

}



// [core/TextLayer.js]

/**
 * TextLayer represents typography elements, hooks, and subtitles.
 */
class TextLayer extends Layer {

	constructor( text = '', options = {} ) {

		super( { ...options, type: LayerTypes.TYPOGRAPHY } );

		this.text = text;
		this.fontFamily = options.fontFamily || 'Inter';
		this.fontSize = options.fontSize || 54;
		this.fontWeight = options.fontWeight || 'bold';
		this.color = options.color || '#FFFFFF';
		this.align = options.align || 'center';
		this.lineHeight = options.lineHeight || 1.2;
		this.letterSpacing = options.letterSpacing || 0;
		this.strokeColor = options.strokeColor || null;
		this.strokeWidth = options.strokeWidth || 0;

	}

	setText( text ) {

		this.text = text;
		return this;

	}

	setFont( fontFamily, fontSize = this.fontSize, fontWeight = this.fontWeight ) {

		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.fontWeight = fontWeight;
		return this;

	}

	setColor( color ) {

		this.color = color;
		return this;

	}

}



// [core/Viewport.js]
class Viewport {
	constructor( width = 1080, height = 1920 ) {
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
	}

	setSize( width, height ) {
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		return this;
	}
}



// [filters/ColorGrading.js]

class ColorGrading extends Filter {
	constructor( exposure = 1.0, contrast = 1.0, saturation = 1.0 ) {
		super( 'ColorGrading' );
		this.exposure = exposure;
		this.contrast = contrast;
		this.saturation = saturation;
	}

	apply( ctx, width, height ) {
		if ( ! this.enabled ) return;
		ctx.filter = `brightness(${this.exposure}) contrast(${this.contrast}) saturate(${this.saturation})`;
	}
}



// [filters/Filter.js]
class Filter {
	constructor( name = 'Filter' ) {
		this.name = name;
		this.enabled = true;
	}

	apply( ctx, width, height ) {
		// Subclass implementation
	}
}



// [loaders/AssetLoader.js]
/**
 * AssetLoader fetches JSON metadata, color palettes, and manifests.
 */
class AssetLoader {

	constructor() {

		this.cache = new Map();

	}

	async loadJSON( url ) {

		if ( this.cache.has( url ) ) {

			return this.cache.get( url );

		}

		const response = await fetch( url );

		if ( ! response.ok ) {

			throw new Error( `AssetLoader: HTTP ${response.status} loading ${url}` );

		}

		const data = await response.json();
		this.cache.set( url, data );
		return data;

	}

	async loadText( url ) {

		const response = await fetch( url );
		return await response.text();

	}

}



// [loaders/CubeLUTLoader.js]

class CubeLUTLoader extends Loader {
	async load( url ) {
		const resp = await fetch( this.path + url );
		const text = await resp.text();
		return this.parse( text );
	}

	parse( text ) {
		const lines = text.split( '\n' );
		let size = 0;
		const data = [];
		for ( let line of lines ) {
			line = line.trim();
			if ( line.startsWith( 'LUT_3D_SIZE' ) ) {
				size = parseInt( line.split( /\s+/ )[ 1 ], 10 );
			} else if ( line && ! line.startsWith( '#' ) && ! line.startsWith( 'TITLE' ) ) {
				const parts = line.split( /\s+/ ).map( Number );
				if ( parts.length === 3 ) {
					data.push( ...parts, 1.0 );
				}
			}
		}
		return { size, data: new Float32Array( data ) };
	}
}



// [loaders/FileLoader.js]

class FileLoader extends Loader {
	async load( url ) {
		const fullUrl = this.path + url;
		const resp = await fetch( fullUrl );
		if ( ! resp.ok ) throw new Error( `FileLoader: ${resp.status} ${resp.statusText}` );
		return await resp.text();
	}
}



// [loaders/FontLoader.js]
/**
 * FontLoader dynamically injects and loads font faces into the document.
 */
class FontLoader {

	constructor() {

		this.loadedFonts = new Set();

	}

	async load( fontName, url ) {

		if ( typeof document === 'undefined' || typeof FontFace === 'undefined' ) {

			return null;

		}

		if ( this.loadedFonts.has( fontName ) ) {

			return fontName;

		}

		try {

			const font = new FontFace( fontName, `url(${url})` );
			const loadedFace = await font.load();
			document.fonts.add( loadedFace );
			this.loadedFonts.add( fontName );
			return loadedFace;

		} catch ( err ) {

			console.warn( `FontLoader: Could not load font ${fontName} from ${url}`, err );
			return null;

		}

	}

	has( fontName ) {

		return this.loadedFonts.has( fontName );

	}

}



// [loaders/Loader.js]
class Loader {
	constructor() {
		this.crossOrigin = 'anonymous';
		this.path = '';
	}

	setPath( path ) {
		this.path = path;
		return this;
	}
}



// [math/Box2.js]

class Box2 {
	constructor( min = new Vector2( + Infinity, + Infinity ), max = new Vector2( - Infinity, - Infinity ) ) {
		this.isBox2 = true;
		this.min = min;
		this.max = max;
	}

	set( min, max ) {
		this.min.copy( min );
		this.max.copy( max );
		return this;
	}

	makeEmpty() {
		this.min.x = this.min.y = + Infinity;
		this.max.x = this.max.y = - Infinity;
		return this;
	}

	isEmpty() {
		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );
	}

	getCenter( target = new Vector2() ) {
		return this.isEmpty() ? target.set( 0, 0 ) : target.addVectors( this.min, this.max ).multiplyScalar( 0.5 );
	}

	getSize( target = new Vector2() ) {
		return this.isEmpty() ? target.set( 0, 0 ) : target.subVectors( this.max, this.min );
	}

	expandByPoint( point ) {
		this.min.min( point );
		this.max.max( point );
		return this;
	}

	containsPoint( point ) {
		return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
	}

	clone() {
		return new Box2().copy( this );
	}

	copy( box ) {
		this.min.copy( box.min );
		this.max.copy( box.max );
		return this;
	}
}



// [math/Color.js]
class Color {
	constructor( r = 1, g = 1, b = 1 ) {
		this.isColor = true;
		this.r = 1;
		this.g = 1;
		this.b = 1;
		if ( typeof r === 'string' ) {
			this.setStyle( r );
		} else {
			this.setRGB( r, g, b );
		}
	}

	setRGB( r, g, b ) {
		this.r = r;
		this.g = g;
		this.b = b;
		return this;
	}

	setHex( hex ) {
		hex = Math.floor( hex );
		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;
		return this;
	}

	getHex() {
		return Math.round( this.r * 255 ) << 16 | Math.round( this.g * 255 ) << 8 | Math.round( this.b * 255 );
	}

	getHexString() {
		return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );
	}

	getStyle() {
		return `rgb(${Math.round( this.r * 255 )},${Math.round( this.g * 255 )},${Math.round( this.b * 255 )})`;
	}

	setStyle( style ) {
		let m;
		if ( ( m = /^#([0-9a-f]{6})$/i.exec( style ) ) ) {
			this.setHex( parseInt( m[ 1 ], 16 ) );
		} else if ( ( m = /^#([0-9a-f]{3})$/i.exec( style ) ) ) {
			this.setHex( parseInt( m[ 1 ].charAt( 0 ) + m[ 1 ].charAt( 0 ) + m[ 1 ].charAt( 1 ) + m[ 1 ].charAt( 1 ) + m[ 1 ].charAt( 2 ) + m[ 1 ].charAt( 2 ), 16 ) );
		}
		return this;
	}

	clone() {
		return new Color( this.r, this.g, this.b );
	}

	copy( color ) {
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		return this;
	}

	lerp( color, alpha ) {
		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;
		return this;
	}
}



// [math/MathUtils.js]
const _lut = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f' ];

const MathUtils = {
	DEG2RAD: Math.PI / 180,
	RAD2DEG: 180 / Math.PI,

	generateUUID() {
		const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		return (
			_lut[ d0 & 0x1f ] + _lut[ d0 >> 8 & 0x1f ] + _lut[ d0 >> 16 & 0x1f ] + _lut[ d0 >> 24 & 0x1f ] + '-' +
			_lut[ d1 & 0x1f ] + _lut[ d1 >> 8 & 0x1f ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0x1f ] + '-' +
			_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0x1f ] + '-' + _lut[ d2 >> 16 & 0x1f ] + _lut[ d2 >> 24 & 0x1f ] +
			_lut[ d3 & 0x1f ] + _lut[ d3 >> 8 & 0x1f ] + _lut[ d3 >> 16 & 0x1f ] + _lut[ d3 >> 24 & 0x1f ]
		);
	},

	clamp( value, min, max ) {
		return Math.max( min, Math.min( max, value ) );
	},

	lerp( x, y, t ) {
		return ( 1 - t ) * x + t * y;
	},

	smoothstep( x, min, max ) {
		if ( x <= min ) return 0;
		if ( x >= max ) return 1;
		x = ( x - min ) / ( max - min );
		return x * x * ( 3 - 2 * x );
	},

	degToRad( degrees ) {
		return degrees * MathUtils.DEG2RAD;
	},

	radToDeg( radians ) {
		return radians * MathUtils.RAD2DEG;
	}
};



// [math/Matrix3.js]
class Matrix3 {
	constructor() {
		this.isMatrix3 = true;
		this.elements = [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		];
	}

	set( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {
		const te = this.elements;
		te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
		te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
		te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;
		return this;
	}

	identity() {
		this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);
		return this;
	}

	clone() {
		return new Matrix3().fromArray( this.elements );
	}

	copy( m ) {
		const te = this.elements;
		const me = m.elements;
		for ( let i = 0; i < 9; i ++ ) te[ i ] = me[ i ];
		return this;
	}

	multiply( m ) {
		return this.multiplyMatrices( this, m );
	}

	multiplyMatrices( a, b ) {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
		const a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
		const a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

		const b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
		const b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
		const b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
		te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
		te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
		te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
		te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
		te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
		te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

		return this;
	}

	fromArray( array, offset = 0 ) {
		for ( let i = 0; i < 9; i ++ ) {
			this.elements[ i ] = array[ i + offset ];
		}
		return this;
	}

	toArray( array = [], offset = 0 ) {
		for ( let i = 0; i < 9; i ++ ) {
			array[ i + offset ] = this.elements[ i ];
		}
		return array;
	}
}



// [math/Vector2.js]
class Vector2 {
	constructor( x = 0, y = 0 ) {
		this.isVector2 = true;
		this.x = x;
		this.y = y;
	}

	set( x, y ) {
		this.x = x;
		this.y = y;
		return this;
	}

	clone() {
		return new Vector2( this.x, this.y );
	}

	copy( v ) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	add( v ) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub( v ) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	multiplyScalar( s ) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	divideScalar( s ) {
		return this.multiplyScalar( 1 / s );
	}

	dot( v ) {
		return this.x * v.x + this.y * v.y;
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}

	length() {
		return Math.sqrt( this.lengthSq() );
	}

	normalize() {
		return this.divideScalar( this.length() || 1 );
	}

	distanceTo( v ) {
		return Math.sqrt( this.distanceToSquared( v ) );
	}

	distanceToSquared( v ) {
		const dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	lerp( v, alpha ) {
		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		return this;
	}

	equals( v ) {
		return ( v.x === this.x ) && ( v.y === this.y );
	}

	toArray( array = [], offset = 0 ) {
		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		return array;
	}

	fromArray( array, offset = 0 ) {
		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		return this;
	}
}



// [math/Vector3.js]
class Vector3 {
	constructor( x = 0, y = 0, z = 0 ) {
		this.isVector3 = true;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	set( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	clone() {
		return new Vector3( this.x, this.y, this.z );
	}

	copy( v ) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	add( v ) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	sub( v ) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	multiplyScalar( s ) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	dot( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	cross( v ) {
		const ax = this.x, ay = this.y, az = this.z;
		const bx = v.x, by = v.y, bz = v.z;
		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;
		return this;
	}

	length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}

	normalize() {
		const l = this.length() || 1;
		return this.multiplyScalar( 1 / l );
	}

	lerp( v, alpha ) {
		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		return this;
	}
}



// [math/interpolants/Interpolant.js]
class Interpolant {
	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {
		this.parameterPositions = parameterPositions;
		this.sampleValues = sampleValues;
		this.sampleSize = sampleSize;
		this.resultBuffer = resultBuffer !== undefined ? resultBuffer : new sampleValues.constructor( sampleSize );
	}

	evaluate( t ) {
		const pp = this.parameterPositions;
		let i1 = 1;
		const l = pp.length;
		while ( i1 < l && t >= pp[ i1 ] ) ++ i1;
		const i0 = i1 - 1;
		const t0 = pp[ i0 ];
		const t1 = pp[ i1 ];
		return this.interpolate_( i0, t0, t, t1 );
	}

	interpolate_( i0, t0, t, t1 ) {
		throw new Error( 'Interpolant.interpolate_() must be implemented.' );
	}
}



// [math/interpolants/LinearInterpolant.js]

class LinearInterpolant extends Interpolant {
	interpolate_( i0, t0, t, t1 ) {
		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.sampleSize;
		const offset0 = i0 * stride;
		const offset1 = offset0 + stride;
		const weight1 = ( t - t0 ) / ( t1 - t0 );
		const weight0 = 1 - weight1;

		for ( let i = 0; i !== stride; ++ i ) {
			result[ i ] = values[ offset0 + i ] * weight0 + values[ offset1 + i ] * weight1;
		}

		return result;
	}
}



// [platforms/InstagramPlatform.js]

const InstagramReels = new PlatformSpec( 'Instagram Reels', 1080, 1920, { top: 150, bottom: 220, right: 120, left: 40 } );
const InstagramFeed = new PlatformSpec( 'Instagram Feed Square', 1080, 1080, { top: 40, bottom: 40, right: 40, left: 40 } );
const InstagramCarousel = new PlatformSpec( 'Instagram Carousel Portrait', 1080, 1350, { top: 50, bottom: 50, right: 50, left: 50 } );


// [platforms/PlatformSpec.js]
class PlatformSpec {
	constructor( name, width, height, safeZone ) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		this.safeZone = safeZone;
	}
}



// [platforms/TikTokPlatform.js]

const TikTokVertical = new PlatformSpec( 'TikTok Vertical', 1080, 1920, { top: 160, bottom: 240, right: 130, left: 40 } );


// [platforms/YouTubePlatform.js]

const YouTubeShorts = new PlatformSpec( 'YouTube Shorts', 1080, 1920, { top: 140, bottom: 200, right: 120, left: 40 } );
const YouTubeVideo = new PlatformSpec( 'YouTube Video 16:9', 1920, 1080, { top: 60, bottom: 60, right: 60, left: 60 } );
const YouTubeThumbnail = new PlatformSpec( 'YouTube Thumbnail', 1280, 720, { top: 40, bottom: 40, right: 40, left: 40 } );


// [renderers/Canvas2DRenderer.js]
class Canvas2DRenderer {
	constructor( parameters = {} ) {
		this.domElement = parameters.canvas || document.createElement( 'canvas' );
		this.ctx = this.domElement.getContext( '2d' );
	}

	setSize( width, height ) {
		this.domElement.width = width;
		this.domElement.height = height;
	}

	render( scene ) {
		if ( ! this.ctx ) return;
		this.ctx.clearRect( 0, 0, this.domElement.width, this.domElement.height );
		if ( scene && scene.render ) {
			scene.render( this.ctx );
		}
	}
}



// [typography/Font.js]
class Font {
	constructor( name, url ) {
		this.name = name;
		this.url = url;
		this.isLoaded = false;
	}

	async load() {
		if ( typeof document !== 'undefined' && typeof FontFace !== 'undefined' ) {
			const face = new FontFace( this.name, `url(${this.url})` );
			await face.load();
			document.fonts.add( face );
			this.isLoaded = true;
		}
		return this;
	}
}



// [typography/HookHeadline.js]
class HookHeadline {
	constructor( text = 'VIRAL HOOK', options = {} ) {
		this.text = text;
		this.font = options.font || 'Bebas Neue';
		this.size = options.size || 72;
		this.color = options.color || '#FFFFFF';
		this.strokeColor = options.strokeColor || '#000000';
		this.strokeWidth = options.strokeWidth || 8;
	}
}



// [typography/SubtitleTrack.js]
class SubtitleTrack {
	constructor() {
		this.cues = [];
	}

	addCue( startTime, endTime, text ) {
		this.cues.push( { startTime, endTime, text } );
		this.cues.sort( ( a, b ) => a.startTime - b.startTime );
		return this;
	}

	getCueAt( time ) {
		return this.cues.find( c => time >= c.startTime && time <= c.endTime ) || null;
	}
}



// [typography/TextMetrics.js]
class TextMetrics {
	static measure( text, font, size, ctx ) {
		if ( ! ctx ) return { width: text.length * size * 0.6, height: size };
		ctx.save();
		ctx.font = `${size}px '${font}', sans-serif`;
		const metrics = ctx.measureText( text );
		ctx.restore();
		return {
			width: metrics.width,
			height: size
		};
	}
}



// [utils.js]
function warn( message ) {

	console.warn( message );

}

function error( message ) {

	console.error( message );

}



// [video/ChromaKeyer.js]

class ChromaKeyer {
	constructor( keyColor = new Color( 0, 1, 0 ), threshold = 0.4, smoothing = 0.1 ) {
		this.keyColor = keyColor;
		this.threshold = threshold;
		this.smoothing = smoothing;
	}

	applyToImageData( imageData ) {
		const data = imageData.data;
		const kr = this.keyColor.r * 255;
		const kg = this.keyColor.g * 255;
		const kb = this.keyColor.b * 255;

		for ( let i = 0; i < data.length; i += 4 ) {
			const r = data[ i ];
			const g = data[ i + 1 ];
			const b = data[ i + 2 ];
			const dist = Math.sqrt( ( r - kr ) ** 2 + ( g - kg ) ** 2 + ( b - kb ) ** 2 ) / 441.67;
			if ( dist < this.threshold ) {
				data[ i + 3 ] = 0;
			}
		}
		return imageData;
	}
}



// [video/KenBurnsController.js]
class KenBurnsController {
	constructor( duration = 5.0, startZoom = 1.0, endZoom = 1.25 ) {
		this.duration = duration;
		this.startZoom = startZoom;
		this.endZoom = endZoom;
	}

	getZoomAt( time ) {
		const t = Math.min( 1.0, Math.max( 0.0, time / this.duration ) );
		return this.startZoom + ( this.endZoom - this.startZoom ) * t;
	}
}



// [video/VideoSource.js]
class VideoSource {
	constructor( src = '' ) {
		this.src = src;
		this.videoElement = null;
		this.isLoaded = false;
		this.duration = 0;
	}

	load() {
		if ( typeof document === 'undefined' ) return Promise.resolve( this );
		return new Promise( ( resolve, reject ) => {
			const v = document.createElement( 'video' );
			v.crossOrigin = 'anonymous';
			v.src = this.src;
			v.onloadedmetadata = () => {
				this.videoElement = v;
				this.duration = v.duration;
				this.isLoaded = true;
				resolve( this );
			};
			v.onerror = reject;
		} );
	}
}




module.exports = { KeyframeTrack, NumberKeyframeTrack, VectorKeyframeTrack, AnimationClip, AnimationMixer, AudioContext, AudioListener, AudioSource, AudioEngine, DopamineTrigger, VideoSource, KenBurnsController, ChromaKeyer, Font, TextMetrics, HookHeadline, SubtitleTrack, PlatformSpec, InstagramReels, InstagramFeed, InstagramCarousel, TikTokVertical, YouTubeShorts, YouTubeVideo, YouTubeThumbnail, Loader, FileLoader, AssetLoader, FontLoader, CubeLUTLoader, Filter, ColorGrading, Canvas2DRenderer, REVISION };
