import { PageHeader } from '@/components/common/PageHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Volume2, VolumeX, Bell, User, ExternalLink, Droplets, Play, Download, Upload } from 'lucide-react';
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
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquapulse-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Backup exported', { description: 'Save this file somewhere safe' });
}

function importData(file, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.entries(data).forEach(([key, val]) => {
        if (key.startsWith('AQUAPULSE_')) localStorage.setItem(key, JSON.stringify(val));
      });
      toast.success('Backup restored', { description: 'Reloading app...' });
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error('Invalid backup file');
    }
  };
  reader.readAsText(file);
}

export function SettingsPage() {
  const { profile, setProfile, settings, setSettings } = useApp();
  const { play } = useSound();

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

  const handleVolumeChange = (val) => {
    const v = val[0] / 100;
    setSettings({ soundVolume: v });
  };

  const testSound = () => {
    play('gentle-bell');
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
                  <span className="text-[10px] text-muted-foreground font-medium w-8 text-right">{Math.round(settings.soundVolume * 100)}%</span>
                  <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-md" onClick={testSound} title="Test sound">
                    <Play size={10} />
                  </Button>
                </div>
              </div>
              <Slider
                value={[Math.round(settings.soundVolume * 100)]}
                onValueChange={handleVolumeChange}
                min={0}
                max={100}
                step={5}
              />
            </div>
          )}
          <Separator className="opacity-40" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5"><Bell size={12} className="text-muted-foreground" /><Label className="text-xs">Notifications</Label></div>
            <Switch checked={settings.notificationsEnabled} onCheckedChange={(v) => setSettings({ notificationsEnabled: v })} />
          </div>
        </div>

        {/* Backup */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-xs font-semibold">Data Backup</h3>
          <p className="text-[10px] text-muted-foreground">Export your data to keep a backup or transfer to another device</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] gap-1 press-scale" onClick={exportData}>
              <Download size={12} /> Export
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] gap-1 press-scale relative" asChild>
              <label className="cursor-pointer">
                <Upload size={12} /> Import
                <input type="file" accept=".json" className="sr-only" onChange={(e) => e.target.files[0] && importData(e.target.files[0])} />
              </label>
            </Button>
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
