import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Droplets } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { WATER_QUICK_ADD } from '@/lib/constants';

export function WaterLogButton({ onAdd }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) { onAdd(amount); setCustomAmount(''); setShowCustom(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-center">
        {WATER_QUICK_ADD.map((amount) => (
          <Button key={amount} variant="outline" size="sm"
            className="press-scale rounded-lg gap-1 h-9 px-3 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            onClick={() => onAdd(amount)}>
            <Droplets size={12} /> {amount}ml
          </Button>
        ))}
        <Button variant="outline" size="sm"
          className="press-scale rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          onClick={() => setShowCustom(!showCustom)}>
          <Plus size={14} />
        </Button>
      </div>
      {showCustom && (
        <div className="flex items-center gap-2 justify-center stagger-in">
          <Input type="number" placeholder="ml" value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd()}
            className="w-20 h-8 text-center rounded-lg text-xs" />
          <Button size="sm" className="press-scale rounded-lg h-8 text-xs" onClick={handleCustomAdd}>Add</Button>
        </div>
      )}
    </div>
  );
}
