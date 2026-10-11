import { createWebGLShader } from './WebGLShader.js';

export class WebGLProgram {
	constructor( gl, vertexShaderSource, fragmentShaderSource ) {
		this.gl = gl;
		this.program = gl.createProgram();

		const vs = createWebGLShader( gl, gl.VERTEX_SHADER, vertexShaderSource );
		const fs = createWebGLShader( gl, gl.FRAGMENT_SHADER, fragmentShaderSource );

		gl.attachShader( this.program, vs );
		gl.attachShader( this.program, fs );
		gl.linkProgram( this.program );

		if ( ! gl.getProgramParameter( this.program, gl.LINK_STATUS ) ) {
			const info = gl.getProgramInfoLog( this.program );
			throw new Error( `WebGLProgram: Link error:\n${info}` );
		}

		this.uniforms = {};
		this.attributes = {};

		const numUniforms = gl.getProgramParameter( this.program, gl.ACTIVE_UNIFORMS );
		for ( let i = 0; i < numUniforms; i ++ ) {
			const info = gl.getActiveUniform( this.program, i );
			this.uniforms[ info.name ] = gl.getUniformLocation( this.program, info.name );
		}
	}

	use() {
		this.gl.useProgram( this.program );
	}
}
