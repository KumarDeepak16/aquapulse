import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Bell, Trash2, Check, CloudOff, Cloud } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useReminders } from '@/hooks/useReminders';
import { toastNoteCreated, toastNoteDeleted, toastError } from '@/lib/toasts';

export function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { addReminder } = useReminders();
  const isNew = id === 'new';
  const existing = !isNew ? notes.find((n) => n.id === id) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasReminder, setHasReminder] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'unsaved' | 'saving'
  const [createdId, setCreatedId] = useState(null);
  const debounceRef = useRef(null);

  // Load existing note
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setHasReminder(!!existing.reminderId);
    }
  }, [existing]);

  // Debounced autosave for existing notes
  const autoSave = useCallback(() => {
    const noteId = createdId || id;
    if (isNew && !createdId) return;
    if (!title.trim()) return;

    setSaveStatus('saving');
    updateNote(noteId, { title, content });
    setTimeout(() => setSaveStatus('saved'), 300);
  }, [title, content, id, createdId, isNew, updateNote]);

  useEffect(() => {
    if (isNew && !createdId) return;
    if (!title.trim()) return;

    setSaveStatus('unsaved');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(autoSave, 1200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [title, content, autoSave, isNew, createdId]);

  const handleSave = () => {
    if (!title.trim()) { toastError('Please add a title first'); return; }

    if (isNew && !createdId) {
      const n = addNote({ title, content });
      setCreatedId(n.id);
      if (hasReminder) {
        const r = addReminder({ title: `Note: ${title}`, notes: content?.slice(0, 100) || '' });
        updateNote(n.id, { reminderId: r.id });
      }
      toastNoteCreated();
      setSaveStatus('saved');
    } else {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      autoSave();
    }
  };

  const handleBack = () => {
    if (debounceRef.current) { clearTimeout(debounceRef.current); autoSave(); }
    navigate('/notes');
  };

  return (
    <div className="min-h-dvh flex flex-col pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border glass sticky top-0 z-10">
        <button onClick={handleBack} className="flex items-center gap-0.5 text-muted-foreground press-scale">
          <ChevronLeft size={18} /><span className="text-xs font-medium">Notes</span>
        </button>
        <div className="flex items-center gap-2">
          {/* Save status indicator */}
          <div className="flex items-center gap-1">
            {saveStatus === 'saved' && <Cloud size={11} className="text-emerald-500" />}
            {saveStatus === 'unsaved' && <CloudOff size={11} className="text-muted-foreground/50" />}
            {saveStatus === 'saving' && <Cloud size={11} className="text-blue-500 animate-pulse" />}
            <span className="text-[9px] text-muted-foreground">
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
            </span>
          </div>
          {!isNew && !createdId && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => { deleteNote(id); toastNoteDeleted(); navigate('/notes'); }}>
              <Trash2 size={14} />
            </Button>
          )}
          <Button size="sm" className="h-7 rounded-lg press-scale gap-1 text-[10px]" onClick={handleSave}>
            <Check size={12} />{isNew && !createdId ? 'Create' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 px-4 py-3 space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border-0 shadow-none focus-visible:ring-0 text-lg font-heading font-bold px-0 h-auto placeholder:text-muted-foreground/30"
          autoFocus={isNew}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="border-0 shadow-none focus-visible:ring-0 min-h-[50vh] resize-none px-0 text-sm leading-relaxed placeholder:text-muted-foreground/25"
        />
      </div>

      {/* Footer toolbar */}
      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bell size={13} className={hasReminder ? 'text-primary' : 'text-muted-foreground'} />
          <span className="text-[10px] text-muted-foreground">Reminder</span>
          <Switch checked={hasReminder} onCheckedChange={setHasReminder} />
        </div>
        <span className="text-[9px] text-muted-foreground">{content.length} chars</span>
      </div>
    </div>
  );
}
