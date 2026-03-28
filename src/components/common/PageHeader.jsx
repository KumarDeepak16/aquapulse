import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, subtitle, showBack = false, action }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-1">
      <div className="flex items-center gap-1.5">
        {showBack && (
          <button onClick={() => navigate(-1)} className="w-7 h-7 -ml-1 rounded-lg flex items-center justify-center hover:bg-muted press-scale">
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-lg font-heading font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
