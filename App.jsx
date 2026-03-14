import { useState, useMemo, useCallback } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap";

const DEFAULT_SETUPS = {
  GAP_GO: {
    id: "GAP_GO", name: "GAP & GO", emoji: "🚀", direction: "long", color: "#00e676",
    grades: { Aplus: 7, A: 6, B: 5, C: 4 },
    criteria: [
      { id: "mercado_ok",   label: "Entorno de mercado favorable ★",  pts:  2, group: "core" },
      { id: "tape_loco",    label: "Tape loco 🔥",                    pts:  1, group: "core" },
      { id: "rompe_pmh",    label: "Rompe Pre Market High",            pts:  1, group: "core" },
      { id: "vol_hist",     label: "Volumen histórico",                pts:  1, group: "core" },
      { id: "noticias",     label: "Catalizador / Noticias",           pts:  1, group: "core" },
      { id: "acumula_pmh",  label: "Acumula zona PMH antes de romper", pts:  1, group: "core" },
      { id: "extension_ok", label: "Extensión >50% y <150%",           pts:  1, group: "core" },
      { id: "timing_ok",    label: "Timing 9:30–11:00h ⏰",             pts:  1, group: "core" },
      { id: "microfloat",   label: "Microfloat ✅",                    pts:  1, group: "quality" },
      { id: "china",        label: "Stock chino 🇨🇳",                  pts: -1, group: "risk" },
      { id: "dilucion",     label: "Dilución activa",                  pts: -1, group: "risk" },
      { id: "overhead",     label: "Overhead significativo ⚠️",        pts: -7, group: "risk" },
    ],
  },
  BO_LONG: {
    id: "BO_LONG", name: "BREAKOUT LONG", emoji: "📈", direction: "long", color: "#00e676",
    grades: { Aplus: 5, A: 4, B: 3, C: 2 },
    criteria: [
      { id: "mercado_ok",  label: "Entorno de mercado favorable ★",   pts:  2, group: "core" },
      { id: "rompe_high",  label: "Rompe High previo",                 pts:  1, group: "core" },
      { id: "vol_hist",    label: "Volumen histórico",                 pts:  1, group: "core" },
      { id: "noticias",    label: "Catalizador / Noticias",            pts:  1, group: "core" },
      { id: "acumula_pmh", label: "Acumula zona PMH antes de romper",  pts:  1, group: "core" },
      { id: "tape_loco",   label: "Tape loco 🔥",                     pts:  1, group: "core" },
      { id: "microfloat",  label: "Microfloat ✅",                    pts:  1, group: "quality" },
      { id: "china",       label: "Stock chino 🇨🇳",                  pts: -1, group: "risk" },
      { id: "dilucion",    label: "Dilución activa",                   pts: -1, group: "risk" },
      { id: "overhead",    label: "Overhead significativo ⚠️",         pts: -7, group: "risk" },
    ],
  },
  GAP_EXT_SHORT: {
    id: "GAP_EXT_SHORT", name: "GAP & EXT SHORT", emoji: "📉", direction: "short", color: "#ff5252",
    grades: { Aplus: 8, A: 6, B: 5, C: 4 },
    criteria: [
      { id: "mercado_ok",  label: "Entorno de mercado favorable ★",      pts:  2, group: "core" },
      { id: "ext_70",      label: "Extensión > 70%",                     pts:  1, group: "core" },
      { id: "vol_ext",     label: "Volumen alto durante la extensión",    pts:  1, group: "core" },
      { id: "destruye_pm", label: "Se destruye progresivamente pre-open", pts:  1, group: "core" },
      { id: "vol_decrec",  label: "Volumen decreciente en destrucción",   pts:  1, group: "core" },
      { id: "bajo_vwap",   label: "Stock por debajo de VWAP",             pts:  1, group: "core" },
      { id: "zonas_agreg", label: "Zonas claras donde agregar",           pts:  1, group: "core" },
      { id: "dilucion",    label: "Dilución activa ✅",                   pts:  1, group: "quality" },
      { id: "overhead",    label: "Overhead significativo ✅",            pts:  1, group: "quality" },
      { id: "china",       label: "Stock chino 🇨🇳",                     pts: -1, group: "risk" },
      { id: "microfloat",  label: "Microfloat",                           pts: -1, group: "risk" },
    ],
  },
  GAP_CRAP: {
    id: "GAP_CRAP", name: "GAP & CRAP", emoji: "💥", direction: "short", color: "#ff6d00",
    grades: { Aplus: 6, A: 5, B: 4, C: 3 },
    criteria: [
      { id: "mercado_ok",        label: "Entorno de mercado favorable ★",       pts:  2, group: "core" },
      { id: "ext_70",            label: "Extensión > 70–80%",                   pts:  1, group: "core" },
      { id: "rompe_pmh_g2r",     label: "Rompe PMH antes del G2R",              pts:  1, group: "core" },
      { id: "rompe_vwap",        label: "Rompe zona relevante / VWAP",          pts:  1, group: "core" },
      { id: "vol_decrec_bounce", label: "Vol decreciente en bounce (R2G)",       pts:  1, group: "core" },
      { id: "resist_tf",         label: "BO coincide con resistencia TF mayor",  pts:  1, group: "core" },
      { id: "overhead",          label: "Overhead significativo ✅",             pts:  1, group: "quality" },
      { id: "china",             label: "Stock chino 🇨🇳",                      pts: -1, group: "risk" },
      { id: "microfloat",        label: "Microfloat",                            pts: -1, group: "risk" },
    ],
  },
  SHORT_RESIST: {
    id: "SHORT_RESIST", name: "SHORT INTO RESIST.", emoji: "🧱", direction: "short", color: "#e040fb",
    grades: { Aplus: 6, A: 5, B: 4, C: 3 },
    criteria: [
      { id: "mercado_ok",    label: "Entorno de mercado favorable ★",          pts:  2, group: "core" },
      { id: "ext_80",        label: "Extensión > 80%",                         pts:  1, group: "core" },
      { id: "rompe_highs",   label: "Rompiendo highs previos",                 pts:  1, group: "core" },
      { id: "zona_tf_mayor", label: "Precio en zona resistencia TF mayor",     pts:  1, group: "core" },
      { id: "ext_tramo",     label: "Extensión clara del tramo (rompe high)",  pts:  1, group: "core" },
      { id: "vol_relevante", label: "Día extensión con volumen relevante",     pts:  1, group: "core" },
      { id: "overhead",      label: "Overhead significativo ✅",               pts:  1, group: "quality" },
      { id: "china",         label: "Stock chino 🇨🇳",                        pts: -1, group: "risk" },
      { id: "microfloat",    label: "Microfloat",                              pts: -1, group: "risk" },
    ],
  },
  FBO: {
    id: "FBO", name: "FBO", emoji: "🪤", direction: "short", color: "#ffab40",
    grades: { Aplus: 10, A: 8, B: 7, C: 5 },
    criteria: [
      { id: "mercado_ok",      label: "Entorno de mercado favorable ★",         pts:  2, group: "core" },
      { id: "timing_fbo",      label: "Timing 9:30–10:30h ⏰",                  pts:  1, group: "core" },
      { id: "break_pmh",       label: "Break inicial del PMH",                 pts:  1, group: "core" },
      { id: "break_violencia", label: "Break inicial con violencia",           pts:  1, group: "core" },
      { id: "break_vol",       label: "Break inicial con mucho volumen",       pts:  1, group: "core" },
      { id: "fail_rapido",     label: "Fail rápido (3–4 min)",                 pts:  1, group: "core" },
      { id: "fail_violencia",  label: "Fail con violencia / intención",        pts:  1, group: "core" },
      { id: "no_guarrea",      label: "No se queda 'guarreando' en PMH",       pts:  1, group: "core" },
      { id: "breakdown_claro", label: "Breakdown claro por debajo del PMH",    pts:  1, group: "core" },
      { id: "rompe_zona",      label: "Rompe zona relevante a la baja",        pts:  1, group: "core" },
      { id: "rompe_vwap",      label: "Rompe VWAP a la baja",                  pts:  1, group: "core" },
      { id: "fbo_resist_tf",   label: "FBO coincide con resistencia TF mayor", pts:  1, group: "quality" },
      { id: "overhead",        label: "Overhead significativo ✅",              pts:  1, group: "quality" },
      { id: "china",           label: "Stock chino 🇨🇳",                       pts: -1, group: "risk" },
      { id: "microfloat",      label: "Microfloat",                            pts: -1, group: "risk" },
    ],
  },
};

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

