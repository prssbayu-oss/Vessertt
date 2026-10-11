export default /* glsl */`
precision highp float;
attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vUv;
uniform mat3 uMatrix;

void main() {
	vUv = aTexCoord;
	vec3 pos = uMatrix * vec3( aPosition, 1.0 );
	gl_Position = vec4( pos.xy, 0.0, 1.0 );
}
`;
