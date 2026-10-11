import { Filter } from './Filter.js';

class ColorGrading extends Filter {
	constructor( exposure = 1.0, contrast = 1.0, saturation = 1.0 ) {
		super( 'ColorGrading' );
		this.exposure = exposure;
		this.contrast = contrast;
		this.saturation = saturation;
	}

	apply( ctx, width, height ) {
		if ( ! this.enabled ) return;
		ctx.filter = `brightness(${this.exposure}) contrast(${this.contrast}) saturate(${this.saturation})`;
	}
}

export { ColorGrading };
