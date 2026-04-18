/* global React */

// Route segments (straight lines, easy to interpolate position along)
const SEG = [
  { x1:115, y1:355, x2:115, y2:178, len:177 }, // north on Broadway
  { x1:115, y1:178, x2:278, y2:178, len:163 }, // east on W 14 St
  { x1:278, y1:178, x2:278, y2: 82, len: 96 }, // north on 5th Ave
];
const ROUTE_LEN = SEG.reduce((s, g) => s + g.len, 0); // 436

function posAlongRoute(progress) {
  let rem = Math.min(progress, 0.999) * ROUTE_LEN;
  for (const g of SEG) {
    if (rem <= g.len) {
      const t = rem / g.len;
      return { x: g.x1 + (g.x2 - g.x1) * t, y: g.y1 + (g.y2 - g.y1) * t, seg: SEG.indexOf(g) };
    }
    rem -= g.len;
  }
  return { x: SEG[2].x2, y: SEG[2].y2, seg: 2 };
}

function MapCanvas({ routeProgress = 0, showRoute = true }) {
  const W = 390, H = 844;

  const drawn  = Math.round(ROUTE_LEN * routeProgress);
  const remLen = ROUTE_LEN - drawn;
  const routePath = `M 115 355 L 115 178 L 278 178 L 278 82`;

  const user = posAlongRoute(routeProgress);
  // heading arrow direction per segment
  const headings = [
    { dx: 0, dy: -1 }, // ↑ north
    { dx: 1, dy:  0 }, // → east
    { dx: 0, dy: -1 }, // ↑ north
  ];
  const h = headings[user.seg] || headings[0];

  // Turn indicator: show when within ~60px of turn corner, hide after turn
  const turnDist = Math.abs(drawn - 177);
  const showTurn = showRoute && drawn < 200;
  // After turn: show next waypoint label
  const onSeg2   = user.seg === 1;
  const onSeg3   = user.seg === 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`}
         style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
         preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4F8A72"/>
          <stop offset="55%" stopColor="#E89B6C"/>
          <stop offset="100%" stopColor="#F2B088"/>
        </linearGradient>
        <radialGradient id="userHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#F5EFE6" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="destHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E89B6C" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#E89B6C" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#0B1118"/>
      <path d={`M 0 0 L ${W} 0 L ${W} 28 C 260 32 160 24 80 30 C 40 33 10 28 0 30 Z`} fill="#0D1722"/>

      {/* Park */}
      <rect x="148" y="230" width="108" height="80" rx="4" fill="#1B2A24"/>
      <text x="202" y="277" fontFamily="Inter Tight,sans-serif" fontSize="8" fontWeight="500"
            fill="#3A5A48" textAnchor="middle" letterSpacing="0.08em">UNION SQ PARK</text>

      {/* Alleys */}
      <g stroke="#172030" strokeWidth="1.5" fill="none">
        {[40,202,350].map(x => <line key={x} x1={x} y1="0" x2={x} y2={H}/>)}
        {[50,120,230,320,390,460,540,640,720].map(y => <line key={y} x1="0" y1={y} x2={W} y2={y}/>)}
      </g>

      {/* Secondary avenues */}
      <g stroke="#253244" strokeWidth="3" strokeLinecap="round" fill="none">
        {[40,202,350].map(x => <line key={x} x1={x} y1="0" x2={x} y2={H}/>)}
      </g>

      {/* Main lit roads */}
      <g stroke="#3A4B62" strokeWidth="5" strokeLinecap="round" fill="none">
        <line x1="115" y1="0" x2="115" y2={H}/>
        <line x1="0"   y1="178" x2={W}   y2="178"/>
        <line x1="278" y1="0"   x2="278" y2={H}/>
      </g>

      {/* Labels */}
      <g fontFamily="Inter Tight,sans-serif" fill="#4A5E78" fontSize="9" fontWeight="600" letterSpacing="0.07em">
        <text x="8" y="171" textAnchor="start">W 14 ST</text>
        <text x="8" y="115" textAnchor="start">W 16 ST</text>
        <text x="8" y="52"  textAnchor="start">W 18 ST</text>
      </g>
      <g fontFamily="Inter Tight,sans-serif" fill="#4A5E78" fontSize="9" fontWeight="600"
         letterSpacing="0.07em" textAnchor="middle">
        <text x="115" y={H - 20}>BROADWAY</text>
        <text x="278" y={H - 20}>5TH AVE</text>
      </g>

      {/* ── Route ── */}
      {showRoute && (
        <>
          {/* Full glow */}
          <path d={routePath} stroke="#E89B6C" strokeOpacity="0.09" strokeWidth="14"
                fill="none" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Completed — dim green */}
          {drawn > 0 && (
            <path d={routePath} stroke="#4F8A72" strokeWidth="4" strokeOpacity="0.4"
                  fill="none" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={`${drawn} ${remLen}`} strokeDashoffset="0"/>
          )}

          {/* Remaining — bright gradient */}
          <path d={routePath} stroke="url(#routeGrad)" strokeWidth="4.5"
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={`${remLen} ${drawn}`} strokeDashoffset={remLen}
                style={{ transition:"stroke-dasharray 400ms ease-out, stroke-dashoffset 400ms ease-out" }}/>
        </>
      )}

      {/* Next-turn indicator */}
      {showTurn && (
        <g transform="translate(115 178)" opacity={Math.max(0, 1 - (drawn - 130) / 70)}>
          <circle r="13" fill="#E89B6C" fillOpacity="0.2"/>
          <circle r="5"  fill="#E89B6C"/>
          <g stroke="#E89B6C" strokeWidth="1.75" strokeLinecap="round" fill="none" transform="translate(17 -2)">
            <line x1="-5" y1="0" x2="5" y2="0"/>
            <polyline points="1,-4 5,0 1,4"/>
          </g>
          <text x="27" y="-11" fontFamily="Inter Tight,sans-serif" fontSize="10" fontWeight="600"
                fill="#E89B6C">Turn right</text>
          <text x="27" y="2"   fontFamily="Inter Tight,sans-serif" fontSize="9" fill="#8593A6">onto 5th Ave</text>
        </g>
      )}

      {/* On seg 2/3: updated waypoint label */}
      {showRoute && (onSeg2 || onSeg3) && (
        <g transform={`translate(278 ${onSeg3 ? Math.max(user.y + 18, 100) : 162})`}>
          <rect x="-28" y="-13" width={onSeg3 ? "86" : "100"} height="18" rx="9"
                fill="rgba(21,31,44,0.82)" stroke="rgba(245,239,230,0.12)" strokeWidth="1"/>
          <text x="15" y="0" fontFamily="Inter Tight,sans-serif" fontSize="9" fontWeight="600"
                fill="#E89B6C" textAnchor="middle">
            {onSeg3 ? "Home ahead" : "Continue on W 14 St"}
          </text>
        </g>
      )}

      {/* Destination pin */}
      {showRoute && (
        <g transform="translate(278 82)">
          <circle r="30" fill="url(#destHalo)"/>
          <circle r="10" fill="#E89B6C" stroke="#0E1620" strokeWidth="2.5"/>
          <rect x="-20" y="-36" width="40" height="18" rx="9" fill="#E89B6C"/>
          <text x="0" y="-23" fontFamily="Inter Tight,sans-serif" fontSize="9" fontWeight="700"
                fill="#0E1620" textAnchor="middle" letterSpacing="0.04em">HOME</text>
        </g>
      )}

      {/* User — moves along route */}
      <g transform={`translate(${user.x} ${user.y})`}>
        <circle r="34" fill="url(#userHalo)"/>
        <circle r="17" stroke="#F5EFE6" strokeWidth="1" strokeOpacity="0.1" fill="none"/>
        <circle r="9"  fill="#F5EFE6" stroke="#0E1620" strokeWidth="3"/>
        {/* heading arrow */}
        <g stroke="#F5EFE6" strokeWidth="2" strokeLinecap="round" fill="none"
           transform={`translate(${h.dx * 14} ${h.dy * 14})`}>
          <line x1={-h.dx * 5} y1={-h.dy * 5} x2={h.dx * 5} y2={h.dy * 5}/>
          <polyline points={`${-h.dy * 3 - h.dx * 3},${h.dx * 3 - h.dy * 3} ${h.dx * 5},${h.dy * 5} ${h.dy * 3 - h.dx * 3},${-h.dx * 3 - h.dy * 3}`}/>
        </g>
      </g>
    </svg>
  );
}

Object.assign(window, { MapCanvas });
