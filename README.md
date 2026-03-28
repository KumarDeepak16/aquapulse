<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="AquaPulse" />
</p>

<h1 align="center">AquaPulse</h1>

<p align="center">
  <strong>Your daily wellness companion</strong><br/>
  Track water intake, set smart reminders, manage notes, build healthy habits — all offline, all free.
</p>

<p align="center">
  <a href="https://aquapulse.1619.in">Live Demo</a> ·
  <a href="https://github.com/KumarDeepak16/aquapulse/issues">Report Bug</a> ·
  <a href="https://github.com/KumarDeepak16/aquapulse/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PWA-Offline_Ready-22c55e?logo=googlechrome&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/License-MIT-f59e0b" alt="License" />
  <img src="https://img.shields.io/github/stars/KumarDeepak16/aquapulse?style=flat&color=818cf8" alt="Stars" />
</p>

---

## What is AquaPulse?

AquaPulse is a **free, offline-first** Progressive Web App that helps you build and maintain healthy hydration habits. No signups, no servers, no tracking — your data stays on your device.

---

## Features

### Core
| Feature | Description |
|---|---|
| **Water Tracker** | Animated circular ring, liquid-fill stat cards, contextual entry icons (Sip / Glass / Bottle) |
| **Smart Calculator** | BMI with health tips, ideal weight range & gain/lose guidance. Water requirement by weight, age, activity |
| **Smart Reminders** | Quick-add presets (Morning, Vitamins, Workout, Sleep, Stand Up, Meal Prep) + full custom with weekday picker & quick-select (Weekdays / Weekend / Daily) |
| **Water Reminders** | Smart presets (Light Sips, Balanced, Active, Office Hours) + configurable interval (15min–2hr) with active hours |
| **Notes** | Full-page editor with 1.2s debounced autosave, live save status (Saved / Saving / Unsaved), search, optional reminder link |
| **Tasks** | Minimal to-do list — add, complete, delete, clear done |
| **Onboarding** | 3-step wizard with validation, activity level picker, profile summary before completing |

### Analytics & Gamification
| Feature | Description |
|---|---|
| **Profile Dashboard** | 30-day analytics: total liters, avg daily, active days, consistency %, body metrics, achievements |
| **Score Card** | Habit rating (S/A/B/C/D ranks), animated score ring with counter, 14-day interactive heatmap, next rank progress bar |
| **Shareable Score** | Public achievement card via encrypted URL — anyone can view without installing the app. Dark-themed standalone page with entrance animations |
| **Weekly Summary** | Interactive bar chart with tooltips, stats grid (avg / best / goals / completion), streak badge |
| **Water History** | Browse any previous day with date navigator + 7-day quick grid with goal indicators |

