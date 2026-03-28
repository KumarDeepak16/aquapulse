import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS, DEFAULT_WATER_REMINDERS } from '@/lib/constants';
import { isWithinActiveHours } from '@/lib/date-utils';
import { soundManager } from '@/lib/sound-manager';

function ReminderScheduler() {
  const { settings } = useApp();
  const lastWaterReminder = useRef(0);
  const lastReminderChecks = useRef({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const waterConfig = getItem(STORAGE_KEYS.WATER_REMINDERS, DEFAULT_WATER_REMINDERS);
      if (
        waterConfig.enabled &&
        settings.notificationsEnabled &&
        isWithinActiveHours(waterConfig.activeHoursStart, waterConfig.activeHoursEnd)
      ) {
        const elapsed = now.getTime() - lastWaterReminder.current;
        if (elapsed >= waterConfig.intervalMinutes * 60 * 1000) {
          lastWaterReminder.current = now.getTime();
          if (settings.soundEnabled) soundManager.play(waterConfig.sound);
          try {
            if (Notification.permission === 'granted') {
              new Notification('Time to hydrate!', {
                body: 'Take a sip of water to stay on track.',
                icon: '/favicon.svg',
              });
            }
          } catch {}
        }
      }

      const remindersData = getItem(STORAGE_KEYS.REMINDERS, { items: [] });
      const currentDay = now.getDay();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      remindersData.items.forEach((reminder) => {
        if (
          reminder.enabled &&
          reminder.days.includes(currentDay) &&
          reminder.time === currentTime &&
          settings.notificationsEnabled
        ) {
          const checkKey = `${reminder.id}-${currentTime}`;
          if (!lastReminderChecks.current[checkKey]) {
            lastReminderChecks.current[checkKey] = true;
            if (settings.soundEnabled) soundManager.play(reminder.sound);
            try {
              if (Notification.permission === 'granted') {
                new Notification(reminder.title, {
                  body: reminder.notes || 'Time for your reminder!',
                  icon: '/favicon.svg',
                });
              }
            } catch {}
            setTimeout(() => { delete lastReminderChecks.current[checkKey]; }, 120000);
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [settings]);

  return null;
}

function AppContent() {
  const { profile } = useApp();
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

  if (!profile.onboardingComplete) {
    return <OnboardingPage />;
  }

  return (
    <>
      <ReminderScheduler />
      {/* Gradient mesh background */}
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <BottomNav />
      <OfflineIndicator />
      <UniversalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          className: 'glass-card !border-glass-border',
        }}
      />
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
