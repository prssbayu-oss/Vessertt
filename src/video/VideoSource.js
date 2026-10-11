class VideoSource {
	constructor( src = '' ) {
		this.src = src;
		this.videoElement = null;
		this.isLoaded = false;
		this.duration = 0;
	}

	load() {
		if ( typeof document === 'undefined' ) return Promise.resolve( this );
		return new Promise( ( resolve, reject ) => {
			const v = document.createElement( 'video' );
			v.crossOrigin = 'anonymous';
			v.src = this.src;
			v.onloadedmetadata = () => {
				this.videoElement = v;
				this.duration = v.duration;
				this.isLoaded = true;
				resolve( this );
			};
			v.onerror = reject;
		} );
	}
}

export { VideoSource };
