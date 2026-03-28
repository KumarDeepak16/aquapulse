<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="AquaPulse" />
</p>

<h1 align="center">AquaPulse</h1>

<p align="center">
  <strong>Your daily wellness companion</strong><br/>
  Track water intake, set smart reminders, manage notes, build healthy habits — all offline.
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
| **Water Tracker** | Animated circular progress ring, liquid-fill stat cards, contextual entry icons (Sip/Glass/Bottle) |
| **Smart Calculator** | BMI calculator with health tips & ideal weight range. Water requirement based on weight, age, activity |
| **Smart Reminders** | Quick-add presets (Morning Routine, Vitamins, Workout, Sleep, etc.) + fully custom with weekday picker |
| **Water Reminders** | Configurable interval reminders (15min–2hr) with smart presets (Balanced, Active, Office Hours) |
| **Notes** | Full-page editor with 1.2s debounced autosave, save status indicator (Saved/Saving/Unsaved), search |
| **Tasks** | Minimal to-do list with add, complete, delete, clear completed |

### Analytics & Gamification
| Feature | Description |
|---|---|
| **Profile Dashboard** | 30-day analytics: total liters, avg daily, active days, consistency %, progress bars |
| **Score Card** | Habit rating system (S/A/B/C/D/F ranks), animated score ring, 14-day interactive heatmap |
| **Shareable Score** | Public achievement card via encrypted URL — anyone can view without the app |
| **Weekly Summary** | Interactive bar chart with tooltips, stats grid, streak badge |
| **Water History** | Browse any previous day with date navigator + 7-day quick grid |

### UX & Platform
| Feature | Description |
|---|---|
| **Dark Mode** | Animated toggle — light, dark, and system auto. Updates mobile browser chrome color |
| **Universal Search** | `Ctrl+K` to search notes, reminders, and navigate anywhere |
| **Offline Mode** | Service worker caches everything — app works fully offline after first load |
| **Import/Export** | Backup all data as JSON file, restore on another device |
| **Sound Alerts** | 3 notification sounds with volume slider + test play button |
| **PWA** | Installable on mobile & desktop, standalone mode, splash screen |

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
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |
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

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KumarDeepak16/aquapulse)

The repo includes `public/_redirects` for Netlify SPA routing.

---

## Project Structure

