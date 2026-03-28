import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { getTodayKey } from '@/lib/date-utils';

export function useWaterTracker() {
  const [waterLog, setWaterLog] = useLocalStorage(STORAGE_KEYS.WATER_LOG, {
    version: 1,
    entries: {},
  });

  const todayKey = getTodayKey();
  const todayEntries = useMemo(() => waterLog.entries[todayKey] || [], [waterLog, todayKey]);

  const todayTotal = useMemo(
    () => todayEntries.reduce((sum, e) => sum + e.amount, 0),
    [todayEntries]
  );

  const addWater = useCallback(
    (amount) => {
      const entry = {
        id: crypto.randomUUID(),
        amount,
        timestamp: new Date().toISOString(),
      };
      setWaterLog((prev) => ({
        ...prev,
        entries: {
          ...prev.entries,
          [todayKey]: [...(prev.entries[todayKey] || []), entry],
        },
      }));
      return entry;
    },
    [todayKey, setWaterLog]
  );

  const removeWater = useCallback(
    (entryId) => {
      setWaterLog((prev) => ({
        ...prev,
        entries: {
          ...prev.entries,
          [todayKey]: (prev.entries[todayKey] || []).filter((e) => e.id !== entryId),
        },
      }));
    },
    [todayKey, setWaterLog]
  );

  const getEntriesForDate = useCallback(
    (dateKey) => waterLog.entries[dateKey] || [],
    [waterLog]
  );

  const getTotalForDate = useCallback(
    (dateKey) => (waterLog.entries[dateKey] || []).reduce((sum, e) => sum + e.amount, 0),
    [waterLog]
  );

  return {
    waterLog,
    todayEntries,
    todayTotal,
    addWater,
    removeWater,
    getEntriesForDate,
    getTotalForDate,
  };
}
