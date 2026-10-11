class SubtitleTrack {
	constructor() {
		this.cues = [];
	}

	addCue( startTime, endTime, text ) {
		this.cues.push( { startTime, endTime, text } );
		this.cues.sort( ( a, b ) => a.startTime - b.startTime );
		return this;
	}

	getCueAt( time ) {
		return this.cues.find( c => time >= c.startTime && time <= c.endTime ) || null;
	}
}

export { SubtitleTrack };
