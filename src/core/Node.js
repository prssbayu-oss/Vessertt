import { EventDispatcher } from './EventDispatcher.js';
import { MathUtils } from '../math/MathUtils.js';

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

export { Node };
