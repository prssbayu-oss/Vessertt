export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tLUT;
uniform float uLUTSize;
uniform float uIntensity;

vec3 sampleLUT( vec3 color ) {
	float red = color.r * ( uLUTSize - 1.0 );
	float green = color.g * ( uLUTSize - 1.0 );
	float blue = color.b * ( uLUTSize - 1.0 );

	float slice = floor( blue );
	float sliceNext = min( slice + 1.0, uLUTSize - 1.0 );
	float sliceFrac = fract( blue );

	float u = ( red + 0.5 ) / ( uLUTSize * uLUTSize );
	float v = ( green + 0.5 ) / uLUTSize;

	vec2 uv1 = vec2( slice / uLUTSize + u, v );
	vec2 uv2 = vec2( sliceNext / uLUTSize + u, v );

	vec3 col1 = texture2D( tLUT, uv1 ).rgb;
	vec3 col2 = texture2D( tLUT, uv2 ).rgb;

	return mix( col1, col2, sliceFrac );
}

void main() {
	vec4 base = texture2D( tDiffuse, vUv );
	vec3 graded = sampleLUT( base.rgb );
	gl_FragColor = vec4( mix( base.rgb, graded, uIntensity ), base.a );
}
`;
