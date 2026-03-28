import { useMemo } from 'react';
import { getWeekDays } from '@/lib/date-utils';
import { useWaterTracker } from './useWaterTracker';
import { useApp } from '@/context/AppContext';

export function useWeeklySummary() {
  const { getTotalForDate } = useWaterTracker();
  const { profile } = useApp();
  const weekDays = getWeekDays();

  const weeklyData = useMemo(() => {
    return weekDays.map((day) => {
      const total = getTotalForDate(day.key);
      return {
        ...day,
        total,
        goal: profile.dailyWaterGoal,
        percentage: profile.dailyWaterGoal > 0
          ? Math.round((total / profile.dailyWaterGoal) * 100)
          : 0,
        goalMet: total >= profile.dailyWaterGoal,
      };
    });
  }, [weekDays, getTotalForDate, profile.dailyWaterGoal]);

  const stats = useMemo(() => {
    const totals = weeklyData.map((d) => d.total);
    const daysWithData = totals.filter((t) => t > 0);
    const goalMetDays = weeklyData.filter((d) => d.goalMet).length;

    return {
      average: daysWithData.length > 0
        ? Math.round(daysWithData.reduce((a, b) => a + b, 0) / daysWithData.length)
        : 0,
      best: Math.max(...totals, 0),
      goalMetDays,
      completionRate: weeklyData.length > 0
        ? Math.round((goalMetDays / weeklyData.length) * 100)
        : 0,
    };
  }, [weeklyData]);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = weeklyData.length - 1; i >= 0; i--) {
      if (weeklyData[i].goalMet) count++;
      else if (weeklyData[i].total > 0 || weeklyData[i].isToday) {
        if (!weeklyData[i].goalMet && !weeklyData[i].isToday) break;
        if (weeklyData[i].isToday && !weeklyData[i].goalMet) break;
      } else break;
    }
    return count;
  }, [weeklyData]);

  return { weeklyData, stats, streak };
}
