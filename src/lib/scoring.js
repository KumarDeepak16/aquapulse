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
  if (score >= 95) return { rank: 'S', label: 'Legendary', color: '#f59e0b', bg: 'from-amber-500 to-orange-500', emoji: '👑' };
  if (score >= 80) return { rank: 'A', label: 'Excellent', color: '#22c55e', bg: 'from-emerald-500 to-teal-500', emoji: '🏆' };
  if (score >= 60) return { rank: 'B', label: 'Great', color: '#3b82f6', bg: 'from-blue-500 to-indigo-500', emoji: '💪' };
  if (score >= 40) return { rank: 'C', label: 'Good Start', color: '#a855f7', bg: 'from-purple-500 to-pink-500', emoji: '🌱' };
  if (score >= 20) return { rank: 'D', label: 'Building', color: '#f97316', bg: 'from-orange-500 to-red-500', emoji: '🔥' };
  return { rank: 'F', label: 'New Journey', color: '#ef4444', bg: 'from-red-500 to-rose-600', emoji: '💧' };
}

export function calculateStreakData(getTotalForDate, goal, days = 30) {
  let maxStreak = 0;
  let currentStreak = 0;
  let totalScore = 0;
  let activeDays = 0;
  let goalDays = 0;
  let totalMl = 0;

  const dailyScores = [];

  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const total = getTotalForDate(key);
    const score = calculateDailyScore(total, goal);
    dailyScores.push({ day: i, score, total });
    totalMl += total;

    if (total > 0) activeDays++;
    if (total >= goal) {
      goalDays++;
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
    totalScore += score;
  }

  // Current streak from today
  let streak = 0;
  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
    if (getTotalForDate(key) >= goal) streak++;
    else if (i > 0) break;
    else break;
  }

  const avgScore = activeDays > 0 ? Math.round(totalScore / Math.min(activeDays, days)) : 0;
  const overallRank = getScoreRank(avgScore);
  const totalLiters = (totalMl / 1000).toFixed(1);

  return { streak, maxStreak, avgScore, overallRank, activeDays, goalDays, dailyScores, totalLiters };
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
