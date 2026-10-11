export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uGrainAmount;

float pseudoRandom( vec2 co ) {
	return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

void main() {
	vec4 color = texture2D( tDiffuse, vUv );
	float noise = pseudoRandom( vUv + fract( uTime ) ) * 2.0 - 1.0;
	color.rgb += noise * uGrainAmount;
	gl_FragColor = color;
}
`;
