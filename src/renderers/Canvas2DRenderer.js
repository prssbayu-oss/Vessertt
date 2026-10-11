class Canvas2DRenderer {
	constructor( parameters = {} ) {
		this.domElement = parameters.canvas || document.createElement( 'canvas' );
		this.ctx = this.domElement.getContext( '2d' );
	}

	setSize( width, height ) {
		this.domElement.width = width;
		this.domElement.height = height;
	}

	render( scene ) {
		if ( ! this.ctx ) return;
		this.ctx.clearRect( 0, 0, this.domElement.width, this.domElement.height );
		if ( scene && scene.render ) {
			scene.render( this.ctx );
		}
	}
}

export { Canvas2DRenderer };
