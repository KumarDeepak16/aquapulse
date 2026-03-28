import { useMemo, useRef, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { useApp } from '@/context/AppContext';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { calculateStreakData, getScoreRank, encodeScoreCard } from '@/lib/scoring';
import { Button } from '@/components/ui/button';
import { Share2, Download, Link2, Trophy, Flame, Target, Droplets, TrendingUp, Star, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

function ScoreRing({ score, size = 120 }) {
  const rank = getScoreRank(score);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth - 2} className="text-muted/40" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={rank.color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" style={{ transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)', filter: `drop-shadow(0 0 6px ${rank.color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-heading font-black" style={{ color: rank.color }}>{rank.rank}</span>
        <span className="text-[9px] text-muted-foreground font-medium">{score}pts</span>
      </div>
    </div>
  );
}

export function ScoreCardPage() {
  const { profile } = useApp();
  const { getTotalForDate } = useWaterTracker();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const data = useMemo(() => calculateStreakData(getTotalForDate, profile.dailyWaterGoal, 30), [getTotalForDate, profile.dailyWaterGoal]);
  const firstName = profile.name ? profile.name.trim().split(/\s+/)[0] : 'User';

  const shareLink = useMemo(() => {
    const cardData = {
      n: firstName,
      s: data.avgScore,
      st: data.streak,
      ms: data.maxStreak,
      g: data.goalDays,
      a: data.activeDays,
      gl: profile.dailyWaterGoal,
      d: format(new Date(), 'yyyy-MM-dd'),
    };
    const encoded = encodeScoreCard(cardData);
    return `${window.location.origin}/score?d=${encoded}`;
  }, [firstName, data, profile.dailyWaterGoal]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied!', { description: 'Share it with friends' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${firstName}'s AquaPulse Score`,
          text: `I scored ${data.avgScore} points on AquaPulse! Rank: ${data.overallRank.rank} — ${data.overallRank.label}. Can you beat me?`,
          url: shareLink,
        });
      } catch { /* cancelled */ }
    } else {
      handleCopyLink();
    }
  };

  const stats = [
    { icon: Flame, label: 'Streak', value: `${data.streak}d`, color: 'text-amber-500' },
    { icon: Trophy, label: 'Best Streak', value: `${data.maxStreak}d`, color: 'text-emerald-500' },
    { icon: Target, label: 'Goals Met', value: `${data.goalDays}/30`, color: 'text-blue-500' },
    { icon: TrendingUp, label: 'Active Days', value: `${data.activeDays}/30`, color: 'text-indigo-500' },
  ];

  return (
    <div className="pb-safe">
      <PageHeader title="Score Card" subtitle="Your hydration rating" showBack />
      <div className="px-4 mt-2 space-y-3">

        {/* Main score card */}
        <div ref={cardRef} className={`rounded-2xl overflow-hidden bg-gradient-to-br ${data.overallRank.bg} p-[1px]`}>
          <div className="bg-card rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Hydration Score</p>
                <p className="text-sm font-heading font-bold mt-0.5">{firstName}'s Card</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: `${data.overallRank.color}15`, color: data.overallRank.color }}>
                <Star size={9} /> {data.overallRank.label}
              </div>
            </div>

            {/* Score ring */}
            <div className="flex justify-center py-2">
              <ScoreRing score={data.avgScore} size={130} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon size={14} className={`${s.color} mx-auto mb-0.5`} />
                  <p className="text-xs font-bold">{s.value}</p>
                  <p className="text-[8px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Mini heatmap — last 14 days */}
            <div>
              <p className="text-[9px] text-muted-foreground mb-1.5">Last 14 days</p>
              <div className="flex gap-1">
                {data.dailyScores.slice(0, 14).reverse().map((d, i) => {
                  const rank = getScoreRank(d.score);
                  return (
                    <div
                      key={i}
                      className="flex-1 h-6 rounded-sm transition-all"
                      style={{ background: d.score > 0 ? `${rank.color}30` : 'var(--muted)', minWidth: 0 }}
                      title={`${d.score} pts`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Droplets size={10} className="text-blue-500" />
                <span className="text-[9px] text-muted-foreground">AquaPulse</span>
              </div>
              <span className="text-[9px] text-muted-foreground">{format(new Date(), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Share actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-9 rounded-xl text-xs gap-1.5 press-scale" onClick={handleShare}>
            <Share2 size={13} /> Share
          </Button>
          <Button variant="outline" className="h-9 rounded-xl text-xs gap-1.5 press-scale" onClick={handleCopyLink}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>

        {/* How scoring works */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="text-xs font-semibold">How Scoring Works</h3>
          <div className="space-y-1.5 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center font-bold text-amber-500">S</span> 95+ pts — Hit goal every day</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center font-bold text-emerald-500">A</span> 80–94 pts — Consistently great</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center font-bold text-blue-500">B</span> 60–79 pts — Good habit forming</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-purple-500/15 flex items-center justify-center font-bold text-purple-500">C</span> 40–59 pts — Room for growth</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-orange-500/15 flex items-center justify-center font-bold text-orange-500">D</span> 20–39 pts — Getting started</div>
          </div>
        </div>
      </div>
    </div>
  );
}
