import { LinearInterpolant } from '../math/interpolants/LinearInterpolant.js';

class KeyframeTrack {
	constructor( name, times, values, interpolation ) {
		this.name = name;
		this.times = times;
		this.values = values;
		this.InterpolantFactoryMethod = LinearInterpolant;
	}

	getInterpolant() {
		return new this.InterpolantFactoryMethod( this.times, this.values, this.getValueSize() );
	}

	getValueSize() {
		return this.values.length / this.times.length;
	}
}

export { KeyframeTrack };
