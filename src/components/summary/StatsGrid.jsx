import { Droplets, Target, Flame, TrendingUp } from 'lucide-react';

export function StatsGrid({ stats }) {
  const items = [
    { label: 'Avg. Daily', value: stats.average, unit: 'ml', icon: Droplets, bg: 'bg-blue-500', iconBg: 'bg-blue-500/10 text-blue-500 dark:text-blue-400' },
    { label: 'Best Day', value: stats.best, unit: 'ml', icon: TrendingUp, bg: 'bg-emerald-500', iconBg: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' },
    { label: 'Goals Met', value: stats.goalMetDays, unit: '/7', icon: Target, bg: 'bg-indigo-500', iconBg: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400' },
    { label: 'Completion', value: stats.completionRate, unit: '%', icon: Flame, bg: 'bg-amber-500', iconBg: 'bg-amber-500/10 text-amber-500 dark:text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div key={item.label} className="glass-card p-3 stagger-in" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className={`w-6 h-6 rounded-md ${item.iconBg} flex items-center justify-center`}>
              <item.icon size={12} />
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</span>
          </div>
          <p className="text-xl font-heading font-bold tracking-tight">
            {item.value}<span className="text-xs text-muted-foreground font-normal ml-0.5">{item.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
