"use client";
import { useEffect, useRef } from "react";
import type { Stats } from "@/types/token";
import styles from "./StatsBar.module.css";

interface StatItem {
  key: keyof Stats;
  label: string;
  color: string;
}

const ITEMS: StatItem[] = [
  { key: "total",    label: "Total Token",    color: "#818cf8" },
  { key: "reserved", label: "Reserved Words", color: "#f59e0b" },
  { key: "symbol",   label: "Simbol",         color: "#e879f9" },
  { key: "variable", label: "Variabel",       color: "#34d399" },
  { key: "math",     label: "Matematika",     color: "#fb923c" },
  { key: "number",   label: "Angka",          color: "#60a5fa" },
  { key: "string",   label: "String",         color: "#f87171" },
  { key: "comment",  label: "Komentar",       color: "#6b7280" },
];

export default function StatsBar({ stats }: { stats: Stats | null }) {
  return (
    <div className={styles.bar}>
      {ITEMS.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          value={stats?.[item.key] ?? null}
          color={item.color}
        />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<number>(0);

  useEffect(() => {
    if (value === null) return;
    const el = numRef.current;
    if (!el) return;

    const start = prevRef.current;
    const end = value;
    prevRef.current = end;

    if (start === end) return;

    const steps = 20;
    const step = (end - start) / steps;
    let cur = start;
    let frame = 0;

    const timer = setInterval(() => {
      cur += step;
      frame++;
      el.textContent = String(Math.round(cur));
      if (frame >= steps) {
        el.textContent = String(end);
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={styles.card} style={{ "--stat-color": color } as React.CSSProperties}>
      <span ref={numRef} className={styles.num}>
        {value === null ? "—" : value}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
