import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Trash2, Clock } from 'lucide-react';
import { WEEKDAYS } from '@/lib/constants';
import { formatTime } from '@/lib/date-utils';

export function ReminderCard({ reminder, onToggle, onDelete, onEdit, style }) {
  return (
    <div className="glass-card p-3 press-scale stagger-in cursor-pointer group relative overflow-hidden" style={style} onClick={() => onEdit?.(reminder)}>
      <div className={`absolute top-0 left-0 w-0.5 h-full ${reminder.enabled ? 'bg-primary' : 'bg-muted'}`} />
      <div className="flex items-start gap-2.5 pl-1.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Bell size={14} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{reminder.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={9} className="text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">{formatTime(reminder.time)}</p>
              </div>
            </div>
            <Switch checked={reminder.enabled} onCheckedChange={() => onToggle(reminder.id)} onClick={(e) => e.stopPropagation()} />
          </div>
          {reminder.notes && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{reminder.notes}</p>}
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex gap-0.5">
              {WEEKDAYS.map((day, i) => (
                <span key={i} className={`text-[8px] w-5 h-5 rounded-md flex items-center justify-center font-medium ${reminder.days.includes(i) ? 'bg-primary/10 text-primary' : 'text-muted-foreground/30'}`}>{day[0]}</span>
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onDelete(reminder.id); }}>
              <Trash2 size={11} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
