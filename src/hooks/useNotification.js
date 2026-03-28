import { useState, useCallback, useEffect } from 'react';

export function useNotification() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notify = useCallback(
    (title, options = {}) => {
      if (permission !== 'granted') return;
      try {
        new Notification(title, {
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          ...options,
        });
      } catch {
        // fail silently on mobile
      }
    },
    [permission]
  );

  return { permission, requestPermission, notify };
}
