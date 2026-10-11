import { Node } from './Node.js';
import { Vector2 } from '../math/Vector2.js';
import { Matrix3 } from '../math/Matrix3.js';

class Object2D extends Node {
	constructor() {
		super();
		this.isObject2D = true;
		this.position = new Vector2();
		this.scale = new Vector2( 1, 1 );
		this.rotation = 0;
		this.matrix = new Matrix3();
		this.matrixWorld = new Matrix3();
		this.visible = true;
		this.zIndex = 0;
		this.opacity = 1.0;
		this.blendMode = 'source-over';
	}

	updateMatrix() {
		const c = Math.cos( this.rotation );
		const s = Math.sin( this.rotation );
		this.matrix.set(
			c * this.scale.x, - s * this.scale.y, this.position.x,
			s * this.scale.x,   c * this.scale.y, this.position.y,
			0,                  0,                1
		);
	}

	updateWorldMatrix() {
		this.updateMatrix();
		if ( this.parent && this.parent.isObject2D ) {
			this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );
		} else {
			this.matrixWorld.copy( this.matrix );
		}
		for ( let i = 0; i < this.children.length; i ++ ) {
			if ( this.children[ i ].isObject2D ) this.children[ i ].updateWorldMatrix();
		}
	}
}

export { Object2D };
