/* global React, Icon, scoreColor */

// ----- Routes comparison sheet --------------------------------------------
function RoutesSheet({ destination, onStart, onBack, companionOn, onToggleCompanion }) {
  const routes = [
    { id: "a", title: "Via Broadway & 14th", meta: "14 min · lit, active", score: 82, tags: ["Main roads", "Well-lit"], selected: true },
    { id: "b", title: "Via University Pl", meta: "11 min · quieter after 9", score: 54, tags: ["3 min faster", "Quieter blocks"], selected: false },
    { id: "c", title: "Via 5th Ave", meta: "16 min · transit option", score: 76, tags: ["Bus · 2 stops"], selected: false },
  ];

  const [sel, setSel] = React.useState("a");
  const chosen = routes.find(r => r.id === sel);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#F5EFE6", cursor: "pointer", padding: 4 }}><Icon.ChevLeft size={20}/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8593A6" }}>Destination</div>
          <div className="display" style={{ fontSize: 22, color: "#F5EFE6", marginTop: 2 }}>{destination}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {routes.map(r => {
          const c = scoreColor(r.score);
          const selected = sel === r.id;
          return (
            <button key={r.id} onClick={() => setSel(r.id)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              borderRadius: 16, textAlign: "left", cursor: "pointer",
              background: selected ? "rgba(232,155,108,0.12)" : "rgba(14,22,32,0.5)",
              border: selected ? "1.5px solid #E89B6C" : "1px solid rgba(245,239,230,0.08)",
              color: "#F5EFE6", fontFamily: "Inter Tight"
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 999, background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="score-digit" style={{ fontSize: 24 }}>{r.score}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: "#BDC5D1", marginTop: 2 }}>{r.meta}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {r.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "#8593A6", textTransform: "uppercase" }}>{j > 0 ? "·" : ""} {t}</span>
                  ))}
                </div>
              </div>
              {selected && <Icon.Check size={18}/>}
            </button>
          );
        })}
      </div>

      {/* Companion toggle */}
      <div style={{
        marginTop: 14, padding: "12px 14px", borderRadius: 14,
        background: companionOn ? "rgba(232,155,108,0.14)" : "rgba(14,22,32,0.45)",
        border: companionOn ? "1px solid rgba(232,155,108,0.35)" : "1px solid rgba(245,239,230,0.08)",
        display: "flex", alignItems: "center", gap: 12,
        transition: "background 250ms, border-color 250ms"
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999, flexShrink: 0,
          background: companionOn ? "rgba(232,155,108,0.2)" : "rgba(245,239,230,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: companionOn ? "#E89B6C" : "#8593A6"
        }}>
          <Icon.Phone size={16}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#F5EFE6" }}>
            {companionOn ? "Companion on" : "AI companion call"}
          </div>
          <div style={{ fontSize: 11, color: "#8593A6", marginTop: 1 }}>
            {companionOn ? "Active during your walk · alerts Maya & Sara if silent" : "Simulates a call. Alerts friends if you go silent."}
          </div>
        </div>
        <button onClick={onToggleCompanion} style={{
          padding: "7px 13px", borderRadius: 999, border: "none", cursor: "pointer",
          background: companionOn ? "#E89B6C" : "rgba(245,239,230,0.1)",
          color: companionOn ? "#0E1620" : "#F5EFE6",
          fontFamily: "Inter Tight", fontSize: 12, fontWeight: 700, flexShrink: 0
        }}>{companionOn ? "On" : "Start"}</button>
      </div>

      <button onClick={() => onStart(chosen)} style={{
        marginTop: 12, width: "100%", padding: "16px 24px", borderRadius: 999,
        background: "#E89B6C", color: "#0E1620", border: "none", cursor: "pointer",
        fontFamily: "Inter Tight", fontSize: 16, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
        <Icon.Navigation size={18}/> Start walking · {chosen.meta.split(" · ")[0]}
      </button>
    </>
  );
}

Object.assign(window, { RoutesSheet });
