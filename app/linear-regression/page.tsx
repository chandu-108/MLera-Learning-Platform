"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// ─── Brand ────────────────────────────────────────────────────────────────────
// Coral #FF6B6B → Purple #A855F7  |  Navy bg #0D0B1E
const C = {
  coral: "#FF6B6B",
  purple: "#A855F7",
  navy: "#0D0B1E",
  navyLight: "#13102B",
  card: "rgba(255,255,255,0.032)",
  border: "rgba(255,255,255,0.07)",
};

const cn = (...c: (string | undefined | null | false)[]) => c.filter(Boolean).join(" ");

// ─── Utilities ────────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// ─── Gradient Text ────────────────────────────────────────────────────────────
function G({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${C.coral} 0%, #FF4757 30%, #C026D3 65%, ${C.purple} 100%)` }}
    >
      {children}
    </span>
  );
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 40, className }: { children: React.ReactNode, delay?: number, y?: number, className?: string }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
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
  const edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6], [2, 5]];
  return (
    <svg width={size} height={size} viewBox="0 0 52 56" fill="none" overflow="visible">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.coral} />
          <stop offset="100%" stopColor={C.purple} />
        </linearGradient>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#lg1)" strokeWidth="1.2" strokeOpacity="0.5" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3" fill="url(#lg1)" filter="url(#glow1)" />
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
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled
        ? { background: "rgba(13,11,30,0.92)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(16px)" }
        : { background: "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center -ml-2 sm:ml-0">
            <Image src="/navbar-logo-2.png" alt="MLera Logo" width={120} height={40} className="object-contain w-[100px] sm:w-[120px]" priority />
          </motion.div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Module 1 of 5
          </span>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="text-xs px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}
          >
            Dashboard
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Learning Path", href: "/learning-path" },
    { label: "Linear Regression", href: null },
  ];
  return (
    <Reveal y={20} delay={0.1}>
      <div className="flex items-center gap-2 flex-wrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/20 text-xs">›</span>}
            {item.href ? (
              <Link href={item.href} className="text-xs font-mono transition-colors cursor-pointer text-white/30 hover:text-white/60">
                {item.label}
              </Link>
            ) : (
              <span className="text-xs font-mono transition-colors text-white/60">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </Reveal>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current = 1, total = 5 }: { current?: number, total?: number }) {
  const pct = (current / total) * 100;
  return (
    <Reveal y={15} delay={0.15}>
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-white/35">
          <span>Module Progress</span>
          <span>{current}/{total} complete</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${C.coral}, ${C.purple})` }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-1 rounded-full"
              style={{
                background: i < current
                  ? `linear-gradient(90deg, ${C.coral}, ${C.purple})`
                  : "rgba(255,255,255,0.08)"
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <Reveal delay={delay} className={className}>
      <motion.div
        whileHover={{ boxShadow: `0 8px 60px rgba(168,85,247,0.1)` }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden"
        style={{ background: C.card, borderColor: C.border }}
      >
        {/* Subtle corner glow */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${C.purple}, transparent)` }} />
        {children}
      </motion.div>
    </Reveal>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ number, title }: { number: number, title: string }) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <motion.div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {number}
      </motion.div>
      <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

// ─── Definition Box ───────────────────────────────────────────────────────────
function DefinitionBox({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-xl border-l-4 p-4 sm:p-5"
      style={{ borderColor: C.purple, background: `rgba(168,85,247,0.07)` }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="text-sm font-bold mb-2" style={{ color: C.purple }}>{title}</h3>
      <p className="text-sm leading-relaxed text-white/55">{children}</p>
    </motion.div>
  );
}

// ─── Tip Card ─────────────────────────────────────────────────────────────────
function TipCard({ type = "tip", title, children }: { type?: "tip" | "trick", title: string, children: React.ReactNode }) {
  const isTip = type === "tip";
  const col = isTip ? C.coral : C.purple;
  const icon = isTip ? "💡" : "⚡";
  return (
    <motion.div
      className="rounded-xl p-4 border flex gap-3"
      style={{ background: `${col}0d`, borderColor: `${col}25` }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01, boxShadow: `0 4px 30px ${col}15` }}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold mb-1" style={{ color: col }}>{title}</p>
        <p className="text-xs leading-relaxed text-white/50">{children}</p>
      </div>
    </motion.div>
  );
}

