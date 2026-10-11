export function createWebGLShader( gl, type, source ) {
	const shader = gl.createShader( type );
	gl.shaderSource( shader, source );
	gl.compileShader( shader );

	if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
		const info = gl.getShaderInfoLog( shader );
		gl.deleteShader( shader );
		throw new Error( `WebGLShader: Compilation error:\n${info}` );
	}

	return shader;
}
