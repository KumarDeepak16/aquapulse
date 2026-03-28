import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-destructive" />
      </div>
      <h1 className="text-2xl font-heading font-bold">404</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-5">Page not found</p>
      <Button onClick={() => navigate('/')} className="rounded-xl press-scale gap-1.5">
        <Home size={14} /> Go Home
      </Button>
    </div>
  );
}
