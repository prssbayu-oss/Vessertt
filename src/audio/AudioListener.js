import { AudioContext } from './AudioContext.js';

class AudioListener {
	constructor() {
		this.context = AudioContext.getContext();
		if ( this.context ) {
			this.gain = this.context.createGain();
			this.gain.connect( this.context.destination );
		}
	}

	getInput() {
		return this.gain;
	}

	setMasterVolume( value ) {
		if ( this.gain ) {
			this.gain.gain.setTargetAtTime( value, this.context.currentTime, 0.01 );
		}
		return this;
	}

	getMasterVolume() {
		return this.gain ? this.gain.gain.value : 0;
	}
}

export { AudioListener };
