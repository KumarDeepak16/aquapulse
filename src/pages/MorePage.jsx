import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { useApp } from '@/context/AppContext';
import { Calculator, BarChart3, Settings, ChevronRight, ExternalLink, User, History } from 'lucide-react';

export function MorePage() {
  const navigate = useNavigate();
  const { profile } = useApp();

  const items = [
    { label: 'Profile', desc: '30-day analytics & body metrics', icon: User, path: '/profile', color: 'bg-primary/10 text-primary' },
    { label: 'Water History', desc: 'Browse previous days', icon: History, path: '/water/history', color: 'bg-blue-500/10 text-blue-500 dark:text-blue-400' },
    { label: 'Calculator', desc: 'BMI & water calculator', icon: Calculator, path: '/calculator', color: 'bg-accent/15 text-accent' },
    { label: 'Weekly Summary', desc: 'Hydration stats & charts', icon: BarChart3, path: '/summary', color: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' },
    { label: 'Settings', desc: 'Theme, sound, notifications', icon: Settings, path: '/settings', color: 'bg-muted text-muted-foreground' },
  ];

  return (
    <div className="pb-safe">
      <PageHeader title="More" subtitle="Tools & settings" />

      {/* Profile card */}
      <div className="px-4 mt-2 mb-3">
        <div className="glass-card p-3 flex items-center gap-3 press-scale cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0">
            <span className="text-base font-heading font-bold text-white">{profile.name ? profile.name[0].toUpperCase() : 'A'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{profile.name || 'AquaPulse User'}</p>
            <p className="text-[10px] text-muted-foreground">{profile.weight}kg · {profile.height}cm · {profile.age}yr</p>
          </div>
          <ChevronRight size={14} className="text-muted-foreground/30" />
        </div>
      </div>

      <div className="px-4 space-y-1.5">
        {items.map((item, i) => (
          <div key={item.path} className="glass-card p-2.5 flex items-center gap-2.5 press-scale cursor-pointer stagger-in group"
            style={{ animationDelay: `${i * 40}ms` }} onClick={() => navigate(item.path)}>
            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold">{item.label}</p>
              <p className="text-[9px] text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
          </div>
        ))}
      </div>

      <div className="text-center mt-8 space-y-0.5">
        <p className="text-[9px] text-muted-foreground">AquaPulse v1.0.0</p>
        <p className="text-[9px] text-muted-foreground">Made by <a href="https://1619.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">1619.in <ExternalLink size={7} className="inline" /></a></p>
      </div>
    </div>
  );
}
