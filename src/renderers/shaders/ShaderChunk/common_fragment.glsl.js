export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uOpacity;

void main() {
	vec4 texColor = texture2D( tDiffuse, vUv );
	gl_FragColor = texColor * uOpacity;
}
`;
