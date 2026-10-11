class Interpolant {
	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {
		this.parameterPositions = parameterPositions;
		this.sampleValues = sampleValues;
		this.sampleSize = sampleSize;
		this.resultBuffer = resultBuffer !== undefined ? resultBuffer : new sampleValues.constructor( sampleSize );
	}

	evaluate( t ) {
		const pp = this.parameterPositions;
		let i1 = 1;
		const l = pp.length;
		while ( i1 < l && t >= pp[ i1 ] ) ++ i1;
		const i0 = i1 - 1;
		const t0 = pp[ i0 ];
		const t1 = pp[ i1 ];
		return this.interpolate_( i0, t0, t, t1 );
	}

	interpolate_( i0, t0, t, t1 ) {
		throw new Error( 'Interpolant.interpolate_() must be implemented.' );
	}
}

export { Interpolant };
