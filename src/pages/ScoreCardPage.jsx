import { useMemo, useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { useApp } from '@/context/AppContext';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { calculateStreakData, getScoreRank, encodeScoreCard } from '@/lib/scoring';
import { Button } from '@/components/ui/button';
import { Share2, Trophy, Flame, Target, Droplets, TrendingUp, Star, Copy, Check, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

function AnimatedRing({ score, size = 140, delay = 300 }) {
  const [animated, setAnimated] = useState(false);
  const rank = getScoreRank(score);
  const sw = 10;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${rank.color}20 0%, transparent 70%)`, filter: 'blur(12px)' }} />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw - 3} className="text-muted/20" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={rank.color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={animated ? c - (score / 100) * c : c}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.23,1,0.32,1)', filter: `drop-shadow(0 0 10px ${rank.color}50)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg">{rank.emoji}</span>
        <span className="text-4xl font-heading font-black tracking-tight" style={{ color: rank.color }}>{rank.rank}</span>
        <span className="text-[10px] font-bold text-muted-foreground">{score} pts</span>
      </div>
    </div>
  );
}

export function ScoreCardPage() {
  const { profile } = useApp();
  const { getTotalForDate } = useWaterTracker();
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => calculateStreakData(getTotalForDate, profile.dailyWaterGoal, 30), [getTotalForDate, profile.dailyWaterGoal]);
  const firstName = profile.name ? profile.name.trim().split(/\s+/)[0] : 'User';

  const shareLink = useMemo(() => {
    const encoded = encodeScoreCard({
      n: firstName,
      s: data.avgScore,
      st: data.streak,
      ms: data.maxStreak,
      g: data.goalDays,
      a: data.activeDays,
      gl: profile.dailyWaterGoal,
      tl: data.totalLiters,
      d: format(new Date(), 'yyyy-MM-dd'),
    });
    return `${window.location.origin}/score?d=${encoded}`;
  }, [firstName, data, profile.dailyWaterGoal]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareLink); setCopied(true); toast.success('Link copied!', { description: 'Anyone with this link can see your score' }); setTimeout(() => setCopied(false), 2000); } catch { toast.error('Copy failed'); }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${firstName}'s Hydration Score`, text: `${rank.emoji} I scored ${data.avgScore}pts (Rank ${rank.rank}) on AquaPulse! Can you beat me?`, url: shareLink }); } catch {}
    } else handleCopy();
  };

  const rank = data.overallRank;

  return (
    <div className="pb-safe">
      <PageHeader title="Score Card" subtitle="Your achievement" showBack />
      <div className="px-4 mt-2 space-y-3">

        {/* Achievement card */}
        <div className={`rounded-2xl overflow-hidden bg-gradient-to-br ${rank.bg} p-[2px]`}>
          <div className="rounded-2xl bg-card overflow-hidden">
            {/* Top gradient banner */}
            <div className={`h-2 bg-gradient-to-r ${rank.bg}`} />

            <div className="p-5 space-y-4">
              {/* Name + badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-heading font-bold text-white">{firstName[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold">{firstName}</p>
                    <p className="text-[9px] text-muted-foreground">30-Day Hydration Report</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ background: `${rank.color}12`, color: rank.color }}>
                  <Star size={9} /> {rank.label}
                </div>
              </div>

              {/* Score ring */}
              <div className="flex justify-center py-1">
                <AnimatedRing score={data.avgScore} />
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { icon: Flame, val: `${data.streak}`, unit: 'days', label: 'Streak', color: '#f59e0b' },
                  { icon: Trophy, val: `${data.maxStreak}`, unit: 'days', label: 'Best', color: '#22c55e' },
                  { icon: Target, val: `${data.goalDays}`, unit: '/30', label: 'Goals', color: '#3b82f6' },
                  { icon: Zap, val: data.totalLiters, unit: 'L', label: 'Total', color: '#a855f7' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: `${s.color}08` }}>
                    <s.icon size={13} className="mx-auto mb-0.5" style={{ color: s.color }} />
                    <p className="text-xs font-bold">{s.val}<span className="text-[8px] text-muted-foreground font-normal">{s.unit}</span></p>
                    <p className="text-[7px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* 14-day heatmap */}
              <div>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1.5">Activity — Last 14 Days</p>
                <div className="flex gap-[3px]">
                  {data.dailyScores.slice(0, 14).reverse().map((d, i) => {
                    const r = getScoreRank(d.score);
                    return (
                      <div key={i} className="flex-1 h-5 rounded-[3px] transition-all duration-500"
                        style={{ background: d.score > 0 ? `${r.color}35` : 'var(--muted)', animationDelay: `${i * 50}ms`, minWidth: 0 }} />
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-1">
                  <Droplets size={9} className="text-blue-500" />
                  <span className="text-[8px] text-muted-foreground font-medium">AquaPulse</span>
                </div>
                <span className="text-[8px] text-muted-foreground">{format(new Date(), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-9 rounded-xl text-xs gap-1.5 press-scale" onClick={handleShare}>
            <Share2 size={13} /> Share Card
          </Button>
          <Button variant="outline" className="h-9 rounded-xl text-xs gap-1.5 press-scale" onClick={handleCopy}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>

        {/* Ranks explanation */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="text-xs font-semibold">Rank System</h3>
          <div className="space-y-1.5">
            {[
              { rank: 'S', label: 'Legendary', color: '#f59e0b', emoji: '👑', req: '95+ pts' },
              { rank: 'A', label: 'Excellent', color: '#22c55e', emoji: '🏆', req: '80–94 pts' },
              { rank: 'B', label: 'Great', color: '#3b82f6', emoji: '💪', req: '60–79 pts' },
              { rank: 'C', label: 'Good Start', color: '#a855f7', emoji: '🌱', req: '40–59 pts' },
              { rank: 'D', label: 'Building', color: '#f97316', emoji: '🔥', req: '20–39 pts' },
            ].map((r) => (
              <div key={r.rank} className="flex items-center gap-2 text-[10px]">
                <span className="w-6 h-6 rounded-md flex items-center justify-center font-black" style={{ background: `${r.color}12`, color: r.color }}>{r.rank}</span>
                <span className="text-muted-foreground flex-1">{r.emoji} {r.label}</span>
                <span className="text-muted-foreground/60">{r.req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
