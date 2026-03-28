<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="AquaPulse" />
</p>

<h1 align="center">AquaPulse</h1>

<p align="center">
  <strong>Your daily wellness companion</strong><br/>
  Track water intake, set smart reminders, manage notes & monitor your health — all offline.
</p>

<p align="center">
  <a href="https://aquapulse.1619.in">Live Demo</a> ·
  <a href="https://github.com/KumarDeepak16/aquapulse/issues">Report Bug</a> ·
  <a href="https://github.com/KumarDeepak16/aquapulse/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-blue?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PWA-Offline-green?logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

---

## Features

| Feature | Description |
|---|---|
| **Water Tracker** | Animated liquid-fill stat cards, circular progress ring, quick-add buttons |
| **Smart Calculator** | BMI with health tips, ideal weight range, personalized water recommendation |
| **Smart Reminders** | Quick-add presets (Morning, Vitamins, Workout, Sleep) + full custom with weekday picker |
| **Water Reminders** | Configurable interval reminders with active hours & sound selection |
| **Notes** | Full-page editor with debounced autosave, save status indicator, search |
| **Profile & Analytics** | 30-day stats, active days, consistency %, streak tracking, body metrics |
| **Weekly Summary** | Interactive bar chart, stats grid, streak badge |
| **Water History** | Browse previous days with date navigator & 7-day quick grid |
| **Universal Search** | `Ctrl+K` to search notes, reminders, and navigate anywhere |
| **Dark Mode** | Animated toggle — light, dark, and system auto |
| **PWA** | Installable, works offline, service worker caching |
| **Sound Alerts** | Customizable notification sounds with volume control |

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) + [Vite 8](https://vite.dev) | UI framework & build tool |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling with design tokens |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component primitives (Radix) |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Recharts](https://recharts.org) | Weekly summary charts |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |
| [Lucide](https://lucide.dev) | Icon system |
| [date-fns](https://date-fns.org) | Date utilities |
| localStorage | All data persistence — no backend needed |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/KumarDeepak16/aquapulse.git
cd aquapulse

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui base components
│   ├── common/       # BottomNav, PageHeader, EmptyState, UniversalSearch
│   ├── water/        # WaterRing, WaterLogButton, WaterHistory, WaterCalculator
│   ├── reminders/    # ReminderCard, ReminderForm (with smart presets)
│   ├── notes/        # NoteCard, NoteList
│   ├── calculator/   # BMICalculator (with health tips & ideal weight)
│   └── summary/      # WeeklyChart, StatsGrid, StreakBadge
├── pages/            # Dashboard, Water, Reminders, Notes, Profile, Calculator, etc.
├── hooks/            # useWaterTracker, useReminders, useNotes, useSound, etc.
├── lib/              # utils, constants, calculations, sound-manager, toasts
└── context/          # AppContext (profile, settings, theme toggle)
public/
├── sw.js             # Service worker for offline support
├── manifest.json     # PWA manifest
├── robots.txt        # Search engine crawler rules
├── sitemap.xml       # Sitemap for SEO
└── sounds/           # Notification sound files
```

## Data & Privacy

All data is stored **locally** in your browser using `localStorage`. No data is sent to any server. No tracking. No cookies. Your health data stays on your device.

## Sound Files

The app ships with placeholder sound files. Replace them with real audio:

| File | Purpose |
|---|---|
| `public/sounds/water-drop.mp3` | Water reminder |
| `public/sounds/gentle-bell.mp3` | General reminder |
| `public/sounds/success-chime.mp3` | Goal celebration |

## Browser Support

- Chrome / Edge (desktop & mobile)
- Safari (iOS & macOS)
- Firefox (desktop & mobile)
- Any modern browser with PWA support

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Deepak Kumar** — [@KumarDeepak16](https://github.com/KumarDeepak16)

- Website: [1619.in](https://1619.in)
- GitHub: [github.com/KumarDeepak16](https://github.com/KumarDeepak16)

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <sub>Built with care by <a href="https://1619.in">1619.in</a></sub>
</p>