// ─── Animated Scatter + Line Chart (pure SVG) ─────────────────────────────────
function ScatterChart({ data, lineSlope = 5, lineIntercept = 50, showLine = true, title }: { data: { x: number, y: number }[], lineSlope?: number, lineIntercept?: number, showLine?: boolean, title?: string }) {
  const svgRef = useRef(null);
  const inV = useInView(svgRef, { once: true });

  const W = 480, H = 260, PAD = 40;
  const xs = data.map(d => d.x), ys = data.map(d => d.y);
  const xMin = Math.min(...xs) - 0.5, xMax = Math.max(...xs) + 0.5;
  const yMin = Math.min(...ys) - 5, yMax = Math.max(...ys) + 5;

  const px = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const py = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  const linePoints = [xMin, xMax].map(x => ({
    x: px(x), y: py(lineIntercept + lineSlope * x)
  }));
  const lineD = `M ${linePoints[0].x} ${linePoints[0].y} L ${linePoints[1].x} ${linePoints[1].y}`;

  // Grid lines
  const gridX = 5, gridY = 5;
  const xTicks = Array.from({ length: gridX + 1 }, (_, i) => xMin + i * (xMax - xMin) / gridX);
  const yTicks = Array.from({ length: gridY + 1 }, (_, i) => yMin + i * (yMax - yMin) / gridY);

  return (
    <div className="w-full">
      {title && <p className="text-xs font-mono text-white/30 mb-3 text-center uppercase tracking-widest">{title}</p>}
      <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: 280 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.coral} />
              <stop offset="100%" stopColor={C.purple} />
            </linearGradient>
            <filter id="dotGlow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {xTicks.map((x, i) => (
            <line key={`gx${i}`} x1={px(x)} y1={PAD} x2={px(x)} y2={H - PAD}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          {yTicks.map((y, i) => (
            <line key={`gy${i}`} x1={PAD} y1={py(y)} x2={W - PAD} y2={py(y)}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

          {/* Tick labels */}
          {xTicks.filter((_, i) => i % 2 === 0).map((x, i) => (
            <text key={`xl${i}`} x={px(x)} y={H - PAD + 14} textAnchor="middle"
              fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">
              {x.toFixed(0)}
            </text>
          ))}
          {yTicks.filter((_, i) => i % 2 === 0).map((y, i) => (
            <text key={`yl${i}`} x={PAD - 6} y={py(y) + 3} textAnchor="end"
              fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">
              {y.toFixed(0)}
            </text>
          ))}

          {/* Regression line */}
          {showLine && (
            <motion.path
              d={lineD}
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inV ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
            />
          )}

          {/* Residual lines */}
          {showLine && data.map((d, i) => {
            const predY = lineIntercept + lineSlope * d.x;
            return (
              <motion.line key={`r${i}`}
                x1={px(d.x)} y1={py(d.y)} x2={px(d.x)} y2={py(predY)}
                stroke={C.coral} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2"
                initial={{ opacity: 0 }}
                animate={inV ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.2 + i * 0.05 }}
              />
            );
          })}

          {/* Data points */}
          {data.map((d, i) => (
            <motion.circle key={i}
              cx={px(d.x)} cy={py(d.y)} r="5"
              fill={C.purple} filter="url(#dotGlow)" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={inV ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
            />
          ))}

          {/* Axis labels */}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace">
            Study Hours (X)
          </text>
          <text x={12} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace"
            transform={`rotate(-90, 12, ${H / 2})`}>
            Score (Y)
          </text>
        </svg>
      </div>
    </div>
  );
}

// ─── Cost Chart ───────────────────────────────────────────────────────────────
function CostChart({ data }: { data: { x: number, y: number }[] }) {
  if (!data || data.length < 2) return null;
  const W = 480, H = 220, PAD = 40;
  const xs = data.map(d => d.x), ys = data.map(d => d.y);
  const xMax = Math.max(...xs), yMax = Math.max(...ys), yMin = Math.min(...ys);
  const px = (x: number) => PAD + (x / xMax) * (W - PAD * 2);
  const py = (y: number) => H - PAD - ((y - yMin) / (Math.max(yMax - yMin, 0.001))) * (H - PAD * 2);

  const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"} ${px(d.x)} ${py(d.y)}`).join(" ");
  const areaD = pathD + ` L ${px(data[data.length - 1].x)} ${H - PAD} L ${px(data[0].x)} ${H - PAD} Z`;

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.coral} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.coral} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <motion.path d={areaD} fill="url(#costGrad)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
        {/* Line */}
        <motion.path d={pathD} fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
        {/* Axes */}
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Latest point highlight */}
        <motion.circle cx={px(data[data.length - 1].x)} cy={py(data[data.length - 1].y)} r="5"
          fill={C.coral} stroke="white" strokeWidth="1.5"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        {/* Labels */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace">Iteration</text>
        <text x={12} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace"
          transform={`rotate(-90,12,${H / 2})`}>Cost J(θ)</text>
      </svg>
    </div>
  );
}

