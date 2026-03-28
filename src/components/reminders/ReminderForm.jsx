import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SOUNDS, WEEKDAYS } from '@/lib/constants';
import { Sparkles } from 'lucide-react';

const SMART_PRESETS = [
  { label: 'Morning Routine', title: 'Morning routine', time: '07:00', days: [1,2,3,4,5,6,0], sound: 'gentle-bell', notes: 'Stretch, meditate, plan your day' },
  { label: 'Take Vitamins', title: 'Take vitamins', time: '08:30', days: [1,2,3,4,5,6,0], sound: 'gentle-bell', notes: 'After breakfast' },
  { label: 'Workout', title: 'Time to workout', time: '17:00', days: [1,3,5], sound: 'gentle-bell', notes: 'Stay consistent!' },
  { label: 'Sleep Time', title: 'Wind down for sleep', time: '22:00', days: [0,1,2,3,4,5,6], sound: 'gentle-bell', notes: 'Put phone away, read a book' },
  { label: 'Meal Prep', title: 'Meal prep time', time: '18:00', days: [0], sound: 'gentle-bell', notes: 'Prepare healthy meals for the week' },
  { label: 'Stand Up', title: 'Stand & stretch', time: '14:00', days: [1,2,3,4,5], sound: 'water-drop', notes: 'Take a 5-min break' },
];

export function ReminderForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '', notes: '', time: '09:00', days: [1,2,3,4,5], sound: 'gentle-bell',
    ...initial,
  });
  const [showPresets, setShowPresets] = useState(!initial.id && !form.title);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleDayToggle = (i) => setForm((p) => ({ ...p, days: p.days.includes(i) ? p.days.filter((d) => d !== i) : [...p.days, i].sort() }));

  const applyPreset = (preset) => {
    setForm((p) => ({ ...p, title: preset.title, time: preset.time, days: preset.days, sound: preset.sound, notes: preset.notes }));
    setShowPresets(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  // Quick day selections
  const setWeekdays = () => setForm((p) => ({ ...p, days: [1,2,3,4,5] }));
  const setWeekend = () => setForm((p) => ({ ...p, days: [0,6] }));
  const setEveryday = () => setForm((p) => ({ ...p, days: [0,1,2,3,4,5,6] }));

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Smart presets */}
      {showPresets && (
        <div className="space-y-1.5 stagger-in">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-accent" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Add</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SMART_PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => applyPreset(p)}
                className="text-left p-2 rounded-lg bg-muted/50 hover:bg-muted press-scale transition-colors">
                <p className="text-[10px] font-semibold truncate">{p.label}</p>
                <p className="text-[9px] text-muted-foreground">{p.time}</p>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowPresets(false)} className="text-[10px] text-primary font-medium w-full text-center py-1">
            or create custom
          </button>
        </div>
      )}

      {!showPresets && (
        <>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Title</Label>
            <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Reminder title..." className="h-8 mt-1 rounded-lg text-xs" autoFocus />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Optional details..." className="mt-1 min-h-[48px] resize-none text-xs rounded-lg" />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Time</Label>
            <Input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} className="h-8 mt-1 rounded-lg text-xs" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Repeat</Label>
              <div className="flex gap-1">
                <button type="button" onClick={setWeekdays} className="text-[8px] px-1.5 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary transition-colors font-medium">Weekdays</button>
                <button type="button" onClick={setWeekend} className="text-[8px] px-1.5 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary transition-colors font-medium">Weekend</button>
                <button type="button" onClick={setEveryday} className="text-[8px] px-1.5 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary transition-colors font-medium">Daily</button>
              </div>
            </div>
            <div className="flex gap-1">
              {WEEKDAYS.map((day, i) => (
                <button key={i} type="button" onClick={() => handleDayToggle(i)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-medium press-scale transition-colors ${form.days.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {day[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Sound</Label>
            <Select value={form.sound} onValueChange={(v) => update('sound', v)}>
              <SelectTrigger className="h-8 mt-1 rounded-lg text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(SOUNDS).map(([k, { label }]) => (<SelectItem key={k} value={k}>{label}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 press-scale h-8 rounded-lg text-xs" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="flex-1 press-scale h-8 rounded-lg text-xs">{initial.id ? 'Update' : 'Create'}</Button>
          </div>
        </>
      )}
    </form>
  );
}
