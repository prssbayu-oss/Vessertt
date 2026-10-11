/**
 * VessertID Font Manager
 * Analogous to Three.js FontLoader
 */

export class FontManager {
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
