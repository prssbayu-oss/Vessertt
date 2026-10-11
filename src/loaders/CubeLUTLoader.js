import { Loader } from './Loader.js';

class CubeLUTLoader extends Loader {
	async load( url ) {
		const resp = await fetch( this.path + url );
		const text = await resp.text();
		return this.parse( text );
	}

	parse( text ) {
		const lines = text.split( '\n' );
		let size = 0;
		const data = [];
		for ( let line of lines ) {
			line = line.trim();
			if ( line.startsWith( 'LUT_3D_SIZE' ) ) {
				size = parseInt( line.split( /\s+/ )[ 1 ], 10 );
			} else if ( line && ! line.startsWith( '#' ) && ! line.startsWith( 'TITLE' ) ) {
				const parts = line.split( /\s+/ ).map( Number );
				if ( parts.length === 3 ) {
					data.push( ...parts, 1.0 );
				}
			}
		}
		return { size, data: new Float32Array( data ) };
	}
}

export { CubeLUTLoader };
