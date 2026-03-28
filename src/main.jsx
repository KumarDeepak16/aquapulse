import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Console branding
console.log(
  '%c AquaPulse %c v1.0.0 ',
  'background: #4f46e5; color: #fff; font-size: 14px; font-weight: 700; padding: 4px 8px; border-radius: 6px 0 0 6px;',
  'background: #1e1b4b; color: #a5b4fc; font-size: 14px; padding: 4px 8px; border-radius: 0 6px 6px 0;'
);
console.log(
  '%cDeveloper   %cDeepak Kumar — https://1619.in\n' +
  '%cGitHub      %chttps://github.com/KumarDeepak16/aquapulse\n' +
  '%cLicense     %cMIT — fork it, make it yours.',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #999; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #999; font-size: 11px;',
  'color: #4f46e5; font-weight: 700; font-size: 11px;', 'color: #999; font-size: 11px;',
);

// Service worker with auto-update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');

      // On new SW ready — auto reload (no hard refresh needed)
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // If there was already a controller, this is an update
            if (navigator.serviceWorker.controller) {
              window.location.reload();
            }
          }
        });
      });

      // Check for updates on focus (when user comes back to tab)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update();
      });
    } catch {
      // SW not supported or failed
    }
  });
}
