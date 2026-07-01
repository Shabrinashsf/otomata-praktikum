"use client";
import type { FSMState } from "@/types/fsm";

// State positions in the SVG viewBox (500 x 300)
const POS: Record<FSMState, { cx: number; cy: number }> = {
  S: { cx: 80,  cy: 150 },
  A: { cx: 240, cy: 80  },
  B: { cx: 240, cy: 220 },
  C: { cx: 420, cy: 80  },
};

const STATE_COLOR: Record<FSMState, { fill: string; stroke: string; text: string }> = {
  S: { fill: "rgba(99,102,241,0.18)",  stroke: "#6366f1", text: "#818cf8" },
  A: { fill: "rgba(245,158,11,0.18)", stroke: "#f59e0b", text: "#fbbf24" },
  B: { fill: "rgba(16,185,129,0.18)", stroke: "#10b981", text: "#34d399" },
  C: { fill: "rgba(244,63,94,0.18)",  stroke: "#f43f5e", text: "#f87171" },
};

interface Props {
  currentState: FSMState | null;
  accepted: boolean | null;
}

export default function FSMDiagram({ currentState, accepted }: Props) {
  const getStateProps = (s: FSMState) => {
    const base = STATE_COLOR[s];
    const isActive = currentState === s;
    return {
      fill:        isActive ? base.stroke : base.fill,
      stroke:      base.stroke,
      strokeWidth: isActive ? 3 : 1.5,
      textColor:   isActive ? "#fff" : base.text,
      r:           isActive ? 34 : 30,
      glow:        isActive,
    };
  };

  return (
    <svg
      viewBox="0 0 500 300"
      width="100%"
      style={{ maxWidth: 480, overflow: "visible" }}
      aria-label="Diagram FSM"
    >
      <defs>
        {/* Arrow marker */}
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.4)" />
        </marker>
        <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
        </marker>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Transitions (edges) ─────────────────────────────── */}

      {/* S → A (input 0) */}
      <Arrow from={POS.S} to={POS.A} label="0" offsetFrom={30} offsetTo={30} bend={0} />

      {/* S → B (input 1) */}
      <Arrow from={POS.S} to={POS.B} label="1" offsetFrom={30} offsetTo={30} bend={0} />

      {/* A → C (input 0) */}
      <Arrow from={POS.A} to={POS.C} label="0" offsetFrom={30} offsetTo={30} bend={0} />

      {/* A → B (input 1), right side of A to top of B */}
      <Arrow from={POS.A} to={POS.B} label="1" offsetFrom={30} offsetTo={30} bend={30} id="AB" />

      {/* B → A (input 0), slightly offset from A→B */}
      <Arrow from={POS.B} to={POS.A} label="0" offsetFrom={30} offsetTo={30} bend={30} id="BA" flip />

      {/* B self-loop (input 1) */}
      <SelfLoop cx={POS.B.cx} cy={POS.B.cy} r={30} label="1" side="bottom" />

      {/* C self-loop (input 0, 1) */}
      <SelfLoop cx={POS.C.cx} cy={POS.C.cy} r={30} label="0, 1" side="top" />

      {/* ── States ──────────────────────────────────────────── */}
      {(["S", "A", "B", "C"] as FSMState[]).map((s) => {
        const p = getStateProps(s);
        const pos = POS[s];
        return (
          <g key={s} filter={p.glow ? "url(#glow)" : undefined}>
            {/* Outer circle for accepting state B */}
            {s === "B" && (
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={p.r + 6}
                fill="none"
                stroke={p.stroke}
                strokeWidth={p.strokeWidth * 0.7}
                opacity={0.6}
              />
            )}
            <circle
              cx={pos.cx}
              cy={pos.cy}
              r={p.r}
              fill={p.fill}
              stroke={p.stroke}
              strokeWidth={p.strokeWidth}
            />
            <text
              x={pos.cx}
              y={pos.cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={p.textColor}
              fontSize={16}
              fontWeight={700}
              fontFamily="Inter, sans-serif"
            >
              {s}
            </text>
          </g>
        );
      })}

      {/* Start arrow for S */}
      <line
        x1={20} y1={150}
        x2={POS.S.cx - 32} y2={150}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />
    </svg>
  );
}

/* ── Arrow between two states ─────────────────────────────────── */
function Arrow({
  from,
  to,
  label,
  offsetFrom,
  offsetTo,
  bend = 0,
  flip = false,
}: {
  from: { cx: number; cy: number };
  to: { cx: number; cy: number };
  label: string;
  offsetFrom: number;
  offsetTo: number;
  bend?: number;
  id?: string;
  flip?: boolean;
}) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;

  const sx = from.cx + ux * offsetFrom;
  const sy = from.cy + uy * offsetFrom;
  const ex = to.cx - ux * offsetTo;
  const ey = to.cy - uy * offsetTo;

  // Control point for curve
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const perp = flip ? -bend : bend;
  const cpx = mx - uy * perp;
  const cpy = my + ux * perp;

  // Label position at midpoint of curve
  const lx = 0.25 * sx + 0.5 * cpx + 0.25 * ex;
  const ly = 0.25 * sy + 0.5 * cpy + 0.25 * ey;

  const d = bend !== 0
    ? `M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`
    : `M${sx},${sy} L${ex},${ey}`;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />
      {/* Label background */}
      <rect
        x={lx - 10}
        y={ly - 9}
        width={20}
        height={16}
        rx={4}
        fill="var(--bg-panel)"
        opacity={0.9}
      />
      <text
        x={lx}
        y={ly + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

/* ── Self-loop arrow ──────────────────────────────────────────── */
function SelfLoop({
  cx, cy, r, label, side,
}: {
  cx: number; cy: number; r: number; label: string; side: "top" | "bottom" | "right";
}) {
  const loopR = 20;
  let lx = cx, ly = cy, sx = cx, sy = cy, ex = cx, ey = cy;

  if (side === "top") {
    sx = cx - 8; sy = cy - r;
    ex = cx + 8; ey = cy - r;
    lx = cx; ly = cy - r - loopR - 8;
  } else if (side === "bottom") {
    sx = cx + 8; sy = cy + r;
    ex = cx - 8; ey = cy + r;
    lx = cx; ly = cy + r + loopR + 8;
  } else {
    sx = cx + r; sy = cy - 8;
    ex = cx + r; ey = cy + 8;
    lx = cx + r + loopR + 8; ly = cy;
  }

  const cpx = lx;
  const cpy = side === "top" ? ly - 10 : side === "bottom" ? ly + 10 : lx;

  return (
    <g>
      <path
        d={`M${sx},${sy} C${cpx},${side === "top" ? cpy : cpy},${cpx},${cpy} ${ex},${ey}`}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />
      <rect
        x={lx - 14} y={ly - 9}
        width={28} height={16}
        rx={4} fill="var(--bg-panel)" opacity={0.9}
      />
      <text
        x={lx} y={ly + 1}
        textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize={11}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}
