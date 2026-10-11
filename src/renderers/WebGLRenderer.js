import { WebGLState } from './webgl/WebGLState.js';
import { WebGLTextures } from './webgl/WebGLTextures.js';
import { WebGLProgram } from './webgl/WebGLProgram.js';
import { ShaderLib } from './shaders/ShaderLib.js';

export class WebGLRenderer {
	constructor( parameters = {} ) {
		this.domElement = parameters.canvas || document.createElement( 'canvas' );
		this.gl = this.domElement.getContext( 'webgl' ) || this.domElement.getContext( 'experimental-webgl' );

		if ( ! this.gl ) {
			throw new Error( 'WebGLRenderer: WebGL is not supported on this device/browser.' );
		}

		this.state = new WebGLState( this.gl );
		this.textures = new WebGLTextures( this.gl );
		this.programs = new Map();

		this.initGeometry();
	}

	initGeometry() {
		const gl = this.gl;
		// Fullscreen Quad
		const vertices = new Float32Array( [
			- 1, - 1,   0, 0,
			  1, - 1,   1, 0,
			- 1,   1,   0, 1,
			- 1,   1,   0, 1,
			  1, - 1,   1, 0,
			  1,   1,   1, 1
		] );

		this.quadBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.quadBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );
	}

	setSize( width, height ) {
		this.domElement.width = width;
		this.domElement.height = height;
		this.state.setViewport( 0, 0, width, height );
	}

	renderImageWithLUT( image, lutTexture, intensity = 1.0 ) {
		const gl = this.gl;
		if ( ! this.programs.has( 'lut' ) ) {
			const prog = new WebGLProgram( gl, ShaderLib.lut3D.vertexShader, ShaderLib.lut3D.fragmentShader );
			this.programs.set( 'lut', prog );
		}

		const program = this.programs.get( 'lut' );
		program.use();

		this.textures.uploadTexture( image, 0 );
		gl.uniform1i( program.uniforms.tDiffuse, 0 );

		if ( lutTexture ) {
			this.textures.uploadTexture( lutTexture, 1 );
			gl.uniform1i( program.uniforms.tLUT, 1 );
		}

		gl.uniform1f( program.uniforms.uIntensity, intensity );
		gl.uniform1f( program.uniforms.uLUTSize, 33.0 );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.quadBuffer );
		gl.enableVertexAttribArray( 0 );
		gl.vertexAttribPointer( 0, 2, gl.FLOAT, false, 16, 0 );
		gl.enableVertexAttribArray( 1 );
		gl.vertexAttribPointer( 1, 2, gl.FLOAT, false, 16, 8 );

		gl.drawArrays( gl.TRIANGLES, 0, 6 );
	}
}
