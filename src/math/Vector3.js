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

export { Vector3 };
