import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decodeScoreCard, getScoreRank } from '@/lib/scoring';
import { Droplets, Trophy, Flame, Target, Star, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Counter({ value, duration = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value <= 0) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));
    const t = setInterval(() => { cur = Math.min(cur + step, value); setN(cur); if (cur >= value) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [value, duration]);
  return n;
}

export function SharedScorePage() {
  const [params] = useSearchParams();
  const [show, setShow] = useState(false);
  const [ringShow, setRingShow] = useState(false);

  const data = useMemo(() => decodeScoreCard(params.get('d') || ''), [params]);

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
    setTimeout(() => setRingShow(true), 700);
  }, []);

  if (!data) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-background">
        <Droplets size={40} className="text-muted-foreground/20 mb-4" />
        <h1 className="text-xl font-heading font-bold">Score Card Not Found</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">This link may be broken or expired</p>
        <a href="/"><Button className="rounded-xl press-scale">Try AquaPulse Free</Button></a>
      </div>
    );
  }

  const rank = getScoreRank(data.s);
  const size = 160;
  const sw = 12;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = ringShow ? c - (data.s / 100) * c : c;

  const stats = [
    { icon: Flame, val: `${data.st}`, unit: 'days', label: 'Streak', color: '#f59e0b' },
    { icon: Trophy, val: `${data.ms}`, unit: 'best', label: 'Record', color: '#22c55e' },
    { icon: Target, val: `${data.g}`, unit: '/30', label: 'Goals Hit', color: '#3b82f6' },
    { icon: Zap, val: data.tl || '0', unit: 'L', label: 'Total', color: '#a855f7' },
  ];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-5 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: rank.color, filter: 'blur(120px)', top: '-200px', right: '-150px' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: rank.color, filter: 'blur(100px)', bottom: '-100px', left: '-150px' }} />
      </div>

      {/* Card */}
      <div className={`w-full max-w-[360px] transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }}>

        {/* Gradient border wrapper */}
        <div className={`rounded-3xl bg-gradient-to-br ${rank.bg} p-[2px] shadow-2xl`} style={{ boxShadow: `0 20px 60px -10px ${rank.color}25` }}>
          <div className="rounded-3xl bg-card overflow-hidden">

            {/* Top accent bar */}
            <div className={`h-1.5 bg-gradient-to-r ${rank.bg}`} />

            <div className="px-5 pt-5 pb-6 space-y-5">

              {/* Header: avatar + name + badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rank.bg} flex items-center justify-center shadow-lg`}
                    style={{ boxShadow: `0 4px 14px ${rank.color}30` }}>
                    <span className="text-lg font-heading font-black text-white">{data.n?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                  <div>
                    <h1 className="text-base font-heading font-bold">{data.n}</h1>
                    <p className="text-[10px] text-muted-foreground">Hydration Achievement</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[9px]" style={{ background: `${rank.color}12`, color: rank.color }}>
                  <Star size={9} /> {rank.label}
                </div>
              </div>

              {/* Score ring — centerpiece */}
              <div className="flex justify-center py-3">
                <div className="relative" style={{ width: size, height: size }}>
                  {/* Glow */}
                  <div className="absolute inset-4 rounded-full transition-opacity duration-1000" style={{ background: `radial-gradient(circle, ${rank.color}18 0%, transparent 70%)`, filter: 'blur(16px)', opacity: ringShow ? 1 : 0 }} />
                  <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw - 4} className="text-muted/15" />
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={rank.color} strokeWidth={sw} strokeLinecap="round"
                      strokeDasharray={c} strokeDashoffset={offset}
                      style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.23,1,0.32,1)', filter: `drop-shadow(0 0 12px ${rank.color}50)` }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl mb-0.5">{rank.emoji}</span>
                    <span className="text-5xl font-heading font-black tracking-tighter" style={{ color: rank.color }}>{rank.rank}</span>
                    <span className="text-xs font-heading font-bold text-muted-foreground mt-0.5">
                      <Counter value={data.s} /> pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2">
                {stats.map((s, i) => (
                  <div key={s.label} className="text-center p-2.5 rounded-xl transition-all duration-500"
                    style={{ background: `${s.color}06`, transitionDelay: `${800 + i * 100}ms`, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(8px)' }}>
                    <s.icon size={14} className="mx-auto mb-1" style={{ color: s.color }} />
                    <p className="text-sm font-heading font-bold">{s.val}<span className="text-[8px] text-muted-foreground font-normal ml-0.5">{s.unit}</span></p>
                    <p className="text-[7px] text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Daily goal */}
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/30">
                <Droplets size={14} className="text-blue-500" />
                <span className="text-xs text-muted-foreground">Daily Goal:</span>
                <span className="text-sm font-heading font-bold">{data.gl}<span className="text-[10px] text-muted-foreground ml-0.5">ml</span></span>
              </div>

              {/* Date + branding */}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-1.5">
                  <Droplets size={10} className="text-blue-500" />
                  <span className="text-[9px] font-semibold text-muted-foreground">AquaPulse</span>
                </div>
                <span className="text-[9px] text-muted-foreground">{data.d}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA below the card */}
        <div className="mt-4 space-y-2">
          <a href="/" className="block">
            <Button className={`w-full h-11 rounded-2xl text-sm gap-2 press-scale bg-gradient-to-r ${rank.bg} border-0 text-white hover:opacity-90`}>
              <Droplets size={15} /> Start Your Journey
            </Button>
          </a>
          <p className="text-center text-[9px] text-muted-foreground">
            Free wellness tracker · No signup required
          </p>
          <p className="text-center text-[9px] text-muted-foreground flex items-center justify-center gap-1">
            Made by <a href="https://1619.in" target="_blank" rel="noopener noreferrer" className="text-primary font-medium inline-flex items-center gap-0.5 hover:underline">1619.in <ExternalLink size={7} /></a>
          </p>
        </div>
      </div>
    </div>
  );
}
