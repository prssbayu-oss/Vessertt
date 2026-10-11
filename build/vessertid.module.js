/**
 * VessertID — The Social Media Engine & Creative Asset Architecture
 * Version: 2026.1.0
 * (c) 2026 VessertID Creative Studio
 * All rights reserved.
 */

export const REVISION = '2026.1';

/**
 * Platform aspect ratio presets for Social Media Canvas.
 * @constant
 * @type {Object}
 */
export const AspectRatios = {
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
export const SafeZones = {
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
export const LayerTypes = {
	BACKGROUND: 'background',
	MEDIA: 'media',
	OVERLAY: 'overlay',
	TYPOGRAPHY: 'typography',
	AUDIO: 'audio',
	BRAND: 'brand',
	MOTION: 'motion'
};


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


export { REVISION, AspectRatios, SafeZones, LayerTypes, Layer, MediaLayer, TextLayer, SocialCanvas, FontLoader, AssetLoader, AudioEngine };
