import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS, DEFAULT_PROFILE, DEFAULT_SETTINGS } from '@/lib/constants';

const AppContext = createContext(null);

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
  // Update meta theme-color for mobile browser chrome
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const isDark = root.classList.contains('dark');
    meta.setAttribute('content', isDark ? '#1a1a2e' : '#f4f4f8');
  }
}

export function AppProvider({ children }) {
  const [profile, setProfileState] = useState(() =>
    getItem(STORAGE_KEYS.USER_PROFILE, DEFAULT_PROFILE)
  );
  const [settings, setSettingsState] = useState(() =>
    getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [isDark, setIsDark] = useState(false);

  const setProfile = useCallback((updater) => {
    setProfileState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setItem(STORAGE_KEYS.USER_PROFILE, next);
      return next;
    });
  }, []);

  const setSettings = useCallback((updater) => {
    setSettingsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setItem(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setSettingsState((prev) => {
      // Cycle: light → dark → system → light
      const order = ['light', 'dark', 'system'];
      const idx = order.indexOf(prev.theme);
      const next = { ...prev, theme: order[(idx + 1) % order.length] };
      setItem(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  // Apply theme on change + listen for system changes
  useEffect(() => {
    applyTheme(settings.theme);
    setIsDark(document.documentElement.classList.contains('dark'));

    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        applyTheme('system');
        setIsDark(document.documentElement.classList.contains('dark'));
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [settings.theme]);

  return (
    <AppContext.Provider value={{ profile, setProfile, settings, setSettings, toggleTheme, isDark }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
