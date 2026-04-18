/* global React, Icon, scoreColor */
const { useState, useEffect } = React;

// ----- Walking view: in-journey ------------------------------------------
function WalkingSheet({ route, onReport, onArrive, companionOn }) {
  const [score, setScore] = useState(route?.score ?? 82);
  const [eta, setEta] = useState(14);

  // Simulate ambient score drift
  useEffect(() => {
    const t = setInterval(() => {
      setScore(s => Math.max(40, Math.min(92, s + (Math.random() > 0.5 ? 1 : -1))));
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const c = scoreColor(score);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 220ms ease-out" }}>
          <span className="score-digit" style={{ fontSize: 30 }}>{score}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8593A6" }}>{c.label}</div>
          <div className="display" style={{ fontSize: 26, color: "#F5EFE6", marginTop: 2 }}>{eta} min to home</div>
          <div style={{ fontSize: 13, color: "#BDC5D1", marginTop: 2 }}>Via Broadway · lit · 0.68 mi</div>
        </div>
      </div>

      {/* live note */}
      <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(232,155,108,0.1)", border: "1px solid rgba(232,155,108,0.25)", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14 }}>
        <div style={{ color: "#E89B6C", marginTop: 2 }}><Icon.Lightbulb size={16}/></div>
        <div style={{ color: "#F5EFE6", fontSize: 13, lineHeight: 1.4 }}>
          Lighting drops ahead on Pine St. A lit alternative is 3 min away.
          <button style={{ background: "none", border: "none", color: "#E89B6C", cursor: "pointer", padding: 0, marginLeft: 8, fontWeight: 600, fontFamily: "Inter Tight", fontSize: 13 }}>See it</button>
        </div>
      </div>

      {/* progress strip */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#8593A6", textTransform: "uppercase", marginBottom: 6 }}>
          <span>Progress</span>
          <span className="mono">7:42 PM · ETA</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(245,239,230,0.08)", overflow: "hidden" }}>
          <div style={{ width: "32%", height: "100%", background: "linear-gradient(90deg, #4F8A72, #E89B6C)", borderRadius: 3 }}/>
        </div>
      </div>

      {/* actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
        <button onClick={onReport} style={{
          padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(245,239,230,0.14)",
          background: "rgba(14,22,32,0.5)", color: "#F5EFE6", cursor: "pointer",
          fontFamily: "Inter Tight", fontSize: 14, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <Icon.Flag size={16}/> Report
        </button>
        <button onClick={onArrive} style={{
          padding: "14px 16px", borderRadius: 14, border: "none",
          background: "#E89B6C", color: "#0E1620", cursor: "pointer",
          fontFamily: "Inter Tight", fontSize: 14, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <Icon.Check size={16}/> I'm here
        </button>
      </div>

      {/* check-in */}
      <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(14,22,32,0.5)", border: "1px solid rgba(245,239,230,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ color: "#E89B6C" }}><Icon.Clock size={16}/></div>
        <div style={{ flex: 1, color: "#BDC5D1", fontSize: 13 }}>
          Quick check-in in <span className="mono" style={{ color: "#F5EFE6" }}>2:13</span>
        </div>
        <button style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(245,239,230,0.08)", border: "1px solid rgba(245,239,230,0.12)", color: "#F5EFE6", fontFamily: "Inter Tight", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>I'm good</button>
      </div>
    </>
  );
}

// ----- Report picker sheet -----------------------------------------------
function ReportSheet({ onClose, onSubmit }) {
  const items = [
    { icon: "Lightbulb", label: "Broken lighting", sub: "Block or street lamp out" },
    { icon: "Users", label: "Uncomfortable interaction", sub: "Anonymous, calm report" },
    { icon: "Alert", label: "Aggressive gathering", sub: "Alerts nearby users" },
    { icon: "Eye", label: "Feels exposed", sub: "Empty, unlit block" },
  ];
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="display" style={{ fontSize: 24, color: "#F5EFE6" }}>What did you notice?</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#BDC5D1", cursor: "pointer" }}><Icon.X size={20}/></button>
      </div>
      <div style={{ color: "#8593A6", fontSize: 13, marginBottom: 14 }}>Short reports help the next person walking through.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map((it, i) => {
          const IconEl = Icon[it.icon];
          return (
            <button key={i} onClick={() => onSubmit(it)} style={{
              padding: "14px", borderRadius: 14, background: "rgba(14,22,32,0.5)",
              border: "1px solid rgba(245,239,230,0.08)", color: "#F5EFE6",
              cursor: "pointer", textAlign: "left", fontFamily: "Inter Tight",
              display: "flex", flexDirection: "column", gap: 8, minHeight: 110
            }}>
              <div style={{ color: "#E89B6C" }}><IconEl size={22}/></div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</div>
              <div style={{ fontSize: 11, color: "#8593A6" }}>{it.sub}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ----- Companion active overlay ------------------------------------------
function CompanionActive({ onEnd }) {
  return (
    <div style={{
      position: "absolute", top: 100, left: 16, right: 16, zIndex: 35,
      padding: 14, borderRadius: 20,
      background: "#E89B6C", color: "#0E1620",
      boxShadow: "0 20px 50px rgba(232,155,108,0.4)",
      display: "flex", alignItems: "center", gap: 12, fontFamily: "Inter Tight"
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 999, background: "rgba(14,22,32,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon.Phone size={18}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Companion · on the line</div>
        <div className="mono" style={{ fontSize: 12, opacity: 0.7 }}>02:14 · Sara (auto)</div>
      </div>
      <div style={{ width: 10, height: 10, borderRadius: 999, background: "#4F8A72", animation: "pulse 1.6s ease-in-out infinite", boxShadow: "0 0 0 4px rgba(79,138,114,0.25)" }}/>
      <button onClick={onEnd} style={{ background: "rgba(14,22,32,0.15)", border: "none", padding: "8px 14px", borderRadius: 999, color: "#0E1620", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter Tight" }}>End</button>
    </div>
  );
}

Object.assign(window, { WalkingSheet, ReportSheet, CompanionActive });
