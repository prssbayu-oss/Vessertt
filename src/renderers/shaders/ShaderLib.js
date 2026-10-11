import { ShaderChunk } from './ShaderChunk.js';
import { UniformsLib } from './UniformsLib.js';

export const ShaderLib = {
	basic: {
		uniforms: UniformsLib.common,
		vertexShader: ShaderChunk.common_vertex,
		fragmentShader: ShaderChunk.common_fragment
	},
	colorGrading: {
		uniforms: { ...UniformsLib.common, ...UniformsLib.grading },
		vertexShader: ShaderChunk.common_vertex,
		fragmentShader: ShaderChunk.color_grading_fragment
	},
	chromaKey: {
		uniforms: { ...UniformsLib.common, ...UniformsLib.chroma },
		vertexShader: ShaderChunk.common_vertex,
		fragmentShader: ShaderChunk.chroma_key_fragment
	},
	lut3D: {
		uniforms: { ...UniformsLib.common, ...UniformsLib.lut },
		vertexShader: ShaderChunk.common_vertex,
		fragmentShader: ShaderChunk.lut_3d_fragment
	}
};
