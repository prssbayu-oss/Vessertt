import { Interpolant } from './Interpolant.js';

class LinearInterpolant extends Interpolant {
	interpolate_( i0, t0, t, t1 ) {
		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.sampleSize;
		const offset0 = i0 * stride;
		const offset1 = offset0 + stride;
		const weight1 = ( t - t0 ) / ( t1 - t0 );
		const weight0 = 1 - weight1;

		for ( let i = 0; i !== stride; ++ i ) {
			result[ i ] = values[ offset0 + i ] * weight0 + values[ offset1 + i ] * weight1;
		}

		return result;
	}
}

export { LinearInterpolant };
