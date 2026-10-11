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

export { Vector2 };