// ─── Parameter Chart ──────────────────────────────────────────────────────────
function ParameterChart({ theta0Data, theta1Data }: { theta0Data: { x: number, y: number }[], theta1Data: { x: number, y: number }[] }) {
  if (!theta0Data || theta0Data.length < 2) return null;
  const W = 480, H = 220, PAD = 40;
  const allY = [...theta0Data, ...theta1Data].map(d => d.y);
  const xMax = Math.max(...theta0Data.map(d => d.x));
  const yMin = Math.min(...allY), yMax = Math.max(...allY);
  const px = (x: number) => PAD + (x / xMax) * (W - PAD * 2);
  const py = (y: number) => H - PAD - ((y - yMin) / (Math.max(yMax - yMin, 0.001))) * (H - PAD * 2);

  const makePath = (data: any[]) => data.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${px(d.x)} ${py(d.y)}`).join(" ");

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <motion.path d={makePath(theta0Data)} fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
        <motion.path d={makePath(theta1Data)} fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Legend */}
        <rect x={W - 130} y={PAD} width="10" height="2.5" rx="1" fill={C.coral} />
        <text x={W - 116} y={PAD + 3} fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">θ₀ (Intercept)</text>
        <rect x={W - 130} y={PAD + 12} width="10" height="2.5" rx="1" fill={C.purple} />
        <text x={W - 116} y={PAD + 15} fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">θ₁ (Slope)</text>
      </svg>
    </div>
  );
}

// ─── Interactive Visualization (slope/intercept sliders) ──────────────────────
function InteractiveVisualization() {
  const [slope, setSlope] = useState(5);
  const [intercept, setIntercept] = useState(50);
  const data = [
    { x: 1, y: 55 }, { x: 2, y: 60 }, { x: 3, y: 65 },
    { x: 4, y: 70 }, { x: 5, y: 75 }, { x: 6, y: 80 },
    { x: 7, y: 85 }, { x: 8, y: 90 },
  ];

  const mse = data.reduce((acc, d) => {
    const pred = intercept + slope * d.x;
    return acc + Math.pow(d.y - pred, 2);
  }, 0) / data.length;

  return (
    <div className="space-y-6">
      <ScatterChart data={data} lineSlope={slope} lineIntercept={intercept} title="Adjust Line — Watch Residuals Change" />

      <div className="grid sm:grid-cols-2 gap-5">
        <GradientSlider label="Intercept (θ₀)" value={intercept} min={0} max={100} step={1}
          onChange={setIntercept} unit="" />
        <GradientSlider label="Slope (θ₁)" value={slope} min={0} max={15} step={0.5}
          onChange={setSlope} unit="" />
      </div>

      <motion.div
        key={mse.toFixed(2)}
        className="flex items-center justify-between rounded-xl px-5 py-3.5"
        style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}
        initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}
      >
        <span className="text-xs font-mono text-white/40">Mean Squared Error (MSE)</span>
        <span className="text-base font-black font-mono"
          style={{ color: mse < 100 ? "#4ade80" : mse < 500 ? C.coral : "#f87171" }}>
          {mse.toFixed(2)}
        </span>
      </motion.div>
    </div>
  );
}

// ─── Gradient Slider ──────────────────────────────────────────────────────────
function GradientSlider({ label, value, min, max, step, onChange, unit = "" }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void, unit?: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-mono text-white/50">{label}</label>
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-black font-mono"
          style={{ color: C.coral }}
        >
          {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(3) : value}{unit}
        </motion.span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.coral}, ${C.purple})` }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 8px)`, background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }} />
      </div>
    </div>
  );
}

// ─── Hyperparameter Table ─────────────────────────────────────────────────────
function HyperparameterTable() {
  const rows = [
    { param: "Learning Rate (α)", symbol: "α", typical: "0.01–0.1", effect: "Controls step size", impact: "High" },
    { param: "Iterations", symbol: "T", typical: "100–1000", effect: "Training duration", impact: "Medium" },
    { param: "Theta 0 (θ₀)", symbol: "θ₀", typical: "Initialized 0", effect: "Y-intercept bias", impact: "Low" },
    { param: "Theta 1 (θ₁)", symbol: "θ₁", typical: "Initialized 0", effect: "Feature weight slope", impact: "High" },
  ];
  const impactCol: Record<string, string> = { High: C.coral, Medium: "#FBBF24", Low: "#4ADE80" };

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.border }}>
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.04)" }}>
            {["Parameter", "Symbol", "Typical Range", "Effect", "Impact"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-mono text-white/35 uppercase tracking-widest font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="border-t transition-colors hover:bg-white/[0.02]"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <td className="px-4 py-3 text-white/70 text-xs">{r.param}</td>
              <td className="px-4 py-3">
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.12)", color: C.purple }}>
                  {r.symbol}
                </span>
              </td>
              <td className="px-4 py-3 text-white/45 text-xs font-mono">{r.typical}</td>
              <td className="px-4 py-3 text-white/45 text-xs">{r.effect}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${impactCol[r.impact]}18`, color: impactCol[r.impact] }}>
                  {r.impact}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────
