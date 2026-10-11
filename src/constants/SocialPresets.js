/**
 * VessertID Social Media Platform Presets & Aspect Ratios
 * Inspired by Three.js Constants architecture
 */

export const AspectRatios = {
  STORY_REELS_TIKTOK: { width: 1080, height: 1920, ratio: '9:16', name: 'Vertical Reel/Short' },
  FEED_PORTRAIT:      { width: 1080, height: 1350, ratio: '4:5',  name: 'Instagram Carousel' },
  FEED_SQUARE:        { width: 1080, height: 1080, ratio: '1:1',  name: 'Square Feed' },
  YOUTUBE_LANDSCAPE:  { width: 1920, height: 1080, ratio: '16:9', name: 'YouTube Video' },
  YOUTUBE_THUMBNAIL:  { width: 1280, height: 720,  ratio: '16:9', name: 'YouTube Thumbnail' },
  HEADER_TWITTER_X:   { width: 1500, height: 500,  ratio: '3:1',  name: 'X Header' },
  BANNER_LINKEDIN:    { width: 1584, height: 396,  ratio: '4:1',  name: 'LinkedIn Banner' }
};

export const SafeZones = {
  VERTICAL_9_16: {
    top: 150,     // Platform search / back button
    bottom: 220,  // Audio ticker / caption area
    right: 120,   // Like, comment, share icon column
    left: 40      // Left margin
  },
  PORTRAIT_4_5: {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40
  }
};

export const LayerTypes = {
  BACKGROUND: 'background',
  MEDIA: 'media',
  OVERLAY: 'overlay',
  TYPOGRAPHY: 'typography',
  AUDIO: 'audio',
  BRAND: 'brand',
  MOTION: 'motion'
};
