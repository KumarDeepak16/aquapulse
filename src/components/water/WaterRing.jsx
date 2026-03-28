import { useEffect, useState } from 'react';

export function WaterRing({ current, goal, size = 200 }) {
  const percentage = Math.min(100, goal > 0 ? Math.round((current / goal) * 100) : 0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const goalReached = current >= goal && goal > 0;

  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      {percentage > 0 && (
        <div
          className="absolute rounded-full transition-all duration-700"
          style={{
            width: size * 0.65, height: size * 0.65,
            background: goalReached
              ? 'radial-gradient(circle, var(--success-glow) 0%, transparent 70%)'
              : 'radial-gradient(circle, var(--water-glow) 0%, transparent 70%)',
            filter: 'blur(16px)', opacity: 0.5,
          }}
        />
      )}

      <svg width={size} height={size} className="-rotate-90" style={{ filter: `drop-shadow(0 0 ${goalReached ? '8' : '4'}px ${goalReached ? 'var(--success-glow)' : 'var(--water-glow)'})` }}>
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            {goalReached ? (
              <><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#14b8a6" /></>
            ) : (
              <><stop offset="0%" stopColor="var(--primary)" /><stop offset="100%" stopColor="var(--water)" /></>
            )}
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth - 2} className="text-muted/50" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="url(#ring-grad)" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={animated ? offset : circumference}
          className="transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }}
        />
      </svg>

      {goalReached && (
        <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: '2px solid var(--success)', opacity: 0.2 }} />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-heading font-bold tracking-tight animate-count text-gradient">
          {percentage}
          <span className="text-base font-normal" style={{ WebkitTextFillColor: 'var(--muted-foreground)' }}>%</span>
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
          {current} / {goal} ml
        </span>
      </div>
    </div>
  );
}
