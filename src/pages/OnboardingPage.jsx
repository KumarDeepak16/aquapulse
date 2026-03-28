import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, ArrowRight, Activity, Bell } from 'lucide-react';
import { calculateWaterGoal } from '@/lib/calculations';
import { useApp } from '@/context/AppContext';
import { useNotification } from '@/hooks/useNotification';
import { toastError } from '@/lib/toasts';

export function OnboardingPage() {
  const { setProfile } = useApp();
  const { requestPermission } = useNotification();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', weight: '70', height: '170', age: '25', activityLevel: 'moderate' });
  const [errors, setErrors] = useState({});
  const update = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })); };

  const validateStep = () => {
    if (step === 0) {
      const e = {};
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.weight || parseFloat(form.weight) <= 0) e.weight = 'Required';
      if (!form.height || parseFloat(form.height) <= 0) e.height = 'Required';
      if (!form.age || parseInt(form.age) <= 0) e.age = 'Required';
      setErrors(e);
      if (Object.keys(e).length > 0) {
        toastError('Please fill in all fields');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleComplete = async () => {
    await requestPermission();
    const w = parseFloat(form.weight) || 70;
    setProfile({
      name: form.name.trim(),
      weight: w,
      height: parseFloat(form.height) || 170,
      age: parseInt(form.age) || 25,
      activityLevel: form.activityLevel,
      dailyWaterGoal: calculateWaterGoal(w, form.activityLevel),
      onboardingComplete: true,
    });
  };

  const activities = [
    { value: 'sedentary', emoji: '🧘', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'moderate', emoji: '🚶', label: 'Moderate', desc: 'Exercise 3–5 days/week' },
    { value: 'active', emoji: '🏃', label: 'Active', desc: 'Exercise 6–7 days/week' },
  ];

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-5 py-6 relative">
      <div className="gradient-mesh" />

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 rounded-full flex-1 overflow-hidden bg-muted">
            <div className="h-full rounded-full transition-all duration-400 bg-primary" style={{ width: i <= step ? '100%' : '0%' }} />
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col justify-center">

        {/* Step 1: Profile */}
        {step === 0 && (
          <div className="space-y-5 stagger-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
                <Droplets size={28} className="text-primary-foreground" />
              </div>
              <h2 className="text-xl font-heading font-bold">Welcome to <span className="text-gradient">AquaPulse</span></h2>
              <p className="text-xs text-muted-foreground mt-1">Let's set up your profile</p>
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Your Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Enter your name"
                className={`h-10 mt-1 rounded-lg ${errors.name ? 'border-destructive' : ''}`}
                autoFocus
              />
              {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Weight (kg) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.weight}
                  onChange={(e) => update('weight', e.target.value)}
                  className={`h-10 mt-1 rounded-lg text-center font-semibold ${errors.weight ? 'border-destructive' : ''}`}
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Height (cm) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.height}
                  onChange={(e) => update('height', e.target.value)}
                  className={`h-10 mt-1 rounded-lg text-center font-semibold ${errors.height ? 'border-destructive' : ''}`}
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Age <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                  className={`h-10 mt-1 rounded-lg text-center font-semibold ${errors.age ? 'border-destructive' : ''}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Activity */}
        {step === 1 && (
          <div className="space-y-5 stagger-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-3">
                <Activity size={28} className="text-secondary-foreground" />
              </div>
              <h2 className="text-xl font-heading font-bold">Activity Level</h2>
              <p className="text-xs text-muted-foreground mt-1">How active are you typically?</p>
            </div>

            <div className="space-y-2">
              {activities.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => update('activityLevel', a.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all press-scale text-left ${
                    form.activityLevel === a.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${form.activityLevel === a.value ? 'text-primary' : ''}`}>{a.label}</p>
                    <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goal */}
        {step === 2 && (
          <div className="space-y-5 stagger-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-3 animate-float">
                <Bell size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold">Stay Hydrated</h2>
              <p className="text-xs text-muted-foreground mt-1">We'll remind you throughout the day</p>
            </div>

            <div className="glass-card p-5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Your personalized daily goal</p>
              <p className="text-4xl font-heading font-bold text-gradient">
                {calculateWaterGoal(parseFloat(form.weight) || 70, form.activityLevel)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">milliliters per day</p>
            </div>

            <div className="glass-card p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{form.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Weight / Height / Age</span>
                <span className="font-medium">{form.weight}kg · {form.height}cm · {form.age}yr</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Activity</span>
                <span className="font-medium capitalize">{form.activityLevel}</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">You can change everything in settings later</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="pt-4 space-y-1.5">
        {step < 2 ? (
          <Button className="w-full h-11 rounded-xl text-sm press-scale gap-1.5" onClick={handleNext}>
            Continue <ArrowRight size={15} />
          </Button>
        ) : (
          <Button className="w-full h-11 rounded-xl text-sm press-scale" onClick={handleComplete}>
            Get Started
          </Button>
        )}
        {step > 0 && (
          <Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
