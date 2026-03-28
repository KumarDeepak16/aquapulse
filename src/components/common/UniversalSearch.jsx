import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Droplets, Bell, StickyNote, Calculator, BarChart3, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNotes } from '@/hooks/useNotes';
import { useReminders } from '@/hooks/useReminders';

const quickLinks = [
  { label: 'Water Tracker', icon: Droplets, path: '/water', color: 'text-water' },
  { label: 'Reminders', icon: Bell, path: '/reminders', color: 'text-primary' },
  { label: 'Notes', icon: StickyNote, path: '/notes', color: 'text-accent' },
  { label: 'Calculator', icon: Calculator, path: '/calculator', color: 'text-warning' },
  { label: 'Summary', icon: BarChart3, path: '/summary', color: 'text-success' },
  { label: 'Settings', icon: Settings, path: '/settings', color: 'text-muted-foreground' },
];

export function UniversalSearch({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { searchNotes } = useNotes();
  const { reminders } = useReminders();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.toLowerCase();
  const matchedNotes = query ? searchNotes(query).slice(0, 5) : [];
  const matchedReminders = query
    ? reminders.filter((r) => r.title.toLowerCase().includes(q) || r.notes?.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const matchedLinks = query
    ? quickLinks.filter((l) => l.label.toLowerCase().includes(q))
    : quickLinks;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-md mx-4 glass-card rounded-2xl overflow-hidden slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, reminders, pages..."
            className="border-0 shadow-none focus-visible:ring-0 h-8 px-0 text-sm bg-transparent"
          />
          <button onClick={onClose} className="press-scale shrink-0">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {/* Quick links */}
          {matchedLinks.length > 0 && (
            <div className="mb-2">
              {!query && <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 py-1.5 font-medium">Quick Links</p>}
              <div className="grid grid-cols-3 gap-1">
                {matchedLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigate(link.path)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-secondary/60 press-scale transition-colors"
                  >
                    <link.icon size={18} className={link.color} />
                    <span className="text-[10px] font-medium text-muted-foreground">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes results */}
          {matchedNotes.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 py-1.5 font-medium">Notes</p>
              {matchedNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => { navigate('/notes'); onClose(); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-secondary/60 press-scale text-left transition-colors"
                >
                  <StickyNote size={14} className="text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{note.title}</p>
                    {note.content && <p className="text-xs text-muted-foreground truncate">{note.content}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Reminders results */}
          {matchedReminders.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 py-1.5 font-medium">Reminders</p>
              {matchedReminders.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { navigate('/reminders'); onClose(); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-secondary/60 press-scale text-left transition-colors"
                >
                  <Bell size={14} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && matchedNotes.length === 0 && matchedReminders.length === 0 && matchedLinks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
