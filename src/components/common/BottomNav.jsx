import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Droplets, Bell, StickyNote, MoreHorizontal } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/water', icon: Droplets, label: 'Water' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
  { path: '/notes', icon: StickyNote, label: 'Notes' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIndex = tabs.findIndex(
    (t) => t.path === '/' ? location.pathname === '/' : location.pathname.startsWith(t.path)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-border">
        <div className="max-w-lg mx-auto flex items-center justify-around h-14 px-1 relative">
          <div className="absolute top-0 h-[2px] rounded-full bg-primary transition-all duration-300 animate-spring"
            style={{ width: `${60 / tabs.length}%`, left: `${(activeIndex >= 0 ? activeIndex : 0) * (100 / tabs.length) + (100 / tabs.length - 60 / tabs.length) / 2}%` }}
          />
          {tabs.map((tab) => {
            const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path);
            const Icon = tab.icon;
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full press-scale transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[9px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
