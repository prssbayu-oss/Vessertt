import { Layer } from './Layer.js';
import { LayerTypes } from '../constants.js';

/**
 * MediaLayer handles raster and vector graphic assets.
 * Analogous to Three.js Mesh with Texture.
 */
class MediaLayer extends Layer {

	constructor( src = '', options = {} ) {

		super( { ...options, type: LayerTypes.MEDIA } );

		this.src = src;
		this.image = null;
		this.isLoaded = false;
		this.fit = options.fit || 'cover'; // 'cover', 'contain', 'stretch'

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

export { MediaLayer };
