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

export { Color };
