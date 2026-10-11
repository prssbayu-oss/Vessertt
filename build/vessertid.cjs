/**
 * VessertID — The Social Media Engine & Creative Asset Architecture
 * Version: 2026.1.0
 * (c) 2026 VessertID Creative Studio. Released under MIT License.
 * Architecture inspired by Three.js by Mr. Doob
 */

/**
 * VessertID Social Media Platform Presets & Aspect Ratios
 * Inspired by Three.js Constants architecture
 */

const AspectRatios = {
  STORY_REELS_TIKTOK: { width: 1080, height: 1920, ratio: '9:16', name: 'Vertical Reel/Short' },
  FEED_PORTRAIT:      { width: 1080, height: 1350, ratio: '4:5',  name: 'Instagram Carousel' },
  FEED_SQUARE:        { width: 1080, height: 1080, ratio: '1:1',  name: 'Square Feed' },
  YOUTUBE_LANDSCAPE:  { width: 1920, height: 1080, ratio: '16:9', name: 'YouTube Video' },
  YOUTUBE_THUMBNAIL:  { width: 1280, height: 720,  ratio: '16:9', name: 'YouTube Thumbnail' },
  HEADER_TWITTER_X:   { width: 1500, height: 500,  ratio: '3:1',  name: 'X Header' },
  BANNER_LINKEDIN:    { width: 1584, height: 396,  ratio: '4:1',  name: 'LinkedIn Banner' }
};

const SafeZones = {
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

const LayerTypes = {
  BACKGROUND: 'background',
  MEDIA: 'media',
  OVERLAY: 'overlay',
  TYPOGRAPHY: 'typography',
  AUDIO: 'audio',
  BRAND: 'brand',
  MOTION: 'motion'
};

/**
 * VessertID Layer System
 * Analogous to Three.js Object3D / Mesh hierarchy
 */


class Layer {
  constructor(options = {}) {
    this.id = options.id || 'layer_' + Math.random().toString(36).substr(2, 9);
    this.name = options.name || 'Unnamed Layer';
    this.type = options.type || LayerTypes.MEDIA;
    this.visible = options.visible !== false;
    this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
    this.zIndex = options.zIndex || 0;
    this.blendMode = options.blendMode || 'source-over';
    this.transform = {
      x: options.x || 0,
      y: options.y || 0,
      scaleX: options.scaleX || 1,
      scaleY: options.scaleY || 1,
      rotation: options.rotation || 0
    };
  }

  setOpacity(val) {
    this.opacity = Math.max(0, Math.min(1, val));
    return this;
  }

  setPosition(x, y) {
    this.transform.x = x;
    this.transform.y = y;
    return this;
  }

  setScale(s) {
    this.transform.scaleX = s;
    this.transform.scaleY = s;
    return this;
  }
}

class ImageLayer extends Layer {
  constructor(src, options = {}) {
    super({ ...options, type: LayerTypes.MEDIA });
    this.src = src;
    this.image = null;
    this.isLoaded = false;
  }

  async load() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.image = img;
        this.isLoaded = true;
        resolve(this);
      };
      img.onerror = reject;
      img.src = this.src;
    });
  }
}

class TextLayer extends Layer {
  constructor(text, options = {}) {
    super({ ...options, type: LayerTypes.TYPOGRAPHY });
    this.text = text;
    this.fontFamily = options.fontFamily || 'sans-serif';
    this.fontSize = options.fontSize || 48;
    this.color = options.color || '#FFFFFF';
    this.align = options.align || 'center';
    this.lineHeight = options.lineHeight || 1.2;
    this.letterSpacing = options.letterSpacing || 0;
  }
}

/**
 * VessertID Social Canvas
 * Analogous to Three.js Scene & WebGLRenderer
 */


class SocialCanvas {
  constructor(options = {}) {
    this.preset = options.preset || AspectRatios.STORY_REELS_TIKTOK;
    this.width = options.width || this.preset.width;
    this.height = options.height || this.preset.height;
    this.duration = options.duration || 15.0; // In seconds
    this.layers = [];
    this.domElement = document.createElement('canvas');
    this.domElement.width = this.width;
    this.domElement.height = this.height;
    this.ctx = this.domElement.getContext('2d');
  }

  setPreset(preset) {
    this.preset = preset;
    this.width = preset.width;
    this.height = preset.height;
    this.domElement.width = this.width;
    this.domElement.height = this.height;
    return this;
  }

  add(layer) {
    this.layers.push(layer);
    this.layers.sort((a, b) => a.zIndex - b.zIndex);
    return this;
  }

  remove(layer) {
    const idx = this.layers.indexOf(layer);
    if (idx !== -1) {
      this.layers.splice(idx, 1);
    }
    return this;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const layer of this.layers) {
      if (!layer.visible) continue;

      this.ctx.save();
      this.ctx.globalAlpha = layer.opacity;
      this.ctx.globalCompositeOperation = layer.blendMode;

      // Handle layer transformations
      this.ctx.translate(layer.transform.x, layer.transform.y);
      if (layer.transform.rotation) {
        this.ctx.rotate((layer.transform.rotation * Math.PI) / 180);
      }
      this.ctx.scale(layer.transform.scaleX, layer.transform.scaleY);

      if (layer.image && layer.isLoaded) {
        this.ctx.drawImage(layer.image, 0, 0, this.width, this.height);
      } else if (layer.text) {
        this.ctx.font = `${layer.fontSize}px '${layer.fontFamily}'`;
        this.ctx.fillStyle = layer.color;
        this.ctx.textAlign = layer.align;
        this.ctx.fillText(layer.text, this.width / 2, this.height / 2);
      }

      this.ctx.restore();
    }
  }

  toDataURL(format = 'image/png') {
    this.render();
    return this.domElement.toDataURL(format);
  }
}

/**
 * VessertID Sound Engine
 * Analogous to Three.js Audio / AudioListener
 */

class SoundEngine {
  constructor() {
    this.audioContext = null;
    this.tracks = new Map();
    this.masterGain = null;
  }

  init() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
      }
    }
  }

  setMasterVolume(val) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(val, this.audioContext.currentTime);
    }
  }

  async loadTrack(id, url) {
    this.init();
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.tracks.set(id, audioBuffer);
    return audioBuffer;
  }

  play(id, loop = false, volume = 1.0) {
    this.init();
    const buffer = this.tracks.get(id);
    if (!buffer) return null;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.loop = loop;
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
    return source;
  }
}

/**
 * VessertID Font Manager
 * Analogous to Three.js FontLoader
 */

class FontManager {
  constructor() {
    this.loadedFonts = new Set();
  }

  async load(fontName, fontUrl) {
    if (this.loadedFonts.has(fontName)) return;

    if (typeof FontFace !== 'undefined') {
      const font = new FontFace(fontName, `url(${fontUrl})`);
      const loadedFace = await font.load();
      document.fonts.add(loadedFace);
      this.loadedFonts.add(fontName);
      return loadedFace;
    }
  }

  isLoaded(fontName) {
    return this.loadedFonts.has(fontName);
  }
}

const REVISION = '2026.1';

module.exports = { AspectRatios, SafeZones, LayerTypes, Layer, ImageLayer, TextLayer, SocialCanvas, SoundEngine, FontManager, REVISION };
