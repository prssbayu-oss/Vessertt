export class WebGLState {
	constructor( gl ) {
		this.gl = gl;
		this.currentProgram = null;
		this.viewport = { x: 0, y: 0, width: 0, height: 0 };
	}

	setViewport( x, y, width, height ) {
		if ( this.viewport.width !== width || this.viewport.height !== height ) {
			this.gl.viewport( x, y, width, height );
			this.viewport = { x, y, width, height };
		}
	}

	enableBlend( enable = true ) {
		if ( enable ) {
			this.gl.enable( this.gl.BLEND );
			this.gl.blendFunc( this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA );
		} else {
			this.gl.disable( this.gl.BLEND );
		}
	}
}
