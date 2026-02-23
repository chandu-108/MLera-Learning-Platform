"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from 'next/link';
import Image from "next/image";

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  coral: "#FF6B6B",
  purple: "#A855F7",
  navy: "#0D0B1E",
  dark: "#080614",
  card: "rgba(255,255,255,0.028)",
  border: "rgba(255,255,255,0.07)",
};

const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// ─── Sigmoid function ─────────────────────────────────────────────────────────
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

// ─── Gradient Text ────────────────────────────────────────────────────────────
function G({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("bg-clip-text text-transparent", className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${C.coral} 0%, #FF4757 30%, #C026D3 65%, ${C.purple} 100%)` }}>
      {children}
    </span>
  );
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 40, x = 0, className }: { children: React.ReactNode; delay?: number; y?: number; x?: number; className?: string }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={inV ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── Neural Logo ──────────────────────────────────────────────────────────────
function NeuralLogo({ size = 32 }: { size?: number }) {
  const nodes = [
    { x: 14, y: 6 }, { x: 34, y: 10 },
    { x: 8, y: 22 }, { x: 28, y: 18 }, { x: 44, y: 26 },
    { x: 14, y: 34 }, { x: 34, y: 38 }, { x: 20, y: 50 },
  ];
  const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6]];
  return (
    <svg width={size} height={size} viewBox="0 0 52 56" fill="none" overflow="visible">
      <defs>
        <linearGradient id="nlg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.coral} /><stop offset="100%" stopColor={C.purple} />
        </linearGradient>
        <filter id="nglow"><feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#nlg)" strokeWidth="1.2" strokeOpacity="0.5" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3" fill="url(#nlg)" filter="url(#nglow)" />
      ))}
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? { background: "rgba(13,11,30,0.92)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(16px)" } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center -ml-2 sm:ml-0">
            <Image src="/navbar-logo-2.png" alt="MLera Logo" width={120} height={40} className="object-contain w-[100px] sm:w-[120px]" priority />
          </motion.div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Module 2 of 5
          </span>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="text-xs px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}>
            Dashboard
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current = 2, total = 5 }: { current?: number; total?: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-mono text-white/35">
        <span>Module Progress</span><span>{current}/{total} complete</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${C.coral}, ${C.purple})` }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div key={i} className="flex-1 h-1 rounded-full"
            style={{ background: i < current ? `linear-gradient(90deg, ${C.coral}, ${C.purple})` : "rgba(255,255,255,0.08)" }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ children, delay = 0, glow = false, className }: { children: React.ReactNode; delay?: number; glow?: boolean; className?: string }) {
  return (
    <Reveal delay={delay} className={className}>
      <motion.div whileHover={{ boxShadow: `0 8px 60px rgba(168,85,247,${glow ? "0.18" : "0.08"})` }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden"
        style={{ background: C.card, borderColor: C.border }}>
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.035] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${C.purple}, transparent)` }} />
        {children}
      </motion.div>
    </Reveal>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-2">
      <motion.div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 mt-0.5"
        style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}
        whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
        {number}
      </motion.div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-white/35 font-mono mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Sigmoid Curve SVG ────────────────────────────────────────────────────────
