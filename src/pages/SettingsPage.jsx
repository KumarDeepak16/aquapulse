import { useRef } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Volume2, VolumeX, Bell, User, ExternalLink, Droplets, Play, Download, Upload, ShieldCheck, FileJson, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSound } from '@/hooks/useSound';
import { calculateWaterGoal } from '@/lib/calculations';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { toast } from 'sonner';

function exportData() {
  const data = {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const val = getItem(key);
    if (val) data[key] = val;
  });
  // Also grab todos
  const todos = localStorage.getItem('AQUAPULSE_TODOS');
  if (todos) data['AQUAPULSE_TODOS'] = JSON.parse(todos);

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquapulse-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Backup exported', { description: 'Save this file somewhere safe' });
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      let count = 0;
      Object.entries(data).forEach(([key, val]) => {
        if (key.startsWith('AQUAPULSE_')) {
          localStorage.setItem(key, JSON.stringify(val));
          count++;
        }
      });
      toast.success('Backup restored', { description: `${count} items imported. Reloading...` });
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error('Invalid file', { description: 'Make sure it\'s an AquaPulse backup JSON' });
    }
  };
  reader.readAsText(file);
}

export function SettingsPage() {
  const { profile, setProfile, settings, setSettings } = useApp();
  const { play } = useSound();
  const fileInputRef = useRef(null);

  const update = (key, value) => {
    const u = { ...profile, [key]: value };
    if (key === 'weight' || key === 'activityLevel') {
      u.dailyWaterGoal = calculateWaterGoal(
        key === 'weight' ? value : profile.weight,
        key === 'activityLevel' ? value : profile.activityLevel
      );
    }
    setProfile(u);
  };

  return (
    <div className="pb-safe">
      <PageHeader title="Settings" subtitle="Make it yours" showBack />
      <div className="px-4 space-y-3 mt-2">

        {/* Profile */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><User size={12} className="text-primary" /></div>
            <h3 className="text-xs font-semibold">Profile</h3>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</Label>
            <Input value={profile.name} onChange={(e) => update('name', e.target.value)} className="h-8 mt-1 rounded-lg text-xs" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Weight (kg)</Label><Input type="number" value={profile.weight} onChange={(e) => update('weight', parseFloat(e.target.value) || 0)} className="h-8 mt-1 rounded-lg text-center text-xs font-semibold" /></div>
            <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Height (cm)</Label><Input type="number" value={profile.height} onChange={(e) => update('height', parseFloat(e.target.value) || 0)} className="h-8 mt-1 rounded-lg text-center text-xs font-semibold" /></div>
            <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Age</Label><Input type="number" value={profile.age} onChange={(e) => update('age', parseInt(e.target.value) || 0)} className="h-8 mt-1 rounded-lg text-center text-xs font-semibold" /></div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily Goal (ml)</Label>
            <div className="flex items-center gap-1.5 mt-1">
              <Droplets size={13} className="text-blue-500 shrink-0" />
              <Input type="number" value={profile.dailyWaterGoal} onChange={(e) => update('dailyWaterGoal', parseInt(e.target.value) || 0)} className="h-8 rounded-lg text-xs font-semibold" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-xs font-semibold">Appearance</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light', icon: Sun, label: 'Light', color: 'text-amber-500' },
              { value: 'dark', icon: Moon, label: 'Dark', color: 'text-indigo-400' },
              { value: 'system', icon: Monitor, label: 'Auto', color: 'text-muted-foreground' },
            ].map(({ value, icon: Icon, label, color }) => (
              <button key={value} onClick={() => setSettings({ theme: value })}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl press-scale transition-all border text-xs font-medium ${
                  settings.theme === value ? 'border-primary/30 bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'}`}>
                <Icon size={16} className={color} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-secondary/15 flex items-center justify-center">
              {settings.soundEnabled ? <Volume2 size={12} className="text-secondary" /> : <VolumeX size={12} className="text-muted-foreground" />}
            </div>
            <h3 className="text-xs font-semibold">Sound</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Sound Effects</Label>
            <Switch checked={settings.soundEnabled} onCheckedChange={(v) => setSettings({ soundEnabled: v })} />
          </div>
          {settings.soundEnabled && (
            <div className="stagger-in space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Volume</Label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-medium w-8 text-right">{Math.round((settings.soundVolume ?? 0.7) * 100)}%</span>
                  <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-md" onClick={() => play('gentle-bell')} title="Test sound">
                    <Play size={10} />
                  </Button>
                </div>
              </div>
              <Slider
                value={[Math.round((settings.soundVolume ?? 0.7) * 100)]}
                onValueChange={(val) => {
                  const v = Array.isArray(val) ? val[0] : val;
                  setSettings({ soundVolume: v / 100 });
                }}
                min={0} max={100} step={5}
              />
            </div>
          )}
          <Separator className="opacity-40" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5"><Bell size={12} className="text-muted-foreground" /><Label className="text-xs">Notifications</Label></div>
            <Switch checked={settings.notificationsEnabled} onCheckedChange={(v) => setSettings({ notificationsEnabled: v })} />
          </div>
        </div>

        {/* Data & Backup */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center"><ShieldCheck size={12} className="text-emerald-500" /></div>
            <h3 className="text-xs font-semibold">Data & Backup</h3>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Your data is stored locally on this device. Export a backup to transfer to another device or keep safe.
          </p>

          {/* Export */}
          <button onClick={exportData}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 press-scale transition-colors text-left group">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <ArrowDownToLine size={15} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold">Export Backup</p>
              <p className="text-[9px] text-muted-foreground">Download all data as JSON file</p>
            </div>
            <Download size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>

          {/* Import */}
          <button onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 press-scale transition-colors text-left group">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <ArrowUpFromLine size={15} className="text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold">Import Backup</p>
              <p className="text-[9px] text-muted-foreground">Restore from a backup file</p>
            </div>
            <Upload size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files[0] && importData(e.target.files[0])} />

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
            <FileJson size={13} className="text-muted-foreground shrink-0" />
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              Backup includes: profile, water log, reminders, notes, tasks, and settings
            </p>
          </div>
        </div>

        <div className="text-center py-4 space-y-1">
          <p className="text-[10px] text-muted-foreground">AquaPulse v1.0.0</p>
          <p className="text-[10px] text-muted-foreground">Made by <a href="https://1619.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5 font-medium">1619.in <ExternalLink size={8} /></a></p>
        </div>
      </div>
    </div>
  );
}