const GRADE_DISPLAY = [
  { grade: "A+", color: "#00e676", bg: "rgba(0,230,118,0.10)" },
  { grade: "A",  color: "#69f0ae", bg: "rgba(105,240,174,0.08)" },
  { grade: "B",  color: "#ffab40", bg: "rgba(255,171,64,0.08)" },
  { grade: "C",  color: "#ff8a65", bg: "rgba(255,138,101,0.08)" },
  { grade: "✕",  color: "#ef5350", bg: "rgba(239,83,80,0.08)" },
];
const GRADE_RISK = { "A+": 0.50, "A": 0.30, "B": 0.15, "C": 0.07, "✕": 0 };

function getGradeInfo(score, setup) {
  const g = setup.grades;
  let grade;
  if      (score >= g.Aplus) grade = "A+";
  else if (score >= g.A)     grade = "A";
  else if (score >= g.B)     grade = "B";
  else if (score >= g.C)     grade = "C";
  else                       grade = "✕";
  const display = GRADE_DISPLAY.find(d => d.grade === grade) || GRADE_DISPLAY[4];
  return { ...display, riskPct: GRADE_RISK[grade], gradeKey: grade };
}

function fmt$(n) {
  if (n === null || n === undefined || isNaN(n)) return "–";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtN(n) {
  if (!n && n !== 0) return "–";
  return Math.floor(n).toLocaleString("en-US");
}

function ScoreBar({ pct, color, height = 5 }) {
  return (
    <div style={{ width: "100%", height, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: color, borderRadius: 3, transition: "width 0.35s ease", boxShadow: `0 0 8px ${color}60` }} />
    </div>
  );
}

function Lbl({ children }) {
  return <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 4 }}>{children}</div>;
}

function NavBtn({ label, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", marginTop: 14, padding: "12px 16px", borderRadius: 10,
      border: `1px solid ${color || "rgba(255,255,255,0.15)"}`,
      background: color ? `${color}12` : "rgba(255,255,255,0.05)",
      color: color || "rgba(255,255,255,0.65)",
      fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
      letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <span>{label}</span><span style={{ fontSize: 14 }}>→</span>
    </button>
  );
}

// ─── TAB 1: CATEGORIZER ──────────────────────────────────────────────────────
function CriterionItem({ c, checked, onToggle }) {
  const isNeg = c.pts < 0;
  return (
    <button onClick={() => onToggle(c.id)} style={{
      display: "flex", alignItems: "center", gap: 9, width: "100%",
      padding: "8px 10px", borderRadius: 7,
      border: checked ? `1px solid ${isNeg ? "rgba(239,83,80,0.35)" : "rgba(0,230,118,0.35)"}` : "1px solid rgba(255,255,255,0.06)",
      background: checked ? (isNeg ? "rgba(239,83,80,0.09)" : "rgba(0,230,118,0.07)") : "rgba(255,255,255,0.02)",
      cursor: "pointer", textAlign: "left",
    }}>
      <div style={{ width: 17, height: 17, borderRadius: 4, flexShrink: 0, border: checked ? "none" : "1.5px solid rgba(255,255,255,0.2)", background: checked ? (isNeg ? "#ef5350" : "#00e676") : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <span style={{ color: "#000", fontSize: 9, fontWeight: 900 }}>✓</span>}
      </div>
      <span style={{ flex: 1, fontSize: 12.5, color: checked ? (isNeg ? "#ff8a80" : "#e8f5e9") : "rgba(255,255,255,0.55)" }}>{c.label}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color: checked ? (isNeg ? "#ff5252" : "#00e676") : "rgba(255,255,255,0.22)", fontFamily: "monospace", minWidth: 24, textAlign: "right" }}>
        {c.pts > 0 ? `+${c.pts}` : c.pts}
      </span>
    </button>
  );
}

