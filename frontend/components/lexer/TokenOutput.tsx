"use client";
import { useState, useCallback } from "react";
import type { AnalyzeResponse, TokenType } from "@/types/token";
import styles from "./TokenOutput.module.css";

const GROUP_CONFIG: Record<
  string,
  { label: string; dot: string; cls: string; order: number }
> = {
  reserved: { label: "a. Reserved Words",        dot: "#f59e0b", cls: "token-reserved", order: 1 },
  symbol:   { label: "b. Simbol & Tanda Baca",   dot: "#e879f9", cls: "token-symbol",   order: 2 },
  variable: { label: "c. Variabel / Identifier", dot: "#34d399", cls: "token-variable", order: 3 },
  math:     { label: "d. Ekspresi Matematika",   dot: "#fb923c", cls: "token-math",     order: 4 },
  number:   { label: "Literal Angka",             dot: "#60a5fa", cls: "token-number",   order: 5 },
  string:   { label: "Literal String / Char",    dot: "#f87171", cls: "token-string",   order: 6 },
  comment:  { label: "Komentar",                 dot: "#6b7280", cls: "token-comment",  order: 7 },
};

type ViewMode = "grouped" | "table" | "inline";

interface Props {
  result: AnalyzeResponse | null;
  loading: boolean;
  error: string | null;
}

export default function TokenOutput({ result, loading, error }: Props) {
  const [view, setView] = useState<ViewMode>("grouped");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = useCallback((key: string) => {
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const exportResult = useCallback(() => {
    if (!result) return;
    let txt = "========================================\n";
    txt += "   OTOMATALAB — HASIL ANALISIS LEKSIKAL\n";
    txt += "========================================\n";
    txt += `Total Token: ${result.stats.total}\n\n`;
    Object.entries(GROUP_CONFIG)
      .sort((a, b) => a[1].order - b[1].order)
      .forEach(([type, cfg]) => {
        const tokens = result.groups[type as TokenType] ?? [];
        if (!tokens.length) return;
        txt += `----------------------------------------\n`;
        txt += `${cfg.label.toUpperCase()} (${tokens.length} token)\n`;
        txt += `----------------------------------------\n`;
        const seen = new Map<string, number>();
        tokens.forEach((t) => seen.set(t.value, (seen.get(t.value) ?? 0) + 1));
        [...seen.entries()].forEach(([v, c], i) => {
          txt += `  [${String(i + 1).padStart(3)}] "${v}"${c > 1 ? ` (×${c})` : ""}\n`;
        });
        txt += "\n";
      });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `otomatalab_result_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <div className={`panel ${styles.output}`}>
      {/* Header */}
      <div className="panel-header">
        <h2 className="panel-title">
          <span>🔍</span> Hasil Analisis
        </h2>
        <div className={styles.headerRight}>
          <button
            className="btn btn-ghost"
            onClick={exportResult}
            disabled={!result}
            title="Export ke .txt"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v7M4 6l2.5 2.5L9 6M2 9.5v.5a1 1 0 001 1h7a1 1 0 001-1v-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export
          </button>
          <div className="view-toggle">
            {(["grouped", "table", "inline"] as ViewMode[]).map((v) => (
              <button
                key={v}
                className={`view-btn ${view === v ? "active" : ""}`}
                onClick={() => setView(v)}
              >
                {v === "grouped" ? "Grouped" : v === "table" ? "Tabel" : "Inline"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading && (
          <div className={styles.loading}>
            <div className="dot-flashing"><span /><span /><span /></div>
            <span>Menganalisis token...</span>
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        {!result && !loading && !error && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⚡</div>
            <p className={styles.emptyTitle}>Siap menganalisis!</p>
            <p className={styles.emptySub}>
              Masukkan kode lalu tekan <strong>Analisis Token</strong>
            </p>
          </div>
        )}

        {result && !loading && (
          <>
            {result.errors?.length > 0 && (
              <div className={styles.warnings}>
                {result.errors.map((e, i) => (
                  <div key={i} className={styles.warnItem}>⚠️ {e}</div>
                ))}
              </div>
            )}

            {view === "grouped" && <GroupedView groups={result.groups} collapsed={collapsed} onToggle={toggleGroup} />}
            {view === "table"   && <TableView tokens={result.tokens} />}
            {view === "inline"  && <InlineView tokens={result.tokens} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Grouped view ─────────────────────────────────────────────── */
function GroupedView({
  groups,
  collapsed,
  onToggle,
}: {
  groups: AnalyzeResponse["groups"];
  collapsed: Record<string, boolean>;
  onToggle: (k: string) => void;
}) {
  const sorted = Object.entries(GROUP_CONFIG).sort((a, b) => a[1].order - b[1].order);

  return (
    <div className={styles.groups}>
      {sorted.map(([type, cfg]) => {
        const tokens = groups[type as TokenType] ?? [];
        if (!tokens.length) return null;
        const isCollapsed = collapsed[type];
        const seen = new Map<string, number>();
        tokens.forEach((t) => seen.set(t.value, (seen.get(t.value) ?? 0) + 1));
        const unique = [...seen.entries()];

        return (
          <div key={type} className={styles.group}>
            <button className={styles.groupHeader} onClick={() => onToggle(type)}>
              <div className={styles.groupTitleRow}>
                <span className={styles.groupDot} style={{ background: cfg.dot }} />
                <span className={styles.groupLabel}>{cfg.label}</span>
                <span className={styles.groupCount}>
                  {tokens.length} token · {unique.length} unik
                </span>
              </div>
              <span className={`${styles.chevron} ${isCollapsed ? "" : styles.chevronOpen}`}>▼</span>
            </button>
            {!isCollapsed && (
              <div className={styles.groupBody}>
                {unique.map(([val, count]) => (
                  <span
                    key={val}
                    className={`token-badge ${cfg.cls}`}
                    title={`"${val}" (${count}×)`}
                  >
                    {val.length > 40 ? val.slice(0, 37) + "…" : val}
                    {count > 1 && <sup className={styles.countSup}>×{count}</sup>}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Table view ───────────────────────────────────────────────── */
function TableView({ tokens }: { tokens: AnalyzeResponse["tokens"] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th>Kategori</th>
            <th>Baris</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => {
            const cfg = GROUP_CONFIG[t.type];
            return (
              <tr key={i}>
                <td className={styles.colIdx}>{i + 1}</td>
                <td className={styles.colVal}>
                  <code>{t.value.length > 48 ? t.value.slice(0, 45) + "…" : t.value}</code>
                </td>
                <td>
                  <span className={`token-badge ${cfg?.cls ?? ""}`} style={{ fontSize: "0.68rem" }}>
                    {cfg?.label.replace(/^[a-d]\. /, "") ?? t.type}
                  </span>
                </td>
                <td className={styles.colLine}>{t.line}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Inline view ──────────────────────────────────────────────── */
function InlineView({ tokens }: { tokens: AnalyzeResponse["tokens"] }) {
  return (
    <div className={styles.inlineView}>
      {tokens.map((t, i) => {
        const cfg = GROUP_CONFIG[t.type];
        return (
          <span
            key={i}
            className={`token-badge ${cfg?.cls ?? ""}`}
            title={`${cfg?.label ?? t.type} · baris ${t.line}`}
            style={{ margin: "2px" }}
          >
            {t.value.replace(/\n/g, "↵")}
          </span>
        );
      })}
    </div>
  );
}
