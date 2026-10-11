/**
 * AudioEngine manages retention sounds, backsound tracks, and SFX chimes.
 */
class AudioEngine {

	constructor() {

		this.context = null;
		this.masterGain = null;
		this.buffers = new Map();

	}

	init() {

		if ( ! this.context && typeof window !== 'undefined' ) {

			const AudioCtx = window.AudioContext || window.webkitAudioContext;

			if ( AudioCtx ) {

				this.context = new AudioCtx();
				this.masterGain = this.context.createGain();
				this.masterGain.connect( this.context.destination );

			}

		}

	}

	setMasterVolume( volume ) {

		if ( this.masterGain && this.context ) {

			this.masterGain.gain.setValueAtTime( Math.max( 0, Math.min( 1, volume ) ), this.context.currentTime );

		}

		return this;

	}

	async loadSound( name, url ) {

		this.init();

		if ( this.buffers.has( name ) ) {

			return this.buffers.get( name );

		}

		const response = await fetch( url );
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.context.decodeAudioData( arrayBuffer );

		this.buffers.set( name, audioBuffer );
		return audioBuffer;

	}

	play( name, options = {} ) {

		this.init();

		const buffer = this.buffers.get( name );

		if ( ! buffer ) {

			console.warn( `AudioEngine: Buffer '${name}' not loaded` );
			return null;

		}

		const source = this.context.createBufferSource();
		const gain = this.context.createGain();

		source.buffer = buffer;
		source.loop = options.loop || false;

		const vol = options.volume !== undefined ? options.volume : 1.0;
		gain.gain.setValueAtTime( vol, this.context.currentTime );

		source.connect( gain );
		gain.connect( this.masterGain );

		source.start( 0 );
		return source;

	}

}

export { AudioEngine };