function CategorizerTab({ setups, selectedSetup, setSelectedSetup, checked, setChecked, score, gradeInfo, setActiveTab }) {
  const setup       = selectedSetup ? setups[selectedSetup] : null;
  const coreItems   = setup ? setup.criteria.filter(c => c.group === "core")    : [];
  const qualItems   = setup ? setup.criteria.filter(c => c.group === "quality") : [];
  const riskItems   = setup ? setup.criteria.filter(c => c.group === "risk")    : [];
  const maxPossible = setup ? setup.criteria.filter(c => c.pts > 0).reduce((s, c) => s + c.pts, 0) : 0;
  const barPct      = maxPossible > 0 ? Math.max(0, Math.min(100, (score / maxPossible) * 100)) : 0;

  return (
    <div>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>SELECCIONA EL SETUP</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 5, marginBottom: 14 }}>
        {Object.values(setups).map(s => {
          const isLong    = s.direction === "long";
          const baseColor = isLong ? "#00e676" : "#ff5252";
          const isActive  = selectedSetup === s.id;
          return (
            <button key={s.id} onClick={() => { setSelectedSetup(s.id); setChecked({}); }} style={{
              padding: "9px 5px", borderRadius: 9, cursor: "pointer", textAlign: "center",
              border: isActive ? `2px solid ${baseColor}` : `1px solid ${baseColor}35`,
              background: isActive ? `${baseColor}18` : `${baseColor}08`,
            }}>
              <div style={{ fontSize: 15 }}>{s.emoji}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? baseColor : `${baseColor}90`, fontFamily: "monospace", lineHeight: 1.3, marginTop: 2 }}>{s.name}</div>
              <div style={{ fontSize: 8.5, fontWeight: 700, marginTop: 3, padding: "1px 5px", borderRadius: 8, display: "inline-block", background: isLong ? "rgba(0,230,118,0.15)" : "rgba(255,82,82,0.15)", color: isLong ? "#00e676" : "#ff5252" }}>
                {isLong ? "▲ LONG" : "▼ SHORT"}
              </div>
            </button>
          );
        })}
      </div>

      {!setup ? (
        <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.2)", fontSize: 12, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>📊</div>Selecciona un setup para empezar
        </div>
      ) : (
        <>
          <div style={{ background: gradeInfo.bg, border: `1.5px solid ${gradeInfo.color}45`, borderRadius: 13, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>CALIDAD DEL PLAY</div>
                <div style={{ fontSize: 52, fontWeight: 900, color: gradeInfo.color, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{gradeInfo.grade}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>PUNTOS</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: gradeInfo.color, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{score}</div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>/ {maxPossible} máx</div>
              </div>
            </div>
            <ScoreBar pct={barPct} color={gradeInfo.color} />
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {Object.entries(setup.grades).map(([k, v]) => {
                const labels = { Aplus: "A+", A: "A", B: "B", C: "C" };
                const gd = GRADE_DISPLAY.find(d => d.grade === labels[k]);
                const isActive = gradeInfo.grade === labels[k];
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 20, background: isActive ? `${gd?.color}25` : `${gd?.color}10`, border: `1px solid ${gd?.color}${isActive ? "60" : "30"}` }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: gd?.color, fontFamily: "monospace" }}>{labels[k]}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>≥{v}pts</span>
                    <span style={{ fontSize: 9, color: gd?.color }}>{(GRADE_RISK[labels[k]] * 100).toFixed(0)}%R</span>
                  </div>
                );
              })}
            </div>
          </div>

          {[
            { label: "SEÑALES CORE",        items: coreItems, accent: setup.direction === "long" ? "#00e676" : "#ff5252" },
            { label: "CONFIRMADORES",        items: qualItems, accent: "#90caf9" },
            { label: "FACTORES DE RIESGO",   items: riskItems, accent: "#ef5350" },
          ].filter(g => g.items.length > 0).map(g => (
            <div key={g.label} style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: 1.5, marginBottom: 4, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 2, height: 9, background: g.accent, borderRadius: 1, display: "inline-block" }} />{g.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {g.items.map(c => <CriterionItem key={c.id} c={c} checked={!!checked[c.id]} onToggle={id => setChecked(prev => ({ ...prev, [id]: !prev[id] }))} />)}
              </div>
            </div>
          ))}

          {gradeInfo.grade !== "✕" && <NavBtn label="CONTINUAR A CALCULADORA" onClick={() => setActiveTab(1)} color={gradeInfo.color} />}
        </>
      )}
    </div>
  );
}

