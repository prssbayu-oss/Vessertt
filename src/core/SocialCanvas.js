import { AspectRatios } from '../constants.js';

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

export { SocialCanvas };
