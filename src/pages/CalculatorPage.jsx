import { PageHeader } from '@/components/common/PageHeader';
import { BMICalculator } from '@/components/calculator/BMICalculator';
import { WaterCalculator } from '@/components/water/WaterCalculator';

export function CalculatorPage() {
  return (
    <div className="pb-safe">
      <PageHeader title="Calculator" subtitle="Body metrics" showBack />
      <div className="px-4 space-y-3 mt-2">
        <div className="slide-up"><BMICalculator /></div>
        <div className="slide-up" style={{ animationDelay: '80ms' }}><WaterCalculator /></div>
      </div>
    </div>
  );
}
