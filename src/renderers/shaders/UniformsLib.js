export const UniformsLib = {
	common: {
		tDiffuse: { value: null },
		uOpacity: { value: 1.0 },
		uMatrix: { value: [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ] }
	},
	grading: {
		uExposure: { value: 1.0 },
		uContrast: { value: 1.0 },
		uSaturation: { value: 1.0 },
		uTemperature: { value: 0.0 },
		uTint: { value: 0.0 }
	},
	chroma: {
		uKeyColor: { value: [ 0.0, 1.0, 0.0 ] },
		uSimilarity: { value: 0.4 },
		uSmoothness: { value: 0.1 },
		uSpill: { value: 0.1 }
	},
	lut: {
		tLUT: { value: null },
		uLUTSize: { value: 33.0 },
		uIntensity: { value: 1.0 }
	}
};
