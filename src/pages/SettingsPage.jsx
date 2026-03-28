import { useRef, useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Sun, Moon, Monitor, Volume2, VolumeX, Bell, User, ExternalLink,
  Droplets, Play, Download, Upload, ShieldCheck, FileJson,
  ArrowDownToLine, ArrowUpFromLine, Smartphone, HardDrive,
  Trash2, AlertTriangle, Calendar, StickyNote, Clock, ListTodo
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSound } from '@/hooks/useSound';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { useReminders } from '@/hooks/useReminders';
import { useNotes } from '@/hooks/useNotes';
import { useTodos } from '@/hooks/useTodos';
import { calculateWaterGoal } from '@/lib/calculations';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

function exportData() {
  const data = {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const val = getItem(key);
    if (val) data[key] = val;
  });
  const todos = localStorage.getItem('AQUAPULSE_TODOS');
  if (todos) data['AQUAPULSE_TODOS'] = JSON.parse(todos);
  data._exportedAt = new Date().toISOString();
  data._version = '1.0.0';

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquapulse-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
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
  const { waterLog } = useWaterTracker();
  const { reminders } = useReminders();
  const { notes } = useNotes();
  const { todos } = useTodos();
  const fileInputRef = useRef(null);
  const [deleteStep, setDeleteStep] = useState(0); // 0=hidden, 1=warning, 2=confirm

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

  // Storage stats — localStorage quota is ~5MB on most browsers
  const storageStats = useMemo(() => {
    const waterDays = Object.keys(waterLog.entries || {}).length;
    const totalEntries = Object.values(waterLog.entries || {}).reduce((s, e) => s + e.length, 0);

    let storageBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('AQUAPULSE_')) {
        storageBytes += (localStorage.getItem(key)?.length || 0) * 2; // UTF-16
      }
    }
    const totalQuota = 5 * 1024 * 1024; // 5MB
    const usedPct = Math.round((storageBytes / totalQuota) * 100);
    const sizeKB = (storageBytes / 1024).toFixed(1);

    return { waterDays, totalEntries, remindersCount: reminders.length, notesCount: notes.length, todosCount: todos.length, sizeKB, usedPct };
  }, [waterLog, reminders, notes, todos]);

  const handleDeleteAccount = () => {
    // Clear all AQUAPULSE_ keys
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('AQUAPULSE_')) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));

    toast('All data cleared', { description: 'Starting fresh...' });
    setTimeout(() => window.location.reload(), 800);
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
                onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val; setSettings({ soundVolume: v / 100 }); }}
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

        {/* Storage Info */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center"><Smartphone size={12} className="text-blue-500" /></div>
            <h3 className="text-xs font-semibold">Your Data</h3>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
            <HardDrive size={13} className="text-muted-foreground shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              All data is stored <strong>locally on this device</strong>. Nothing is sent to any server. No account needed.
            </p>
          </div>
          {/* Storage bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">Storage Used</span>
              <span className="text-[10px] font-semibold">{storageStats.sizeKB} KB ({storageStats.usedPct}%)</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${storageStats.usedPct >= 80 ? 'bg-destructive' : storageStats.usedPct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(1, storageStats.usedPct)}%` }} />
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">5 MB total · Only last 10 days of water data kept</p>
          </div>

          {storageStats.usedPct >= 80 && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 stagger-in">
              <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed">
                Storage is almost full. Export a backup and clear old data to free space.
              </p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { icon: Calendar, val: storageStats.waterDays, label: 'Days', color: 'text-blue-500' },
              { icon: Droplets, val: storageStats.totalEntries, label: 'Entries', color: 'text-blue-500' },
              { icon: Clock, val: storageStats.remindersCount, label: 'Reminders', color: 'text-secondary' },
              { icon: StickyNote, val: storageStats.notesCount, label: 'Notes', color: 'text-accent' },
              { icon: ListTodo, val: storageStats.todosCount, label: 'Tasks', color: 'text-emerald-500' },
            ].map((s) => (
              <div key={s.label} className="p-1.5 rounded-lg bg-muted/30 text-center">
                <s.icon size={11} className={`${s.color} mx-auto mb-0.5`} />
                <p className="text-xs font-bold">{s.val}</p>
                <p className="text-[6px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Backup */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center"><ShieldCheck size={12} className="text-emerald-500" /></div>
            <h3 className="text-xs font-semibold">Backup & Restore</h3>
          </div>

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
              Includes profile, water log, reminders, notes, tasks & settings
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-4 space-y-3 border-destructive/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center"><Trash2 size={12} className="text-destructive" /></div>
            <h3 className="text-xs font-semibold text-destructive">Danger Zone</h3>
          </div>

          {deleteStep === 0 && (
            <button onClick={() => setDeleteStep(1)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-destructive/20 hover:bg-destructive/5 press-scale transition-colors text-left group">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 size={15} className="text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-destructive">Delete All Data</p>
                <p className="text-[9px] text-muted-foreground">Permanently erase everything & start fresh</p>
              </div>
            </button>
          )}

          {deleteStep === 1 && (
            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3 stagger-in">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-destructive">Are you sure?</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">This will permanently delete:</p>
                </div>
              </div>
              <div className="space-y-1 pl-6">
                <p className="text-[10px] text-muted-foreground">• Your profile & settings</p>
                <p className="text-[10px] text-muted-foreground">• All {storageStats.totalEntries} water entries ({storageStats.waterDays} days)</p>
                <p className="text-[10px] text-muted-foreground">• All {storageStats.remindersCount} reminders</p>
                <p className="text-[10px] text-muted-foreground">• All {storageStats.notesCount} notes</p>
                <p className="text-[10px] text-muted-foreground">• All {storageStats.todosCount} tasks</p>
                <p className="text-[10px] text-muted-foreground">• Weekly history & score data</p>
              </div>
              <p className="text-[10px] text-destructive font-semibold pl-6">This action cannot be undone. Export a backup first!</p>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-xs" onClick={() => setDeleteStep(0)}>Cancel</Button>
                <Button variant="destructive" size="sm" className="flex-1 h-8 rounded-lg text-xs press-scale" onClick={() => setDeleteStep(2)}>
                  I understand, continue
                </Button>
              </div>
            </div>
          )}

          {deleteStep === 2 && (
            <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/10 space-y-3 stagger-in">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-destructive" />
                <p className="text-xs font-bold text-destructive">Final confirmation</p>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Tap "Delete Everything" to erase all data. You'll be taken back to onboarding to start fresh.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-xs" onClick={() => setDeleteStep(0)}>Go back</Button>
                <Button size="sm" className="flex-1 h-8 rounded-lg text-xs press-scale bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteAccount}>
                  Delete Everything
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center py-4 space-y-1">
          <p className="text-[10px] text-muted-foreground">AquaPulse v1.0.0</p>
          <p className="text-[10px] text-muted-foreground">Made by <a href="https://1619.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5 font-medium">1619.in <ExternalLink size={8} /></a></p>
        </div>
      </div>
    </div>
  );
}
