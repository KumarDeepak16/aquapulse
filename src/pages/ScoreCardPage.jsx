import { useMemo, useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { useApp } from '@/context/AppContext';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { calculateStreakData, getScoreRank, encodeScoreCard } from '@/lib/scoring';
import { Button } from '@/components/ui/button';
import { Share2, Trophy, Flame, Target, Droplets, Star, Copy, Check, Zap, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

function Counter({ value, duration = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value <= 0) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return n;
}

function AnimatedRing({ score, size = 150 }) {
  const [on, setOn] = useState(false);
  const rank = getScoreRank(Math.max(score, 1));
  const sw = 10;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  useEffect(() => { setTimeout(() => setOn(true), 400); }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-4 rounded-full transition-opacity duration-1000" style={{ background: `radial-gradient(circle, ${rank.color}20 0%, transparent 70%)`, filter: 'blur(20px)', opacity: on ? 1 : 0 }} />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw - 3} className="text-muted/15" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={rank.color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={on ? c - (Math.max(score, 2) / 100) * c : c}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.23,1,0.32,1)', filter: `drop-shadow(0 0 10px ${rank.color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {score > 0 ? (
          <>
            <span className="text-xl mb-0.5">{rank.emoji}</span>
            <span className="text-5xl font-heading font-black tracking-tighter" style={{ color: rank.color }}>{rank.rank}</span>
            <span className="text-xs font-heading font-bold text-muted-foreground"><Counter value={score} /> pts</span>
          </>
        ) : (
          <>
            <Sparkles size={22} className="text-muted-foreground/40 mb-1" />
            <span className="text-xs text-muted-foreground font-medium">Start logging</span>
            <span className="text-[9px] text-muted-foreground">to earn your rank</span>
          </>
        )}
      </div>
    </div>
  );
}

function HeatmapCell({ score, index, onTap }) {
  const [hovered, setHovered] = useState(false);
  const rank = getScoreRank(Math.max(score, 1));
  return (
    <div
      className="flex-1 rounded-[3px] cursor-pointer transition-all duration-200 relative"
      style={{ background: score > 0 ? `${rank.color}${hovered ? '60' : '30'}` : 'var(--muted)', minWidth: 0, height: hovered ? 28 : 20, marginTop: hovered ? -4 : 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onTap?.(index)}
    >
      {hovered && score > 0 && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-foreground text-background text-[8px] font-bold whitespace-nowrap z-10">
          {score}pts
        </div>
      )}
    </div>
  );
}

