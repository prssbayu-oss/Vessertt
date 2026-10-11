import { AudioContext } from './AudioContext.js';

class AudioSource {
	constructor( listener ) {
		this.listener = listener;
		this.context = listener.context;
		this.gainNode = this.context ? this.context.createGain() : null;
		if ( this.gainNode ) {
			this.gainNode.connect( listener.getInput() );
		}
		this.buffer = null;
		this.source = null;
		this.isPlaying = false;
		this.loop = false;
	}

	setBuffer( audioBuffer ) {
		this.buffer = audioBuffer;
		return this;
	}

	play( delay = 0 ) {
		if ( ! this.context || ! this.buffer ) return this;
		this.source = this.context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.loop = this.loop;
		this.source.connect( this.gainNode );
		this.source.start( this.context.currentTime + delay );
		this.isPlaying = true;
		return this;
	}

	stop() {
		if ( this.source ) {
			this.source.stop();
			this.isPlaying = false;
		}
		return this;
	}

	setVolume( volume ) {
		if ( this.gainNode ) {
			this.gainNode.gain.setValueAtTime( volume, this.context.currentTime );
		}
		return this;
	}
}

export { AudioSource };
