/* global React, Icon */
const { useState, useEffect } = React;

// ----- Score color helper ---------------------------------------------------
function scoreColor(n) {
  if (n >= 80) return { bg: "#D4E5DC", fg: "#2A5643", dot: "#4F8A72", label: "Calm" };
  if (n >= 65) return { bg: "#DDE7C8", fg: "#4A5B29", dot: "#8BA84A", label: "Okay" };
  if (n >= 45) return { bg: "#F4E3B8", fg: "#6B4F0F", dot: "#B88A2E", label: "Busy" };
  if (n >= 30) return { bg: "#F4D1B8", fg: "#7A3E1A", dot: "#C87849", label: "Low" };
  return { bg: "#EFC9C2", fg: "#6B2A22", dot: "#9A3F32", label: "Avoid" };
}

// ----- Status bar -----------------------------------------------------------
function StatusBar({ theme = "light", time = "9:24" }) {
  const color = theme === "light" ? "#0E1620" : "#F5EFE6";
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 50,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      padding: "0 28px 8px", color, fontFamily: "Inter Tight, sans-serif",
      fontSize: 15, fontWeight: 600, zIndex: 50, pointerEvents: "none"
    }}>
      <span className="mono">{time}</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={color}><rect x="0" y="8" width="3" height="3" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2" width="3" height="9" rx="1"/><rect x="15" y="0" width="2" height="11" rx="1" opacity="0.4"/></svg>
        {/* battery */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={color} opacity="0.4"/><rect x="2" y="2" width="14" height="7" rx="1" fill={color}/><rect x="22" y="4" width="1.5" height="3" rx="0.5" fill={color} opacity="0.4"/></svg>
      </span>
    </div>
  );
}

// ----- Home indicator ------------------------------------------------------
function HomeIndicator({ theme = "light" }) {
  return (
    <div style={{
      position: "absolute", bottom: 8, left: 0, right: 0, zIndex: 50,
      display: "flex", justifyContent: "center", pointerEvents: "none"
    }}>
      <div style={{
        width: 134, height: 5, borderRadius: 3,
        background: theme === "light" ? "#0E1620" : "#F5EFE6"
      }}/>
    </div>
  );
}

// ----- Top context pill (floating over map) -------------------------------
function TopPill({ left, right, center }) {
  return (
    <div style={{
      position: "absolute", top: 60, left: 16, right: 16, zIndex: 30,
      display: "flex", gap: 10, alignItems: "center"
    }}>
      {left}
      {center && <div style={{ flex: 1 }}>{center}</div>}
      {right}
    </div>
  );
}

// ----- Glass IconButton ----------------------------------------------------
function GlassButton({ children, onClick, style, size = 44 }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: 999,
      border: "1px solid rgba(245,239,230,0.1)",
      background: "rgba(21,31,44,0.72)",
      backdropFilter: "blur(18px) saturate(140%)",
      WebkitBackdropFilter: "blur(18px) saturate(140%)",
      color: "#F5EFE6", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.35)", cursor: "pointer", padding: 0,
      ...style
    }}>{children}</button>
  );
}

// ----- Score badge ---------------------------------------------------------
function ScoreBadge({ score, sub, compact = false }) {
  const c = scoreColor(score);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 12,
      padding: compact ? "8px 14px 8px 8px" : "12px 20px 12px 14px",
      borderRadius: 999,
      background: "rgba(21,31,44,0.82)",
      backdropFilter: "blur(18px) saturate(140%)",
      WebkitBackdropFilter: "blur(18px) saturate(140%)",
      border: "1px solid rgba(245,239,230,0.1)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
    }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.dot, boxShadow: `0 0 0 4px ${c.dot}22` }}/>
      <span className="score-digit" style={{ fontSize: compact ? 22 : 28, color: c.bg }}>{score}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, lineHeight: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8593A6" }}>Confidence</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#F5EFE6" }}>{sub}</span>
      </span>
    </div>
  );
}

// ----- Bottom sheet shell --------------------------------------------------
function BottomSheet({ snap = "peek", children, onHandleTap }) {
  const heights = { peek: 160, half: 440, full: 720 };
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 40,
      height: heights[snap], borderTopLeftRadius: 24, borderTopRightRadius: 24,
      background: "rgba(21,31,44,0.92)",
      backdropFilter: "blur(22px) saturate(160%)",
      WebkitBackdropFilter: "blur(22px) saturate(160%)",
      borderTop: "1px solid rgba(245,239,230,0.08)",
      boxShadow: "0 -20px 60px rgba(0,0,0,0.45)",
      transition: "height 420ms cubic-bezier(0.22,1,0.36,1)",
      overflow: "hidden", color: "#F5EFE6"
    }}>
      <button onClick={onHandleTap} style={{
        display: "block", margin: "10px auto 0", width: 40, height: 5, borderRadius: 3,
        background: "rgba(245,239,230,0.3)", border: "none", cursor: "pointer", padding: 0
      }}/>
      <div style={{ padding: "14px 20px 24px", height: heights[snap] - 30, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

// ----- Protection gradient (top fade) --------------------------------------
function TopFade() {
  return <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 160, zIndex: 10,
    background: "linear-gradient(to bottom, rgba(11,17,24,0.9), rgba(11,17,24,0))",
    pointerEvents: "none"
  }}/>;
}

Object.assign(window, { scoreColor, StatusBar, HomeIndicator, TopPill, GlassButton, ScoreBadge, BottomSheet, TopFade });
