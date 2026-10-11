class Filter {
	constructor( name = 'Filter' ) {
		this.name = name;
		this.enabled = true;
	}

	apply( ctx, width, height ) {
		// Subclass implementation
	}
}

export { Filter };
