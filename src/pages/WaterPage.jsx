import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { WaterCalculator } from '@/components/water/WaterCalculator';
import { WaterReminderConfig } from '@/components/water/WaterReminderConfig';
import { WaterHistory } from '@/components/water/WaterHistory';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

export function WaterPage() {
  const { todayEntries, removeWater } = useWaterTracker();
  const navigate = useNavigate();
  return (
    <div className="pb-safe">
      <PageHeader title="Water" subtitle="Track your hydration"
        action={<Button variant="outline" size="sm" className="rounded-lg press-scale gap-1 h-7 text-[10px]" onClick={() => navigate('/water/history')}><History size={12} />History</Button>} />
      <div className="px-4 space-y-3 mt-2">
        <div className="slide-up"><WaterCalculator /></div>
        <div className="slide-up" style={{ animationDelay: '80ms' }}><WaterReminderConfig /></div>
        <div className="slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold">Today</h3>
            <span className="text-[10px] text-muted-foreground">{todayEntries.length} entries</span>
          </div>
          <div className="glass-card p-2.5"><WaterHistory entries={todayEntries} onRemove={removeWater} /></div>
        </div>
      </div>
    </div>
  );
}
