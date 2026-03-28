import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Heart, Utensils, Footprints, Moon as MoonIcon } from 'lucide-react';
import { calculateBMI, getBMICategory } from '@/lib/calculations';
import { useApp } from '@/context/AppContext';

const healthTips = {
  Underweight: [
    { icon: Utensils, tip: 'Eat nutrient-dense meals with healthy fats, proteins, and complex carbs' },
    { icon: Footprints, tip: 'Focus on strength training to build lean muscle mass' },
    { icon: Heart, tip: 'Consider consulting a dietitian for a personalized plan' },
  ],
  Normal: [
    { icon: Heart, tip: 'Maintain your current lifestyle — you\'re in the healthy range!' },
    { icon: Footprints, tip: 'Aim for 150 min of moderate activity per week' },
    { icon: MoonIcon, tip: 'Get 7-9 hours of quality sleep each night' },
  ],
  Overweight: [
    { icon: Utensils, tip: 'Reduce processed foods and increase fiber-rich vegetables' },
    { icon: Footprints, tip: 'Start with 30 min daily walks, gradually increase intensity' },
    { icon: Heart, tip: 'Monitor your blood pressure and cholesterol regularly' },
  ],
  Obese: [
    { icon: Heart, tip: 'Consult a healthcare professional for a safe weight loss plan' },
    { icon: Utensils, tip: 'Focus on portion control and avoid sugary beverages' },
    { icon: Footprints, tip: 'Low-impact exercises like swimming or cycling are gentle on joints' },
  ],
};

export function BMICalculator() {
  const { profile } = useApp();
  const [weight, setWeight] = useState(String(profile.weight));
  const [height, setHeight] = useState(String(profile.height));
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const w = parseFloat(weight), h = parseFloat(height);
    if (w > 0 && h > 0) {
      const bmi = calculateBMI(w, h);
      const category = getBMICategory(bmi);
      const idealMin = Math.round(18.5 * (h / 100) ** 2);
      const idealMax = Math.round(24.9 * (h / 100) ** 2);
      setResult({ bmi, category, idealMin, idealMax });
    }
  };

  const categoryColor = result?.category.label === 'Normal' ? 'text-emerald-600 dark:text-emerald-400'
    : result?.category.label === 'Underweight' || result?.category.label === 'Overweight' ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400';

  const barColor = result?.category.label === 'Normal' ? 'var(--success)'
    : result?.category.label === 'Underweight' || result?.category.label === 'Overweight' ? 'var(--warning)'
    : 'var(--destructive)';

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
          <Activity size={13} className="text-accent" />
        </div>
        <h3 className="font-semibold text-xs">BMI Calculator</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Weight (kg)</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-8 mt-1 rounded-lg text-center text-sm font-semibold" />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Height (cm)</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="h-8 mt-1 rounded-lg text-center text-sm font-semibold" />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full press-scale rounded-lg h-8 text-xs">Calculate BMI</Button>

      {result && (
        <div className="space-y-3 stagger-in">
          {/* Result */}
          <div className="rounded-xl bg-muted p-3 text-center">
            <p className="text-3xl font-heading font-bold">{result.bmi}</p>
            <span className={`text-xs font-semibold ${categoryColor}`}>{result.category.label}</span>
            <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500 animate-spring"
                style={{ width: `${Math.min(100, (result.bmi / 40) * 100)}%`, background: barColor }} />
            </div>
            <div className="flex justify-between text-[8px] text-muted-foreground mt-1">
              <span>&lt;18.5</span><span>18.5-24.9</span><span>25-29.9</span><span>30+</span>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl border border-border p-3 space-y-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Details</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-[9px] text-muted-foreground">Ideal Weight Range</p>
                <p className="font-semibold">{result.idealMin} - {result.idealMax} kg</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-[9px] text-muted-foreground">Your Weight</p>
                <p className="font-semibold">{weight} kg</p>
              </div>
            </div>
            {result.category.label !== 'Normal' && (
              <div className="bg-muted/50 rounded-lg p-2 text-xs">
                <p className="text-[9px] text-muted-foreground">To reach normal range</p>
                <p className="font-semibold">
                  {parseFloat(weight) < result.idealMin
                    ? `Gain ${result.idealMin - parseFloat(weight)} kg`
                    : `Lose ${parseFloat(weight) - result.idealMax} kg`}
                </p>
              </div>
            )}
          </div>

          {/* Health tips */}
          <div className="rounded-xl border border-border p-3 space-y-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Health Tips</h4>
            {healthTips[result.category.label]?.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <tip.icon size={11} className="text-primary" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
