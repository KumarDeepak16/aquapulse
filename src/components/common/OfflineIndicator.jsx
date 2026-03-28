import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const goOffline = () => { setOffline(true); setShow(true); };
    const goOnline = () => {
      setOffline(false);
      // Show "back online" briefly
      setTimeout(() => setShow(false), 2000);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline && !show) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[200] flex justify-center pt-2 px-4 pointer-events-none transition-all duration-300 ${offline || show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium shadow-lg pointer-events-auto ${
        offline
          ? 'bg-amber-500 text-white'
          : 'bg-emerald-500 text-white'
      }`}>
        {offline ? (
          <><WifiOff size={11} /> You're offline — app works fine</>
        ) : (
          <>Back online</>
        )}
      </div>
    </div>
  );
}
