export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform float uProgress;

void main() {
	vec2 center = vec2( 0.5, 0.5 );
	vec2 uvFrom = ( vUv - center ) * ( 1.0 + uProgress * 2.0 ) + center;
	vec2 uvTo = ( vUv - center ) * ( 1.0 - ( 1.0 - uProgress ) * 2.0 ) + center;

	vec4 cFrom = texture2D( tFrom, clamp( uvFrom, 0.0, 1.0 ) );
	vec4 cTo = texture2D( tTo, clamp( uvTo, 0.0, 1.0 ) );

	gl_FragColor = mix( cFrom, cTo, uProgress );
}
`;
