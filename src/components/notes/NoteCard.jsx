import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { StickyNote, Bell, Trash2, ChevronRight } from 'lucide-react';

const colors = ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10', 'bg-blue-500/10', 'bg-emerald-500/10'];

export function NoteCard({ note, onEdit, onDelete, style, index = 0 }) {
  return (
    <div className="glass-card p-3 press-scale stagger-in cursor-pointer group" style={style} onClick={() => onEdit?.(note)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg ${colors[index % colors.length]} flex items-center justify-center shrink-0`}>
            <StickyNote size={13} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold truncate">{note.title}</p>
              {note.reminderId && <div className="shrink-0 w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center"><Bell size={8} className="text-blue-500" /></div>}
            </div>
            {note.content && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{note.content}</p>}
            <p className="text-[9px] text-muted-foreground/50 mt-1">{format(parseISO(note.updatedAt || note.createdAt), 'MMM d, h:mm a')}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
            <Trash2 size={11} />
          </Button>
          <ChevronRight size={12} className="text-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
}