### UX & Platform
| Feature | Description |
|---|---|
| **Dark Mode** | Animated toggle (light / dark / system auto). Updates mobile browser chrome color in real-time |
| **Universal Search** | `Ctrl+K` / `Cmd+K` to search notes, reminders, and jump to any page |
| **Offline Mode** | Service worker caches everything — works fully offline. Auto-updates on new deploy without hard refresh |
| **Import / Export** | Backup all data as JSON. Restore on another device. Export includes profile, water log, reminders, notes, tasks, settings |
| **Storage Management** | Shows storage used as percentage bar with backup warning at 80%. Auto-cleans water entries older than 10 days. Profile & settings kept forever |
| **Delete Account** | 2-step confirmation showing exact data counts. Clears everything and returns to onboarding |
| **Sound Alerts** | 3 notification sounds with volume slider + test play button |
| **PWA** | Installable on mobile & desktop, standalone mode, custom icons (SVG, ICO, PNG, Apple Touch) |
| **Offline Indicator** | Amber banner when offline ("app works fine"), green "Back online" on reconnect |
| **Console Branding** | Developer credits & links in browser DevTools |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling with custom design tokens |
| [shadcn/ui](https://ui.shadcn.com) | Accessible components (Radix primitives) |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Recharts](https://recharts.org) | Charts & data visualization |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications with title + description |
| [Lucide](https://lucide.dev) | Icon system |
| [date-fns](https://date-fns.org) | Date utilities |
| localStorage | Data persistence (no backend) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/KumarDeepak16/aquapulse.git
cd aquapulse

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KumarDeepak16/aquapulse)

Includes `public/_redirects` for Netlify SPA routing.

---

## Project Structure

```
aquapulse/
├── public/
│   ├── _redirects                  # Netlify SPA redirect
│   ├── favicon.svg                 # SVG favicon
│   ├── favicon.ico                 # ICO favicon
│   ├── favicon-96x96.png           # PNG favicon 96x96
│   ├── apple-touch-icon.png        # Apple touch icon 180x180
│   ├── site.webmanifest            # PWA web manifest
│   ├── sw.js                       # Service worker (v3, cache-first)
│   ├── robots.txt                  # Crawler rules
│   ├── sitemap.xml                 # SEO sitemap
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   └── sounds/
│       ├── water-drop.mp3          # Water reminder
│       ├── gentle-bell.mp3         # General reminder
│       └── success-chime.mp3       # Goal celebration
│
├── src/
│   ├── main.jsx                    # Entry + SW registration + console branding
│   ├── App.jsx                     # Router, layout, reminder scheduler
│   ├── index.css                   # Tailwind v4 tokens, theme, animations
│   │
│   ├── components/
│   │   ├── ui/                     # 17 shadcn/ui primitives
│   │   ├── common/
│   │   │   ├── BottomNav.jsx       # 5-tab navigation
│   │   │   ├── PageHeader.jsx      # Title + back button
│   │   │   ├── EmptyState.jsx      # Empty placeholder
│   │   │   ├── OfflineIndicator.jsx # Online/offline banner
│   │   │   └── UniversalSearch.jsx # Ctrl+K search overlay
│   │   ├── water/
│   │   │   ├── WaterRing.jsx       # SVG progress ring with glow
│   │   │   ├── WaterLogButton.jsx  # Quick-add (100/250/500ml + custom)
│   │   │   ├── WaterHistory.jsx    # Entries with contextual icons
│   │   │   ├── WaterCalculator.jsx # Water requirement calculator
│   │   │   └── WaterReminderConfig.jsx # Reminders + smart presets
│   │   ├── reminders/
│   │   │   ├── ReminderCard.jsx    # Reminder with weekday dots
│   │   │   ├── ReminderForm.jsx    # Form + 6 quick-add presets
│   │   │   └── ReminderList.jsx    # List with empty state
│   │   ├── notes/
│   │   │   ├── NoteCard.jsx        # Card with accent colors
│   │   │   ├── NoteForm.jsx        # Note creation form
│   │   │   └── NoteList.jsx        # Searchable list
│   │   ├── calculator/
│   │   │   └── BMICalculator.jsx   # BMI + health tips + ideal weight
│   │   └── summary/
│   │       ├── WeeklyChart.jsx     # Bar chart + tooltips
│   │       ├── StatsGrid.jsx       # 4-stat grid
│   │       └── StreakBadge.jsx     # Flame badge
│   │
│   ├── pages/                      # 16 route pages
│   │   ├── Dashboard.jsx           # Home — ring, liquid stats, log
│   │   ├── WaterPage.jsx           # Calculator + reminders + history
│   │   ├── WaterHistoryPage.jsx    # Past days with date navigator
│   │   ├── RemindersPage.jsx       # Reminder list + drawer form
│   │   ├── NotesPage.jsx           # Note list
│   │   ├── NoteEditorPage.jsx      # Full-page editor with autosave
│   │   ├── MorePage.jsx            # Menu hub
│   │   ├── ProfilePage.jsx         # 30-day analytics + body metrics
│   │   ├── ScoreCardPage.jsx       # Score card + share + ranks
│   │   ├── SharedScorePage.jsx     # Public score (standalone dark page)
│   │   ├── TodosPage.jsx           # Task list
│   │   ├── CalculatorPage.jsx      # BMI + water calculator
│   │   ├── SummaryPage.jsx         # Weekly chart + stats
│   │   ├── SettingsPage.jsx        # Profile, theme, sound, storage, backup, delete
│   │   ├── OnboardingPage.jsx      # 3-step setup wizard
│   │   └── NotFoundPage.jsx        # 404
│   │
│   ├── hooks/                      # 8 custom hooks
│   │   ├── useLocalStorage.js      # Generic localStorage
│   │   ├── useWaterTracker.js      # Water CRUD + auto-cleanup (10 days)
│   │   ├── useReminders.js         # Reminder CRUD + toggle
│   │   ├── useNotes.js             # Note CRUD + search
│   │   ├── useTodos.js             # Todo CRUD + clear done
│   │   ├── useSound.js             # Sound playback
│   │   ├── useNotification.js      # Browser notifications
│   │   └── useWeeklySummary.js     # 7-day aggregation
│   │
│   ├── lib/                        # 8 utility modules
│   │   ├── utils.js                # cn() helper
│   │   ├── constants.js            # Keys, defaults, presets
│   │   ├── storage.js              # localStorage wrapper
│   │   ├── calculations.js         # BMI, water goal formulas
│   │   ├── scoring.js              # Habit scoring, ranks, encode/decode
│   │   ├── date-utils.js           # Date formatting
│   │   ├── sound-manager.js        # Audio singleton
│   │   └── toasts.js               # Friendly toast messages
│   │
│   └── context/
│       └── AppContext.jsx          # Profile, settings, theme toggle
│
├── index.html                      # HTML with PWA meta, OG, icons, fonts
├── vite.config.js                  # Vite + React + Tailwind + aliases
├── jsconfig.json                   # @/ path alias
├── components.json                 # shadcn/ui config
├── package.json                    # Dependencies & scripts
└── .gitignore                      # Excludes node_modules, dist, .claude, .agents
```

**16 pages · 18 components · 8 hooks · 8 utilities**

---

## Data & Privacy

| | |
|---|---|
| **Storage** | All data in browser `localStorage` (5MB quota) |
| **Retention** | Water entries: last 10 days. Profile, settings, notes, reminders: forever |
| **Tracking** | Zero. No analytics, no cookies, no server calls |
| **Signup** | None required — works immediately |
| **Backup** | Export/import as JSON file anytime |
| **Delete** | Full data wipe with 2-step confirmation in Settings |

---

## Score Card Ranks

| Rank | Score | Emoji | Title |
|------|-------|-------|-------|
| **S** | 95+ | 👑 | Legendary |
| **A** | 80–94 | 🏆 | Excellent |
| **B** | 60–79 | 💪 | Great |
| **C** | 40–59 | 🌱 | Good Start |
| **D** | 20–39 | 🔥 | Building |

Share your card via a public link — recipients see a standalone achievement page with animated score ring, stats, and a CTA to try AquaPulse.

---

## Sound Files

Replace placeholders in `public/sounds/` with real audio:

| File | Trigger |
|---|---|
| `water-drop.mp3` | Water reminder interval |
| `gentle-bell.mp3` | Custom reminders |
| `success-chime.mp3` | Daily goal reached |

---

## Contributing

Contributions welcome! Open an issue first to discuss.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
# Then open a Pull Request
```

---

## Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/KumarDeepak16">
        <img src="https://github.com/KumarDeepak16.png" width="80" style="border-radius:50%" alt="Deepak Kumar" /><br/>
        <strong>Deepak Kumar</strong>
      </a><br/>
      <a href="https://1619.in">1619.in</a> · <a href="https://github.com/KumarDeepak16">GitHub</a>
    </td>
  </tr>
</table>

## License

MIT — fork it, build on it, make it yours.

---

<p align="center">
  <sub>Built with 💧 by <a href="https://1619.in">1619.in</a></sub>
</p>
