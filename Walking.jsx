/* global React, Icon, scoreColor */
const { useState, useEffect, useRef } = React;

function fmt(s) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

// Live-note phases keyed by routeProgress
function liveNote(p) {
  if (p < 0.38) return {
    icon: "Lightbulb", color: "#E89B6C",
    bg: "rgba(232,155,108,0.08)", border: "rgba(232,155,108,0.22)",
    text: "Lighting drops ahead on Pine St.",
    action: "Take lit route",
  };
  if (p < 0.68) return {
    icon: "Alert", color: "#C45A4A",
    bg: "rgba(196,90,74,0.08)", border: "rgba(196,90,74,0.28)",
    text: "Uncomfortable interaction flagged nearby · 2 reports in last 10 min.",
    action: "See area",
  };
  return {
    icon: "Shield", color: "#4F8A72",
    bg: "rgba(79,138,114,0.08)", border: "rgba(79,138,114,0.25)",
    text: "Route clear ahead. Confidence improving.",
    action: null,
  };
}

// ── WalkingSheet ─────────────────────────────────────────────────────────────
function WalkingSheet({ route, routeProgress, onReport, onArrive, companionOn, onToggleCompanion }) {
  const progress = routeProgress ?? 0;

  // Score zone: high → dips mid-route → recovers
  const targetScore = progress < 0.38 ? 82 : progress < 0.68 ? 63 : 79;
  const [score, setScore] = useState(route?.score ?? 82);
  const [checkIn, setCheckIn]     = useState(90);
  const [unresponsive, setUnresponsive] = useState(false);
  const [notified, setNotified]   = useState(false);
  const timerRef = useRef(null);

  // Drift score toward zone target
  useEffect(() => {
    const t = setInterval(() => {
      setScore(s => {
        const diff = targetScore - s;
        if (Math.abs(diff) <= 1) return s;
        return s + (diff > 0 ? 1 : -1) + (Math.random() > 0.65 ? (diff > 0 ? 1 : -1) : 0);
      });
    }, 1800);
    return () => clearInterval(t);
  }, [targetScore]);

  // Check-in countdown (companion)
  useEffect(() => {
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

  useEffect(() => { if (companionOn) setCheckIn(90); }, [companionOn]);

  const eta   = Math.max(1, Math.round(14 * (1 - progress)));
  const c     = scoreColor(score);
  const note  = liveNote(progress);
  const NoteIcon = Icon[note.icon] || Icon.Lightbulb;
  const checkInUrgent = companionOn && checkIn <= 20 && !unresponsive;

  return (
    <>
      {/* Score + ETA */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
        <div style={{ width:60, height:60, borderRadius:999, background:c.bg, color:c.fg,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"background 800ms ease-out", flexShrink:0 }}>
          <span className="score-digit" style={{ fontSize:28 }}>{score}</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.12em",
                        textTransform:"uppercase", color:"#8593A6",
                        transition:"color 600ms" }}>{c.label}</div>
          <div className="display" style={{ fontSize:24, color:"#F5EFE6", marginTop:2, lineHeight:1.1 }}>
            {eta} min to home
          </div>
          <div style={{ fontSize:12, color:"#BDC5D1", marginTop:2 }}>Via Broadway · lit · 0.68 mi</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontWeight:600,
                      letterSpacing:"0.06em", color:"#8593A6", textTransform:"uppercase", marginBottom:5 }}>
          <span>Progress</span>
          <span className="mono">ETA 9:38 PM</span>
        </div>
        <div style={{ height:5, borderRadius:3, background:"rgba(245,239,230,0.08)", overflow:"hidden" }}>
          <div style={{ width: `${Math.round(progress * 100)}%`, height:"100%",
                        background:"linear-gradient(90deg,#4F8A72,#E89B6C)", borderRadius:3,
                        transition:"width 800ms ease-out" }}/>
        </div>
      </div>

      {/* Live note — changes with progress */}
      <div style={{ padding:"10px 14px", borderRadius:12,
                    background: note.bg, border:`1px solid ${note.border}`,
                    display:"flex", gap:10, alignItems:"flex-start",
                    marginBottom:14, transition:"background 600ms, border-color 600ms" }}>
        <div style={{ color:note.color, marginTop:1, flexShrink:0 }}><NoteIcon size={15}/></div>
        <div style={{ color:"#F5EFE6", fontSize:12, lineHeight:1.45, flex:1 }}>
          {note.text}
          {note.action && (
            <button style={{ background:"none", border:"none", color:note.color, cursor:"pointer",
                             padding:0, marginLeft:8, fontWeight:600,
                             fontFamily:"Inter Tight", fontSize:12 }}>
              {note.action}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <button onClick={onReport} style={{ padding:"13px 16px", borderRadius:14,
          border:"1px solid rgba(245,239,230,0.14)", background:"rgba(14,22,32,0.5)",
          color:"#F5EFE6", cursor:"pointer", fontFamily:"Inter Tight", fontSize:13, fontWeight:600,
          display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <Icon.Flag size={15}/> Report
        </button>
        <button onClick={onArrive} style={{ padding:"13px 16px", borderRadius:14, border:"none",
          background:"#E89B6C", color:"#0E1620", cursor:"pointer",
          fontFamily:"Inter Tight", fontSize:13, fontWeight:600,
          display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <Icon.Check size={15}/> I'm here
        </button>
      </div>

      {/* Companion section */}
      {!companionOn ? (
        <div style={{ padding:"14px", borderRadius:14, background:"rgba(232,155,108,0.08)",
                      border:"1px solid rgba(232,155,108,0.25)",
                      display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:999, background:"rgba(232,155,108,0.15)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"#E89B6C", flexShrink:0 }}>
            <Icon.Phone size={17}/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#F5EFE6" }}>AI companion call</div>
            <div style={{ fontSize:11, color:"#8593A6", marginTop:2, lineHeight:1.4 }}>
              Simulates a call. Alerts Maya &amp; Sara if you go silent.
            </div>
          </div>
          <button onClick={onToggleCompanion} style={{ padding:"8px 14px", borderRadius:999,
            border:"none", cursor:"pointer", background:"#E89B6C", color:"#0E1620",
            fontFamily:"Inter Tight", fontSize:12, fontWeight:700, flexShrink:0 }}>Start</button>
        </div>
      ) : unresponsive ? (
        <div style={{ padding:"14px", borderRadius:14,
          background: notified ? "rgba(79,138,114,0.15)" : "rgba(196,90,74,0.15)",
          border:`1px solid ${notified ? "rgba(79,138,114,0.4)" : "rgba(196,90,74,0.4)"}`,
          display:"flex", alignItems:"center", gap:12, transition:"background 400ms, border-color 400ms" }}>
          <div style={{ width:38, height:38, borderRadius:999, flexShrink:0,
            background: notified ? "rgba(79,138,114,0.2)" : "rgba(196,90,74,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color: notified ? "#7DB39A" : "#C45A4A" }}><Icon.Alert size={17}/></div>
          <div style={{ flex:1, minWidth:0 }}>
            {notified ? (
              <>
                <div style={{ fontSize:13, fontWeight:600, color:"#7DB39A" }}>Contacts notified</div>
                <div style={{ fontSize:11, color:"#8593A6", marginTop:2 }}>Maya &amp; Sara received your location.</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:13, fontWeight:600, color:"#C45A4A" }}>No response, alerting contacts</div>
                <div style={{ fontSize:11, color:"#8593A6", marginTop:2 }}>Notifying Maya &amp; Sara now…</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding:"12px 14px", borderRadius:14,
          background: checkInUrgent ? "rgba(196,90,74,0.12)" : "rgba(14,22,32,0.5)",
          border:`1px solid ${checkInUrgent ? "rgba(196,90,74,0.35)" : "rgba(245,239,230,0.08)"}`,
          display:"flex", alignItems:"center", gap:10,
          transition:"background 300ms, border-color 300ms" }}>
          <div style={{ width:8, height:8, borderRadius:999, flexShrink:0,
            background: checkInUrgent ? "#C45A4A" : "#4F8A72",
            animation:"pulse 1.4s ease-in-out infinite",
            boxShadow:`0 0 0 4px ${checkInUrgent ? "rgba(196,90,74,0.25)" : "rgba(79,138,114,0.2)"}` }}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600,
                          color: checkInUrgent ? "#EFC9C2" : "#F5EFE6" }}>Companion active · check in</div>
            <div style={{ fontSize:11, color:"#8593A6", marginTop:1 }}>
              Contacts alerted in{" "}
              <span className="mono" style={{ color: checkInUrgent ? "#C45A4A" : "#F5EFE6", fontWeight:600 }}>
                {fmt(checkIn)}
              </span>
            </div>
          </div>
          <button onClick={() => setCheckIn(90)} style={{ padding:"7px 13px", borderRadius:999,
            border:"none", cursor:"pointer",
            background: checkInUrgent ? "#C45A4A" : "rgba(245,239,230,0.1)",
            color: checkInUrgent ? "#fff" : "#F5EFE6",
            fontFamily:"Inter Tight", fontSize:12, fontWeight:600, flexShrink:0,
            transition:"background 300ms" }}>I'm okay</button>
        </div>
      )}
    </>
  );
}

// ── ReportSheet ───────────────────────────────────────────────────────────────
function ReportSheet({ onClose, onSubmit }) {
  const [submitted, setSubmitted] = useState(false);

  const items = [
    { icon:"Lightbulb", label:"Broken lighting",          sub:"Block or street lamp out" },
    { icon:"Users",     label:"Uncomfortable interaction", sub:"Anonymous, calm report" },
    { icon:"Alert",     label:"Aggressive gathering",      sub:"Alerts nearby users" },
    { icon:"Eye",       label:"Feels exposed",             sub:"Empty, unlit block" },
  ];

  function handlePick(it) {
    setSubmitted(true);
    setTimeout(() => onSubmit(it), 1800);
  }

  if (submitted) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    padding:"40px 20px", gap:14, textAlign:"center" }}>
        <div style={{ width:48, height:48, borderRadius:999, background:"rgba(79,138,114,0.18)",
                      display:"flex", alignItems:"center", justifyContent:"center", color:"#4F8A72" }}>
          <Icon.Check size={22}/>
        </div>
        <div style={{ fontSize:16, fontWeight:600, color:"#F5EFE6" }}>Thanks.</div>
        <div style={{ fontSize:13, color:"#8593A6", lineHeight:1.5 }}>
          Noted for the next person walking through.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:8 }}>
        <span className="display" style={{ fontSize:22, color:"#F5EFE6" }}>What did you notice?</span>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#BDC5D1", cursor:"pointer" }}><Icon.X size={20}/></button>
      </div>
      <div style={{ color:"#8593A6", fontSize:12, marginBottom:14 }}>Short reports help the next person walking through.</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {items.map((it, i) => {
          const El = Icon[it.icon];
          return (
            <button key={i} onClick={() => handlePick(it)} style={{ padding:"14px", borderRadius:14,
              background:"rgba(14,22,32,0.5)", border:"1px solid rgba(245,239,230,0.08)",
              color:"#F5EFE6", cursor:"pointer", textAlign:"left", fontFamily:"Inter Tight",
              display:"flex", flexDirection:"column", gap:8, minHeight:100 }}>
              <div style={{ color:"#E89B6C" }}><El size={20}/></div>
              <div style={{ fontSize:13, fontWeight:600 }}>{it.label}</div>
              <div style={{ fontSize:10, color:"#8593A6" }}>{it.sub}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── CompanionActive overlay ───────────────────────────────────────────────────
function CompanionActive({ onEnd }) {
  const [elapsed, setElapsed] = useState(0);
  // Simulate voice activity: speaking ~60% of the time
  const [speaking, setSpeaking] = useState(true);
  const [silenceFor, setSilenceFor] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Toggle speaking/silent randomly
  useEffect(() => {
    function schedule() {
      const delay = speaking
        ? 2000 + Math.random() * 4000   // speaking for 2-6s
        : 1500 + Math.random() * 3000;  // silent for 1.5-4.5s
      return setTimeout(() => {
        setSpeaking(v => !v);
        if (speaking) setSilenceFor(0); // just went silent, reset counter
      }, delay);
    }
    const id = schedule();
    return () => clearTimeout(id);
  }, [speaking]);

  // Count silence duration
  useEffect(() => {
    if (speaking) { setSilenceFor(0); return; }
    const t = setInterval(() => setSilenceFor(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [speaking]);

  return (
    <div style={{ position:"absolute", top:116, left:16, right:16, zIndex:35,
                  padding:"12px 14px", borderRadius:18,
                  background:"#E89B6C", color:"#0E1620",
                  boxShadow:"0 16px 40px rgba(232,155,108,0.45)",
                  display:"flex", alignItems:"center", gap:12, fontFamily:"Inter Tight" }}>
      <div style={{ width:38, height:38, borderRadius:999, background:"rgba(14,22,32,0.15)",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon.Phone size={17}/>
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700 }}>Companion · on the line</div>
        <div className="mono" style={{ fontSize:11, opacity:0.75, marginTop:1 }}>{fmt(elapsed)} · Maya (auto)</div>
      </div>

      {/* Voice / silence indicator */}
      {speaking ? (
        // Animated waveform bars
        <div style={{ display:"flex", alignItems:"center", gap:2, height:18, flexShrink:0 }}>
          {[
            "waveA 0.8s ease-in-out infinite",
            "waveB 0.8s ease-in-out 0.15s infinite",
            "waveC 0.8s ease-in-out 0.3s infinite",
            "waveB 0.8s ease-in-out 0.45s infinite",
            "waveA 0.8s ease-in-out 0.6s infinite",
          ].map((anim, i) => (
            <div key={i} style={{ width:3, borderRadius:2,
              background:"rgba(14,22,32,0.5)", animation:anim }}/>
          ))}
        </div>
      ) : (
        // Silent counter
        <div style={{ fontSize:11, fontWeight:700, color:"rgba(14,22,32,0.6)",
                      flexShrink:0, textAlign:"right" }}>
          <div>Silent</div>
          <div className="mono">{fmt(silenceFor)}</div>
        </div>
      )}

      <button onClick={onEnd} style={{ background:"rgba(14,22,32,0.18)", border:"none",
        padding:"7px 13px", borderRadius:999, color:"#0E1620",
        fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter Tight", flexShrink:0 }}>End</button>
    </div>
  );
}

Object.assign(window, { WalkingSheet, ReportSheet, CompanionActive });
