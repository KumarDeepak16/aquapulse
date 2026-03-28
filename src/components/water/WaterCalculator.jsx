import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calculator, Droplets } from 'lucide-react';
import { calculateWaterByAge } from '@/lib/calculations';
import { useApp } from '@/context/AppContext';

export function WaterCalculator() {
  const { profile, setProfile } = useApp();
  const [weight, setWeight] = useState(String(profile.weight));
  const [age, setAge] = useState(String(profile.age));
  const [activity, setActivity] = useState(profile.activityLevel);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const w = parseFloat(weight), a = parseInt(age);
    if (w > 0 && a > 0) setResult(calculateWaterByAge(w, a, activity));
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator size={13} className="text-primary" />
        </div>
        <h3 className="font-semibold text-xs">Water Requirement</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Weight (kg)</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 mt-1 rounded-lg text-center text-sm font-semibold" />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Age</Label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="h-8 mt-1 rounded-lg text-center text-sm font-semibold" />
        </div>
      </div>
      <div>
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Activity</Label>
        <ToggleGroup type="single" value={activity} onValueChange={(v) => v && setActivity(v)} className="mt-1 justify-start">
          <ToggleGroupItem value="sedentary" size="sm" className="text-[10px] rounded-lg h-7 px-2.5">Sedentary</ToggleGroupItem>
          <ToggleGroupItem value="moderate" size="sm" className="text-[10px] rounded-lg h-7 px-2.5">Moderate</ToggleGroupItem>
          <ToggleGroupItem value="active" size="sm" className="text-[10px] rounded-lg h-7 px-2.5">Active</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full press-scale rounded-lg h-8 text-xs">Calculate</Button>
      {result && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 text-center stagger-in">
          <Droplets size={20} className="text-blue-500 dark:text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-heading font-bold text-gradient">{result}<span className="text-xs text-muted-foreground ml-1">ml</span></p>
          <Button variant="outline" size="sm" onClick={() => setProfile({ weight: parseFloat(weight), age: parseInt(age), activityLevel: activity, dailyWaterGoal: result })}
            className="mt-2 press-scale rounded-lg text-[10px] h-7 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40">
            Set as My Goal
          </Button>
        </div>
      )}
    </div>
  );
}
