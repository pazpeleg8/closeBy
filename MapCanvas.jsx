/* global React */
const { useMemo } = React;

// Stylized dark-map canvas. SVG-only; not a real tile layer.
// Renders water, parks, a road network, route polyline with apricot dashes,
// and labels. Pins and the live confidence overlay are optional props.

function MapCanvas({ routeProgress = 0, showRoute = true, variant = "home" }) {
  // Route polyline — a believable walking path
  const route = "M 60 640 C 90 560 140 520 210 540 S 330 620 360 580 S 440 460 470 440 S 560 380 600 310 S 680 210 720 160";
  const routeLen = 1200; // approximate length for dashoffset
  const draw = routeLen * (1 - routeProgress);

  return (
    <svg viewBox="0 0 780 780" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4F8A72"/>
          <stop offset="50%" stopColor="#E89B6C"/>
          <stop offset="100%" stopColor="#F2B088"/>
        </linearGradient>
        <radialGradient id="userHalo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E89B6C" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#E89B6C" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Base land */}
      <rect width="780" height="780" fill="#0B1118"/>

      {/* Water */}
      <path d="M 0 0 L 780 0 L 780 80 C 600 90 400 130 200 110 C 100 100 30 120 0 140 Z" fill="#0D1722"/>
      <path d="M 0 780 L 780 780 L 780 700 C 600 680 450 720 300 700 C 180 685 60 720 0 720 Z" fill="#0D1722"/>

      {/* Parks */}
      <path d="M 450 250 C 520 240 580 250 610 300 C 620 360 560 380 500 370 C 450 360 440 300 450 250 Z" fill="#1B2A24"/>
      <path d="M 120 380 C 180 370 220 400 200 440 C 180 470 130 470 110 440 C 100 410 100 390 120 380 Z" fill="#1B2A24"/>

      {/* Road network — main roads (lit) */}
      <g stroke="#3A4B62" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M -20 620 Q 200 580 400 600 T 800 540"/>
        <path d="M 400 0 L 360 780"/>
        <path d="M -20 300 Q 300 280 500 260 T 800 200"/>
      </g>
      {/* Secondary roads */}
      <g stroke="#253244" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M 100 0 L 120 780"/>
        <path d="M 600 0 L 650 780"/>
        <path d="M -20 450 L 800 470"/>
        <path d="M -20 180 L 800 160"/>
        <path d="M -20 720 L 800 700"/>
        <path d="M 250 0 L 280 780"/>
        <path d="M 520 0 L 540 780"/>
      </g>
      {/* Alleys */}
      <g stroke="#1A2432" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M 50 0 L 55 780"/>
        <path d="M 180 0 L 200 780"/>
        <path d="M 330 0 L 340 780"/>
        <path d="M 460 0 L 480 780"/>
        <path d="M 700 0 L 720 780"/>
        <path d="M -20 100 L 800 90"/>
        <path d="M -20 380 L 800 390"/>
        <path d="M -20 550 L 800 560"/>
      </g>

      {showRoute && (
        <>
          {/* Route glow */}
          <path d={route} stroke="#E89B6C" strokeOpacity="0.25" strokeWidth="10" fill="none" strokeLinecap="round"/>
          {/* Route line */}
          <path d={route} stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeLinecap="round"
                strokeDasharray={routeLen} strokeDashoffset={draw}
                style={{ transition: "stroke-dashoffset 600ms var(--ease, ease-out)" }}/>
          {/* Dots along route */}
          <path d={route} stroke="#F2B088" strokeWidth="2" fill="none" strokeLinecap="round"
                strokeDasharray="0 14"/>
        </>
      )}

      {/* Destination pin */}
      {showRoute && (
        <g transform="translate(720 160)">
          <circle r="18" fill="url(#userHalo)"/>
          <circle r="7" fill="#E89B6C" stroke="#0E1620" strokeWidth="2"/>
        </g>
      )}

      {/* User position */}
      <g transform="translate(60 640)">
        <circle r="26" fill="url(#userHalo)"/>
        <circle r="9" fill="#F5EFE6" stroke="#0E1620" strokeWidth="3"/>
      </g>

      {/* Labels */}
      <g fontFamily="Inter Tight, sans-serif" fill="#8593A6" fontSize="11" fontWeight="500" letterSpacing="0.06em" textAnchor="middle">
        <text x="530" y="315" fill="#5F7A6E">WASHINGTON SQ PARK</text>
        <text x="160" y="420" fill="#5F7A6E">UNION SQ</text>
        <text x="400" y="40" fontSize="9" opacity="0.7">EAST RIVER</text>
        <text x="400" y="760" fontSize="9" opacity="0.7">HUDSON</text>
      </g>
    </svg>
  );
}
Object.assign(window, { MapCanvas });