function StatBox({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <motion.div
      className="text-center rounded-xl py-3 px-2"
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}
      whileHover={{ scale: 1.04 }}
    >
      <p className="text-[10px] font-mono text-white/30 mb-1 uppercase tracking-widest">{label}</p>
      <motion.p key={value} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-lg font-black font-mono" style={{ color }}>
        {value}
      </motion.p>
    </motion.div>
  );
}

// ─── Iteration Controls ───────────────────────────────────────────────────────
function IterationControls({ current, max, onChange }: { current: number, max: number, onChange: (v: number) => void }) {
  const pct = (current / max) * 100;
  return (
    <div className="space-y-4 rounded-xl p-5 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => onChange(0)}
            className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm text-white/50 hover:text-white transition-colors"
            style={{ borderColor: C.border }}>⏮</motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => onChange(Math.max(0, current - Math.ceil(max / 10)))}
            className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm text-white/50 hover:text-white transition-colors"
            style={{ borderColor: C.border }}>◀</motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => onChange(Math.min(max, current + Math.ceil(max / 10)))}
            className="px-4 h-9 rounded-lg text-white font-semibold text-sm"
            style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}>▶ Next</motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => onChange(max)}
            className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm text-white/50 hover:text-white transition-colors"
            style={{ borderColor: C.border }}>⏭</motion.button>
        </div>
        <span className="text-xs font-mono text-white/30">
          Iteration <span className="text-white/70 font-bold">{current}</span> / {max}
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="absolute h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${C.coral}, ${C.purple})` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }} />
        <input type="range" min={0} max={max} step={1} value={current}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }} />
      </div>
    </div>
  );
}