function SigmoidChart({ highlightX = 0, animated = true }: { highlightX?: number; animated?: boolean }) {
  const svgRef = useRef(null);
  const inV = useInView(svgRef, { once: true });
  const W = 500, H = 240, PAD = 45;

  const xMin = -6, xMax = 6;
  const pts = Array.from({ length: 200 }, (_, i) => {
    const x = xMin + i * (xMax - xMin) / 199;
    return { x, y: sigmoid(x) };
  });

  const px = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y) * (H - PAD * 2);

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x).toFixed(2)} ${py(p.y).toFixed(2)}`).join(" ");
  const areaD = pathD + ` L ${px(xMax)} ${py(0)} L ${px(xMin)} ${py(0)} Z`;

  const hlX = px(highlightX);
  const hlY = py(sigmoid(highlightX));
  const prob = sigmoid(highlightX);

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="sigGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.purple} /><stop offset="100%" stopColor={C.coral} />
          </linearGradient>
          <linearGradient id="sigArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.purple} stopOpacity="0.18" />
            <stop offset="100%" stopColor={C.purple} stopOpacity="0" />
          </linearGradient>
          <filter id="hlGlow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {[-6, -4, -2, 0, 2, 4, 6].map(x => (
          <line key={x} x1={px(x)} y1={PAD} x2={px(x)} y2={H - PAD}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map(y => (
          <line key={y} x1={PAD} y1={py(y)} x2={W - PAD} y2={py(y)}
            stroke={y === 0.5 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"} strokeWidth={y === 0.5 ? "1.5" : "1"}
            strokeDasharray={y === 0.5 ? "6 4" : "none"} />
        ))}

        {/* Area */}
        <motion.path d={areaD} fill="url(#sigArea)"
          initial={{ opacity: 0 }} animate={inV ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} />

        {/* Sigmoid line */}
        <motion.path d={pathD} fill="none" stroke="url(#sigGrad)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inV ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, ease: "easeInOut" }} />

        {/* Highlight vertical */}
        <motion.line x1={hlX} y1={PAD} x2={hlX} y2={H - PAD}
          stroke={prob >= 0.5 ? C.coral : C.purple} strokeWidth="1.5" strokeDasharray="5 3"
          animate={{ x1: hlX, x2: hlX }} transition={{ duration: 0.2 }} />

        {/* Highlight horizontal */}
        <motion.line x1={PAD} y1={hlY} x2={hlX} y2={hlY}
          stroke={prob >= 0.5 ? C.coral : C.purple} strokeWidth="1.5" strokeDasharray="5 3"
          animate={{ y1: hlY, y2: hlY }} transition={{ duration: 0.2 }} />

        {/* Highlight point */}
        <motion.circle cx={hlX} cy={hlY} r="7"
          fill={prob >= 0.5 ? C.coral : C.purple} filter="url(#hlGlow)"
          stroke="white" strokeWidth="2"
          animate={{ cx: hlX, cy: hlY, fill: prob >= 0.5 ? C.coral : C.purple }}
          transition={{ duration: 0.2 }} />

        {/* Decision boundary label */}
        <text x={px(0) + 6} y={py(0.5) - 6} fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">
          Decision Boundary (0.5)
        </text>

        {/* Axes */}
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Y axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(y => (
          <text key={y} x={PAD - 6} y={py(y) + 3} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">
            {y.toFixed(2)}
          </text>
        ))}
        {[-6, -3, 0, 3, 6].map(x => (
          <text key={x} x={px(x)} y={H - PAD + 14} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">
            {x}
          </text>
        ))}

        {/* Labels */}
        <text x={W / 2} y={H - 3} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="10" fontFamily="monospace">z = θ·X</text>
        <text x={12} y={H / 2 + 3} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="10" fontFamily="monospace"
          transform={`rotate(-90,12,${H / 2})`}>σ(z)</text>

        {/* Probability display */}
        <text x={hlX + 10} y={hlY - 12} fill={prob >= 0.5 ? C.coral : C.purple}
          fontSize="11" fontFamily="monospace" fontWeight="bold">
          P={prob.toFixed(3)}
        </text>
      </svg>
    </div>
  );
}

// ─── Gradient Slider ──────────────────────────────────────────────────────────
function GradSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between">
        <label className="text-xs font-mono text-white/45">{label}</label>
        <motion.span key={value} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-black font-mono" style={{ color: C.coral }}>
          {value.toFixed(2)}
        </motion.span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.coral})` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 10 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, background: `linear-gradient(135deg, ${C.purple}, ${C.coral})` }} />
      </div>
    </div>
  );
}

