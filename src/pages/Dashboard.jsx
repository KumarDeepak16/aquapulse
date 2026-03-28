import { useApp } from '@/context/AppContext';
import { useWaterTracker } from '@/hooks/useWaterTracker';
import { useSound } from '@/hooks/useSound';
import { WaterRing } from '@/components/water/WaterRing';
import { WaterLogButton } from '@/components/water/WaterLogButton';
import { WaterHistory } from '@/components/water/WaterHistory';
import { Droplets, Target, TrendingUp, Search, Sun, Moon, Monitor } from 'lucide-react';
import { toastWaterAdded, toastGoalReached } from '@/lib/toasts';
import { useState, useEffect } from 'react';

function ThemeToggle() {
  const { settings, toggleTheme } = useApp();
  return (
    <button onClick={toggleTheme} className="w-9 h-9 rounded-xl glass-card flex items-center justify-center press-scale" title={`Theme: ${settings.theme}`}>
      <div className="relative w-4.5 h-4.5">
        <Sun size={18} className={`absolute inset-0 transition-all duration-300 ${settings.theme === 'light' ? 'opacity-100 rotate-0 scale-100 text-amber-500' : 'opacity-0 rotate-90 scale-50'}`} />
        <Moon size={18} className={`absolute inset-0 transition-all duration-300 ${settings.theme === 'dark' ? 'opacity-100 rotate-0 scale-100 text-indigo-400' : 'opacity-0 -rotate-90 scale-50'}`} />
        <Monitor size={17} className={`absolute inset-0 transition-all duration-300 ${settings.theme === 'system' ? 'opacity-100 rotate-0 scale-100 text-muted-foreground' : 'opacity-0 rotate-90 scale-50'}`} />
      </div>
    </button>
  );
}

function LiquidStatCard({ icon: Icon, value, label, fillPercent, baseColor, fillColor, waveDark, delay }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay + 100); return () => clearTimeout(t); }, [delay]);
  const level = mounted ? Math.min(100, Math.max(0, fillPercent)) : 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-3 text-center stagger-in ${baseColor}`} style={{ animationDelay: `${delay}ms` }}>
      {/* Liquid fill */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
          style={{
            height: `${level}%`,
            background: fillColor,
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {/* Wave SVG on top of liquid */}
          <svg className="absolute top-0 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: '8px', transform: 'translateY(-6px)' }}>
            <path fill={waveDark} opacity="0.4">
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="M0 6 Q25 0,50 6 Q75 12,100 6 Q125 0,150 6 Q175 12,200 6 L200 12 L0 12Z;M0 6 Q25 12,50 6 Q75 0,100 6 Q125 12,150 6 Q175 0,200 6 L200 12 L0 12Z;M0 6 Q25 0,50 6 Q75 12,100 6 Q125 0,150 6 Q175 12,200 6 L200 12 L0 12Z"
              />
            </path>
            <path fill={waveDark} opacity="0.25">
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="M0 6 Q30 10,60 6 Q90 2,120 6 Q150 10,180 6 Q195 2,200 6 L200 12 L0 12Z;M0 6 Q30 2,60 6 Q90 10,120 6 Q150 2,180 6 Q195 10,200 6 L200 12 L0 12Z;M0 6 Q30 10,60 6 Q90 2,120 6 Q150 10,180 6 Q195 2,200 6 L200 12 L0 12Z"
              />
            </path>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Icon size={15} className="text-white/80 mx-auto mb-1" />
        <p className="text-xl font-heading font-bold tracking-tight text-white">{value}</p>
        <p className="text-[8px] text-white/60 font-medium tracking-wider uppercase">{label}</p>
      </div>
    </div>
  );
}

export function Dashboard({ onSearchOpen }) {
  const { profile } = useApp();
  const { todayTotal, todayEntries, addWater, removeWater } = useWaterTracker();
  const { play } = useSound();
  const [celebrated, setCelebrated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAddWater = (amount) => {
    addWater(amount);
    const newTotal = todayTotal + amount;
    if (newTotal >= profile.dailyWaterGoal && !celebrated) {
      play('success-chime');
      setCelebrated(true);
      setShowConfetti(true);
      toastGoalReached();
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      toastWaterAdded(amount);
    }
  };

  const remaining = Math.max(0, profile.dailyWaterGoal - todayTotal);
  const pct = profile.dailyWaterGoal > 0 ? (todayTotal / profile.dailyWaterGoal) * 100 : 0;
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile.name ? profile.name.trim().split(/\s+/)[0] : '';

  return (
    <div className="px-4 pb-safe pt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between slide-up">
        <div>
          <h1 className="text-xl font-heading font-bold tracking-tight">
            {greeting}{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Stay hydrated, stay healthy</p>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button onClick={onSearchOpen} className="w-9 h-9 rounded-xl glass-card flex items-center justify-center press-scale">
            <Search size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Water Ring */}
      <div className="flex justify-center py-2 slide-up relative" style={{ animationDelay: '80ms' }}>
        <WaterRing current={todayTotal} goal={profile.dailyWaterGoal} size={200} />
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="absolute animate-confetti" style={{
                left: `${25 + Math.random() * 50}%`, top: `${35 + Math.random() * 30}%`,
                width: 7, height: 7, borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: ['var(--primary)','var(--water)','var(--success)','var(--warning)','var(--secondary)'][i % 5],
                animationDelay: `${i * 0.06}s`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Quick add */}
      <div className="slide-up" style={{ animationDelay: '150ms' }}>
        <WaterLogButton onAdd={handleAddWater} />
      </div>

      {/* Stats with liquid fill */}
      <div className="grid grid-cols-3 gap-2.5">
        <LiquidStatCard
          icon={Droplets}
          value={todayTotal}
          label="Drunk"
          fillPercent={pct}
          baseColor="bg-blue-600 dark:bg-blue-700"
          fillColor="rgba(96, 165, 250, 0.45)"
          waveDark="rgba(96, 165, 250, 0.6)"
          delay={200}
        />
        <LiquidStatCard
          icon={Target}
          value={profile.dailyWaterGoal}
          label="Goal"
          fillPercent={100}
          baseColor="bg-indigo-600 dark:bg-indigo-700"
          fillColor="rgba(129, 140, 248, 0.3)"
          waveDark="rgba(129, 140, 248, 0.5)"
          delay={250}
        />
        <LiquidStatCard
          icon={TrendingUp}
          value={remaining}
          label="Left"
          fillPercent={remaining > 0 ? 100 - pct : 0}
          baseColor="bg-emerald-600 dark:bg-emerald-700"
          fillColor="rgba(74, 222, 128, 0.35)"
          waveDark="rgba(74, 222, 128, 0.55)"
          delay={300}
        />
      </div>

      {/* Today's log */}
      <div className="slide-up" style={{ animationDelay: '350ms' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">Today's Log</h3>
          <span className="text-[10px] text-muted-foreground">{todayEntries.length} entries</span>
        </div>
        <div className="glass-card p-2.5">
          <WaterHistory entries={todayEntries} onRemove={removeWater} compact />
        </div>
      </div>
    </div>
  );
}