function StatPill({ emoji, val, unit, label, color, delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), delay); }, [delay]);

  return (
    <div className="text-center p-2.5 rounded-xl transition-all duration-500"
      style={{ background: `${color}08`, opacity: show ? 1 : 0, transform: show ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)', transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }}>
      <span className="text-base block mb-0.5">{emoji}</span>
      <p className="text-sm font-heading font-bold">{val}<span className="text-[8px] text-muted-foreground font-normal ml-0.5">{unit}</span></p>
      <p className="text-[7px] text-muted-foreground uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

export function ScoreCardPage() {
  const { profile } = useApp();
  const { getTotalForDate } = useWaterTracker();
  const [copied, setCopied] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const data = useMemo(() => calculateStreakData(getTotalForDate, profile.dailyWaterGoal, 30), [getTotalForDate, profile.dailyWaterGoal]);
  const firstName = profile.name ? profile.name.trim().split(/\s+/)[0] : 'User';
  const rank = data.overallRank;
  const hasData = data.activeDays > 0;

  const shareLink = useMemo(() => {
    if (!hasData) return '';
    const encoded = encodeScoreCard({
      n: firstName, s: data.avgScore, st: data.streak, ms: data.maxStreak,
      g: data.goalDays, a: data.activeDays, gl: profile.dailyWaterGoal, tl: data.totalLiters,
      d: format(new Date(), 'yyyy-MM-dd'),
    });
    return `${window.location.origin}/score?d=${encoded}`;
  }, [firstName, data, profile.dailyWaterGoal, hasData]);

  const handleCopy = async () => {
    if (!shareLink) return;
    try { await navigator.clipboard.writeText(shareLink); setCopied(true); toast.success('Link copied!', { description: 'Share with friends to flex your rank' }); setTimeout(() => setCopied(false), 2000); } catch { toast.error('Copy failed'); }
  };

  const handleShare = async () => {
    if (!shareLink) return;
    if (navigator.share) {
      try { await navigator.share({ title: `${firstName}'s Hydration Score`, text: `${rank.emoji} Rank ${rank.rank} — ${data.avgScore}pts on AquaPulse! Can you beat me?`, url: shareLink }); } catch {}
    } else handleCopy();
  };

  const heatmapData = data.dailyScores.slice(0, 14).reverse();
  const selectedDayData = selectedDay !== null ? heatmapData[selectedDay] : null;

  return (
    <div className="pb-safe">
      <PageHeader title="Score Card" subtitle="Your achievement" showBack />
      <div className="px-4 mt-2 space-y-3">

        {/* Main card */}
        <div className="glass-card overflow-hidden slide-up">
          <div className="p-5 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-linear-to-br ${hasData ? rank.bg : 'from-muted-foreground/20 to-muted-foreground/10'} flex items-center justify-center`}>
                  <span className="text-base font-heading font-black text-white">{firstName[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-heading font-bold">{firstName}</p>
                  <p className="text-[9px] text-muted-foreground tracking-wide">{hasData ? '30-DAY HYDRATION REPORT' : 'START YOUR JOURNEY'}</p>
                </div>
              </div>
              {hasData && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ background: `${rank.color}12`, color: rank.color }}>
                  <Star size={9} /> {rank.label}
                </div>
              )}
            </div>

            {/* Ring */}
            <div className="flex justify-center">
              <AnimatedRing score={data.avgScore} />
            </div>

            {/* New user message */}
            {!hasData && (
              <div className="text-center p-3 rounded-xl bg-muted/30 stagger-in">
                <p className="text-xs font-semibold">Log your first water to start earning points</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Your score builds over 30 days of tracking</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-1.5">
              <StatPill emoji="🔥" val={data.streak} unit="d" label="Streak" color="#f59e0b" delay={600} />
              <StatPill emoji="🏆" val={data.maxStreak} unit="d" label="Best" color="#22c55e" delay={700} />
              <StatPill emoji="🎯" val={data.goalDays} unit="/30" label="Goals" color="#3b82f6" delay={800} />
              <StatPill emoji="⚡" val={data.totalLiters} unit="L" label="Total" color="#a855f7" delay={900} />
            </div>

            {/* Heatmap */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Activity · Last 14 Days</p>
                {selectedDayData && selectedDayData.score > 0 && (
                  <p className="text-[9px] font-semibold stagger-in" style={{ color: getScoreRank(selectedDayData.score).color }}>
                    {selectedDayData.score}pts · {selectedDayData.total}ml
                  </p>
                )}
              </div>
              <div className="flex gap-3 items-end">
                {heatmapData.map((d, i) => (
                  <HeatmapCell key={i} score={d.score} index={i} onTap={setSelectedDay} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-1.5">
                <Droplets size={10} className="text-blue-500" />
                <span className="text-[8px] text-muted-foreground font-semibold">AquaPulse</span>
              </div>
              <span className="text-[8px] text-muted-foreground">{format(new Date(), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Share — only if has data */}
        {hasData && (
          <div className="grid grid-cols-2 gap-2 slide-up" style={{ animationDelay: '200ms' }}>
            <Button className={`h-10 rounded-xl text-xs gap-1.5 press-scale bg-linear-to-r ${rank.bg} border-0 text-white hover:opacity-90`} onClick={handleShare}>
              <Share2 size={13} /> Share Card
            </Button>
            <Button variant="outline" className="h-10 rounded-xl text-xs gap-1.5 press-scale" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        )}

        {/* Next rank progress */}
        {hasData && data.avgScore < 95 && (
          <div className="glass-card p-4 slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold">Next Rank</h3>
              {(() => {
                const thresholds = [20, 40, 60, 80, 95];
                const next = thresholds.find((t) => t > data.avgScore) || 95;
                const nr = getScoreRank(next);
                return <span className="text-[9px] font-bold" style={{ color: nr.color }}>{nr.emoji} {nr.rank} — {nr.label}</span>;
              })()}
            </div>
            {(() => {
              const thresholds = [20, 40, 60, 80, 95];
              const next = thresholds.find((t) => t > data.avgScore) || 95;
              const prev = thresholds[thresholds.indexOf(next) - 1] || 0;
              const progress = ((data.avgScore - prev) / (next - prev)) * 100;
              const nr = getScoreRank(next);
              return (
                <>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: nr.color }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground">{data.avgScore} pts</span>
                    <span className="text-[9px] font-medium" style={{ color: nr.color }}>{next} pts needed</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Ranks */}
        <div className="glass-card p-4 space-y-2 slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-xs font-semibold">All Ranks</h3>
          <div className="space-y-1">
            {[
              { rank: 'S', label: 'Legendary', color: '#f59e0b', emoji: '👑', req: '95+' },
              { rank: 'A', label: 'Excellent', color: '#22c55e', emoji: '🏆', req: '80–94' },
              { rank: 'B', label: 'Great', color: '#3b82f6', emoji: '💪', req: '60–79' },
              { rank: 'C', label: 'Good Start', color: '#a855f7', emoji: '🌱', req: '40–59' },
              { rank: 'D', label: 'Building', color: '#f97316', emoji: '🔥', req: '20–39' },
            ].map((r) => {
              const isCurrent = hasData && r.rank === rank.rank;
              return (
                <div key={r.rank} className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${isCurrent ? 'bg-muted' : ''}`}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: `${r.color}12`, color: r.color }}>{r.rank}</span>
                  <span className="text-[10px] flex-1">{r.emoji} {r.label}</span>
                  <span className="text-[9px] text-muted-foreground">{r.req} pts</span>
                  {isCurrent && <ChevronRight size={10} style={{ color: r.color }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
