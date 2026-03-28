import { useCallback, useEffect } from 'react';
import { soundManager } from '@/lib/sound-manager';
import { useApp } from '@/context/AppContext';

export function useSound() {
  const { settings } = useApp();

  useEffect(() => {
    soundManager.setVolume(settings.soundVolume);
  }, [settings.soundVolume]);

  useEffect(() => {
    const handleInteraction = () => soundManager.unlock();
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
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
