import { format, subDays } from 'date-fns';

export function calculateDailyScore(total, goal) {
  if (goal <= 0) return 0;
  const pct = total / goal;
  if (pct >= 1) return 100;
  if (pct >= 0.8) return 80 + (pct - 0.8) * 100;
  if (pct >= 0.5) return 50 + (pct - 0.5) * 100;
  return Math.round(pct * 50);
}

export function getScoreRank(score) {
  if (score >= 95) return { rank: 'S', label: 'Legendary', color: '#f59e0b', bg: 'from-amber-500 to-orange-500' };
  if (score >= 80) return { rank: 'A', label: 'Excellent', color: '#22c55e', bg: 'from-emerald-500 to-teal-500' };
  if (score >= 60) return { rank: 'B', label: 'Good', color: '#3b82f6', bg: 'from-blue-500 to-indigo-500' };
  if (score >= 40) return { rank: 'C', label: 'Fair', color: '#a855f7', bg: 'from-purple-500 to-pink-500' };
  if (score >= 20) return { rank: 'D', label: 'Needs Work', color: '#f97316', bg: 'from-orange-500 to-red-500' };
  return { rank: 'F', label: 'Get Started', color: '#ef4444', bg: 'from-red-500 to-rose-600' };
}

export function calculateStreakData(getTotalForDate, goal, days = 30) {
  let streak = 0;
  let maxStreak = 0;
  let currentStreak = 0;
  let totalScore = 0;
  let activeDays = 0;
  let goalDays = 0;

  const dailyScores = [];

  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const total = getTotalForDate(key);
    const score = calculateDailyScore(total, goal);
    dailyScores.push({ day: i, score, total });

    if (total > 0) activeDays++;
    if (total >= goal) {
      goalDays++;
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      if (i === 0 && total === 0) { /* today not yet, don't break */ }
      else currentStreak = 0;
    }
    totalScore += score;
  }

  // Current streak from today backwards
  streak = 0;
  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const total = getTotalForDate(key);
    if (total >= goal) streak++;
    else if (i > 0) break;
    else break;
  }

  const avgScore = activeDays > 0 ? Math.round(totalScore / Math.min(activeDays, days)) : 0;
  const overallRank = getScoreRank(avgScore);

  return { streak, maxStreak, avgScore, overallRank, activeDays, goalDays, dailyScores };
}

export function encodeScoreCard(data) {
  const payload = JSON.stringify(data);
  return btoa(encodeURIComponent(payload));
}

export function decodeScoreCard(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}
