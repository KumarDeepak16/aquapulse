import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

export function useReminders() {
  const [reminders, setReminders] = useLocalStorage(STORAGE_KEYS.REMINDERS, {
    version: 1,
    items: [],
  });

  const addReminder = useCallback(
    (reminder) => {
      const newReminder = {
        id: crypto.randomUUID(),
        title: '',
        notes: '',
        time: '09:00',
        days: [1, 2, 3, 4, 5],
        sound: 'gentle-bell',
        enabled: true,
        createdAt: new Date().toISOString(),
        ...reminder,
      };
      setReminders((prev) => ({
        ...prev,
        items: [...prev.items, newReminder],
      }));
      return newReminder;
    },
    [setReminders]
  );

  const updateReminder = useCallback(
    (id, updates) => {
      setReminders((prev) => ({
        ...prev,
        items: prev.items.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      }));
    },
    [setReminders]
  );

  const deleteReminder = useCallback(
    (id) => {
      setReminders((prev) => ({
        ...prev,
        items: prev.items.filter((r) => r.id !== id),
      }));
    },
    [setReminders]
  );

  const toggleReminder = useCallback(
    (id) => {
      setReminders((prev) => ({
        ...prev,
        items: prev.items.map((r) =>
          r.id === id ? { ...r, enabled: !r.enabled } : r
        ),
      }));
    },
    [setReminders]
  );

  return {
    reminders: reminders.items,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
  };
}
