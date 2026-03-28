import { PageHeader } from '@/components/common/PageHeader';
import { WeeklyChart } from '@/components/summary/WeeklyChart';
import { StatsGrid } from '@/components/summary/StatsGrid';
import { StreakBadge } from '@/components/summary/StreakBadge';
import { useWeeklySummary } from '@/hooks/useWeeklySummary';

export function SummaryPage() {
  const { stats, streak } = useWeeklySummary();
  return (
    <div className="pb-safe">
      <PageHeader title="Summary" subtitle="Weekly hydration" showBack />
      <div className="px-4 space-y-3 mt-2">
        {streak > 0 && <div className="flex justify-center slide-up"><StreakBadge streak={streak} /></div>}
        <div className="slide-up" style={{ animationDelay: '80ms' }}><WeeklyChart /></div>
        <div className="slide-up" style={{ animationDelay: '150ms' }}><StatsGrid stats={stats} /></div>
      </div>
    </div>
  );
}