// ─── TAB 2: CALCULATOR ───────────────────────────────────────────────────────
function CalculatorTab({ capital, setCapital, riskStr, setRiskStr, bbOffset, setBbOffset, entryPrice, setEntryPrice, slPrice, setSlPrice, ticker, setTicker, gradeInfo, selectedSetup, onSaveToLog, setActiveTab }) {
  const baseRisk     = parseFloat(riskStr) || 0;
  const effectivePct = Math.max(0.1, +(baseRisk + bbOffset).toFixed(1));
  const dailyR       = capital * (effectivePct / 100);
  const ep           = parseFloat(entryPrice) || 0;
  const sp           = parseFloat(slPrice) || 0;
  const rps          = Math.abs(ep - sp);
  const isValid      = capital > 0 && rps > 0 && ep > 0;
  const bbMod        = +bbOffset.toFixed(1);
  const bbLabel      = bbMod > 0 ? `BOOST +${bbMod}%` : bbMod < 0 ? `BREAK ${bbMod}%` : null;
  const bbColor      = bbMod > 0 ? "#00e676" : bbMod < 0 ? "#ff5252" : null;
  const canSave      = isValid && selectedSetup && gradeInfo.grade !== "✕";

  const gradeRows = useMemo(() => {
    if (!isValid) return [];
    return [
      { grade: "A+", riskPct: 0.50, color: "#00e676" },
      { grade: "A",  riskPct: 0.30, color: "#69f0ae" },
      { grade: "B",  riskPct: 0.15, color: "#ffab40" },
      { grade: "C",  riskPct: 0.07, color: "#ff8a65" },
    ].map(g => {
      const shares = rps > 0 ? Math.floor((dailyR * g.riskPct) / rps) : 0;
      return { ...g, shares, dollarRisk: shares * rps };
    });
  }, [capital, effectivePct, ep, sp, isValid, dailyR, rps]);

  const inStyle = { width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" };

  return (
    <div>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>CONFIGURACIÓN DE CUENTA</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <Lbl>CAPITAL TOTAL</Lbl>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", pointerEvents: "none" }}>$</span>
            <input type="number" value={capital || ""} onChange={e => setCapital(parseFloat(e.target.value) || 0)} placeholder="25000" style={{ ...inStyle, paddingLeft: 20 }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Lbl>% RIESGO DIARIO</Lbl>
          <input type="text" inputMode="decimal" value={riskStr}
            onChange={e => { const v = e.target.value; if (v === "" || v === "." || /^\d*\.?\d*$/.test(v)) setRiskStr(v); }}
            placeholder="1.0" style={inStyle} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 8 }}>
        <button onClick={() => setBbOffset(p => +(Math.max(-3, p - 0.1)).toFixed(1))} style={{ flex: 1, padding: "9px 6px", borderRadius: 9, border: "1px solid rgba(255,82,82,0.4)", background: "rgba(255,82,82,0.08)", color: "#ff5252", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>⬇ BREAK −0.1%</button>
        <div style={{ textAlign: "center", minWidth: 68 }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>R. EFECTIVO</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: bbColor || "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{effectivePct.toFixed(1)}%</div>
          {bbLabel ? <div style={{ fontSize: 8.5, color: bbColor, fontFamily: "monospace", fontWeight: 700 }}>{bbLabel}</div> : <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>sin ajuste</div>}
        </div>
        <button onClick={() => setBbOffset(p => +(Math.min(3, p + 0.1)).toFixed(1))} style={{ flex: 1, padding: "9px 6px", borderRadius: 9, border: "1px solid rgba(0,230,118,0.4)", background: "rgba(0,230,118,0.08)", color: "#00e676", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>⬆ BOOST +0.1%</button>
      </div>

      {capital > 0 && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>1R DIARIO</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(dailyR)}</span>
        </div>
      )}

      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>DATOS DEL TRADE</div>
      <div style={{ marginBottom: 7 }}>
        <Lbl>TICKER</Lbl>
        <input type="text" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="AAPL"
          style={{ ...inStyle, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: 1.5 }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        {[{ lbl: "PRECIO ENTRADA", val: entryPrice, set: setEntryPrice, ph: "10.50" }, { lbl: "PRECIO STOP LOSS", val: slPrice, set: setSlPrice, ph: "9.80" }].map(f => (
          <div key={f.lbl} style={{ flex: 1 }}>
            <Lbl>{f.lbl}</Lbl>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", pointerEvents: "none" }}>$</span>
              <input type="number" value={f.val || ""} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ ...inStyle, paddingLeft: 20 }} />
            </div>
          </div>
        ))}
      </div>
      {rps > 0 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 10 }}>RIESGO / ACCIÓN: <span style={{ color: "#fff", fontWeight: 700 }}>{fmt$(rps)}</span></div>}

      {isValid ? (
        <div style={{ borderRadius: 11, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "38px 1fr 1fr 1fr", background: "rgba(255,255,255,0.05)", padding: "7px 12px", gap: 4 }}>
            {["", "SHARES", "$ RIESGO", "% R"].map((h, i) => <div key={i} style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: 1 }}>{h}</div>)}
          </div>
          {gradeRows.map((p, i) => (
            <div key={p.grade} style={{ display: "grid", gridTemplateColumns: "38px 1fr 1fr 1fr", padding: "9px 12px", gap: 4, background: gradeInfo.grade === p.grade ? `${p.color}10` : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderTop: "1px solid rgba(255,255,255,0.04)", borderLeft: gradeInfo.grade === p.grade ? `3px solid ${p.color}` : "3px solid transparent" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: p.color, fontFamily: "'Space Grotesk', sans-serif" }}>{p.grade}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'JetBrains Mono', monospace" }}>{fmtN(p.shares)}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(p.dollarRisk)}</div>
              <div style={{ fontSize: 11.5, color: p.color, fontFamily: "monospace", fontWeight: 700 }}>{(p.riskPct * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "18px", textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 11.5, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.07)", marginBottom: 12 }}>Introduce capital, entrada y stop para ver el sizing</div>
      )}

      <button onClick={onSaveToLog} disabled={!canSave} style={{ width: "100%", padding: "12px", borderRadius: 10, background: canSave ? `linear-gradient(135deg, ${gradeInfo.color}28, ${gradeInfo.color}12)` : "rgba(255,255,255,0.04)", border: canSave ? `1.5px solid ${gradeInfo.color}55` : "1px solid rgba(255,255,255,0.07)", color: canSave ? gradeInfo.color : "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed", fontFamily: "monospace", letterSpacing: 0.5 }}>
        {canSave ? `💾  REGISTRAR — ${ticker || "TICKER"} · ${gradeInfo.grade}` : !selectedSetup ? "← Categoriza primero el play" : gradeInfo.grade === "✕" ? "⛔ PLAY DESCARTADO" : "Rellena capital, entrada y stop"}
      </button>
      {canSave && <NavBtn label="VER REGISTRO DE TRADES" onClick={() => setActiveTab(2)} color={gradeInfo.color} />}
      <div style={{ textAlign: "center", marginTop: 22, fontSize: 9.5, color: "rgba(255,255,255,0.1)", fontFamily: "monospace", letterSpacing: 2 }}>by jotaerre</div>
    </div>
  );
}

// ─── TAB 3: LOG ──────────────────────────────────────────────────────────────
function LogTab({ log, setLog, setActiveTab }) {
  const [editingNote, setEditingNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  if (log.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>📋</div>Sin trades registrados aún.
        <div style={{ fontSize: 10.5, marginTop: 4 }}>Usa la calculadora para guardar plays.</div>
        <NavBtn label="IR A CALCULADORA" onClick={() => setActiveTab(1)} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>REGISTRO DE TRADES</div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{log.length} trade{log.length !== 1 ? "s" : ""}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {[...log].reverse().map(entry => {
          const gd  = GRADE_DISPLAY.find(d => d.grade === entry.grade) || GRADE_DISPLAY[4];
          const rps = Math.abs(entry.entryPrice - entry.slPrice);
          return (
            <div key={entry.id} style={{ borderRadius: 12, border: `1px solid ${gd.color}28`, background: `${gd.color}05`, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: gd.color, fontFamily: "'Space Grotesk', sans-serif" }}>{entry.grade}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{entry.ticker}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{entry.time} · {entry.setupName || "–"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {entry.bbLabel && <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 5px", borderRadius: 9, background: entry.bbMod > 0 ? "rgba(0,230,118,0.15)" : "rgba(255,82,82,0.15)", color: entry.bbMod > 0 ? "#00e676" : "#ff5252", fontFamily: "monospace" }}>{entry.bbLabel}</span>}
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", background: "rgba(255,255,255,0.05)", padding: "2px 5px", borderRadius: 5 }}>{entry.score}pts</span>
                  <button onClick={() => setLog(prev => prev.filter(e => e.id !== entry.id))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 14, padding: "0 2px" }}>✕</button>
                </div>
              </div>
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {[{ l: "ENTRADA", v: fmt$(entry.entryPrice) }, { l: "STOP", v: fmt$(entry.slPrice) }, { l: "R/ACC", v: fmt$(rps) }].map((item, i) => (
                  <div key={item.l} style={{ flex: 1, padding: "7px 10px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: 1 }}>{item.l}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.78)", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", marginBottom: 5, letterSpacing: 1 }}>SIZING POR CALIDAD</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
                  {[{ grade: "A+", riskPct: 0.50, color: "#00e676" }, { grade: "A", riskPct: 0.30, color: "#69f0ae" }, { grade: "B", riskPct: 0.15, color: "#ffab40" }, { grade: "C", riskPct: 0.07, color: "#ff8a65" }].map(g2 => {
                    const sh = rps > 0 ? Math.floor((entry.dailyR * g2.riskPct) / rps) : 0;
                    const isActive = entry.grade === g2.grade;
                    return (
                      <div key={g2.grade} style={{ padding: "5px 6px", borderRadius: 6, background: isActive ? `${g2.color}18` : "rgba(255,255,255,0.03)", border: isActive ? `1px solid ${g2.color}38` : "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: g2.color, fontFamily: "monospace" }}>{g2.grade}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", fontFamily: "'JetBrains Mono', monospace" }}>{fmtN(sh)}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(sh * rps)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ padding: "7px 12px" }}>
                {editingNote === entry.id ? (
                  <div>
                    <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Notas del trade..." rows={2}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", fontSize: 12, padding: "6px 9px", resize: "none", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                    <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
                      <button onClick={() => { setLog(prev => prev.map(e => e.id === entry.id ? { ...e, notes: noteDraft } : e)); setEditingNote(null); }} style={{ flex: 1, padding: "5px", borderRadius: 6, border: "none", background: "#00e676", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
                      <button onClick={() => setEditingNote(null)} style={{ flex: 1, padding: "5px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setEditingNote(entry.id); setNoteDraft(entry.notes || ""); }} style={{ cursor: "pointer", minHeight: 22 }}>
                    {entry.notes ? <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)", fontStyle: "italic", lineHeight: 1.4 }}>"{entry.notes}"</p> : <p style={{ margin: 0, fontSize: 10.5, color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>+ Añadir nota...</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <NavBtn label="VER ALARMAS DE RIESGO" onClick={() => setActiveTab(3)} />
    </div>
  );
}

// ─── TAB 4: ALARMS ───────────────────────────────────────────────────────────
function AlarmsTab({ log, capital, effectivePct, setActiveTab }) {
  const dailyR = capital * (effectivePct / 100);
  const totalRisked = log.reduce((sum, e) => {
    const rps = Math.abs(e.entryPrice - e.slPrice);
    const sh  = rps > 0 ? Math.floor((e.dailyR * (GRADE_RISK[e.grade] || 0)) / rps) : 0;
    return sum + sh * rps;
  }, 0);
  const pct          = dailyR > 0 ? (totalRisked / dailyR) * 100 : 0;
  const overallColor = pct >= 75 ? "#f44336" : pct >= 50 ? "#ff9800" : pct >= 30 ? "#ffeb3b" : "#00e676";
  const alarms = [
    { label: "ALARMA 1 — Precaución", threshold: 30, color: "#ffeb3b", icon: "⚠️" },
    { label: "ALARMA 2 — Atención",   threshold: 50, color: "#ff9800", icon: "🔶" },
    { label: "ALARMA 3 — PELIGRO",    threshold: 75, color: "#f44336", icon: "🚨" },
  ];

  return (
    <div>
      <div style={{ borderRadius: 12, padding: "14px 15px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1.5 }}>RIESGO DIARIO (1R)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{fmt$(dailyR)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1.5 }}>COMPROMETIDO</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: overallColor, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{fmt$(totalRisked)}</div>
          </div>
        </div>
        <ScoreBar pct={pct} color={overallColor} height={7} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>0%</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "monospace", color: overallColor }}>{Math.min(100, Math.round(pct))}% del R diario usado</span>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>100%</span>
        </div>
      </div>

      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>ALARMAS DE RIESGO</div>
      {alarms.map(a => {
        const triggered = pct >= a.threshold;
        const fill      = Math.min(100, (pct / a.threshold) * 100);
        return (
          <div key={a.threshold} style={{ borderRadius: 11, padding: "12px 14px", marginBottom: 8, border: `1.5px solid ${triggered ? a.color : "rgba(255,255,255,0.07)"}`, background: triggered ? `${a.color}10` : "rgba(255,255,255,0.03)", transition: "all 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16, animation: triggered ? "pulse 1.2s infinite" : "none" }}>{triggered ? a.icon : "⏸"}</span>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: triggered ? a.color : "rgba(255,255,255,0.55)", fontFamily: "'Space Grotesk', sans-serif" }}>{a.label}</div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>Se activa al {a.threshold}% · {fmt$(dailyR * a.threshold / 100)}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: triggered ? a.color : "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{Math.min(100, Math.round(pct))}%</div>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>/ {a.threshold}%</div>
              </div>
            </div>
            <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill}%`, background: triggered ? a.color : `${a.color}45`, borderRadius: 3, transition: "width 0.4s ease", boxShadow: triggered ? `0 0 10px ${a.color}70` : "none" }} />
            </div>
            {triggered && <div style={{ marginTop: 6, fontSize: 10.5, color: a.color, fontWeight: 700, fontFamily: "monospace", animation: "pulse 1.5s infinite" }}>ACTIVADA — {Math.round(pct)}% del R diario comprometido</div>}
          </div>
        );
      })}

      {log.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.28)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>TRADES DEL DÍA</div>
          {log.map(e => {
            const gd  = GRADE_DISPLAY.find(d => d.grade === e.grade);
            const rps = Math.abs(e.entryPrice - e.slPrice);
            const sh  = rps > 0 ? Math.floor((e.dailyR * (GRADE_RISK[e.grade] || 0)) / rps) : 0;
            return (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 11px", borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: gd?.color, fontFamily: "monospace" }}>{e.grade}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'Space Grotesk', sans-serif" }}>{e.ticker}</span>
                  {e.bbLabel && <span style={{ fontSize: 8.5, color: e.bbMod > 0 ? "#00e676" : "#ff5252", fontFamily: "monospace", fontWeight: 700 }}>{e.bbLabel}</span>}
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{e.time}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.65)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(sh * rps)}</span>
              </div>
            );
          })}
        </div>
      )}
      {capital === 0 && <div style={{ textAlign: "center", padding: 16, color: "rgba(255,255,255,0.2)", fontSize: 11.5 }}>Configura tu capital en la pestaña Calculadora</div>}
      <NavBtn label="NUEVO TRADE — IR A SETUP" onClick={() => setActiveTab(0)} />
    </div>
  );
}

// ─── TAB 5: CONFIG ────────────────────────────────────────────────────────────
const GROUP_OPTIONS = ["core", "quality", "risk"];

function ConfigTab({ setups, setSetups }) {
  const [activeSetupId, setActiveSetupId] = useState(Object.keys(setups)[0]);
  const [newLabel, setNewLabel]           = useState("");
  const [newPts, setNewPts]               = useState("1");
  const [newGroup, setNewGroup]           = useState("core");
  const [confirmReset, setConfirmReset]   = useState(false);

  const setup = setups[activeSetupId];
  if (!setup) return null;

  const inputStyle = { padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: "none" };

  function updateField(id, field, value) {
    setSetups(prev => ({ ...prev, [activeSetupId]: { ...prev[activeSetupId], criteria: prev[activeSetupId].criteria.map(c => c.id === id ? { ...c, [field]: value } : c) } }));
  }

  function deleteCriterion(id) {
    setSetups(prev => ({ ...prev, [activeSetupId]: { ...prev[activeSetupId], criteria: prev[activeSetupId].criteria.filter(c => c.id !== id) } }));
  }

  function addCriterion() {
    if (!newLabel.trim()) return;
    setSetups(prev => ({ ...prev, [activeSetupId]: { ...prev[activeSetupId], criteria: [...prev[activeSetupId].criteria, { id: "custom_" + Date.now(), label: newLabel.trim(), pts: parseInt(newPts, 10) || 1, group: newGroup }] } }));
    setNewLabel(""); setNewPts("1");
  }

  function updateGrade(key, val) {
    const n = parseInt(val, 10);
    if (!isNaN(n)) setSetups(prev => ({ ...prev, [activeSetupId]: { ...prev[activeSetupId], grades: { ...prev[activeSetupId].grades, [key]: n } } }));
  }

  return (
    <div>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>EDITAR SETUP</div>

      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.values(setups).map(s => {
          const c      = s.direction === "long" ? "#00e676" : "#ff5252";
          const active = activeSetupId === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSetupId(s.id)} style={{ padding: "4px 9px", borderRadius: 20, border: active ? `1.5px solid ${c}` : `1px solid ${c}35`, background: active ? `${c}18` : "transparent", color: active ? c : `${c}70`, fontSize: 9.5, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>
              {s.emoji} {s.name}
            </button>
          );
        })}
      </div>

      {/* Grade thresholds */}
      <div style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 8 }}>UMBRALES DE CALIDAD (puntos mínimos)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
          {[{ key: "Aplus", label: "A+", color: "#00e676" }, { key: "A", label: "A", color: "#69f0ae" }, { key: "B", label: "B", color: "#ffab40" }, { key: "C", label: "C", color: "#ff8a65" }].map(g => (
            <div key={g.key}>
              <div style={{ fontSize: 9, color: g.color, fontFamily: "monospace", fontWeight: 700, marginBottom: 3 }}>{g.label}</div>
              <input type="number" value={setup.grades[g.key]} onChange={e => updateGrade(g.key, e.target.value)}
                style={{ ...inputStyle, width: "100%", color: g.color, textAlign: "center", fontSize: 14, fontWeight: 700 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Criteria */}
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 6 }}>CRITERIOS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {setup.criteria.map(c => {
          const isNeg = c.pts < 0;
          return (
            <div key={c.id} style={{ display: "flex", gap: 5, alignItems: "center", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${isNeg ? "rgba(239,83,80,0.15)" : "rgba(0,230,118,0.1)"}` }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, flexShrink: 0, background: c.group === "core" ? (setup.direction === "long" ? "#00e676" : "#ff5252") : c.group === "quality" ? "#90caf9" : "#ef5350" }} />
              <input type="text" value={c.label} onChange={e => updateField(c.id, "label", e.target.value)}
                style={{ ...inputStyle, flex: 1, fontSize: 11.5, padding: "5px 7px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.08)", borderRadius: 0 }} />
              <input type="number" value={c.pts} onChange={e => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) updateField(c.id, "pts", n); }}
                style={{ ...inputStyle, width: 46, textAlign: "center", fontSize: 13, fontWeight: 700, color: isNeg ? "#ff5252" : "#00e676", padding: "5px 4px" }} />
              <select value={c.group} onChange={e => updateField(c.id, "group", e.target.value)}
                style={{ ...inputStyle, fontSize: 9, padding: "5px 4px", color: "rgba(255,255,255,0.5)" }}>
                {GROUP_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <button onClick={() => deleteCriterion(c.id)} style={{ background: "none", border: "none", color: "rgba(255,82,82,0.5)", cursor: "pointer", fontSize: 16, padding: "0 2px", flexShrink: 0, lineHeight: 1 }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Add criterion */}
      <div style={{ borderRadius: 10, border: "1px solid rgba(0,230,118,0.2)", background: "rgba(0,230,118,0.04)", padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: "#00e676", fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 8 }}>+ AÑADIR CRITERIO</div>
        <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Descripción del criterio..."
          style={{ ...inputStyle, width: "100%", fontSize: 12, marginBottom: 6 }} />
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 3 }}>PUNTOS (+/-)</div>
            <input type="number" value={newPts} onChange={e => setNewPts(e.target.value)} placeholder="1" style={{ ...inputStyle, width: "100%", textAlign: "center" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 3 }}>GRUPO</div>
            <select value={newGroup} onChange={e => setNewGroup(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
              {GROUP_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={addCriterion} disabled={!newLabel.trim()} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: newLabel.trim() ? "#00e676" : "rgba(255,255,255,0.08)", color: newLabel.trim() ? "#000" : "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 13, cursor: newLabel.trim() ? "pointer" : "not-allowed" }}>＋</button>
          </div>
        </div>
      </div>

      {/* Reset */}
      {!confirmReset ? (
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setConfirmReset("setup")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(255,171,64,0.3)", background: "rgba(255,171,64,0.06)", color: "#ffab40", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>↺ Reset este setup</button>
          <button onClick={() => setConfirmReset("all")}   style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(239,83,80,0.3)",  background: "rgba(239,83,80,0.06)",  color: "#ef5350", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>↺ Reset todo</button>
        </div>
      ) : (
        <div style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(239,83,80,0.4)", background: "rgba(239,83,80,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
            {confirmReset === "setup" ? `¿Resetear ${setup.name} a valores originales?` : "¿Resetear TODOS los setups a valores originales?"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { confirmReset === "setup" ? setSetups(prev => ({ ...prev, [activeSetupId]: deepClone(DEFAULT_SETUPS[activeSetupId]) })) : setSetups(deepClone(DEFAULT_SETUPS)); setConfirmReset(false); }}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#ef5350", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Sí, resetear</button>
            <button onClick={() => setConfirmReset(false)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", lineHeight: 1.7 }}>
          <span style={{ color: "rgba(0,230,118,0.6)" }}>●</span> CORE — señales principales &nbsp;
          <span style={{ color: "rgba(144,202,249,0.6)" }}>●</span> QUALITY — confirmadores &nbsp;
          <span style={{ color: "rgba(239,83,80,0.6)" }}>●</span> RISK — factores de riesgo<br/>
          Puntos negativos restan al score. Umbral A+ debe ser mayor que A, B y C.
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [setups, setSetups]       = useState(() => deepClone(DEFAULT_SETUPS));
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [checked, setChecked]     = useState({});
  const [capital, setCapital]     = useState(0);
  const [riskStr, setRiskStr]     = useState("1.0");
  const [bbOffset, setBbOffset]   = useState(0);
  const [entryPrice, setEntryPrice] = useState("");
  const [slPrice, setSlPrice]     = useState("");
  const [ticker, setTicker]       = useState("");
  const [log, setLog]             = useState([]);

  const baseRisk     = parseFloat(riskStr) || 0;
  const effectivePct = Math.max(0.1, +(baseRisk + bbOffset).toFixed(1));
  const dailyR       = capital * (effectivePct / 100);

  const { score, gradeInfo } = useMemo(() => {
    const setup = selectedSetup ? setups[selectedSetup] : null;
    if (!setup) return { score: 0, gradeInfo: GRADE_DISPLAY[4] };
    const sc = setup.criteria.filter(c => checked[c.id]).reduce((s, c) => s + c.pts, 0);
    return { score: sc, gradeInfo: getGradeInfo(sc, setup) };
  }, [selectedSetup, checked, setups]);

  const handleSetSetups = useCallback((updater) => { setSetups(updater); setChecked({}); }, []);

  function handleSaveToLog() {
    const ep = parseFloat(entryPrice), sp = parseFloat(slPrice);
    if (!ep || !sp || !capital || !selectedSetup || gradeInfo.grade === "✕") return;
    const bbMod    = +bbOffset.toFixed(1);
    const setupDef = setups[selectedSetup];
    setLog(prev => [...prev, { id: Date.now(), time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }), ticker: ticker || "–", setupId: selectedSetup, setupName: setupDef ? `${setupDef.emoji} ${setupDef.name}` : "–", grade: gradeInfo.grade, score, entryPrice: ep, slPrice: sp, dailyR, effectivePct, bbMod, bbLabel: bbMod > 0 ? `BOOST +${bbMod}%` : bbMod < 0 ? `BREAK ${bbMod}%` : null, notes: "" }]);
    setActiveTab(2);
  }

  const totalRisked  = log.reduce((sum, e) => { const rps = Math.abs(e.entryPrice - e.slPrice); const sh = rps > 0 ? Math.floor((e.dailyR * (GRADE_RISK[e.grade] || 0)) / rps) : 0; return sum + sh * rps; }, 0);
  const riskPct      = dailyR > 0 ? (totalRisked / dailyR) * 100 : 0;
  const alarmColor   = riskPct >= 75 ? "#f44336" : riskPct >= 50 ? "#ff9800" : riskPct >= 30 ? "#ffeb3b" : null;

  const tabs = [
    { label: "SETUP",  icon: "🎯" },
    { label: "CALC",   icon: "💰" },
    { label: "LOG",    icon: "📋", badge: log.length },
    { label: "RIESGO", icon: "🚨" },
    { label: "CONFIG", icon: "⚙️" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f12", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", width: "100%", maxWidth: 540, margin: "0 auto" }}>
      <style>{`
        @import url('${FONT_URL}');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #0d0f12; min-height: 100vh; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.09); border-radius: 2px; }
        button { transition: opacity 0.1s; }
        button:active { opacity: 0.72; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        select option { background: #1a1d24; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#141720,#0d0f12)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <svg width="26" height="26" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="10" fill="#141720"/>
            <polyline points="8,48 20,34 28,40 40,20 56,16" fill="none" stroke="#00e676" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="56" cy="16" r="4" fill="#00e676"/>
            <line x1="8" y1="52" x2="56" y2="52" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
          </svg>
          <div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: 3, fontFamily: "monospace" }}>XVN TRADING</div>
            <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.5 }}>Jotaerre Calc</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {capital > 0 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{fmt$(dailyR)} <span style={{ color: "rgba(255,255,255,0.15)" }}>1R</span></div>}
          {alarmColor && <div style={{ padding: "2px 7px", borderRadius: 20, background: `${alarmColor}18`, border: `1px solid ${alarmColor}55`, fontSize: 9.5, fontWeight: 700, color: alarmColor, fontFamily: "monospace", animation: riskPct >= 50 ? "pulse 1.5s infinite" : "none" }}>🚨 {Math.round(riskPct)}%</div>}
          {selectedSetup && gradeInfo.grade !== "✕" && <div style={{ padding: "2px 8px", borderRadius: 20, background: `${gradeInfo.color}18`, border: `1px solid ${gradeInfo.color}45`, fontSize: 12, fontWeight: 900, color: gradeInfo.color, fontFamily: "'Space Grotesk', sans-serif" }}>{gradeInfo.grade}</div>}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", background: "#0e1015", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: "10px 2px 8px", border: "none", background: "none", cursor: "pointer", borderBottom: activeTab === i ? "2px solid rgba(255,255,255,0.75)" : "2px solid transparent", position: "relative" }}>
            <div style={{ fontSize: 13 }}>{t.icon}</div>
            <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 0.3, marginTop: 1, color: activeTab === i ? "#fff" : "rgba(255,255,255,0.32)", fontWeight: activeTab === i ? 700 : 400 }}>{t.label}</div>
            {t.badge > 0 && <div style={{ position: "absolute", top: 5, right: "calc(50% - 13px)", width: 13, height: 13, borderRadius: 7, background: "#00e676", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7.5, fontWeight: 900, color: "#000" }}>{t.badge}</div>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "13px 13px 30px" }}>
        {activeTab === 0 && <CategorizerTab setups={setups} selectedSetup={selectedSetup} setSelectedSetup={setSelectedSetup} checked={checked} setChecked={setChecked} score={score} gradeInfo={gradeInfo} setActiveTab={setActiveTab} />}
        {activeTab === 1 && <CalculatorTab capital={capital} setCapital={setCapital} riskStr={riskStr} setRiskStr={setRiskStr} bbOffset={bbOffset} setBbOffset={setBbOffset} entryPrice={entryPrice} setEntryPrice={setEntryPrice} slPrice={slPrice} setSlPrice={setSlPrice} ticker={ticker} setTicker={setTicker} gradeInfo={gradeInfo} selectedSetup={selectedSetup} onSaveToLog={handleSaveToLog} setActiveTab={setActiveTab} />}
        {activeTab === 2 && <LogTab log={log} setLog={setLog} setActiveTab={setActiveTab} />}
        {activeTab === 3 && <AlarmsTab log={log} capital={capital} effectivePct={effectivePct} setActiveTab={setActiveTab} />}
        {activeTab === 4 && <ConfigTab setups={setups} setSetups={handleSetSetups} />}
      </div>
    </div>
  );
}
