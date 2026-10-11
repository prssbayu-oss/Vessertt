import { LayerTypes } from '../constants.js';

/**
 * Base Layer class representing an element on the Social Canvas.
 * Analogous to Three.js Object3D.
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

export { Layer };
