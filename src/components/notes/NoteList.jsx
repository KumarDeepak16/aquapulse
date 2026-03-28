import { useState } from 'react';
import { NoteCard } from './NoteCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { StickyNote, Search } from 'lucide-react';

export function NoteList({ notes, searchNotes, onEdit, onDelete, onAdd }) {
  const [query, setQuery] = useState('');
  const filtered = query ? searchNotes(query) : notes;

  return (
    <div className="space-y-2">
      {notes.length > 0 && (
        <div className="px-4 relative">
          <Search size={13} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes..." className="h-8 pl-8 rounded-lg text-xs" />
        </div>
      )}
      {filtered.length === 0 ? (
        query ? <p className="text-xs text-muted-foreground text-center py-6">No notes found</p>
        : <EmptyState icon={StickyNote} title="No notes yet" description="Jot down your thoughts" actionLabel="Add Note" onAction={onAdd} />
      ) : (
        <div className="space-y-2 px-4">
          {filtered.map((note, i) => (
            <NoteCard key={note.id} note={note} index={i} onEdit={onEdit} onDelete={onDelete} style={{ animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      )}
    </div>
  );
}
