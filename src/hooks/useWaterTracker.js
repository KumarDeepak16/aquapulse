import { useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { getTodayKey } from '@/lib/date-utils';
import { format, subDays } from 'date-fns';

const KEEP_DAYS = 10;

export function useWaterTracker() {
  const [waterLog, setWaterLog] = useLocalStorage(STORAGE_KEYS.WATER_LOG, {
    version: 1,
    entries: {},
  });

  // Auto-cleanup: keep only last 10 days of detailed entries
  // Profile/scoring still tracks totals via daily scores
  useEffect(() => {
    const validKeys = new Set();
    for (let i = 0; i < KEEP_DAYS; i++) {
      validKeys.add(format(subDays(new Date(), i), 'yyyy-MM-dd'));
    }
    const currentKeys = Object.keys(waterLog.entries || {});
    const staleKeys = currentKeys.filter((k) => !validKeys.has(k));

    if (staleKeys.length > 0) {
      setWaterLog((prev) => {
        const cleaned = { ...prev.entries };
        staleKeys.forEach((k) => delete cleaned[k]);
        return { ...prev, entries: cleaned };
      });
    }
  }, []); // Run once on mount

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
