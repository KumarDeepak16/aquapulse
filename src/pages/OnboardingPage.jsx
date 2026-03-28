import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Droplets, ArrowRight, Activity, Bell } from 'lucide-react';
import { calculateWaterGoal } from '@/lib/calculations';
import { useApp } from '@/context/AppContext';
import { useNotification } from '@/hooks/useNotification';

export function OnboardingPage() {
  const { setProfile } = useApp();
  const { requestPermission } = useNotification();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', weight: '70', height: '170', age: '25', activityLevel: 'moderate' });
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleComplete = async () => {
    await requestPermission();
    const w = parseFloat(form.weight) || 70;
    setProfile({ name: form.name, weight: w, height: parseFloat(form.height) || 170, age: parseInt(form.age) || 25, activityLevel: form.activityLevel, dailyWaterGoal: calculateWaterGoal(w, form.activityLevel), onboardingComplete: true });
  };

  const steps = [
    <div key="1" className="space-y-5 stagger-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
          <Droplets size={28} className="text-primary-foreground" />
        </div>
        <h2 className="text-xl font-heading font-bold">Welcome to <span className="text-gradient">AquaPulse</span></h2>
        <p className="text-xs text-muted-foreground mt-1">Your wellness companion</p>
      </div>
      <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Your Name</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Name" className="h-9 mt-1 rounded-lg" autoFocus /></div>
      <div className="grid grid-cols-3 gap-2">
        <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Weight</Label><Input type="number" value={form.weight} onChange={(e) => update('weight', e.target.value)} className="h-9 mt-1 rounded-lg text-center font-semibold" /></div>
        <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Height</Label><Input type="number" value={form.height} onChange={(e) => update('height', e.target.value)} className="h-9 mt-1 rounded-lg text-center font-semibold" /></div>
        <div><Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Age</Label><Input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} className="h-9 mt-1 rounded-lg text-center font-semibold" /></div>
      </div>
    </div>,
    <div key="2" className="space-y-5 stagger-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-3"><Activity size={28} className="text-secondary-foreground" /></div>
        <h2 className="text-xl font-heading font-bold">Activity Level</h2>
        <p className="text-xs text-muted-foreground mt-1">How active are you?</p>
      </div>
      <ToggleGroup type="single" value={form.activityLevel} onValueChange={(v) => v && update('activityLevel', v)} className="flex-col gap-2">
        {[{ v: 'sedentary', e: '🧘', l: 'Sedentary', d: 'Little or no exercise' }, { v: 'moderate', e: '🚶', l: 'Moderate', d: '3-5 days/week' }, { v: 'active', e: '🏃', l: 'Active', d: '6-7 days/week' }].map((o) => (
          <ToggleGroupItem key={o.v} value={o.v} className="w-full h-auto py-3 px-4 rounded-xl flex-row items-center gap-3 text-left glass-card border-transparent data-[state=on]:border-primary/30 data-[state=on]:bg-primary/5">
            <span className="text-xl">{o.e}</span><div><span className="text-xs font-semibold">{o.l}</span><span className="text-[10px] text-muted-foreground block">{o.d}</span></div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>,
    <div key="3" className="space-y-5 stagger-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-3 animate-float"><Bell size={28} className="text-white" /></div>
        <h2 className="text-xl font-heading font-bold">Stay Hydrated</h2>
        <p className="text-xs text-muted-foreground mt-1">We'll keep you on track</p>
      </div>
      <div className="glass-card p-4 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Your daily goal</p>
        <p className="text-3xl font-heading font-bold text-gradient">{calculateWaterGoal(parseFloat(form.weight) || 70, form.activityLevel)}<span className="text-sm text-muted-foreground ml-1">ml</span></p>
      </div>
      <p className="text-[10px] text-muted-foreground text-center">Customize reminders in settings anytime</p>
    </div>,
  ];

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-5 py-6 relative">
      <div className="gradient-mesh" />
      <div className="flex gap-1.5 mb-6">
        {steps.map((_, i) => (<div key={i} className="h-1 rounded-full flex-1 overflow-hidden bg-muted"><div className="h-full rounded-full transition-all duration-400 bg-primary" style={{ width: i <= step ? '100%' : '0%' }} /></div>))}
      </div>
      <div className="flex-1 flex flex-col justify-center">{steps[step]}</div>
      <div className="pt-4 space-y-1.5">
        {step < steps.length - 1
          ? <Button className="w-full h-10 rounded-xl text-sm press-scale gap-1.5" onClick={() => setStep(step + 1)}>Continue <ArrowRight size={15} /></Button>
          : <Button className="w-full h-10 rounded-xl text-sm press-scale" onClick={handleComplete}>Get Started</Button>}
        {step > 0 && <Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={() => setStep(step - 1)}>Back</Button>}
      </div>
    </div>
  );
}
