export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform float uProgress;

void main() {
	vec4 cFrom = texture2D( tFrom, vUv );
	vec4 cTo = texture2D( tTo, vUv );
	gl_FragColor = mix( cFrom, cTo, uProgress );
}
`;
