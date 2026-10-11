import { KeyframeTrack } from '../KeyframeTrack.js';

class VectorKeyframeTrack extends KeyframeTrack {
	constructor( name, times, values ) {
		super( name, times, values );
		this.ValueTypeName = 'vector';
	}
}

export { VectorKeyframeTrack };
