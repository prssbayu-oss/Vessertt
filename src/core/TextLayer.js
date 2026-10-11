import { Layer } from './Layer.js';
import { LayerTypes } from '../constants.js';

/**
 * TextLayer represents typography elements, hooks, and subtitles.
 * Analogous to Three.js TextGeometry / SpriteText.
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

export { TextLayer };
