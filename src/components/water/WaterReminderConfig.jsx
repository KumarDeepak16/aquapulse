import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Timer, Sparkles, Clock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_WATER_REMINDERS, SOUNDS, WATER_REMINDER_PRESETS } from '@/lib/constants';
import { toast } from 'sonner';

export function WaterReminderConfig() {
  const [config, setConfig] = useLocalStorage(STORAGE_KEYS.WATER_REMINDERS, DEFAULT_WATER_REMINDERS);
  const [showPresets, setShowPresets] = useState(false);
  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const applyPreset = (preset) => {
    setConfig((prev) => ({
      ...prev,
      enabled: true,
      intervalMinutes: preset.intervalMinutes,
      activeHoursStart: preset.activeHoursStart,
      activeHoursEnd: preset.activeHoursEnd,
    }));
    setShowPresets(false);
    toast.success(`"${preset.label}" applied`, { description: preset.desc, duration: 2000 });
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Timer size={13} className="text-secondary" />
          </div>
          <h3 className="font-semibold text-xs">Water Reminders</h3>
        </div>
        <Switch checked={config.enabled} onCheckedChange={(v) => update('enabled', v)} />
      </div>

      {config.enabled && (
        <div className="space-y-2 stagger-in">
          {/* Smart presets */}
          <button type="button" onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
            <Sparkles size={11} className="text-primary shrink-0" />
            <span className="text-[10px] font-medium text-primary">Smart Presets</span>
          </button>

          {showPresets && (
            <div className="grid grid-cols-2 gap-1.5 stagger-in">
              {WATER_REMINDER_PRESETS.map((p) => (
                <button key={p.label} onClick={() => applyPreset(p)}
                  className="text-left p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 press-scale transition-all">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Clock size={9} className="text-muted-foreground" />
                    <span className="text-[10px] font-semibold">{p.label}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">{p.desc}</p>
                </button>
              ))}
            </div>
          )}

          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Remind every</Label>
            <Select value={String(config.intervalMinutes)} onValueChange={(v) => update('intervalMinutes', parseInt(v))}>
              <SelectTrigger className="h-8 mt-1 rounded-lg text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">From</Label>
              <Input type="time" value={config.activeHoursStart} onChange={(e) => update('activeHoursStart', e.target.value)} className="h-8 mt-1 rounded-lg text-xs" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Until</Label>
              <Input type="time" value={config.activeHoursEnd} onChange={(e) => update('activeHoursEnd', e.target.value)} className="h-8 mt-1 rounded-lg text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Sound</Label>
            <Select value={config.sound} onValueChange={(v) => update('sound', v)}>
              <SelectTrigger className="h-8 mt-1 rounded-lg text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(SOUNDS).map(([key, { label }]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
