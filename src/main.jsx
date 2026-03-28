import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Developer console branding
console.log(
  '%c AquaPulse %c v1.0.0 ',
  'background: #4f46e5; color: #fff; font-size: 14px; font-weight: 700; padding: 4px 8px; border-radius: 6px 0 0 6px;',
  'background: #1e1b4b; color: #a5b4fc; font-size: 14px; padding: 4px 8px; border-radius: 0 6px 6px 0;'
);
console.log(
  '%cYour daily wellness companion — water tracking, reminders & more.\n\n' +
  '%cDeveloper   %cDeepak Kumar\n' +
  '%cWebsite     %chttps://1619.in\n' +
  '%cGitHub      %chttps://github.com/KumarDeepak16\n' +
  '%cRepo        %chttps://github.com/KumarDeepak16/aquapulse\n' +
  '%cStack       %cReact · Vite · Tailwind v4 · shadcn/ui · PWA\n' +
  '%cLicense     %cMIT — fork it, build on it, make it yours.\n',
  'color: #888; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #ccc; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #ccc; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #ccc; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #ccc; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #ccc; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #ccc; font-size: 11px;',
);

// Register service worker with update handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');

      // Check for updates every 30 minutes
      setInterval(() => reg.update(), 30 * 60 * 1000);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            // New version available — will activate on next visit
            console.log('[AquaPulse] New version cached. Refresh to update.');
          }
        });
      });
    } catch {
      // SW registration failed — app works fine without it
    }
  });
}
