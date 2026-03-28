import { format, parseISO } from 'date-fns';
import { Droplets, Trash2, GlassWater, Coffee, CupSoda } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getAmountMeta(amount) {
  if (amount <= 100) return { icon: Coffee, label: 'Sip', color: 'bg-sky-500/10 text-sky-500 dark:text-sky-400', bar: 'bg-sky-400' };
  if (amount <= 250) return { icon: GlassWater, label: 'Glass', color: 'bg-blue-500/10 text-blue-500 dark:text-blue-400', bar: 'bg-blue-400' };
  if (amount <= 500) return { icon: CupSoda, label: 'Bottle', color: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400', bar: 'bg-indigo-400' };
  return { icon: Droplets, label: 'Big Gulp', color: 'bg-violet-500/10 text-violet-500 dark:text-violet-400', bar: 'bg-violet-400' };
}

export function WaterHistory({ entries, onRemove, compact = false, goal = 2500 }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <Droplets size={20} className="text-muted-foreground/20 mx-auto mb-1" />
        <p className="text-xs text-muted-foreground">No water logged yet</p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const maxAmount = Math.max(...sorted.map((e) => e.amount), 500);

  return (
    <div className={`space-y-1.5 ${compact ? 'max-h-40 overflow-y-auto no-scrollbar' : ''}`}>
      {sorted.map((entry, i) => {
        const meta = getAmountMeta(entry.amount);
        const Icon = meta.icon;
        const barWidth = Math.max(8, (entry.amount / maxAmount) * 100);

        return (
          <div
            key={entry.id}
            className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-card border border-border/50 stagger-in group overflow-hidden"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Background fill bar */}
            <div
              className={`absolute inset-y-0 left-0 ${meta.bar} opacity-[0.06] transition-all duration-500`}
              style={{ width: `${barWidth}%` }}
            />

            <div className={`relative w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center shrink-0`}>
              <Icon size={13} />
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold">{entry.amount}ml</span>
                <span className="text-[9px] text-muted-foreground font-medium">{meta.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {format(parseISO(entry.timestamp), 'h:mm a')}
              </span>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-6 w-6 text-muted-foreground hover:text-destructive md:opacity-0 md:group-hover:opacity-100 transition-opacity press-scale shrink-0"
                onClick={() => onRemove(entry.id)}
              >
                <Trash2 size={11} />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
