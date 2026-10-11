export default /* glsl */`
precision highp float;
attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vUv;
uniform vec2 uPan;
uniform float uZoom;

void main() {
	vec2 centered = aTexCoord - 0.5;
	vUv = ( centered / uZoom ) + 0.5 + uPan;
	gl_Position = vec4( aPosition, 0.0, 1.0 );
}
`;
