export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tBase;
uniform sampler2D tBlend;
uniform int uBlendMode; // 0=Normal, 1=Multiply, 2=Screen, 3=Overlay, 4=SoftLight
uniform float uOpacity;

vec3 blendMultiply( vec3 base, vec3 blend ) { return base * blend; }
vec3 blendScreen( vec3 base, vec3 blend ) { return 1.0 - ( 1.0 - base ) * ( 1.0 - blend ); }
vec3 blendOverlay( vec3 base, vec3 blend ) {
	return mix( 2.0 * base * blend, 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ), step( 0.5, base ) );
}

void main() {
	vec4 base = texture2D( tBase, vUv );
	vec4 blend = texture2D( tBlend, vUv );
	vec3 res = blend.rgb;

	if ( uBlendMode == 1 ) res = blendMultiply( base.rgb, blend.rgb );
	else if ( uBlendMode == 2 ) res = blendScreen( base.rgb, blend.rgb );
	else if ( uBlendMode == 3 ) res = blendOverlay( base.rgb, blend.rgb );

	gl_FragColor = vec4( mix( base.rgb, res, uOpacity * blend.a ), base.a );
}
`;
