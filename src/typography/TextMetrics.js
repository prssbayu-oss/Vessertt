class TextMetrics {
	static measure( text, font, size, ctx ) {
		if ( ! ctx ) return { width: text.length * size * 0.6, height: size };
		ctx.save();
		ctx.font = `${size}px '${font}', sans-serif`;
		const metrics = ctx.measureText( text );
		ctx.restore();
		return {
			width: metrics.width,
			height: size
		};
	}
}

export { TextMetrics };
