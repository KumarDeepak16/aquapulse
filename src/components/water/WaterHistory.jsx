import { format, parseISO } from 'date-fns';
import { Droplets, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WaterHistory({ entries, onRemove, compact = false }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <Droplets size={20} className="text-muted-foreground/30 mx-auto mb-1" />
        <p className="text-xs text-muted-foreground">No water logged yet</p>
      </div>
    );
  }
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return (
    <div className={`space-y-1 ${compact ? 'max-h-36 overflow-y-auto no-scrollbar' : ''}`}>
      {sorted.map((entry, i) => (
        <div key={entry.id} className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-muted/50 stagger-in group"
          style={{ animationDelay: `${i * 30}ms` }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
              <Droplets size={11} className="text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold">{entry.amount}ml</span>
            <span className="text-[10px] text-muted-foreground">{format(parseISO(entry.timestamp), 'h:mm a')}</span>
          </div>
          {onRemove && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity press-scale"
              onClick={() => onRemove(entry.id)}>
              <Trash2 size={11} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
