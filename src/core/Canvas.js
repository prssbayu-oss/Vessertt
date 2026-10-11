/**
 * VessertID Social Canvas
 * Analogous to Three.js Scene & WebGLRenderer
 */

import { AspectRatios } from '../constants/SocialPresets.js';

export class SocialCanvas {
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
