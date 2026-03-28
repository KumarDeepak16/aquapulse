import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Timer } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_WATER_REMINDERS, SOUNDS } from '@/lib/constants';

export function WaterReminderConfig() {
  const [config, setConfig] = useLocalStorage(STORAGE_KEYS.WATER_REMINDERS, DEFAULT_WATER_REMINDERS);
  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Timer size={13} className="text-secondary dark:text-secondary" />
          </div>
          <h3 className="font-semibold text-xs">Water Reminders</h3>
        </div>
        <Switch checked={config.enabled} onCheckedChange={(v) => update('enabled', v)} />
      </div>
      {config.enabled && (
        <div className="space-y-2 stagger-in">
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Remind every</Label>
            <Select value={String(config.intervalMinutes)} onValueChange={(v) => update('intervalMinutes', parseInt(v))}>
              <SelectTrigger className="h-8 mt-1 rounded-lg text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
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
