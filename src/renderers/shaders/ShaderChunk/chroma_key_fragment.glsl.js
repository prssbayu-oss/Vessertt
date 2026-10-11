export default /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec3 uKeyColor;
uniform float uSimilarity;
uniform float uSmoothness;
uniform float uSpill;

void main() {
	vec4 color = texture2D( tDiffuse, vUv );
	float d = distance( color.rgb, uKeyColor );
	float alpha = smoothstep( uSimilarity, uSimilarity + uSmoothness, d );

	// Despill
	float greenDiff = color.g - max( color.r, color.b );
	if ( greenDiff > 0.0 ) {
		color.g -= greenDiff * uSpill;
	}

	gl_FragColor = vec4( color.rgb, color.a * alpha );
}
`;
