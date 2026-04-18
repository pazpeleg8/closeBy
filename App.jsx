/* global React, MapCanvas, StatusBar, HomeIndicator, TopPill, GlassButton, ScoreBadge, BottomSheet, TopFade, HomeSheet, SearchSheet, RoutesSheet, WalkingSheet, ReportSheet, CompanionActive, Icon */
const { useState } = React;

function Phone({ children }) {
  return (
    <div style={{
      position: "relative", width: 390, height: 844, borderRadius: 54,
      overflow: "hidden", background: "#0B1118",
      boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 11px #1a1a1a, 0 0 0 12px #2d2d2d",
      fontFamily: "Inter Tight, sans-serif", color: "#F5EFE6"
    }}>
      {/* dynamic island */}
      <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, borderRadius: 24, background: "#000", zIndex: 60 }}/>
      {children}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("home"); // home | search | routes | walking
  const [dest, setDest] = useState(null);
  const [route, setRoute] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [companionOn, setCompanionOn] = useState(false);
  const [arrived, setArrived] = useState(false);

  const progress = screen === "walking" ? 0.35 : screen === "routes" ? 0.6 : 0;

  return (
    <Phone>
      <StatusBar theme="dark" time="9:24"/>
      <HomeIndicator theme="dark"/>

      {/* Map always underneath */}
      <div style={{ position: "absolute", inset: 0 }}>
        <MapCanvas routeProgress={progress} showRoute={screen !== "home" && screen !== "search"}/>
      </div>
      <TopFade/>

      {/* Score badge + glass nav — only on walking */}
      {screen === "walking" && (
        <TopPill
          left={<GlassButton onClick={() => setScreen("home")}><Icon.X size={18}/></GlassButton>}
          center={<div style={{ display: "flex", justifyContent: "center" }}><ScoreBadge score={82} sub="Calm · lit" compact/></div>}
          right={<GlassButton><Icon.Eye size={18}/></GlassButton>}
        />
      )}

      {companionOn && screen === "walking" && <CompanionActive onEnd={() => setCompanionOn(false)}/>}

      {/* Sheets */}
      {screen === "home" && !showReport && (
        <BottomSheet snap="half">
          <HomeSheet
            onStartSearch={() => setScreen("search")}
            onStartRoute={(place) => { setDest(place.label); setScreen("routes"); }}
            companionOn={companionOn}
            onToggleCompanion={() => setCompanionOn(v => !v)}
          />
        </BottomSheet>
      )}

      {screen === "search" && (
        <BottomSheet snap="full">
          <SearchSheet
            onPick={(s) => { setDest(s.name); setScreen("routes"); }}
            onClose={() => setScreen("home")}
          />
        </BottomSheet>
      )}

      {screen === "routes" && (
        <BottomSheet snap="half">
          <RoutesSheet
            destination={dest || "Union Square"}
            onBack={() => setScreen("home")}
            onStart={(r) => { setRoute(r); setScreen("walking"); }}
          />
        </BottomSheet>
      )}

      {screen === "walking" && !showReport && (
        <BottomSheet snap="peek">
          <WalkingSheet
            route={route || { score: 82 }}
            onReport={() => setShowReport(true)}
            onArrive={() => setArrived(true)}
            companionOn={companionOn}
          />
        </BottomSheet>
      )}

      {showReport && (
        <BottomSheet snap="half">
          <ReportSheet onClose={() => setShowReport(false)} onSubmit={() => setShowReport(false)}/>
        </BottomSheet>
      )}

      {arrived && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,17,24,0.85)", backdropFilter: "blur(10px)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#151F2C", borderRadius: 24, padding: 28, maxWidth: 320, textAlign: "center", border: "1px solid rgba(245,239,230,0.1)" }}>
            <div className="display" style={{ fontSize: 34, color: "#F5EFE6", marginBottom: 8 }}>You're home.</div>
            <div style={{ fontSize: 14, color: "#BDC5D1", marginBottom: 20 }}>Companion ended. Maya notified you arrived safely.</div>
            <button onClick={() => { setArrived(false); setScreen("home"); setCompanionOn(false); }} style={{ padding: "14px 28px", borderRadius: 999, background: "#E89B6C", color: "#0E1620", border: "none", fontFamily: "Inter Tight", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        </div>
      )}
    </Phone>
  );
}

Object.assign(window, { App, Phone });
