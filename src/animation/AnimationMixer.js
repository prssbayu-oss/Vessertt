import { EventDispatcher } from '../core/EventDispatcher.js';

class AnimationMixer extends EventDispatcher {
	constructor( root ) {
		super();
		this.root = root;
		this.time = 0;
		this.actions = [];
	}

	update( deltaTime ) {
		this.time += deltaTime;
		for ( let i = 0; i < this.actions.length; i ++ ) {
			this.actions[ i ].update( deltaTime );
		}
		return this;
	}

	clipAction( clip ) {
		// Registers clip to root
		return clip;
	}
}

export { AnimationMixer };