```
aquapulse/
├── public/
│   ├── _redirects              # Netlify SPA redirect
│   ├── favicon.svg             # App icon (SVG)
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker (cache-first strategy)
│   ├── robots.txt              # Crawler rules
│   ├── sitemap.xml             # SEO sitemap
│   ├── icons/
│   │   ├── icon-192.png        # PWA icon 192x192
│   │   └── icon-512.png        # PWA icon 512x512
│   └── sounds/
│       ├── water-drop.mp3      # Water reminder sound
│       ├── gentle-bell.mp3     # General reminder sound
│       └── success-chime.mp3   # Goal completion sound
│
├── src/
│   ├── main.jsx                # Entry point + SW registration + console branding
│   ├── App.jsx                 # Router, layout, reminder scheduler, theme
│   ├── index.css               # Tailwind v4 config, design tokens, animations
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (17 components)
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── chart.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── drawer.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── select.jsx
│   │   │   ├── separator.jsx
│   │   │   ├── slider.jsx
│   │   │   ├── sonner.jsx
│   │   │   ├── switch.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── toggle.jsx
│   │   │   ├── toggle-group.jsx
│   │   │   ├── badge.jsx
│   │   │   └── progress.jsx
│   │   │
│   │   ├── common/             # Shared app components
│   │   │   ├── BottomNav.jsx         # 5-tab bottom navigation
│   │   │   ├── PageHeader.jsx        # Page title + back button
│   │   │   ├── EmptyState.jsx        # Empty state placeholder
│   │   │   ├── OfflineIndicator.jsx  # Offline/online banner
│   │   │   └── UniversalSearch.jsx   # Ctrl+K search overlay
│   │   │
│   │   ├── water/              # Water tracking components
│   │   │   ├── WaterRing.jsx         # Animated SVG progress ring
│   │   │   ├── WaterLogButton.jsx    # Quick-add buttons (100/250/500ml)
│   │   │   ├── WaterHistory.jsx      # Entry list with contextual icons
│   │   │   ├── WaterCalculator.jsx   # Water requirement calculator
│   │   │   └── WaterReminderConfig.jsx  # Reminder settings + smart presets
│   │   │
│   │   ├── reminders/          # Reminder components
│   │   │   ├── ReminderCard.jsx      # Single reminder display
│   │   │   ├── ReminderForm.jsx      # Create/edit form + quick-add presets
│   │   │   └── ReminderList.jsx      # Reminder list with empty state
│   │   │
│   │   ├── notes/              # Note components
│   │   │   ├── NoteCard.jsx          # Note card with accent colors
│   │   │   ├── NoteForm.jsx          # Note creation form
│   │   │   └── NoteList.jsx          # Searchable note list
│   │   │
│   │   ├── calculator/         # Body calculator
│   │   │   └── BMICalculator.jsx     # BMI with gauge, tips, ideal weight
│   │   │
│   │   └── summary/            # Weekly summary
│   │       ├── WeeklyChart.jsx       # Recharts bar chart + tooltips
│   │       ├── StatsGrid.jsx         # 4-stat grid with icons
│   │       └── StreakBadge.jsx       # Streak flame badge
│   │
│   ├── pages/                  # Route pages
│   │   ├── Dashboard.jsx             # Home — ring, stats, log, theme toggle
│   │   ├── WaterPage.jsx            # Water calculator + reminders + history
│   │   ├── WaterHistoryPage.jsx     # Browse past days with date nav
│   │   ├── RemindersPage.jsx        # Reminder list + drawer form
│   │   ├── NotesPage.jsx            # Note list + navigation
│   │   ├── NoteEditorPage.jsx       # Full-page editor with autosave
│   │   ├── MorePage.jsx             # Menu: profile, tasks, tools, settings
│   │   ├── ProfilePage.jsx          # 30-day analytics + body metrics
│   │   ├── ScoreCardPage.jsx        # Interactive score card + share
│   │   ├── SharedScorePage.jsx      # Public score card (standalone, dark)
│   │   ├── TodosPage.jsx            # Task list
│   │   ├── CalculatorPage.jsx       # BMI + water calculator
│   │   ├── SummaryPage.jsx          # Weekly chart + stats + streak
│   │   ├── SettingsPage.jsx         # Profile, theme, sound, backup
│   │   ├── OnboardingPage.jsx       # 3-step setup wizard
│   │   └── NotFoundPage.jsx         # 404 page
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLocalStorage.js        # Generic localStorage hook
│   │   ├── useWaterTracker.js        # Water log CRUD + daily totals
│   │   ├── useReminders.js           # Reminder CRUD + toggle
│   │   ├── useNotes.js               # Note CRUD + search
│   │   ├── useTodos.js               # Todo CRUD + clear done
│   │   ├── useSound.js               # Sound playback with settings
│   │   ├── useNotification.js        # Browser notification API
│   │   └── useWeeklySummary.js       # 7-day aggregation
│   │
│   ├── lib/                    # Utilities & business logic
│   │   ├── utils.js                  # cn() helper
│   │   ├── constants.js              # Storage keys, defaults, presets
│   │   ├── storage.js                # localStorage wrapper
│   │   ├── calculations.js           # BMI, water goal formulas
│   │   ├── scoring.js                # Habit scoring, ranks, encode/decode
│   │   ├── date-utils.js             # Date formatting, week helpers
│   │   ├── sound-manager.js          # Audio singleton with preload
│   │   └── toasts.js                 # Friendly toast messages
│   │
│   └── context/
│       └── AppContext.jsx            # Global state: profile, settings, theme
│
├── index.html                  # HTML entry with PWA meta, OG tags, fonts
├── vite.config.js              # Vite + React + Tailwind + path aliases
├── jsconfig.json               # @/ path alias
├── components.json             # shadcn/ui configuration
├── package.json                # Dependencies & scripts
├── .gitignore                  # node_modules, dist, .claude, .env
└── README.md                   # This file
```

**Total: 16 pages · 18 components · 8 hooks · 8 utilities**

---

## Data & Privacy

- All data stored **locally** in `localStorage`
- **Zero tracking** — no analytics, no cookies, no server calls
- **No signup** required — works immediately
- **Import/Export** your data anytime as JSON backup
- Keys prefixed `AQUAPULSE_` and versioned for migrations

---

## Score Card & Sharing

AquaPulse includes a **gamified habit rating system**:

| Rank | Score | Emoji | Label |
|------|-------|-------|-------|
| S | 95+ | 👑 | Legendary |
| A | 80–94 | 🏆 | Excellent |
| B | 60–79 | 💪 | Great |
| C | 40–59 | 🌱 | Good Start |
| D | 20–39 | 🔥 | Building |
| F | 0–19 | 💧 | New Journey |

Share your score card via a **public link** — anyone can view it without installing the app. The card renders as a standalone dark-themed achievement page with animated score ring and stats.

---

## Sound Files

Replace placeholder sounds in `public/sounds/` with real audio:

| File | When it plays |
|---|---|
| `water-drop.mp3` | Water reminder interval |
| `gentle-bell.mp3` | Custom reminders |
| `success-chime.mp3` | Daily goal reached |

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | Desktop & Mobile |
| Safari | iOS & macOS |
| Firefox | Desktop & Mobile |
| Samsung Internet | Mobile |
| Any modern browser | PWA installable |

---

## Contributing

Contributions welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork → Clone → Branch → Code → Commit → Push → PR

git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
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
      <a href="https://1619.in">1619.in</a> ·
      <a href="https://github.com/KumarDeepak16">GitHub</a>
    </td>
  </tr>
</table>

## License

MIT — fork it, build on it, make it yours.

---

<p align="center">
  <sub>Built with 💧 by <a href="https://1619.in">1619.in</a></sub>
</p>
