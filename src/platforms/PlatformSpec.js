class PlatformSpec {
	constructor( name, width, height, safeZone ) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		this.safeZone = safeZone;
	}
}

export { PlatformSpec };
