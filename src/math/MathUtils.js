const _lut = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f' ];

const MathUtils = {
	DEG2RAD: Math.PI / 180,
	RAD2DEG: 180 / Math.PI,

	generateUUID() {
		const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		return (
			_lut[ d0 & 0x1f ] + _lut[ d0 >> 8 & 0x1f ] + _lut[ d0 >> 16 & 0x1f ] + _lut[ d0 >> 24 & 0x1f ] + '-' +
			_lut[ d1 & 0x1f ] + _lut[ d1 >> 8 & 0x1f ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0x1f ] + '-' +
			_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0x1f ] + '-' + _lut[ d2 >> 16 & 0x1f ] + _lut[ d2 >> 24 & 0x1f ] +
			_lut[ d3 & 0x1f ] + _lut[ d3 >> 8 & 0x1f ] + _lut[ d3 >> 16 & 0x1f ] + _lut[ d3 >> 24 & 0x1f ]
		);
	},

	clamp( value, min, max ) {
		return Math.max( min, Math.min( max, value ) );
	},

	lerp( x, y, t ) {
		return ( 1 - t ) * x + t * y;
	},

	smoothstep( x, min, max ) {
		if ( x <= min ) return 0;
		if ( x >= max ) return 1;
		x = ( x - min ) / ( max - min );
		return x * x * ( 3 - 2 * x );
	},

	degToRad( degrees ) {
		return degrees * MathUtils.DEG2RAD;
	},

	radToDeg( radians ) {
		return radians * MathUtils.RAD2DEG;
	}
};

export { MathUtils };
