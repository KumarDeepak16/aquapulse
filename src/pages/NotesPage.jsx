import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { NoteList } from '@/components/notes/NoteList';
import { useNotes } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toastNoteDeleted } from '@/lib/toasts';

export function NotesPage() {
  const { notes, deleteNote, searchNotes } = useNotes();
  const navigate = useNavigate();
  return (
    <div className="pb-safe">
      <PageHeader title="Notes" subtitle="Your thoughts, organized"
        action={<Button size="sm" className="rounded-lg press-scale gap-1 h-7 text-[10px]" onClick={() => navigate('/notes/new')}><Plus size={13} />New</Button>} />
      <div className="mt-2">
        <NoteList notes={notes} searchNotes={searchNotes} onEdit={(n) => navigate(`/notes/${n.id}`)} onDelete={(id) => { deleteNote(id); toastNoteDeleted(); }} onAdd={() => navigate('/notes/new')} />
      </div>
    </div>
  );
}
