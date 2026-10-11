class AnimationClip {
	constructor( name = '', duration = - 1, tracks = [] ) {
		this.name = name;
		this.tracks = tracks;
		this.duration = duration;
		if ( this.duration < 0 ) {
			this.resetDuration();
		}
	}

	resetDuration() {
		const tracks = this.tracks;
		let maxDuration = 0;
		for ( let i = 0; i < tracks.length; i ++ ) {
			const track = tracks[ i ];
			const trackDuration = track.times[ track.times.length - 1 ];
			if ( trackDuration > maxDuration ) maxDuration = trackDuration;
		}
		this.duration = maxDuration;
		return this;
	}
}

export { AnimationClip };
