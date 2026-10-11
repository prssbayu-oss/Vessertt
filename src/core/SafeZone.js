import { Box2 } from '../math/Box2.js';
import { Vector2 } from '../math/Vector2.js';

class SafeZone {
	constructor( width = 1080, height = 1920, margins = { top: 150, bottom: 220, left: 40, right: 120 } ) {
		this.width = width;
		this.height = height;
		this.margins = margins;
		this.bounds = new Box2(
			new Vector2( margins.left, margins.top ),
			new Vector2( width - margins.right, height - margins.bottom )
		);
	}

	isSafe( x, y ) {
		return this.bounds.containsPoint( new Vector2( x, y ) );
	}
}

export { SafeZone };
