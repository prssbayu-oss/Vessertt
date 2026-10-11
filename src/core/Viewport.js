class Viewport {
	constructor( width = 1080, height = 1920 ) {
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
	}

	setSize( width, height ) {
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		return this;
	}
}

export { Viewport };
