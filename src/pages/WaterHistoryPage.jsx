import { useState, useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { useApp } from '@/context/AppContext';
import { Droplets, ChevronLeft, ChevronRight, CalendarDays, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WaterHistoryPage() {
  const { getEntriesForDate, getTotalForDate } = useWaterTracker();
  const { profile } = useApp();
  const [dayOffset, setDayOffset] = useState(0);
  const selectedDate = useMemo(() => subDays(new Date(), dayOffset), [dayOffset]);
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const entries = getEntriesForDate(dateKey);
  const total = getTotalForDate(dateKey);
  const isToday = dayOffset === 0;
  const pct = profile.dailyWaterGoal > 0 ? Math.min(100, Math.round((total / profile.dailyWaterGoal) * 100)) : 0;
  const goalMet = total >= profile.dailyWaterGoal;
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="pb-safe">
      <PageHeader title="History" subtitle="Past intake" showBack />
      <div className="px-4 mt-2 space-y-3">
        {/* Date nav */}
        <div className="flex items-center justify-between glass-card p-2.5">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg press-scale" onClick={() => setDayOffset((d) => d + 1)}><ChevronLeft size={16} /></Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1"><CalendarDays size={12} className="text-primary" /><span className="text-xs font-semibold">{isToday ? 'Today' : format(selectedDate, 'EEEE')}</span></div>
            <p className="text-[10px] text-muted-foreground">{format(selectedDate, 'MMM d, yyyy')}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg press-scale" onClick={() => setDayOffset((d) => Math.max(0, d - 1))} disabled={isToday}><ChevronRight size={16} /></Button>
        </div>
        {/* Summary */}
        <div className={`rounded-2xl p-4 text-center ${goalMet ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800' : 'glass-card'}`}>
          <div className="flex items-center justify-center gap-5 mb-2">
            <div><p className="text-2xl font-heading font-bold">{total}</p><p className="text-[9px] text-muted-foreground uppercase tracking-wider">ml</p></div>
            <div className="w-px h-8 bg-border" />
            <div><p className={`text-2xl font-heading font-bold ${goalMet ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>{pct}%</p><p className="text-[9px] text-muted-foreground uppercase tracking-wider">goal</p></div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 animate-spring" style={{ width: `${pct}%`, background: goalMet ? 'var(--success)' : 'var(--primary)' }} />
          </div>
          <div className="flex justify-between mt-1"><span className="text-[9px] text-muted-foreground">0</span><span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Target size={8} />{profile.dailyWaterGoal}ml</span></div>
        </div>
        {/* Entries */}
        <div>
          <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-semibold">Entries</h3><span className="text-[10px] text-muted-foreground">{entries.length}</span></div>
          {entries.length === 0
            ? <div className="glass-card p-6 text-center"><Droplets size={20} className="text-muted-foreground/25 mx-auto mb-1" /><p className="text-xs text-muted-foreground">No logs</p></div>
            : <div className="glass-card p-2.5 space-y-1">
                {sorted.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/40 stagger-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center"><Droplets size={10} className="text-blue-500 dark:text-blue-400" /></div>
                    <span className="text-xs font-semibold">{e.amount}ml</span>
                    <span className="text-[10px] text-muted-foreground">{format(parseISO(e.timestamp), 'h:mm a')}</span>
                  </div>
                ))}
              </div>}
        </div>
        {/* 7 day grid */}
        <div>
          <h3 className="text-xs font-semibold mb-2">Last 7 Days</h3>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = subDays(new Date(), i), k = format(d, 'yyyy-MM-dd'), t = getTotalForDate(k);
              const met = t >= profile.dailyWaterGoal, sel = i === dayOffset;
              return (
                <button key={i} onClick={() => setDayOffset(i)} className={`flex flex-col items-center p-1.5 rounded-lg press-scale transition-colors ${sel ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <span className="text-[8px] font-medium opacity-70">{i === 0 ? 'Today' : format(d, 'EEE')}</span>
                  <span className="text-[10px] font-bold">{format(d, 'd')}</span>
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${met ? (sel ? 'bg-white' : 'bg-emerald-500') : t > 0 ? (sel ? 'bg-white/50' : 'bg-blue-400/40') : 'bg-muted'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
