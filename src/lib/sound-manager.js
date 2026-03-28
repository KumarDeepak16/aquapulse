import { SOUNDS } from './constants';

class SoundManager {
  constructor() {
    this.cache = {};
    this.unlocked = false;
    this.volume = 0.7;
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.preloadAll();
  }

  preloadAll() {
    Object.entries(SOUNDS).forEach(([key, { file }]) => {
      if (!this.cache[key]) {
        const audio = new Audio(file);
        audio.preload = 'auto';
        audio.load();
        this.cache[key] = audio;
      }
    });
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  play(soundName) {
    if (!this.unlocked) return;
    const src = SOUNDS[soundName];
    if (!src) return;

    try {
      const audio = this.cache[soundName];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = this.volume;
        audio.play().catch(() => {});
      } else {
        const fresh = new Audio(src.file);
        fresh.volume = this.volume;
        fresh.play().catch(() => {});
        this.cache[soundName] = fresh;
      }
    } catch {
      // fail silently
    }
  }
}

export const soundManager = new SoundManager();
