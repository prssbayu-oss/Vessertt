import { Vector2 } from './Vector2.js';

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

export { Box2 };
