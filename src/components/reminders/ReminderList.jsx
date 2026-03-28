import { ReminderCard } from './ReminderCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Bell } from 'lucide-react';

export function ReminderList({ reminders, onToggle, onDelete, onEdit, onAdd }) {
  if (reminders.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No reminders yet"
        description="Create your first reminder to stay on track"
        actionLabel="Add Reminder"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-2 px-5">
      {reminders.map((reminder, i) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}
