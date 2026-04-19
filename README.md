# CloseBy

**A real-time navigation companion for safer walking at night.**

CloseBy is an interactive mobile prototype that guides users along safety-scored walking routes, with an optional AI companion that checks in during the walk and alerts contacts if something goes wrong.

---

## Live Demo

**[pazpeleg8.github.io/closeBy](https://pazpeleg8.github.io/closeBy/)**

---

## Features

- Search destination and compare safety-scored routes
- Animated walking view — user pin moves along the route in real time
- Live safety score updates as you pass through different zones
- AI companion: simulated voice call with check-in countdown
- Unresponsive flow: auto-notifies emergency contacts
- Incident report sheet with confirmation
- Responsive: two-column desktop layout, full-screen mobile

---

## Tech Stack

- React 18 (via Babel CDN — no build step)
- Vanilla CSS with design tokens
- SVG map with `requestAnimationFrame` animation
- Pure static files — no backend, no npm

---

## Run Locally

```bash
git clone https://github.com/pazpeleg8/closeBy.git
cd closeBy
python3 -m http.server 8080
# open http://localhost:8080
```

---

## File Structure

```
closeBy/
├── index.html      ← entry point + main app logic
├── tokens.css      ← design tokens (colors, fonts)
├── Icons.jsx       ← SVG icon components
├── Chrome.jsx      ← shared UI (status bar, bottom sheet, score badge)
├── MapCanvas.jsx   ← SVG map + route animation
├── Home.jsx        ← home + search screens
├── Routes.jsx      ← route comparison screen
├── Walking.jsx     ← walking, companion, and report screens
└── assets/
    └── logo-wordmark.svg
```
