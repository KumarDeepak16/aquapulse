import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine, Tooltip } from 'recharts';
import { useWeeklySummary } from '@/hooks/useWeeklySummary';
import { useApp } from '@/context/AppContext';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="glass-card px-2.5 py-1.5 text-[10px]"><p className="font-semibold">{label}</p><p style={{ color: 'var(--water)' }}>{payload[0].value}ml</p></div>;
}

export function WeeklyChart() {
  const { weeklyData } = useWeeklySummary();
  const { profile } = useApp();
  const data = weeklyData.map((d) => ({ name: d.label, total: d.total, isToday: d.isToday, goalMet: d.total >= profile.dailyWaterGoal }));

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-xs">This Week</h3>
        <div className="flex items-center gap-2.5 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Goal</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Today</span>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={24} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine y={profile.dailyWaterGoal} stroke="var(--success)" strokeDasharray="5 3" strokeWidth={1} strokeOpacity={0.5} />
            <Bar dataKey="total" radius={[6, 6, 2, 2]} animationDuration={600}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.goalMet ? 'var(--success)' : entry.isToday ? 'var(--water)' : 'var(--water-light)'} fillOpacity={entry.isToday || entry.goalMet ? 1 : 0.6} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
