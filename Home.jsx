/* global React, Icon, scoreColor */
// Note: do NOT destructure React hooks at top level — Walking.jsx does it and
// top-level const re-declarations across <script> tags throw in browsers.

function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// ── HomeSheet ─────────────────────────────────────────────────────────────────
function HomeSheet({ onStartSearch, onStartRoute, companionOn, onToggleCompanion }) {
  const saved = [
    { icon:"Home",     label:"Home",        meta:"12 min · Calm", score:84 },
    { icon:"Bookmark", label:"Work",        meta:"22 min · Busy", score:62 },
    { icon:"Users",    label:"Maya's place",meta:"8 min · Calm",  score:88 },
  ];

  const [checkIn, setCheckIn]           = React.useState(90);
  const [speaking, setSpeaking]         = React.useState(true);
  const [silenceFor, setSilenceFor]     = React.useState(0);
  const [unresponsive, setUnresponsive] = React.useState(false);
  const [notified, setNotified]         = React.useState(false);
  const timerRef = React.useRef(null);

  // Check-in countdown
  React.useEffect(() => {
    clearInterval(timerRef.current);
    if (!companionOn || unresponsive) return;
    timerRef.current = setInterval(() => {
      setCheckIn(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setUnresponsive(true);
          setTimeout(() => setNotified(true), 400);
          setTimeout(() => { setUnresponsive(false); setNotified(false); setCheckIn(90); }, 5000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [companionOn, unresponsive]);

  // Voice activity simulation
  React.useEffect(() => {
    if (!companionOn) { setSpeaking(true); setSilenceFor(0); return; }
    const id = setTimeout(() => setSpeaking(v => !v),
      speaking ? 2000 + Math.random() * 4000 : 1500 + Math.random() * 3500);
    return () => clearTimeout(id);
  }, [companionOn, speaking]);

  // Silence counter
  React.useEffect(() => {
    if (!companionOn || speaking) { setSilenceFor(0); return; }
    const t = setInterval(() => setSilenceFor(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [companionOn, speaking]);

  // Reset on start
  React.useEffect(() => {
    if (companionOn) { setCheckIn(90); setSpeaking(true); setSilenceFor(0); }
    else { setUnresponsive(false); setNotified(false); }
  }, [companionOn]);

  const checkInUrgent = companionOn && checkIn <= 20 && !unresponsive;

  return (
    <>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
        <span className="display" style={{ fontSize:28, color:"#F5EFE6" }}>Evening, Anna</span>
        <span style={{ fontSize:12, fontWeight:500, color:"#8593A6" }}>9:24 PM · sunset +2h</span>
      </div>

      {/* Search */}
      <button onClick={onStartSearch} style={{ display:"flex", alignItems:"center", gap:12,
        width:"100%", padding:"14px 16px", borderRadius:14,
        background:"rgba(14,22,32,0.6)", border:"1px solid rgba(245,239,230,0.1)",
        color:"#8593A6", fontFamily:"Inter Tight", fontSize:15, cursor:"pointer", textAlign:"left" }}>
        <Icon.Search size={18}/> Where to?
      </button>

      {/* Saved places */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:18 }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.12em",
                      textTransform:"uppercase", color:"#8593A6" }}>Saved</div>
        {saved.map((s, i) => {
          const c = scoreColor(s.score);
          const El = Icon[s.icon];
          return (
            <button key={i} onClick={() => onStartRoute(s)} style={{ display:"flex",
              alignItems:"center", gap:14, width:"100%", padding:"12px 14px", borderRadius:14,
              background:"rgba(14,22,32,0.5)", border:"1px solid rgba(245,239,230,0.06)",
              color:"#F5EFE6", fontFamily:"Inter Tight", cursor:"pointer", textAlign:"left" }}>
              <div style={{ width:40, height:40, borderRadius:12,
                background:"rgba(232,155,108,0.14)", display:"flex",
                alignItems:"center", justifyContent:"center", color:"#E89B6C" }}>
                <El size={18}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600 }}>{s.label}</div>
                <div style={{ fontSize:12, color:"#BDC5D1" }}>{s.meta}</div>
              </div>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6,
                padding:"4px 10px", borderRadius:999, background:c.bg, color:c.fg,
                fontSize:12, fontWeight:600 }}>
                <span className="score-digit" style={{ fontSize:14 }}>{s.score}</span>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Companion ── */}
      <div style={{ marginTop:18 }}>
        {!companionOn ? (
          <div style={{ padding:"14px", borderRadius:14, background:"rgba(232,155,108,0.08)",
            border:"1px solid rgba(232,155,108,0.25)", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:999, background:"rgba(232,155,108,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center", color:"#E89B6C" }}>
              <Icon.Phone size={18}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#F5EFE6" }}>AI companion call</div>
              <div style={{ fontSize:12, color:"#8593A6", marginTop:1 }}>Simulates a call. Alerts Maya &amp; Sara if silent.</div>
            </div>
            <button onClick={onToggleCompanion} style={{ padding:"8px 14px", borderRadius:999,
              border:"none", cursor:"pointer", background:"#E89B6C", color:"#0E1620",
              fontFamily:"Inter Tight", fontSize:13, fontWeight:600 }}>Start</button>
          </div>

        ) : unresponsive ? (
          <div style={{ padding:"14px", borderRadius:14,
            background: notified ? "rgba(79,138,114,0.15)" : "rgba(196,90,74,0.15)",
            border:`1px solid ${notified ? "rgba(79,138,114,0.4)" : "rgba(196,90,74,0.4)"}`,
            display:"flex", alignItems:"center", gap:12, transition:"all 400ms" }}>
            <div style={{ width:38, height:38, borderRadius:999, flexShrink:0,
              background: notified ? "rgba(79,138,114,0.2)" : "rgba(196,90,74,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color: notified ? "#7DB39A" : "#C45A4A" }}><Icon.Alert size={17}/></div>
            <div style={{ flex:1 }}>
              {notified
                ? <><div style={{ fontSize:13, fontWeight:600, color:"#7DB39A" }}>Contacts notified</div>
                     <div style={{ fontSize:11, color:"#8593A6", marginTop:2 }}>Maya &amp; Sara received your location.</div></>
                : <><div style={{ fontSize:13, fontWeight:600, color:"#C45A4A" }}>No response — alerting contacts</div>
                     <div style={{ fontSize:11, color:"#8593A6", marginTop:2 }}>Notifying Maya &amp; Sara now…</div></>
              }
            </div>
          </div>

        ) : (
          <div style={{ borderRadius:14, overflow:"hidden",
            border:`1px solid ${checkInUrgent ? "rgba(196,90,74,0.35)" : "rgba(232,155,108,0.3)"}`,
            transition:"border-color 300ms" }}>
            {/* Voice bar */}
            <div style={{ padding:"12px 14px", background:"#E89B6C",
              display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:999, background:"rgba(14,22,32,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center", color:"#0E1620" }}>
                <Icon.Phone size={16}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#0E1620" }}>Companion · on the line</div>
                <div style={{ fontSize:11, color:"rgba(14,22,32,0.6)", marginTop:1 }}>Maya (auto)</div>
              </div>
              {speaking ? (
                <div style={{ display:"flex", alignItems:"center", gap:2, height:18, flexShrink:0 }}>
                  {["waveA 0.8s ease-in-out infinite",
                    "waveB 0.8s ease-in-out 0.15s infinite",
                    "waveC 0.8s ease-in-out 0.3s infinite",
                    "waveB 0.8s ease-in-out 0.45s infinite",
                    "waveA 0.8s ease-in-out 0.6s infinite",
                  ].map((anim, i) => (
                    <div key={i} style={{ width:3, borderRadius:2,
                      background:"rgba(14,22,32,0.45)", animation:anim }}/>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(14,22,32,0.55)",
                  flexShrink:0, textAlign:"right" }}>
                  <div>Silent</div>
                  <div className="mono">{fmtTime(silenceFor)}</div>
                </div>
              )}
              <button onClick={onToggleCompanion} style={{ background:"rgba(14,22,32,0.2)",
                border:"none", padding:"7px 12px", borderRadius:999, color:"#0E1620",
                fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter Tight" }}>End</button>
            </div>
            {/* Check-in row */}
            <div style={{ padding:"11px 14px",
              background: checkInUrgent ? "rgba(196,90,74,0.12)" : "rgba(14,22,32,0.5)",
              display:"flex", alignItems:"center", gap:10, transition:"background 300ms" }}>
              <div style={{ width:8, height:8, borderRadius:999, flexShrink:0,
                background: checkInUrgent ? "#C45A4A" : "#4F8A72",
                animation:"pulse 1.4s ease-in-out infinite",
                boxShadow:`0 0 0 4px ${checkInUrgent ? "rgba(196,90,74,0.25)" : "rgba(79,138,114,0.2)"}` }}/>
              <div style={{ flex:1, fontSize:12,
                color: checkInUrgent ? "#EFC9C2" : "#F5EFE6", fontWeight:500 }}>
                Contacts alerted if no response in{" "}
                <span className="mono" style={{ fontWeight:700,
                  color: checkInUrgent ? "#C45A4A" : "#F5EFE6" }}>{fmtTime(checkIn)}</span>
              </div>
              <button onClick={() => setCheckIn(90)} style={{ padding:"6px 12px", borderRadius:999,
                border:"none", cursor:"pointer",
                background: checkInUrgent ? "#C45A4A" : "rgba(245,239,230,0.1)",
                color: checkInUrgent ? "#fff" : "#F5EFE6",
                fontFamily:"Inter Tight", fontSize:12, fontWeight:600,
                transition:"background 300ms" }}>I'm okay</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── SearchSheet ───────────────────────────────────────────────────────────────
function SearchSheet({ onPick, onClose }) {
  const [q, setQ] = React.useState("");
  const suggestions = [
    { name:"Union Square",      meta:"0.6 mi · 14 St & Broadway" },
    { name:"Bowery Ballroom",   meta:"1.1 mi · 6 Delancey St" },
    { name:"Maya's place",      meta:"0.4 mi · Saved" },
    { name:"Bedford Ave L stop",meta:"2.3 mi · Brooklyn" },
  ];
  return (
    <>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
          borderRadius:14, background:"rgba(14,22,32,0.6)", border:"1px solid rgba(232,155,108,0.4)" }}>
          <Icon.Search size={18}/>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Where to?"
            style={{ background:"transparent", border:"none", outline:"none", color:"#F5EFE6",
                     fontFamily:"Inter Tight", fontSize:15, flex:1 }}/>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#BDC5D1",
          fontFamily:"Inter Tight", fontSize:14, cursor:"pointer" }}>Cancel</button>
      </div>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.12em",
        textTransform:"uppercase", color:"#8593A6", marginBottom:8 }}>Suggestions</div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onPick(s)} style={{ display:"flex", alignItems:"center",
            gap:14, padding:"14px 10px", background:"transparent", border:"none",
            borderBottom: i < suggestions.length - 1 ? "1px solid rgba(245,239,230,0.06)" : "none",
            color:"#F5EFE6", cursor:"pointer", textAlign:"left", fontFamily:"Inter Tight" }}>
            <Icon.Pin size={18}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:500 }}>{s.name}</div>
              <div style={{ fontSize:12, color:"#8593A6" }}>{s.meta}</div>
            </div>
            <Icon.ChevRight size={16}/>
          </button>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { HomeSheet, SearchSheet });
