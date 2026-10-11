export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform float uProgress;

float random( vec2 co ) {
	return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

void main() {
	float block = random( floor( vUv * 20.0 ) + uProgress );
	vec2 offset = vec2( ( block - 0.5 ) * 0.1 * sin( uProgress * 3.1415 ), 0.0 );

	vec4 colFrom = texture2D( tFrom, vUv + offset );
	vec4 colTo = texture2D( tTo, vUv - offset );

	// Chromatic displacement
	float r = mix( colFrom.r, colTo.r, uProgress );
	float g = mix( texture2D( tFrom, vUv + offset * 1.5 ).g, texture2D( tTo, vUv - offset * 1.5 ).g, uProgress );
	float b = mix( colFrom.b, colTo.b, uProgress );

	gl_FragColor = vec4( r, g, b, 1.0 );
}
`;
