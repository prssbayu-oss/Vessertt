export const REVISION = '2026.1';

/**
 * Platform aspect ratio presets for Social Media Canvas.
 * @constant
 * @type {Object}
 */
export const AspectRatios = {
	REELS_TIKTOK_9_16: { width: 1080, height: 1920, ratio: '9:16', name: 'Vertical Reel/Shorts/TikTok' },
	CAROUSEL_FEED_4_5: { width: 1080, height: 1350, ratio: '4:5',  name: 'Instagram Portrait Carousel' },
	SQUARE_FEED_1_1:   { width: 1080, height: 1080, ratio: '1:1',  name: 'Square Feed' },
	YOUTUBE_16_9:      { width: 1920, height: 1080, ratio: '16:9', name: 'YouTube Landscape' },
	THUMBNAIL_16_9:    { width: 1280, height: 720,  ratio: '16:9', name: 'YouTube Thumbnail' },
	HEADER_X_3_1:      { width: 1500, height: 500,  ratio: '3:1',  name: 'X / Twitter Header' },
	BANNER_LINKEDIN:   { width: 1584, height: 396,  ratio: '4:1',  name: 'LinkedIn Banner' }
};

/**
 * Standard Safe Zones for UI overlays on social media platforms.
 * @constant
 * @type {Object}
 */
export const SafeZones = {
	VERTICAL_9_16: {
		top: 150,     // Platform search / back icon safe area
		bottom: 220,  // Audio ticker / caption safe area
		right: 120,   // Action column (like, comment, share)
		left: 40
	},
	PORTRAIT_4_5: {
		top: 40,
		bottom: 40,
		right: 40,
		left: 40
	}
};

/**
 * Layer classification types.
 * @constant
 * @type {Object}
 */
export const LayerTypes = {
	BACKGROUND: 'background',
	MEDIA: 'media',
	OVERLAY: 'overlay',
	TYPOGRAPHY: 'typography',
	AUDIO: 'audio',
	BRAND: 'brand',
	MOTION: 'motion'
};