// ─── Probability Gauge ────────────────────────────────────────────────────────
function ProbGauge({ probability }: { probability: number }) {
  const isYes = probability >= 0.5;
  const col = isYes ? C.coral : C.purple;
  const angle = probability * 180 - 90; // -90 to 90 degrees
  const r = 60, cx = 80, cy = 78;
  const arcPath = (startAngle: number, endAngle: number, radius: number) => {
    const s = { x: cx + radius * Math.cos((startAngle * Math.PI) / 180), y: cy + radius * Math.sin((startAngle * Math.PI) / 180) };
    const e = { x: cx + radius * Math.cos((endAngle * Math.PI) / 180), y: cy + radius * Math.sin((endAngle * Math.PI) / 180) };
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 160 90" className="w-full max-w-[180px]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.purple} /><stop offset="100%" stopColor={C.coral} />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path d={arcPath(180, 360, r)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round" />
        {/* Filled arc */}
        <motion.path d={arcPath(180, 180 + probability * 180, r)} fill="none"
          stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round"
          animate={{ d: arcPath(180, 180 + probability * 180, r) }} transition={{ duration: 0.3 }} />
        {/* Needle */}
        <motion.line
          x1={cx} y1={cy}
          x2={cx + (r - 14) * Math.cos(((180 + probability * 180 - 90) * Math.PI) / 180)}
          y2={cy + (r - 14) * Math.sin(((180 + probability * 180 - 90) * Math.PI) / 180)}
          stroke="white" strokeWidth="2.5" strokeLinecap="round"
          animate={{
            x2: cx + (r - 14) * Math.cos(((180 + probability * 180 - 90) * Math.PI) / 180),
            y2: cy + (r - 14) * Math.sin(((180 + probability * 180 - 90) * Math.PI) / 180),
          }} transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        />
        <circle cx={cx} cy={cy} r="5" fill="white" />
        {/* Labels */}
        <text x="18" y="82" fill={C.purple} fontSize="9" fontFamily="monospace" fontWeight="bold">NO</text>
        <text x="128" y="82" fill={C.coral} fontSize="9" fontFamily="monospace" fontWeight="bold">YES</text>
        {/* Center probability */}
        <text x={cx} y={cy - 18} textAnchor="middle" fill="white" fontSize="16" fontFamily="monospace" fontWeight="bold">
          {(probability * 100).toFixed(0)}%
        </text>
      </svg>
      <motion.div
        animate={{
          background: isYes
            ? `linear-gradient(135deg, ${C.coral}22, ${C.coral}11)`
            : `linear-gradient(135deg, ${C.purple}22, ${C.purple}11)`,
          borderColor: isYes ? `${C.coral}50` : `${C.purple}50`
        }}
        className="px-5 py-2 rounded-full border text-sm font-black tracking-wide"
        style={{ color: isYes ? C.coral : C.purple }}>
        {isYes ? "✓ YES" : "✕ NO"}
      </motion.div>
    </div>
  );
}

