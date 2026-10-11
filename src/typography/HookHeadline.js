class HookHeadline {
	constructor( text = 'VIRAL HOOK', options = {} ) {
		this.text = text;
		this.font = options.font || 'Bebas Neue';
		this.size = options.size || 72;
		this.color = options.color || '#FFFFFF';
		this.strokeColor = options.strokeColor || '#000000';
		this.strokeWidth = options.strokeWidth || 8;
	}
}

export { HookHeadline };
