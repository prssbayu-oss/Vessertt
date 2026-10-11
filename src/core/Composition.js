import { Object2D } from './Object2D.js';
import { Viewport } from './Viewport.js';

class Composition extends Object2D {
	constructor( width = 1080, height = 1920, duration = 15.0 ) {
		super();
		this.isComposition = true;
		this.viewport = new Viewport( width, height );
		this.duration = duration;
		this.currentTime = 0;
	}

	setTime( time ) {
		this.currentTime = Math.max( 0, Math.min( this.duration, time ) );
		this.dispatchEvent( { type: 'timeupdate', time: this.currentTime } );
	}
}

export { Composition };
