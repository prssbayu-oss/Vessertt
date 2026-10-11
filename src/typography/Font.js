class Font {
	constructor( name, url ) {
		this.name = name;
		this.url = url;
		this.isLoaded = false;
	}

	async load() {
		if ( typeof document !== 'undefined' && typeof FontFace !== 'undefined' ) {
			const face = new FontFace( this.name, `url(${this.url})` );
			await face.load();
			document.fonts.add( face );
			this.isLoaded = true;
		}
		return this;
	}
}

export { Font };
