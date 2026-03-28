import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage(STORAGE_KEYS.NOTES, {
    version: 1,
    items: [],
  });

  const addNote = useCallback(
    (note) => {
      const newNote = {
        id: crypto.randomUUID(),
        title: '',
        content: '',
        reminderId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...note,
      };
      setNotes((prev) => ({
        ...prev,
        items: [newNote, ...prev.items],
      }));
      return newNote;
    },
    [setNotes]
  );

  const updateNote = useCallback(
    (id, updates) => {
      setNotes((prev) => ({
        ...prev,
        items: prev.items.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        ),
      }));
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => ({
        ...prev,
        items: prev.items.filter((n) => n.id !== id),
      }));
    },
    [setNotes]
  );

  const searchNotes = useCallback(
    (query) => {
      if (!query) return notes.items;
      const q = query.toLowerCase();
      return notes.items.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    },
    [notes.items]
  );

  return {
    notes: notes.items,
    addNote,
    updateNote,
    deleteNote,
    searchNotes,
  };
}
