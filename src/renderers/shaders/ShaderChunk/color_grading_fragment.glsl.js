export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uExposure;
uniform float uContrast;
uniform float uSaturation;
uniform float uTemperature;
uniform float uTint;

vec3 adjustColor( vec3 color ) {
	// Exposure
	color *= uExposure;

	// Temperature & Tint
	color.r += uTemperature * 0.1;
	color.b -= uTemperature * 0.1;
	color.g += uTint * 0.1;

	// Contrast
	color = ( color - 0.5 ) * uContrast + 0.5;

	// Saturation
	float luminance = dot( color, vec3( 0.2126, 0.7152, 0.0722 ) );
	color = mix( vec3( luminance ), color, uSaturation );

	return clamp( color, 0.0, 1.0 );
}

void main() {
	vec4 texColor = texture2D( tDiffuse, vUv );
	vec3 graded = adjustColor( texColor.rgb );
	gl_FragColor = vec4( graded, texColor.a );
}
`;
