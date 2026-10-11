class DopamineTrigger {
	constructor( audioEngine ) {
		this.audioEngine = audioEngine;
		this.cues = new Map();
	}

	registerCue( name, audioBuffer ) {
		this.cues.set( name, audioBuffer );
	}

	trigger( name, options = {} ) {
		const buf = this.cues.get( name );
		if ( buf && this.audioEngine ) {
			this.audioEngine.playBuffer( buf, options );
		}
	}
}

export { DopamineTrigger };
