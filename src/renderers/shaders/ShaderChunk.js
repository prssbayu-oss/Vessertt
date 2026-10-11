import common_vertex from './ShaderChunk/common_vertex.glsl.js';
import common_fragment from './ShaderChunk/common_fragment.glsl.js';
import color_grading_fragment from './ShaderChunk/color_grading_fragment.glsl.js';
import chroma_key_fragment from './ShaderChunk/chroma_key_fragment.glsl.js';
import lut_3d_fragment from './ShaderChunk/lut_3d_fragment.glsl.js';
import blend_modes_fragment from './ShaderChunk/blend_modes_fragment.glsl.js';
import film_grain_fragment from './ShaderChunk/film_grain_fragment.glsl.js';
import vignette_fragment from './ShaderChunk/vignette_fragment.glsl.js';
import transition_glitch_fragment from './ShaderChunk/transition_glitch_fragment.glsl.js';
import transition_zoom_fragment from './ShaderChunk/transition_zoom_fragment.glsl.js';
import transition_fade_fragment from './ShaderChunk/transition_fade_fragment.glsl.js';
import ken_burns_vertex from './ShaderChunk/ken_burns_vertex.glsl.js';

export const ShaderChunk = {
	common_vertex,
	common_fragment,
	color_grading_fragment,
	chroma_key_fragment,
	lut_3d_fragment,
	blend_modes_fragment,
	film_grain_fragment,
	vignette_fragment,
	transition_glitch_fragment,
	transition_zoom_fragment,
	transition_fade_fragment,
	ken_burns_vertex
};
