class Loader {
	constructor() {
		this.crossOrigin = 'anonymous';
		this.path = '';
	}

	setPath( path ) {
		this.path = path;
		return this;
	}
}

export { Loader };
