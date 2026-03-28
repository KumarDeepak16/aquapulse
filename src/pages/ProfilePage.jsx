import { useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { useApp } from '@/context/AppContext';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { useReminders } from '@/hooks/useReminders';
import { useNotes } from '@/hooks/useNotes';
import { calculateBMI, getBMICategory } from '@/lib/calculations';
import { format, subDays } from 'date-fns';
import { User, Droplets, Target, Flame, Bell, StickyNote, Activity, TrendingUp, Calendar, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { profile } = useApp();
  const { getTotalForDate } = useWaterTracker();
  const { reminders } = useReminders();
  const { notes } = useNotes();
  const navigate = useNavigate();

  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);
  const activeReminders = reminders.filter((r) => r.enabled).length;

  // Last 30 days stats
  const monthStats = useMemo(() => {
    let totalDays = 0, goalDays = 0, totalMl = 0, bestDay = 0;
    for (let i = 0; i < 30; i++) {
      const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const t = getTotalForDate(key);
      if (t > 0) totalDays++;
      if (t >= profile.dailyWaterGoal) goalDays++;
      totalMl += t;
      if (t > bestDay) bestDay = t;
    }
    return {
      activeDays: totalDays,
      goalDays,
      totalLiters: (totalMl / 1000).toFixed(1),
      avgDaily: totalDays > 0 ? Math.round(totalMl / totalDays) : 0,
      bestDay,
      consistency: totalDays > 0 ? Math.round((goalDays / totalDays) * 100) : 0,
    };
  }, [getTotalForDate, profile.dailyWaterGoal]);

  // Current streak
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
      if (getTotalForDate(key) >= profile.dailyWaterGoal) count++;
      else if (i > 0) break;
    }
    return count;
  }, [getTotalForDate, profile.dailyWaterGoal]);

  const bmiColor = bmiCat.label === 'Normal' ? 'text-emerald-600 dark:text-emerald-400'
    : bmiCat.label === 'Underweight' || bmiCat.label === 'Overweight' ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-500';

  return (
    <div className="pb-safe">
      <PageHeader title="Profile" subtitle="Your wellness overview" showBack />
      <div className="px-4 space-y-3 mt-2">

        {/* Avatar + name */}
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0">
            <span className="text-xl font-heading font-bold text-white">
              {profile.name ? profile.name[0].toUpperCase() : 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading font-bold truncate">{profile.name || 'AquaPulse User'}</p>
            <p className="text-[10px] text-muted-foreground">{profile.weight}kg · {profile.height}cm · {profile.age}yr</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-semibold ${bmiColor}`}>BMI {bmi} · {bmiCat.label}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 h-7 rounded-lg text-[10px]" onClick={() => navigate('/settings')}>
            Edit
          </Button>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Target, value: profile.dailyWaterGoal, unit: 'ml', label: 'Goal', color: 'text-primary' },
            { icon: Flame, value: streak, unit: 'd', label: 'Streak', color: 'text-amber-500' },
            { icon: Bell, value: activeReminders, unit: '', label: 'Active', color: 'text-secondary' },
            { icon: StickyNote, value: notes.length, unit: '', label: 'Notes', color: 'text-accent' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-2.5 text-center">
              <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
              <p className="text-sm font-heading font-bold">{s.value}<span className="text-[9px] text-muted-foreground font-normal">{s.unit}</span></p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 30-day analytics */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
              <Calendar size={12} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xs font-semibold">30-Day Analytics</h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <p className="text-lg font-heading font-bold">{monthStats.totalLiters}</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Liters Total</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <p className="text-lg font-heading font-bold">{monthStats.avgDaily}</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Avg ml/day</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <p className="text-lg font-heading font-bold">{monthStats.bestDay}</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Best Day ml</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Active Days</span>
                <span className="text-[10px] font-semibold">{monthStats.activeDays}/30</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(monthStats.activeDays / 30) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Goals Met</span>
                <span className="text-[10px] font-semibold">{monthStats.goalDays}/30</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${(monthStats.goalDays / 30) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Consistency</span>
                <span className="text-[10px] font-semibold">{monthStats.consistency}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${monthStats.consistency}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Body metrics */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/15 flex items-center justify-center">
              <Activity size={12} className="text-accent" />
            </div>
            <h3 className="text-xs font-semibold">Body Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-[9px] text-muted-foreground">BMI</p>
              <p className="text-sm font-bold">{bmi} <span className={`text-[10px] font-semibold ${bmiColor}`}>{bmiCat.label}</span></p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-[9px] text-muted-foreground">Activity</p>
              <p className="text-sm font-bold capitalize">{profile.activityLevel}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-[9px] text-muted-foreground">Ideal Weight</p>
              <p className="text-sm font-bold">{Math.round(18.5 * (profile.height / 100) ** 2)} - {Math.round(24.9 * (profile.height / 100) ** 2)} kg</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-[9px] text-muted-foreground">Daily Goal</p>
              <p className="text-sm font-bold">{profile.dailyWaterGoal} ml</p>
            </div>
          </div>
        </div>

        {/* Achievement */}
        {streak >= 3 && (
          <div className="glass-card p-4 flex items-center gap-3 stagger-in">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Award size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold">{streak >= 7 ? 'Hydration Champion!' : 'Great Progress!'}</p>
              <p className="text-[10px] text-muted-foreground">{streak} day streak — keep it going!</p>
            </div>
          </div>
        )}

        <div className="text-center py-3">
          <p className="text-[10px] text-muted-foreground">AquaPulse v1.0.0 · Made by <a href="https://1619.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">1619.in</a></p>
        </div>
      </div>
    </div>
  );
}
