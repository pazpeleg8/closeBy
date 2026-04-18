/* global React */

// Map canvas sized exactly to the phone (390×844).
// SVG coordinates map 1:1 to phone pixels — no aspect-ratio distortion.
// Visible map area when panel is at half snap: y = 0..404.
// User pin sits just above panel; destination pin sits in the upper portion.

function MapCanvas({ routeProgress = 0, showRoute = true }) {
  const W = 390, H = 844;

  // Key positions (all within visible map area 0..404)
  const UX = 115, UY = 355;   // user — lower left of map
  const TX = 115, TY = 178;   // turn corner — go straight then right
  const DX = 278, DY = 82;    // destination — upper right

  // Route: north on Broadway → right on 14th → north on 5th Ave to home
  const routePath = `M ${UX} ${UY} L ${TX} ${TY} L ${DX} ${TY} L ${DX} ${DY}`;
  const routeLen = (UY - TY) + (DX - TX) + (TY - DY); // 177 + 163 + 96 = 436
  const drawn = routeLen * routeProgress;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4F8A72"/>
          <stop offset="60%" stopColor="#E89B6C"/>
          <stop offset="100%" stopColor="#F2B088"/>
        </linearGradient>
        <radialGradient id="userHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#F5EFE6" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="destHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E89B6C" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#E89B6C" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── Base land ── */}
      <rect width={W} height={H} fill="#0B1118"/>

      {/* ── Water strip (top) ── */}
      <path d={`M 0 0 L ${W} 0 L ${W} 28 C 260 32 160 24 80 30 C 40 33 10 28 0 30 Z`} fill="#0D1722"/>

      {/* ── Park block ── */}
      <rect x="148" y="230" width="108" height="80" rx="4" fill="#1B2A24"/>
      <text x="202" y="277" fontFamily="Inter Tight, sans-serif" fontSize="8" fontWeight="500"
            fill="#3A5A48" textAnchor="middle" letterSpacing="0.08em">UNION SQ PARK</text>

      {/* ── Road network ──
           Avenues (vertical): x=40, 115(Broadway), 202, 278(5th), 350
           Streets (horizontal): y=50, 120, 178(14th St), 230, 320, 390, 460, 540, 640, 720, 800  */}

      {/* Side alleys */}
      <g stroke="#172030" strokeWidth="1.5" fill="none">
        <line x1="40"  y1="0" x2="40"  y2={H}/>
        <line x1="202" y1="0" x2="202" y2={H}/>
        <line x1="350" y1="0" x2="350" y2={H}/>
        <line x1="0" y1="50"  x2={W} y2="50"/>
        <line x1="0" y1="120" x2={W} y2="120"/>
        <line x1="0" y1="230" x2={W} y2="230"/>
        <line x1="0" y1="320" x2={W} y2="320"/>
        <line x1="0" y1="390" x2={W} y2="390"/>
        <line x1="0" y1="460" x2={W} y2="460"/>
        <line x1="0" y1="540" x2={W} y2="540"/>
        <line x1="0" y1="640" x2={W} y2="640"/>
        <line x1="0" y1="720" x2={W} y2="720"/>
      </g>

      {/* Secondary avenues */}
      <g stroke="#253244" strokeWidth="3" strokeLinecap="round" fill="none">
        <line x1="40"  y1="0" x2="40"  y2={H}/>
        <line x1="202" y1="0" x2="202" y2={H}/>
        <line x1="350" y1="0" x2="350" y2={H}/>
      </g>

      {/* Main lit roads */}
      <g stroke="#3A4B62" strokeWidth="5" strokeLinecap="round" fill="none">
        {/* Broadway — user's street */}
        <line x1={UX} y1="0" x2={UX} y2={H}/>
        {/* 14th St — the turn */}
        <line x1="0" y1={TY} x2={W} y2={TY}/>
        {/* 5th Ave — destination street */}
        <line x1={DX} y1="0" x2={DX} y2={H}/>
      </g>

      {/* Street labels (horizontal) */}
      <g fontFamily="Inter Tight, sans-serif" fill="#4A5E78" fontSize="9" fontWeight="600" letterSpacing="0.07em">
        <text x="8"   y={TY - 5} textAnchor="start">W 14 ST</text>
        <text x="8"   y="115"    textAnchor="start">W 16 ST</text>
        <text x="8"   y="52"     textAnchor="start">W 18 ST</text>
      </g>
      {/* Avenue labels */}
      <g fontFamily="Inter Tight, sans-serif" fill="#4A5E78" fontSize="9" fontWeight="600" letterSpacing="0.07em" textAnchor="middle">
        <text x={UX} y={H - 20}>BROADWAY</text>
        <text x={DX} y={H - 20}>5TH AVE</text>
      </g>

      {/* ── Route ── */}
      {showRoute && (
        <>
          {/* Glow */}
          <path d={routePath} stroke="#E89B6C" strokeOpacity="0.18" strokeWidth="14"
                fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Route line — draws progressively */}
          <path d={routePath} stroke="url(#routeGrad)" strokeWidth="4.5"
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={routeLen} strokeDashoffset={routeLen - drawn}
                style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)" }}/>
          {/* Dashes overlay */}
          <path d={routePath} stroke="#F2B088" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 12" opacity="0.6"/>
        </>
      )}

      {/* ── Next-turn indicator ── */}
      {showRoute && (
        <g transform={`translate(${TX} ${TY})`}>
          {/* corner highlight circle */}
          <circle r="14" fill="#E89B6C" fillOpacity="0.18"/>
          <circle r="5"  fill="#E89B6C"/>
          {/* arrow → pointing right */}
          <g stroke="#E89B6C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none"
             transform="translate(18 -2)">
            <line x1="-6" y1="0" x2="6" y2="0"/>
            <polyline points="2,-4 6,0 2,4"/>
          </g>
          {/* label */}
          <text x="28" y="-12" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="600"
                fill="#E89B6C" letterSpacing="-0.01em">Turn right</text>
          <text x="28" y="2"  fontFamily="Inter Tight, sans-serif" fontSize="9"
                fill="#8593A6">onto 5th Ave</text>
        </g>
      )}

      {/* ── Destination pin ── */}
      {showRoute && (
        <g transform={`translate(${DX} ${DY})`}>
          <circle r="32" fill="url(#destHalo)"/>
          <circle r="10" fill="#E89B6C" stroke="#0E1620" strokeWidth="2.5"/>
          {/* Home label */}
          <rect x="-20" y="-36" width="40" height="18" rx="9" fill="#E89B6C"/>
          <text x="0" y="-23" fontFamily="Inter Tight, sans-serif" fontSize="9" fontWeight="700"
                fill="#0E1620" textAnchor="middle" letterSpacing="0.04em">HOME</text>
        </g>
      )}

      {/* ── User position ── */}
      <g transform={`translate(${UX} ${UY})`}>
        <circle r="36" fill="url(#userHalo)"/>
        {/* accuracy ring */}
        <circle r="18" stroke="#F5EFE6" strokeWidth="1" strokeOpacity="0.15" fill="none"/>
        {/* dot */}
        <circle r="9" fill="#F5EFE6" stroke="#0E1620" strokeWidth="3"/>
        {/* heading arrow ↑ */}
        <g stroke="#F5EFE6" strokeWidth="2" strokeLinecap="round" fill="none" transform="translate(0 -14)">
          <line x1="0" y1="5" x2="0" y2="-5"/>
          <polyline points="-3,-1 0,-5 3,-1"/>
        </g>
      </g>
    </svg>
  );
}

Object.assign(window, { MapCanvas });
