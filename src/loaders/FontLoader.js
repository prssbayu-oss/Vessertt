/**
 * FontLoader dynamically injects and loads font faces into the document.
 */
class FontLoader {

	constructor() {

		this.loadedFonts = new Set();

	}

	async load( fontName, url ) {

		if ( typeof document === 'undefined' || typeof FontFace === 'undefined' ) {

			return null;

		}

		if ( this.loadedFonts.has( fontName ) ) {

			return fontName;

		}

		try {

			const font = new FontFace( fontName, `url(${url})` );
			const loadedFace = await font.load();
			document.fonts.add( loadedFace );
			this.loadedFonts.add( fontName );
			return loadedFace;

		} catch ( err ) {

			console.warn( `FontLoader: Could not load font ${fontName} from ${url}`, err );
			return null;

		}

	}

	has( fontName ) {

		return this.loadedFonts.has( fontName );

	}

}

export { FontLoader };