// ─── Simulate gradient descent ────────────────────────────────────────────────
function simulateGD(learningRate: number, iterations: number, datasetName: string) {
  const datasets: Record<string, { x: number, y: number }[]> = {
    "sales-revenue": Array.from({ length: 20 }, (_, i) => ({ x: i + 1, y: 30 + 3.5 * i + (Math.random() - 0.5) * 10 })),
    "salary-experience": Array.from({ length: 20 }, (_, i) => ({ x: i * 0.5, y: 40000 + 8000 * i * 0.5 + (Math.random() - 0.5) * 5000 })),
    "house-prices": Array.from({ length: 20 }, (_, i) => ({ x: 500 + i * 100, y: 200000 + 150 * (i * 100) + (Math.random() - 0.5) * 20000 })),
  };

  const dataset = datasets[datasetName] || datasets["sales-revenue"];
  const n = dataset.length;

  // Normalize for stability
  const xVals = dataset.map(d => d.x);
  const yVals = dataset.map(d => d.y);
  const xMean = xVals.reduce((a, b) => a + b, 0) / n;
  const yMean = yVals.reduce((a, b) => a + b, 0) / n;
  const xStd = Math.sqrt(xVals.reduce((a, b) => a + (b - xMean) ** 2, 0) / n) || 1;
  const yStd = Math.sqrt(yVals.reduce((a, b) => a + (b - yMean) ** 2, 0) / n) || 1;
  const norm = dataset.map(d => ({ x: (d.x - xMean) / xStd, y: (d.y - yMean) / yStd }));

  let t0 = 0, t1 = 0;
  const history = [];

  const clampedLR = Math.min(learningRate, 0.08);

  for (let iter = 0; iter <= iterations; iter++) {
    const cost = norm.reduce((acc, d) => acc + (t0 + t1 * d.x - d.y) ** 2, 0) / (2 * n);
    const realT0 = yMean + t0 * yStd - t1 * xMean * yStd / xStd;
    const realT1 = t1 * yStd / xStd;
    if (iter % Math.max(1, Math.floor(iterations / 100)) === 0 || iter === iterations) {
      history.push({ iteration: iter, theta0: realT0, theta1: realT1, cost });
    }
    if (iter < iterations) {
      const g0 = norm.reduce((acc, d) => acc + (t0 + t1 * d.x - d.y), 0) / n;
      const g1 = norm.reduce((acc, d) => acc + (t0 + t1 * d.x - d.y) * d.x, 0) / n;
      t0 -= clampedLR * g0;
      t1 -= clampedLR * g1;
    }
  }

  return {
    history,
    dataset,
    finalCost: history[history.length - 1].cost,
    finalTheta0: history[history.length - 1].theta0,
    finalTheta1: history[history.length - 1].theta1,
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LinearRegressionPage() {
  const router = useRouter();
  const [learningRate, setLearningRate] = useState(0.05);
  const [iterations, setIterations] = useState(100);
  const [dataset, setDataset] = useState("sales-revenue");
  const [currentIter, setCurrentIter] = useState(0);
  const [modelBuilt, setModelBuilt] = useState(false);
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string, type: string } | null>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleReset = useCallback(() => {
    setModelBuilt(false);
    setCurrentIter(0);
    setResult(null);
  }, []);

  const handleBuild = useCallback(() => {
    if (training) return;
    setTraining(true);
    setTimeout(() => {
      try {
        const r = simulateGD(learningRate, iterations, dataset) as any;
        setResult(r);
        setModelBuilt(true);
        setCurrentIter(iterations);
        showToast(`Model trained! Final cost: ${r.finalCost.toFixed(4)}`);
      } catch (e) {
        showToast("Training failed. Try lower learning rate.", "error");
      }
      setTraining(false);
    }, 800);
  }, [training, learningRate, iterations, dataset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          if (modelBuilt) setCurrentIter(c => Math.min(iterations, c + Math.max(1, Math.floor(iterations / 20))));
          break;
        case 'r':
          handleReset();
          break;
        case 'b':
          handleBuild();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modelBuilt, iterations, handleBuild, handleReset]);

  const getState = () => {
    if (!result?.history) return null;
    const idx = result.history.findIndex((h: any) => h.iteration >= currentIter);
    return result.history[idx >= 0 ? idx : result.history.length - 1] || result.history[result.history.length - 1];
  };

  const state = getState();

  const studyData = [
    { x: 1, y: 55 }, { x: 2, y: 60 }, { x: 3, y: 65 },
    { x: 4, y: 70 }, { x: 5, y: 75 }, { x: 6, y: 80 },
    { x: 7, y: 85 }, { x: 8, y: 90 },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: C.navy, fontFamily: "'Inter', system-ui, sans-serif" }}>
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            className="fixed top-20 left-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-2xl"
            style={{
              background: toast.type === "error"
                ? "rgba(239,68,68,0.9)"
                : `linear-gradient(135deg, ${C.coral}, ${C.purple})`,
              backdropFilter: "blur(12px)",
            }}
          >
            {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.06]"
          style={{ background: C.coral }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.06]"
          style={{ background: C.purple }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px,transparent 1px)", backgroundSize: "36px 36px" }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 sm:space-y-8">

        {/* ── Header ── */}
        <div className="space-y-5">
          <Breadcrumb />
          <Reveal delay={0.05}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}>
              <G>Introduction to</G>
              <br />
              <span className="text-white">Linear Regression</span>
            </h1>
          </Reveal>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5">
            <div className="w-full lg:max-w-sm">
              <ProgressBar current={1} total={5} />
            </div>
            <Reveal delay={0.2}>
              <div className="flex gap-3 flex-wrap">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => showToast("Shortcuts: [Space] step, [R] reset, [B] build (Coming soon!)")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/60 hover:text-white transition-colors"
                  style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>
                  ⌨️ <span className="hidden sm:inline">Shortcuts</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm text-white/60 hover:text-white transition-colors"
                  style={{ borderColor: C.border, background: "rgba(255,255,255,0.03)" }}>
                  ‹ Previous
                </motion.button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Section 1: What is LR ── */}
        <Card delay={0.1}>
          <SectionHeader number={1} title="What is Linear Regression?" />
          <div className="mt-4 space-y-4">
            <p className="text-white/55 leading-relaxed text-sm sm:text-base">
              Linear Regression is one of the most fundamental and widely used techniques in machine learning and statistics.
              At its core, it models the relationship between a{" "}
              <span className="font-bold" style={{ color: C.coral }}>dependent variable</span> (Y) and one or more{" "}
              <span className="font-bold" style={{ color: C.purple }}>independent variables</span> (X)
              by fitting a linear equation to the observed data.
            </p>
            <DefinitionBox title="Definition:">
              Linear Regression is a{" "}
              <span className="font-bold" style={{ color: C.coral }}>supervised learning</span> algorithm that predicts a
              continuous output value based on one or more input{" "}
              <span className="font-bold" style={{ color: C.purple }}>features</span>, assuming a linear relationship
              between the inputs and the output.
            </DefinitionBox>

            {/* Equation display */}
            <motion.div className="rounded-xl p-5 flex flex-wrap items-center gap-3 justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}>
              {[
                { el: "ŷ", label: "Prediction" },
                { el: "=", label: null },
                { el: "θ₀", label: "Intercept", col: C.coral },
                { el: "+", label: null },
                { el: "θ₁", label: "Slope", col: C.purple },
                { el: "·", label: null },
                { el: "X", label: "Feature" },
              ].map((item, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <div className="text-2xl sm:text-3xl font-black font-mono" style={{ color: item.col || "rgba(255,255,255,0.85)" }}>
                    {item.el}
                  </div>
                  {item.label && (
                    <div className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: item.col || "rgba(255,255,255,0.3)" }}>
                      {item.label}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Card>

        {/* ── Section 3: Intuition ── */}
        <Card delay={0.12}>
          <SectionHeader number={3} title="Intuition Behind LR" />
          <div className="mt-4 space-y-5">
            <p className="text-white/55 leading-relaxed text-sm sm:text-base">
              Imagine you're understanding the relationship between study hours and exam scores.
              More study hours → higher scores. Linear Regression formalizes this intuition by finding
              the straight line that <em className="text-white/80 not-italic font-semibold">best represents</em> this relationship.
            </p>
            <ScatterChart
              data={studyData}
              lineSlope={5}
              lineIntercept={50}
              title="Study Hours vs Exam Score — Best-Fit Line"
            />
            <p className="text-xs text-white/35 leading-relaxed">
              Each point represents a student's study hours (x-axis) and exam score (y-axis).
              The gradient line minimizes the total squared distance from all data points — the "best fit."
            </p>
          </div>
        </Card>

        {/* ── Section 7: Interactive Visual ── */}
        <Card delay={0.14}>
          <SectionHeader number={7} title="Visual Representation" />
          <div className="mt-4 space-y-4">
            <p className="text-white/55 leading-relaxed text-sm sm:text-base">
              Drag the sliders to change slope and intercept. Watch how the MSE (cost) reacts in real time — this
              is exactly what gradient descent is optimizing.
            </p>
            <InteractiveVisualization />
          </div>
        </Card>

        {/* ── Section 9: Hyperparameters ── */}
        <Card delay={0.16}>
          <SectionHeader number={9} title="Choose the Hyperparameters" />
          <div className="mt-4 space-y-6">
            <p className="text-white/55 leading-relaxed text-sm sm:text-base">
              Experiment with different hyperparameter combinations to see how they affect model training:
            </p>

            <HyperparameterTable />

            <div className="grid sm:grid-cols-2 gap-4">
              <TipCard type="tip" title="Pro Tip">
                If the cost function oscillates or increases, try reducing the learning rate.
                A good starting point is 0.01 to 0.05 for most datasets.
              </TipCard>
              <TipCard type="trick" title="Quick Trick">
                Want faster convergence? Increase learning rate slightly — but watch for oscillations.
                The sweet spot: cost decreases smoothly and quickly.
              </TipCard>
            </div>

            {/* Controls */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dataset picker */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono text-white/50">Dataset for Model</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "sales-revenue", label: "📈 Sales Revenue" },
                    { id: "salary-experience", label: "💼 Salary vs Experience" },
                    { id: "house-prices", label: "🏠 House Prices" },
                  ].map(opt => (
                    <motion.button key={opt.id} onClick={() => setDataset(opt.id)}
                      whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                      className="text-left px-4 py-2.5 rounded-lg border text-xs font-medium transition-all"
                      style={dataset === opt.id
                        ? { background: `linear-gradient(135deg, ${C.coral}18, ${C.purple}18)`, borderColor: C.purple, color: "white" }
                        : { borderColor: C.border, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)" }}>
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <GradientSlider label="Learning Rate (α)" value={learningRate}
                min={0.001} max={0.1} step={0.001} onChange={setLearningRate} />

              <GradientSlider label="Iterations" value={iterations}
                min={50} max={500} step={10} onChange={setIterations} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-3 py-2 rounded-lg border text-xs text-white/40 hover:text-white/70 transition-colors"
                  style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                  📤 Export Results
                </motion.button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  onClick={handleBuild}
                  disabled={training}
                  whileHover={!training ? { scale: 1.04, boxShadow: `0 0 30px ${C.coral}40` } : {}}
                  whileTap={!training ? { scale: 0.97 } : {}}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white relative overflow-hidden disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.purple})` }}
                >
                  {training ? (
                    <span className="flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block">⟳</motion.span>
                      Training...
                    </span>
                  ) : "▶ Build Model"}
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  disabled={training}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  ↺ Reset
                </motion.button>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Section 4: Model Results ── */}
        <AnimatePresence>
          {modelBuilt && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card>
                <SectionHeader number={4} title="Model's Growth" />
                <div className="mt-6 space-y-6">

                  {/* Stats row */}
                  <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <StatBox label="Iteration" value={state?.iteration ?? 0} color={C.purple} />
                    <StatBox label="θ₀ Intercept" value={state?.theta0?.toFixed(3) ?? "—"} color={C.coral} />
                    <StatBox label="θ₁ Slope" value={state?.theta1?.toFixed(4) ?? "—"} color={C.purple} />
                    <StatBox label="Cost J(θ)" value={state?.cost?.toFixed(5) ?? "—"} color={state?.cost < 0.01 ? "#4ade80" : C.coral} />
                  </motion.div>

                  {/* Iteration slider */}
                  <IterationControls current={currentIter} max={iterations} onChange={setCurrentIter} />

                  {/* Charts grid */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
                        Regression Fit — Iteration {currentIter}
                      </p>
                      {state && result.dataset && (
                        <ScatterChart
                          data={result.dataset}
                          lineSlope={state.theta1}
                          lineIntercept={state.theta0}
                          title=""
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
                        Cost Function J(θ) over Iterations
                      </p>
                      <CostChart
                        data={result.history
                          .filter((h: any) => h.iteration <= currentIter)
                          .map((h: any) => ({ x: h.iteration, y: h.cost }))}
                      />
                    </div>
                  </div>

                  {/* Parameter evolution */}
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
                      Parameter Evolution — θ₀ & θ₁ over Iterations
                    </p>
                    <ParameterChart
                      theta0Data={result.history.filter((h: any) => h.iteration <= currentIter).map((h: any) => ({ x: h.iteration, y: h.theta0 }))}
                      theta1Data={result.history.filter((h: any) => h.iteration <= currentIter).map((h: any) => ({ x: h.iteration, y: h.theta1 }))}
                    />
                  </div>

                  {/* Summary box */}
                  <motion.div
                    className="rounded-xl p-5 border"
                    style={{ background: `rgba(168,85,247,0.06)`, borderColor: `${C.purple}30` }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: C.purple }}>
                      Training Summary
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
                      {[
                        { label: "Dataset", val: dataset.replace("-", " ") },
                        { label: "Learning Rate", val: learningRate.toFixed(3) },
                        { label: "Final Cost", val: result.finalCost.toFixed(6) },
                        { label: "θ₀ Final", val: result.finalTheta0.toFixed(4) },
                        { label: "θ₁ Final", val: result.finalTheta1.toFixed(4) },
                        { label: "Convergence", val: result.finalCost < 0.01 ? "✓ Good" : "↻ Adjust LR" },
                      ].map((item, i) => (
                        <div key={i}>
                          <span className="text-white/25 block mb-0.5">{item.label}</span>
                          <span className="text-white/75 font-bold">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state nudge ── */}
        {!modelBuilt && (
          <Reveal delay={0.2}>
            <div className="rounded-2xl border border-dashed flex flex-col items-center justify-center py-12 text-center"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="text-4xl mb-3 opacity-40">📊</div>
              <p className="text-white/25 text-sm font-mono">Configure hyperparameters above and click</p>
              <p className="font-bold text-sm mt-1" style={{ color: `${C.coral}80` }}>▶ Build Model</p>
              <p className="text-white/15 text-xs mt-1 font-mono">to see training results here</p>
            </div>
          </Reveal>
        )}

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