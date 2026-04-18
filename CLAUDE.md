# CloseBy — Project CLAUDE.md

A static, no-build interactive prototype for **CloseBy**: a real-time navigation companion for safer walking at night. Built with React 18 + Babel standalone (CDN), all JSX files loaded via `<script type="text/babel">`.

---

## Current status (April 2026)

Prototype is **complete and working**. All screens functional with full interactivity:

- **Home** → Search → Routes → Walking → Arrive flow
- Animated walking: user pin moves along route in real-time (rAF, 36s loop)
- Live score changes through three zones (82 → 63 → 79) as walk progresses
- AI companion: simulated call with voice/silence waveform indicator, check-in countdown, unresponsive → notify contacts flow
- Report sheet with confirmation message
- Two-column desktop layout (one-pager brief + phone simulator), full-screen mobile
- Git repo on `main` branch, GitHub Pages compatible

---

## File structure

```
closeBy/
├── index.html        ← landing page + AppWithFlow (replaces App.jsx logic)
├── tokens.css        ← design tokens (colors, fonts, spacing)
├── Icons.jsx         ← inline SVG icon components (exported to window)
├── Chrome.jsx        ← StatusBar, BottomSheet, ScoreBadge, GlassButton, TopFade, scoreColor
├── MapCanvas.jsx     ← SVG map, route animation, user pin
├── Home.jsx          ← HomeSheet + SearchSheet
├── Routes.jsx        ← RoutesSheet
├── Walking.jsx       ← WalkingSheet + ReportSheet + CompanionActive
├── App.jsx           ← Phone frame + original App (NOT used at runtime — AppWithFlow in index.html takes over)
└── assets/
    └── logo-wordmark.svg
```

**Important:** `App.jsx` is loaded but its `App` component is shadowed by `AppWithFlow` defined inline in `index.html`. `AppWithFlow` is what actually renders. `App.jsx` only contributes the `Phone` component to `window`.

---

## Architecture: shared global scope

All `<script type="text/babel">` tags share the **same global scope** in the browser. This has two critical consequences:

### 1. No top-level `const` re-declarations across files
If two files both do `const { useState } = React;` at the top level, the browser throws a `SyntaxError` on the second declaration. 

**Rule:** Only `Walking.jsx` uses top-level destructuring (`const { useState, useEffect, useRef } = React`). All other files use `React.useState`, `React.useEffect`, etc. directly.

### 2. No duplicate function names at top level
`Walking.jsx` defines `fmt(s)`. `Home.jsx` uses `fmtTime(s)` (renamed to avoid collision). Never define the same global name in two files.

---

## Critical implementation details

### MapCanvas viewBox
The viewBox **must** be `"0 0 390 844"` — matching the Phone's exact pixel dimensions (390×844). An earlier version used `"0 0 780 780"` which caused the SVG to render as a 390×390 square inside the 390×844 phone via `meet` scaling, making the route and pins appear in the wrong position.

### Route segments
```js
const SEG = [
  { x1:115, y1:355, x2:115, y2:178, len:177 }, // north on Broadway
  { x1:115, y1:178, x2:278, y2:178, len:163 }, // east on W 14 St
  { x1:278, y1:178, x2:278, y2: 82, len: 96 }, // north on 5th Ave
];
const ROUTE_LEN = 436;
```

### Route drawing (dasharray math)
```js
// Completed segment (dim green)
strokeDasharray={`${drawn} ${remLen}`} strokeDashoffset="0"

// Remaining segment (bright gradient)
strokeDasharray={`${remLen} ${drawn}`} strokeDashoffset={remLen}
```

### Walk animation
`setInterval` was unreliable (stuttery). Uses `requestAnimationFrame` with timestamp modulo in `AppWithFlow` (index.html):
```js
const DURATION = 36000; // 36s per loop
function tick(ts) {
  if (!startTs.current) startTs.current = ts;
  const t = ((ts - startTs.current) % DURATION) / DURATION;
  setWalkProgress(t);
  rafRef.current = requestAnimationFrame(tick);
}
```

### Phone scaling (fitPhone)
The phone (390×844) is scaled to fit the right column via a JS `fitPhone()` function:
- Headline (`sim-header`) lives **outside** `simulator-inner` and is never scaled
- Only a negative **bottom** margin is applied after scaling — never negative top margin
- Negative top margin + `overflow:hidden` on `.simulator` clips the top of the phone

```js
inner.style.transform = 'scale(' + scale + ')';
if (scale < 1) {
  inner.style.marginBottom = '-' + Math.round((1 - scale) * natural) + 'px';
}
```

---

## Component prop contracts

### HomeSheet
```js
{ onStartSearch, onStartRoute, companionOn, onToggleCompanion }
```
Has full companion state machine internally (voice simulation, check-in countdown, unresponsive → notified). Uses `React.useState` directly.

### RoutesSheet
```js
{ destination, onStart, onBack, companionOn, onToggleCompanion }
```

### WalkingSheet
```js
{ route, routeProgress, onReport, onArrive, companionOn, onToggleCompanion }
```
`routeProgress` (0–1) drives score zone, ETA, progress bar, and live notes.

### ReportSheet
```js
{ onClose, onSubmit }
```
Shows confirmation screen for 1.8s after tapping a report item before calling `onSubmit`.

### CompanionActive
```js
{ onEnd }
```
Floating overlay (position absolute, top 116px). Handles its own voice/silence simulation and elapsed timer. Rendered by `AppWithFlow` when `companionOn && screen ∈ {home, routes, walking}`.

---

## Design tokens (tokens.css)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0E1620` | Dark background, text on light |
| `--cream` | `#F5EFE6` | Primary text on dark |
| `--cream-2` | `#EDE4D6` | Page background, simulator bg |
| `--apricot` | `#E89B6C` | Brand accent, CTAs |
| `--sage` | `#7DB39A` | Safe/positive states |
| `--clay` | `#C45A4A` | Alert/danger states |
| `--font-display` | Fraunces | Headlines |
| `--font-ui` | Inter Tight | All UI text |
| `--font-mono` | JetBrains Mono | Timer/data values |

---

## Known issues / watch out for

1. **`App.jsx` vs `AppWithFlow`** — `App.jsx` is a stub that gets overridden. If you edit routing logic, edit `AppWithFlow` in `index.html`, not `App.jsx`.

2. **Bottom sheet snaps** — `BottomSheet` in `Chrome.jsx` supports `snap="peek"` (160px), `"half"` (440px), `"full"` (720px). Walking screen uses `"half"` in `AppWithFlow` but `"peek"` in the original `App.jsx` (which isn't used). Don't change it back to peek.

3. **Score badge in TopPill** — `AppWithFlow` passes hardcoded `score={82}` to `ScoreBadge` in the walking TopPill. It does not update dynamically with `walkProgress`. This is intentional for the prototype.

4. **Mobile breakpoint** — Below 900px, `.brief` is hidden, `.sim-header` is hidden, `.flow` is hidden, and the phone frame CSS is overridden to fill 100dvh. The `fitPhone()` function early-returns at ≤900px.

5. **No build step** — Babel transpiles JSX in the browser at load time. This is fine for a prototype but slow on first load (~1–2s). Never introduce npm, webpack, or vite — keep it CDN-only.

---

## How to run

```bash
cd /Users/pazpeleg/projects/closeBy
python3 -m http.server 8080
# open http://localhost:8080
```

Or just open `index.html` directly in a browser (Babel CDN requires http:// for some browsers, not file://).
