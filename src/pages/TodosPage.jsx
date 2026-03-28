import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Check, Trash2, ListTodo, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export function TodosPage() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearDone } = useTodos();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input.trim());
    setInput('');
    toast.success('Task added', { duration: 1200 });
  };

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  return (
    <div className="pb-safe">
      <PageHeader title="Tasks" subtitle={`${pending.length} pending`} showBack
        action={done.length > 0 ? (
          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground gap-1" onClick={() => { clearDone(); toast('Cleared completed'); }}>
            <CheckCheck size={12} /> Clear done
          </Button>
        ) : null}
      />

      <div className="px-4 mt-2 space-y-3">
        {/* Add input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a task..."
            className="h-9 rounded-lg text-xs flex-1"
            autoFocus
          />
          <Button size="sm" className="h-9 w-9 p-0 rounded-lg press-scale shrink-0" onClick={handleAdd} disabled={!input.trim()}>
            <Plus size={16} />
          </Button>
        </div>

        {todos.length === 0 ? (
          <EmptyState icon={ListTodo} title="No tasks yet" description="Add tasks to stay organized" />
        ) : (
          <div className="space-y-3">
            {/* Pending */}
            {pending.length > 0 && (
              <div className="space-y-1.5">
                {pending.map((todo, i) => (
                  <div key={todo.id} className="glass-card p-2.5 flex items-center gap-2.5 stagger-in group" style={{ animationDelay: `${i * 30}ms` }}>
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="w-5 h-5 rounded-md border-2 border-primary/40 hover:border-primary flex items-center justify-center press-scale transition-colors shrink-0"
                    />
                    <span className="text-xs flex-1 min-w-0 truncate">{todo.text}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => { deleteTodo(todo.id); toast('Removed', { duration: 1000 }); }}>
                      <Trash2 size={10} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Done */}
            {done.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider px-1">Completed ({done.length})</p>
                {done.map((todo) => (
                  <div key={todo.id} className="glass-card p-2.5 flex items-center gap-2.5 opacity-50 group">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="w-5 h-5 rounded-md bg-primary flex items-center justify-center press-scale shrink-0"
                    >
                      <Check size={11} className="text-primary-foreground" />
                    </button>
                    <span className="text-xs flex-1 min-w-0 truncate line-through">{todo.text}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => deleteTodo(todo.id)}>
                      <Trash2 size={10} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
