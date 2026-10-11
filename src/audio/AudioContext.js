let _context = null;

const AudioContext = {
	getContext() {
		if ( _context === null && typeof window !== 'undefined' ) {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if ( AudioCtx ) {
				_context = new AudioCtx();
			}
		}
		return _context;
	},

	setContext( value ) {
		_context = value;
	}
};

export { AudioContext };
