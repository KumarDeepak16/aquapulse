import { Flame } from 'lucide-react';

export function StreakBadge({ streak }) {
  if (streak === 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
      <Flame size={13} className="text-amber-500" />
      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{streak} day streak!</span>
    </div>
  );
}
