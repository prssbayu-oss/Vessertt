class KenBurnsController {
	constructor( duration = 5.0, startZoom = 1.0, endZoom = 1.25 ) {
		this.duration = duration;
		this.startZoom = startZoom;
		this.endZoom = endZoom;
	}

	getZoomAt( time ) {
		const t = Math.min( 1.0, Math.max( 0.0, time / this.duration ) );
		return this.startZoom + ( this.endZoom - this.startZoom ) * t;
	}
}

export { KenBurnsController };
