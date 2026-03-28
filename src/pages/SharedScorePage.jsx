import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decodeScoreCard, getScoreRank } from '@/lib/scoring';
import { Droplets, Trophy, Flame, Target, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return count;
}

export function SharedScorePage() {
  const [params] = useSearchParams();
  const [revealed, setRevealed] = useState(false);
  const encoded = params.get('d');

  const data = useMemo(() => {
    if (!encoded) return null;
    return decodeScoreCard(encoded);
  }, [encoded]);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (!data) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <Droplets size={32} className="text-muted-foreground/30 mb-3" />
        <h1 className="text-lg font-heading font-bold">Invalid Score Card</h1>
        <p className="text-xs text-muted-foreground mt-1">This link seems broken or expired</p>
        <a href="/" className="mt-4"><Button size="sm" className="rounded-xl text-xs">Try AquaPulse</Button></a>
      </div>
    );
  }

  const rank = getScoreRank(data.s);
  const strokeWidth = 10;
  const size = 150;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = revealed ? circumference - (data.s / 100) * circumference : circumference;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-8 relative">
      <div className="gradient-mesh" />

      {/* Card */}
      <div className={`w-full max-w-sm rounded-3xl overflow-hidden bg-gradient-to-br ${rank.bg} p-[2px] slide-up`}>
        <div className="bg-card rounded-3xl p-6 space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold mb-3" style={{ background: `${rank.color}15`, color: rank.color }}>
              <Star size={10} /> {rank.label}
            </div>
            <h1 className="text-lg font-heading font-bold">{data.n}'s Hydration Score</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">{data.d}</p>
          </div>

          {/* Animated score ring */}
          <div className="flex justify-center py-2">
            <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth - 3} className="text-muted/30" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={rank.color} strokeWidth={strokeWidth} strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.23,1,0.32,1)', filter: `drop-shadow(0 0 8px ${rank.color}50)` }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-heading font-black" style={{ color: rank.color }}>
                  {rank.rank}
                </span>
                <span className="text-sm font-heading font-bold text-muted-foreground">
                  <AnimatedCounter value={data.s} duration={1500} /> pts
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Flame, label: 'Streak', value: `${data.st}d`, color: 'text-amber-500' },
              { icon: Trophy, label: 'Best', value: `${data.ms}d`, color: 'text-emerald-500' },
              { icon: Target, label: 'Goals', value: `${data.g}/30`, color: 'text-blue-500' },
              { icon: TrendingUp, label: 'Active', value: `${data.a}/30`, color: 'text-indigo-500' },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-xl bg-muted/30">
                <s.icon size={14} className={`${s.color} mx-auto mb-0.5`} />
                <p className="text-xs font-bold">{s.value}</p>
                <p className="text-[8px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Daily goal */}
          <div className="text-center p-3 rounded-xl bg-muted/30">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Daily Goal</p>
            <p className="text-lg font-heading font-bold">{data.gl}<span className="text-xs text-muted-foreground ml-0.5">ml</span></p>
          </div>

          {/* CTA */}
          <div className="text-center space-y-2">
            <a href="/">
              <Button className="w-full h-10 rounded-xl text-xs gap-1.5 press-scale">
                <Droplets size={13} /> Try AquaPulse — It's Free
              </Button>
            </a>
            <p className="text-[9px] text-muted-foreground flex items-center justify-center gap-1">
              Powered by <a href="https://1619.in" className="text-primary font-medium inline-flex items-center gap-0.5">1619.in <ExternalLink size={7} /></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
