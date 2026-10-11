import { Color } from '../math/Color.js';

class ChromaKeyer {
	constructor( keyColor = new Color( 0, 1, 0 ), threshold = 0.4, smoothing = 0.1 ) {
		this.keyColor = keyColor;
		this.threshold = threshold;
		this.smoothing = smoothing;
	}

	applyToImageData( imageData ) {
		const data = imageData.data;
		const kr = this.keyColor.r * 255;
		const kg = this.keyColor.g * 255;
		const kb = this.keyColor.b * 255;

		for ( let i = 0; i < data.length; i += 4 ) {
			const r = data[ i ];
			const g = data[ i + 1 ];
			const b = data[ i + 2 ];
			const dist = Math.sqrt( ( r - kr ) ** 2 + ( g - kg ) ** 2 + ( b - kb ) ** 2 ) / 441.67;
			if ( dist < this.threshold ) {
				data[ i + 3 ] = 0;
			}
		}
		return imageData;
	}
}

export { ChromaKeyer };
