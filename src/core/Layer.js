/**
 * VessertID Layer System
 * Analogous to Three.js Object3D / Mesh hierarchy
 */

import { LayerTypes } from '../constants/SocialPresets.js';

export class Layer {
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

export class ImageLayer extends Layer {
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

export class TextLayer extends Layer {
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
