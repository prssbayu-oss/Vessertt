export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uRadius;
uniform float uSoftness;

void main() {
	vec4 color = texture2D( tDiffuse, vUv );
	float dist = distance( vUv, vec2( 0.5, 0.5 ) );
	float vignette = smoothstep( uRadius, uRadius - uSoftness, dist );
	color.rgb *= vignette;
	gl_FragColor = color;
}
`;
