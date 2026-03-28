import { PageHeader } from '@/components/common/PageHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Monitor, Volume2, Bell, User, ExternalLink, Droplets } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateWaterGoal } from '@/lib/calculations';

export function SettingsPage() {
  const { profile, setProfile, settings, setSettings } = useApp();
  const update = (key, value) => {
    const u = { ...profile, [key]: value };
    if (key === 'weight' || key === 'activityLevel') u.dailyWaterGoal = calculateWaterGoal(key === 'weight' ? value : profile.weight, key === 'activityLevel' ? value : profile.activityLevel);
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
            <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Weight</Label><Input type="number" value={profile.weight} onChange={(e) => update('weight', parseFloat(e.target.value) || 0)} className="h-8 mt-1 rounded-lg text-center text-xs font-semibold" /></div>
            <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Height</Label><Input type="number" value={profile.height} onChange={(e) => update('height', parseFloat(e.target.value) || 0)} className="h-8 mt-1 rounded-lg text-center text-xs font-semibold" /></div>
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
            <div className="w-6 h-6 rounded-md bg-secondary/15 flex items-center justify-center"><Volume2 size={12} className="text-secondary" /></div>
            <h3 className="text-xs font-semibold">Sound</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Sound Effects</Label>
            <Switch checked={settings.soundEnabled} onCheckedChange={(v) => setSettings({ soundEnabled: v })} />
          </div>
          {settings.soundEnabled && (
            <div className="stagger-in">
              <div className="flex items-center justify-between mb-1"><Label className="text-[10px] text-muted-foreground">Volume</Label><span className="text-[10px] text-muted-foreground font-medium">{Math.round(settings.soundVolume * 100)}%</span></div>
              <Slider value={[settings.soundVolume * 100]} onValueChange={([v]) => setSettings({ soundVolume: v / 100 })} max={100} step={5} />
            </div>
          )}
          <Separator className="opacity-40" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5"><Bell size={12} className="text-muted-foreground" /><Label className="text-xs">Notifications</Label></div>
            <Switch checked={settings.notificationsEnabled} onCheckedChange={(v) => setSettings({ notificationsEnabled: v })} />
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
