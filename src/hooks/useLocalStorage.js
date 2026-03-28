import { useState, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => getItem(key, initialValue));

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        setItem(key, next);
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
