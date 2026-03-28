import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ReminderList } from '@/components/reminders/ReminderList';
import { ReminderForm } from '@/components/reminders/ReminderForm';
import { useReminders } from '@/hooks/useReminders';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Plus } from 'lucide-react';
import { toastReminderCreated, toastReminderUpdated, toastReminderDeleted } from '@/lib/toasts';

export function RemindersPage() {
  const { reminders, addReminder, updateReminder, deleteReminder, toggleReminder } = useReminders();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (data) => {
    if (editing) { updateReminder(editing.id, data); toastReminderUpdated(); }
    else { addReminder(data); toastReminderCreated(); }
    setDrawerOpen(false); setEditing(null);
  };

  return (
    <div className="pb-safe">
      <PageHeader title="Reminders" subtitle="Never miss what matters"
        action={<Button size="sm" className="rounded-lg press-scale gap-1 h-7 text-[10px]" onClick={() => { setEditing(null); setDrawerOpen(true); }}><Plus size={13} />New</Button>} />
      <div className="mt-2">
        <ReminderList reminders={reminders} onToggle={toggleReminder} onDelete={(id) => { deleteReminder(id); toastReminderDeleted(); }} onEdit={(r) => { setEditing(r); setDrawerOpen(true); }} onAdd={() => setDrawerOpen(true)} />
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent><DrawerHeader><DrawerTitle className="text-sm">{editing ? 'Edit' : 'New'} Reminder</DrawerTitle></DrawerHeader>
          <div className="px-4 pb-6"><ReminderForm initial={editing || {}} onSubmit={handleSubmit} onCancel={() => { setDrawerOpen(false); setEditing(null); }} /></div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
