/* global React, Icon, scoreColor, ScoreBadge, GlassButton */
const { useState } = React;

// ----- Home view: saved places + quick actions ----------------------------
function HomeSheet({ onStartSearch, onStartRoute, companionOn, onToggleCompanion }) {
  const saved = [
    { icon: "Home", label: "Home", meta: "12 min · Calm", score: 84 },
    { icon: "Bookmark", label: "Work", meta: "22 min · Busy", score: 62 },
    { icon: "Users", label: "Maya's place", meta: "8 min · Calm", score: 88 },
  ];
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="display" style={{ fontSize: 28, color: "#F5EFE6" }}>Evening, Anna</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#8593A6" }}>9:24 PM · sunset +2h</span>
      </div>

      <button onClick={onStartSearch} style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "14px 16px", borderRadius: 14,
        background: "rgba(14,22,32,0.6)", border: "1px solid rgba(245,239,230,0.1)",
        color: "#8593A6", fontFamily: "Inter Tight", fontSize: 15, cursor: "pointer", textAlign: "left"
      }}>
        <Icon.Search size={18}/> Where to?
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8593A6" }}>Saved</div>
        {saved.map((s, i) => {
          const c = scoreColor(s.score);
          const IconEl = Icon[s.icon];
          return (
            <button key={i} onClick={() => onStartRoute(s)} style={{
              display: "flex", alignItems: "center", gap: 14, width: "100%",
              padding: "12px 14px", borderRadius: 14, background: "rgba(14,22,32,0.5)",
              border: "1px solid rgba(245,239,230,0.06)", color: "#F5EFE6",
              fontFamily: "Inter Tight", cursor: "pointer", textAlign: "left"
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(232,155,108,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E89B6C" }}>
                <IconEl size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "#BDC5D1" }}>{s.meta}</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: c.bg, color: c.fg, fontSize: 12, fontWeight: 600 }}>
                <span className="score-digit" style={{ fontSize: 14 }}>{s.score}</span>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: companionOn ? "#E89B6C" : "rgba(232,155,108,0.1)", border: "1px solid rgba(232,155,108,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: companionOn ? "rgba(14,22,32,0.15)" : "rgba(232,155,108,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: companionOn ? "#0E1620" : "#E89B6C" }}>
          <Icon.Phone size={18}/>
        </div>
        <div style={{ flex: 1, color: companionOn ? "#0E1620" : "#F5EFE6" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{companionOn ? "Companion is on" : "Call companion"}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{companionOn ? "Stays on until you're inside" : "Fake call · friends notified if silent"}</div>
        </div>
        <button onClick={onToggleCompanion} style={{
          padding: "8px 14px", borderRadius: 999, border: "none", cursor: "pointer",
          background: companionOn ? "#0E1620" : "#E89B6C", color: companionOn ? "#F5EFE6" : "#0E1620",
          fontFamily: "Inter Tight", fontSize: 13, fontWeight: 600
        }}>{companionOn ? "Hang up" : "Start"}</button>
      </div>
    </>
  );
}

// ----- Search view --------------------------------------------------------
function SearchSheet({ onPick, onClose }) {
  const [q, setQ] = useState("");
  const suggestions = [
    { name: "Union Square", meta: "0.6 mi · 14 St & Broadway" },
    { name: "Bowery Ballroom", meta: "1.1 mi · 6 Delancey St" },
    { name: "Maya's place", meta: "0.4 mi · Saved" },
    { name: "Bedford Ave L stop", meta: "2.3 mi · Brooklyn" },
  ];
  return (
    <>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, background: "rgba(14,22,32,0.6)", border: "1px solid rgba(232,155,108,0.4)" }}>
          <Icon.Search size={18}/>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Where to?" style={{
            background: "transparent", border: "none", outline: "none", color: "#F5EFE6",
            fontFamily: "Inter Tight", fontSize: 15, flex: 1
          }}/>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#BDC5D1", fontFamily: "Inter Tight", fontSize: 14, cursor: "pointer" }}>Cancel</button>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8593A6", marginBottom: 8 }}>Suggestions</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onPick(s)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 10px",
            background: "transparent", border: "none", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(245,239,230,0.06)" : "none",
            color: "#F5EFE6", cursor: "pointer", textAlign: "left", fontFamily: "Inter Tight"
          }}>
            <Icon.Pin size={18}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "#8593A6" }}>{s.meta}</div>
            </div>
            <Icon.ChevRight size={16}/>
          </button>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { HomeSheet, SearchSheet });