// ─── Spam Filter Demo ─────────────────────────────────────────────────────────
function SpamFilterDemo() {
  const features = [
    { id: "free", label: "Contains 'FREE'", weight: 2.8, icon: "🆓" },
    { id: "winner", label: "Contains 'WINNER'", weight: 3.1, icon: "🏆" },
    { id: "unknown", label: "Unknown sender", weight: 1.9, icon: "👤" },
    { id: "urgent", label: "Urgent language", weight: 2.2, icon: "🚨" },
    { id: "friend", label: "From contact", weight: -3.5, icon: "👥" },
    { id: "reply", label: "Reply to my email", weight: -2.8, icon: "↩️" },
  ];

  const [active, setActive] = useState<Record<string, boolean>>({});
  const bias = -1.2;
  const z = Object.entries(active).reduce((acc, [id, on]) => {
    const f = features.find(f => f.id === id);
    return on ? acc + (f?.weight || 0) : acc;
  }, bias);
  const prob = sigmoid(z);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {features.map((f) => {
          const on = active[f.id];
          const isSpam = f.weight > 0;
          return (
            <motion.button key={f.id}
              onClick={() => setActive(prev => ({ ...prev, [f.id]: !prev[f.id] }))}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="p-3 rounded-xl border text-left transition-all"
              style={on
                ? { background: isSpam ? `${C.coral}18` : `${C.purple}18`, borderColor: isSpam ? `${C.coral}50` : `${C.purple}50` }
                : { background: "rgba(255,255,255,0.02)", borderColor: C.border }}>
              <div className="text-lg mb-1">{f.icon}</div>
              <div className={cn("text-xs font-medium leading-tight", on ? "text-white" : "text-white/40")}>{f.label}</div>
              <div className="text-[10px] font-mono mt-1" style={{ color: f.weight > 0 ? C.coral : C.purple }}>
                {f.weight > 0 ? "+" : ""}{f.weight.toFixed(1)}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Score display */}
      <motion.div className="rounded-xl p-4 border" key={z.toFixed(2)}
        style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}>
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="font-mono text-sm text-white/50">
            z = <span style={{ color: C.purple }}>{bias.toFixed(1)} (bias)</span>
            {Object.entries(active).filter(([, v]) => v).map(([id]) => {
              const f = features.find(x => x.id === id);
              return f ? <span key={id} style={{ color: f.weight > 0 ? C.coral : "#4ade80" }}> + {f.weight}</span> : null;
            })}
            {" "} = <span className="text-white font-bold">{z.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <ProbGauge probability={prob} />
          <div className="space-y-3">
            <div className="text-xs font-mono text-white/30">σ(z) = 1 / (1 + e⁻ᶻ)</div>
            <div className="text-2xl font-black font-mono" style={{ color: prob >= 0.5 ? C.coral : C.purple }}>
              P(spam) = {(prob * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-white/50">
              {prob >= 0.9 ? "🚫 Definitely spam — moved to junk"
                : prob >= 0.5 ? "⚠️ Likely spam — flagged for review"
                  : prob >= 0.2 ? "🤔 Uncertain — inbox with warning"
                    : "✅ Looks safe — delivered to inbox"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sigmoid Explorer ─────────────────────────────────────────────────────────
function SigmoidExplorer() {
  const [z, setZ] = useState(0);
  const prob = sigmoid(z);
  const isYes = prob >= 0.5;

  return (
    <div className="space-y-5">
      <SigmoidChart highlightX={z} />
      <GradSlider label="z value (linear combination θ·X)" value={z} min={-6} max={6} step={0.1} onChange={setZ} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "z value", val: z.toFixed(2), col: "white" },
          { label: "σ(z)", val: prob.toFixed(4), col: isYes ? C.coral : C.purple },
          { label: "Decision", val: isYes ? "YES ✓" : "NO ✕", col: isYes ? C.coral : C.purple },
        ].map((item, i) => (
          <motion.div key={i} className="text-center rounded-xl py-3 px-2"
            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}
            whileHover={{ scale: 1.03 }}>
            <div className="text-[10px] font-mono text-white/30 mb-1 uppercase tracking-widest">{item.label}</div>
            <motion.div key={item.val} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-black font-mono" style={{ color: item.col }}>{item.val}</motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Use Case Card ────────────────────────────────────────────────────────────
function UseCaseCard({ icon, title, desc, examples, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; examples: { label: string; result: string }[]; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <motion.div
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(168,85,247,0.18)` }}
        className="rounded-2xl border p-6 relative overflow-hidden cursor-default h-full"
        style={{ background: C.card, borderColor: C.border }}>
        {/* Hover glow */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: `radial-gradient(circle at 30% 30%, ${C.purple}12, transparent 70%)` }} />
          )}
        </AnimatePresence>


        <motion.div className="text-4xl mb-4" whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}>{icon}</motion.div>

        <h3 className="font-bold text-white mb-2">{title}</h3>
        <p className="text-white/40 text-xs leading-relaxed mb-4">{desc}</p>

        <div className="space-y-2">
          {examples.map((ex, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: delay + i * 0.1 }}
              className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-white/45">{ex.label}</span>
              <span className="font-bold px-2 py-0.5 rounded text-[10px]"
                style={ex.result === "✓"
                  ? { color: "#4ade80", background: "rgba(74,222,128,0.12)" }
                  : { color: "#f87171", background: "rgba(248,113,113,0.12)" }}>
                {ex.result === "✓" ? "✓ PASS" : "✕ BLOCK"}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${C.purple}, transparent)` }} />
      </motion.div >
    </Reveal >
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function Step({ num, title, desc, delay = 0, isLast = false }: { num: number; title: string; desc: string; delay?: number; isLast?: boolean }) {
  return (
    <Reveal delay={delay}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}
            whileHover={{ scale: 1.12, rotate: 8 }} transition={{ type: "spring", stiffness: 400 }}>
            {num}
          </motion.div>
          {!isLast && (
            <motion.div className="w-px flex-1 mt-2 min-h-[40px]"
              style={{ background: `linear-gradient(to bottom, ${C.purple}40, transparent)` }}
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: delay + 0.3 }} />
          )}
        </div>
        <div className="pb-6">
          <h4 className="font-bold text-white text-base mb-1">{title}</h4>
          <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ─── LR vs LogR comparison ────────────────────────────────────────────────────
function ComparisonViz() {
  const [mode, setMode] = useState("linear");
  const pts = Array.from({ length: 12 }, (_, i) => {
    // Deterministic pseudo-random values to avoid SSR hydration mismatches
    const jitter = [2.4, -3.1, 4.2, -1.5, 0.8, -4.6, 3.7, -2.2, 1.1, -0.4, 4.9, -1.8][i];
    return {
      x: i + 1,
      linearY: 40 + 5 * i + jitter,
      logisticY: i >= 6 ? 1 : 0,
    };
  });

  const W = 400, H = 180, PAD = 35;
  const px = (x: number) => PAD + ((x - 1) / 11) * (W - PAD * 2);
  const pyLinear = (y: number) => H - PAD - ((y - 30) / 60) * (H - PAD * 2);
  const pyLogistic = (y: number) => H - PAD - y * (H - PAD * 2);

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x)} ${pyLinear(40 + 5 * p.x)}`).join(" ");
  const logPath = Array.from({ length: 100 }, (_, i) => {
    const x = 1 + i * 11 / 99;
    const z = (x - 6.5) * 1.2;
    return `${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${pyLogistic(sigmoid(z)).toFixed(1)}`;
  }).join(" ");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["linear", "logistic"].map(m => (
          <motion.button key={m} onClick={() => setMode(m)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={mode === m
              ? { background: `linear-gradient(135deg, ${C.coral}, ${C.purple})`, color: "white" }
              : { background: "rgba(255,255,255,0.04)", borderColor: C.border, color: "rgba(255,255,255,0.4)" }}>
            {m === "linear" ? "📈 Linear Regression" : "📊 Logistic Regression"}
          </motion.button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map(t => (
            <line key={t} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          {/* Decision boundary for logistic */}
          {mode === "logistic" && (
            <line x1={px(6.5)} y1={PAD} x2={px(6.5)} y2={H - PAD}
              stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
          )}
          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Data points */}
          {pts.map((p, i) => {
            const cy = mode === "linear" ? pyLinear(p.linearY) : pyLogistic(p.logisticY);
            const col = mode === "logistic" ? (p.logisticY === 1 ? C.coral : C.purple) : C.purple;
            return (
              <motion.circle key={i} cx={px(p.x)} cy={cy} r="5.5"
                fill={col} stroke="white" strokeWidth="1.5" strokeOpacity="0.5"
                animate={{ cy }} transition={{ duration: 0.5, delay: i * 0.03 }} />
            );
          })}

          {/* Line */}
          <AnimatePresence mode="wait">
            <motion.path key={mode}
              d={mode === "linear" ? linePath : logPath}
              fill="none" stroke={`url(#sigGrad2)`} strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }} />
          </AnimatePresence>

          <defs>
            <linearGradient id="sigGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.purple} /><stop offset="100%" stopColor={C.coral} />
            </linearGradient>
          </defs>

          {/* Y axis labels for logistic */}
          {mode === "logistic" && [0, 0.5, 1].map(y => (
            <text key={y} x={PAD - 6} y={pyLogistic(y) + 3} textAnchor="end"
              fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">{y}</text>
          ))}

          {/* Decision boundary label */}
          {mode === "logistic" && (
            <text x={px(6.5) + 5} y={PAD + 12} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
              Boundary
            </text>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl p-3" style={{ background: `${C.purple}12`, border: `1px solid ${C.purple}25` }}>
          <p className="font-bold mb-1" style={{ color: C.purple }}>Linear Regression</p>
          <p className="text-white/40">Predicts continuous values: {`"$350,000"`}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: `${C.coral}12`, border: `1px solid ${C.coral}25` }}>
          <p className="font-bold mb-1" style={{ color: C.coral }}>Logistic Regression</p>
          <p className="text-white/40">Predicts probability: {`"87% chance = YES"`}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Formula Display ──────────────────────────────────────────────────────────
function FormulaDisplay() {
  const parts = [
    { text: "σ(z)", sub: "Output 0-1", col: "#4ade80" },
    { text: "=", col: "rgba(255,255,255,0.4)" },
    { text: "1", col: "white" },
    { text: "÷", col: "rgba(255,255,255,0.4)" },
    { text: "(1 +", col: "white" },
    { text: "e", sub: "Euler's", col: C.purple },
    { text: "⁻ᶻ", sub: "Negated z", col: C.coral },
    { text: ")", col: "white" },
  ];
  return (
    <motion.div className="rounded-2xl p-6 border flex flex-wrap items-end justify-center gap-3"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}
      initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      {parts.map((p, i) => (
        <motion.div key={i} className="text-center"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          <div className="text-2xl sm:text-3xl font-black font-mono" style={{ color: p.col }}>{p.text}</div>
          {p.sub && <div className="text-[10px] font-mono uppercase tracking-widest mt-1 text-white/25">{p.sub}</div>}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Coming Soon section ──────────────────────────────────────────────────────
function ComingSoon() {
  const items = ["Train your own spam filter", "Live customer prediction demo", "ROC curve visualizer", "Confusion matrix builder"];
  return (
    <Reveal delay={0.1}>
      <div className="rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center relative overflow-hidden"
        style={{ borderColor: `${C.purple}40` }}>
        {/* Animated background */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ background: `conic-gradient(${C.coral}, ${C.purple}, ${C.coral})` }} />

        <motion.div className="text-6xl mb-4"
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}>🚧</motion.div>

        <h3 className="text-2xl sm:text-3xl font-black mb-3" style={{ fontFamily: "'Georgia', serif" }}>
          <G>Interactive Module</G> Coming Soon!
        </h3>
        <p className="text-white/45 max-w-xl mx-auto mb-8 leading-relaxed">
          We're building an immersive interactive experience — train your own models, explore decision boundaries, and see logistic regression come alive!
        </p>

        <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-left text-sm text-white/40 px-3 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-base">⏳</span> {item}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.a href="/" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}>
            ← Back to Home
          </motion.a>
          <motion.a href="/linear-regression" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer">
            Try Linear Regression
          </motion.a>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LogisticRegressionPage() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="min-h-screen text-white"
      style={{ background: C.navy, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{overflow-x:hidden;}
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#060410;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#FF6B6B,#A855F7);border-radius:2px;}
        ::selection{background:rgba(168,85,247,0.3);color:white;}
      `}</style>

      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div style={{ y: bgY }}
          className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.07]"
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity }}
          ref={null} // inline style applied
        >
          <div style={{ width: "100%", height: "100%", background: C.purple }} />
        </motion.div>
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.07]"
          style={{ background: C.purple }} />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.06]"
          style={{ background: C.coral }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 sm:space-y-8">

        {/* ── Header ── */}
        <div className="space-y-5">
          {/* Breadcrumb */}
          <Reveal y={20} delay={0.05}>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "Home", href: "/" },
                { label: "Learning Path", href: "/learning-path" },
                { label: "Logistic Regression", href: "#" }
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/20 text-xs">›</span>}
                  {item.href !== "#" ? (
                    <Link href={item.href} className="text-xs font-mono text-white/28 hover:text-white/55 transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-xs font-mono text-white/60 cursor-default transition-colors">
                      {item.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border"
                style={{ borderColor: `${C.purple}40`, background: `${C.purple}0d`, color: C.purple }}>
                Module 2 · Classification
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}>
              <G>Logistic Regression:</G>
              <br />
              <span className="text-white">Making Yes/No Decisions</span>
            </h1>
          </Reveal>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5">
            <div className="w-full lg:max-w-sm">
              <ProgressBar current={2} total={5} />
            </div>
            <Reveal delay={0.2}>
              <div className="flex gap-3">
                <motion.a href="/linear-regression" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/55 hover:text-white transition-colors cursor-pointer"
                  style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>
                  ‹ Previous Module
                </motion.a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <Reveal delay={0.1}>
          <motion.div
            className="rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center"
            style={{ background: `linear-gradient(135deg, ${C.coral}12 0%, ${C.purple}18 100%)`, border: `1px solid ${C.purple}30` }}
            whileHover={{ boxShadow: `0 20px 80px ${C.purple}20` }}>
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: `linear-gradient(${C.coral} 1px, transparent 1px), linear-gradient(90deg, ${C.coral} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="text-5xl mb-5">🎬</motion.div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4 relative z-10"
              style={{ fontFamily: "'Georgia', serif" }}>
              Like Netflix Recommending Shows, <G>But for Decisions!</G>
            </h2>
            <p className="text-white/50 max-w-3xl mx-auto leading-relaxed text-base relative z-10">
              How does your email know what's spam? How do apps decide what ads to show you?
              That's Logistic Regression — the algorithm that makes brilliant{" "}
              <span className="font-bold text-white/80">"yes or no"</span> decisions with probability.
            </p>
          </motion.div>
        </Reveal>

        {/* ── Real World Use Cases ── */}
        <div className="space-y-5">
          <Reveal delay={0.05}>
            <h2 className="text-2xl sm:text-4xl font-black text-white text-center"
              style={{ fontFamily: "'Georgia', serif" }}>
              Where You've <G>Already Seen This</G>
            </h2>
            <p className="text-center text-white/35 text-sm mt-2 font-mono">(without knowing it)</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <UseCaseCard icon="📧" title="Email Spam Filter" delay={0.05}
              desc='"Is this spam?" Your email decides in milliseconds using LR.'
              examples={[
                { label: `"FREE MONEY!!!"`, result: "✕" },
                { label: "From: mom@gmail.com", result: "✓" },
              ]} />
            <UseCaseCard icon="🛡️" title="Fraud Detection" delay={0.1}
              desc="Banks catching suspicious transactions before they complete."
              examples={[
                { label: "Usual coffee shop", result: "✓" },
                { label: "$5000 in Belarus", result: "✕" },
              ]} />
            <UseCaseCard icon="💬" title="Social Media" delay={0.15}
              desc='"Will you click this post?" Platforms predict engagement instantly.'
              examples={[
                { label: "Cat videos (you love)", result: "✓" },
                { label: "Random boring ad", result: "✕" },
              ]} />
            <UseCaseCard icon="🏥" title="Health Apps" delay={0.2}
              desc="Medical AI predicting risk levels from patient vitals."
              examples={[
                { label: "Normal vitals", result: "✓" },
                { label: "High risk factors", result: "✕" },
              ]} />
          </div>
        </div>

        {/* ── Linear vs Logistic ── */}
        <Card delay={0.1}>
          <SectionHeader number={1} title="Linear vs Logistic: The Core Difference"
            subtitle="Click the toggle to see how output type changes everything" />
          <div className="mt-6">
            <ComparisonViz />
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: C.purple }} />
                <h3 className="font-bold text-white/80 text-sm">Linear Regression predicts quantities</h3>
              </div>
              {["How much will this house cost? → $350,000", "What's my exam score? → 87.5", "Revenue prediction? → $12,450"].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="text-xs text-white/40 py-2 px-3 rounded-lg flex gap-2"
                  style={{ background: `${C.purple}08` }}>
                  <span style={{ color: C.purple }}>→</span> {s}
                </motion.div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: C.coral }} />
                <h3 className="font-bold text-white/80 text-sm">Logistic Regression predicts probability</h3>
              </div>
              {["Will I buy this house? → 73% likely YES", "Will I pass the exam? → Pass/Fail (92%)", "Will customer buy? → 67% → YES"].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="text-xs text-white/40 py-2 px-3 rounded-lg flex gap-2"
                  style={{ background: `${C.coral}08` }}>
                  <span style={{ color: C.coral }}>→</span> {s}
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Sigmoid Function ── */}
        <Card delay={0.12}>
          <SectionHeader number={2} title="The Sigmoid Function: The Magic Squisher"
            subtitle="Transforms any number into a probability between 0 and 1" />
          <div className="mt-6 space-y-6">
            <p className="text-white/50 text-sm leading-relaxed">
              The key to Logistic Regression is the <span className="font-bold" style={{ color: C.coral }}>sigmoid function σ(z)</span> —
              it takes any real number and "squishes" it into a probability between 0 and 1.
              Drag the slider to explore how z maps to probabilities.
            </p>
            <FormulaDisplay />
            <SigmoidExplorer />
          </div>
        </Card>

        {/* ── How It Works ── */}
        <Card delay={0.14}>
          <SectionHeader number={3} title="How It Actually Works"
            subtitle="4 steps from raw data to yes/no decision" />
          <div className="mt-6">
            <Step num={1} title="Look at Past Examples" delay={0.05}
              desc='Like learning from history: "Last 100 emails with the word WINNER were spam." The algorithm studies labeled data to find patterns.' />
            <Step num={2} title="Find Patterns & Assign Weights" delay={0.1}
              desc='Discovers: "Unknown sender + urgent language = probably spam." Each feature gets a weight reflecting how strongly it predicts the outcome.' />
            <Step num={3} title="Calculate Probability via Sigmoid" delay={0.15}
              desc="Doesn't just say yes/no — gives you: '82% chance this is spam.' The sigmoid function converts the weighted sum into a crisp probability." />
            <Step num={4} title="Make a Decision" delay={0.2} isLast
              desc="If probability &gt; 0.5 → YES. Otherwise → NO. You can tune this threshold based on how cautious you want to be (e.g., 0.3 for medical alerts)." />
          </div>
        </Card>

        {/* ── Interactive Spam Filter ── */}
        <Card delay={0.15} glow>
          <SectionHeader number={4} title="Interactive Spam Filter Demo"
            subtitle="Toggle email features to see probability change live" />
          <div className="mt-6 space-y-3">
            <p className="text-white/45 text-sm leading-relaxed">
              Click features to activate them. Watch how each one shifts the probability — this is exactly what a trained logistic regression model does internally.
            </p>
            <SpamFilterDemo />
          </div>
        </Card>

        {/* ── Why It Matters ── */}
        <Card delay={0.1}>
          <SectionHeader number={5} title="Why Should You Care?" />
          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            {[
              { emoji: "🎯", title: "Everywhere You Look", desc: "Used in thousands of apps you interact with daily — from Gmail to your bank app to Spotify.", col: C.coral },
              { emoji: "⚡", title: "Blazing Fast", desc: "Makes millions of yes/no decisions per second with minimal compute. The backbone of real-time AI systems.", col: C.purple },
              { emoji: "🧠", title: "Interpretable", desc: "Unlike deep learning black boxes, you can actually explain WHY it made a decision — crucial for healthcare & finance.", col: "#4ade80" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -5, boxShadow: `0 12px 40px ${item.col}15` }}
                  className="rounded-xl p-5 text-center border" style={{ borderColor: `${item.col}20`, background: `${item.col}08` }}>
                  <motion.div className="text-4xl mb-3"
                    animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.2 }}>
                    {item.emoji}
                  </motion.div>
                  <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                  <p className="text-white/38 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Card>

        {/* ── Coming Soon ── */}
        <ComingSoon />

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 px-6 text-center" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <NeuralLogo size={24} />
          <span className="text-sm font-black">
            <span style={{ color: C.coral }}>ML</span><span style={{ color: C.purple }}>era</span>
          </span>
        </div>
        <p className="text-white/18 text-xs font-mono">© 2026 MLera · IIIT Dharwad Research Park</p>
      </footer>
    </div>
  );
}
