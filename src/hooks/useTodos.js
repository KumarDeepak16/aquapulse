import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const KEY = 'AQUAPULSE_TODOS';

export function useTodos() {
  const [todos, setTodos] = useLocalStorage(KEY, { version: 1, items: [] });

  const addTodo = useCallback((text) => {
    const item = { id: crypto.randomUUID(), text, done: false, createdAt: new Date().toISOString() };
    setTodos((prev) => ({ ...prev, items: [item, ...prev.items] }));
    return item;
  }, [setTodos]);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) => ({
      ...prev,
      items: prev.items.map((t) => t.id === id ? { ...t, done: !t.done } : t),
    }));
  }, [setTodos]);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => ({ ...prev, items: prev.items.filter((t) => t.id !== id) }));
  }, [setTodos]);

  const updateTodo = useCallback((id, text) => {
    setTodos((prev) => ({
      ...prev,
      items: prev.items.map((t) => t.id === id ? { ...t, text } : t),
    }));
  }, [setTodos]);

  const clearDone = useCallback(() => {
    setTodos((prev) => ({ ...prev, items: prev.items.filter((t) => !t.done) }));
  }, [setTodos]);

  return { todos: todos.items, addTodo, toggleTodo, deleteTodo, updateTodo, clearDone };
}
