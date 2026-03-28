import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider, useApp } from '@/context/AppContext';
import { BottomNav } from '@/components/common/BottomNav';
import { UniversalSearch } from '@/components/common/UniversalSearch';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { Dashboard } from '@/pages/Dashboard';
import { WaterPage } from '@/pages/WaterPage';
import { RemindersPage } from '@/pages/RemindersPage';
import { NotesPage } from '@/pages/NotesPage';
import { NoteEditorPage } from '@/pages/NoteEditorPage';
import { MorePage } from '@/pages/MorePage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { SummaryPage } from '@/pages/SummaryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { WaterHistoryPage } from '@/pages/WaterHistoryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { TodosPage } from '@/pages/TodosPage';
import { ScoreCardPage } from '@/pages/ScoreCardPage';
import { SharedScorePage } from '@/pages/SharedScorePage';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS, DEFAULT_WATER_REMINDERS } from '@/lib/constants';
import { isWithinActiveHours } from '@/lib/date-utils';
import { soundManager } from '@/lib/sound-manager';
import { toast } from 'sonner';

function ReminderScheduler() {
  const { settings } = useApp();
  const lastWaterReminder = useRef(Date.now()); // Start from now, not 0
  const lastReminderChecks = useRef({});
  const hasRequestedPermission = useRef(false);

  // Request notification permission once on mount
  useEffect(() => {
    if (hasRequestedPermission.current) return;
    hasRequestedPermission.current = true;

    if (settings.notificationsEnabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      // Delay permission request so it doesn't block app load
      setTimeout(() => Notification.requestPermission(), 3000);
    }
  }, [settings.notificationsEnabled]);

  useEffect(() => {
    const check = () => {
      const now = new Date();

      // ── Water reminders ──
      const waterConfig = getItem(STORAGE_KEYS.WATER_REMINDERS, DEFAULT_WATER_REMINDERS);
      if (
        waterConfig.enabled &&
        isWithinActiveHours(waterConfig.activeHoursStart, waterConfig.activeHoursEnd)
      ) {
        const elapsed = now.getTime() - lastWaterReminder.current;
        if (elapsed >= waterConfig.intervalMinutes * 60 * 1000) {
          lastWaterReminder.current = now.getTime();

          // Play sound
          if (settings.soundEnabled) {
            soundManager.play(waterConfig.sound || 'water-drop');
          }

          // In-app toast always
          toast('Time to hydrate! 💧', {
            description: 'Take a sip of water to stay on track',
            duration: 5000,
          });

          // Browser notification if allowed
          if (settings.notificationsEnabled) {
            try {
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification('AquaPulse — Hydration Reminder', {
                  body: 'Time to drink some water! 💧',
                  icon: '/favicon-96x96.png',
                  badge: '/favicon-96x96.png',
                  tag: 'water-reminder', // Prevents duplicate notifications
                  renotify: true,
                });
              }
            } catch {}
          }
        }
      }

      // ── Custom reminders ──
      const remindersData = getItem(STORAGE_KEYS.REMINDERS, { items: [] });
      const currentDay = now.getDay();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      remindersData.items.forEach((reminder) => {
        if (!reminder.enabled || !reminder.days.includes(currentDay) || reminder.time !== currentTime) return;

        const checkKey = `${reminder.id}-${currentTime}`;
        if (lastReminderChecks.current[checkKey]) return;

        lastReminderChecks.current[checkKey] = true;

        // Sound
        if (settings.soundEnabled) {
          soundManager.play(reminder.sound || 'gentle-bell');
        }

        // In-app toast
        toast(reminder.title, {
          description: reminder.notes || 'Reminder!',
          duration: 5000,
        });

        // Browser notification
        if (settings.notificationsEnabled) {
          try {
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(reminder.title, {
                body: reminder.notes || 'Time for your reminder!',
                icon: '/favicon-96x96.png',
                tag: `reminder-${reminder.id}`,
                renotify: true,
              });
            }
          } catch {}
        }

        // Clear check key after 2 min
        setTimeout(() => { delete lastReminderChecks.current[checkKey]; }, 120000);
      });
    };

    // Check every 15 seconds for more responsive reminders
    const interval = setInterval(check, 15000);

    // Also check immediately on mount
    check();

    return () => clearInterval(interval);
  }, [settings]);

  return null;
}

function AppContent() {
  const { profile } = useApp();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Public routes — no onboarding, no nav
  if (location.pathname === '/score') {
    return <SharedScorePage />;
  }

  // Onboarding gate
  if (!profile.onboardingComplete) {
    return <OnboardingPage />;
  }

  return (
    <>
      <ReminderScheduler />
      <div className="gradient-mesh" />

      <div className="flex justify-center hide-scrollbar">
        <main className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl min-h-dvh transition-all">
          <Routes>
            <Route path="/" element={<Dashboard onSearchOpen={() => setSearchOpen(true)} />} />
            <Route path="/water" element={<WaterPage />} />
            <Route path="/water/history" element={<WaterHistoryPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:id" element={<NoteEditorPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/scorecard" element={<ScoreCardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <BottomNav />
      <OfflineIndicator />
      <UniversalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
