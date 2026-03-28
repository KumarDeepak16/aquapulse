import { useCallback, useEffect } from 'react';
import { soundManager } from '@/lib/sound-manager';
import { useApp } from '@/context/AppContext';

export function useSound() {
  const { settings } = useApp();

  useEffect(() => {
    soundManager.setVolume(settings.soundVolume ?? 0.7);
  }, [settings.soundVolume]);

  // Preload sounds on first user interaction
  useEffect(() => {
    const preload = () => soundManager.preload();
    document.addEventListener('click', preload, { once: true });
    document.addEventListener('touchstart', preload, { once: true });
    return () => {
      document.removeEventListener('click', preload);
      document.removeEventListener('touchstart', preload);
    };
  }, []);

  const play = useCallback(
    (soundName) => {
      if (!settings.soundEnabled) return;
      soundManager.play(soundName);
    },
    [settings.soundEnabled]
  );

  return { play };
}
