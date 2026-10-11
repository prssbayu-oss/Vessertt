import { KeyframeTrack } from '../KeyframeTrack.js';

class NumberKeyframeTrack extends KeyframeTrack {
	constructor( name, times, values ) {
		super( name, times, values );
		this.ValueTypeName = 'number';
	}
}

export { NumberKeyframeTrack };
