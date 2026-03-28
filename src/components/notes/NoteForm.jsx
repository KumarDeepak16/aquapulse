import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export function NoteForm({ initial = {}, onSubmit, onCancel, onAddReminder }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    hasReminder: !!initial.reminderId,
    ...initial,
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const { hasReminder, ...noteData } = form;
    onSubmit(noteData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-1">
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Note title..."
          className="h-9 mt-1"
          autoFocus
        />
      </div>

      <div>
        <Label className="text-xs">Content</Label>
        <Textarea
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          placeholder="Write your note..."
          className="mt-1 min-h-[120px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-muted-foreground" />
          <span className="text-sm">Add Reminder</span>
        </div>
        <Switch
          checked={form.hasReminder}
          onCheckedChange={(v) => {
            update('hasReminder', v);
            if (v && onAddReminder) onAddReminder();
          }}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1 press-scale" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 press-scale">
          {initial.id ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
