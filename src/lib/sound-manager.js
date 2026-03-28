import { SOUNDS } from './constants';

class SoundManager {
  constructor() {
    this.cache = {};
    this.volume = 0.7;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Object.values(this.cache).forEach((a) => { a.volume = this.volume; });
  }

  _getAudio(soundName) {
    if (this.cache[soundName]) return this.cache[soundName];
    const src = SOUNDS[soundName];
    if (!src) return null;
    const audio = new Audio(src.file);
    audio.preload = 'auto';
    audio.volume = this.volume;
    this.cache[soundName] = audio;
    return audio;
  }

  // Preload all sounds into cache
  preload() {
    Object.keys(SOUNDS).forEach((key) => this._getAudio(key));
  }

  play(soundName) {
    const audio = this._getAudio(soundName);
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = this.volume;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
  }
}

export const soundManager = new SoundManager();
