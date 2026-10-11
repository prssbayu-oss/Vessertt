/**
 * VessertID Sound Engine
 * Analogous to Three.js Audio / AudioListener
 */

export class SoundEngine {
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
