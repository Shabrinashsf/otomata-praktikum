"use client";
import { useState, useCallback } from "react";
import FSMDiagram from "@/components/fsm/FSMDiagram";
import StepTrace from "@/components/fsm/StepTrace";
import { checkFSM } from "@/lib/fsm-api";
import type { CheckResponse, FSMState } from "@/types/fsm";
import styles from "./page.module.css";

const EXAMPLES = ["1", "01", "101", "11", "0", "00", "001", "100", "010"];

export default function Praktikum2Page() {
  const [input, setInput] = useState("10101");
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const handleCheck = useCallback(async (val?: string) => {
    const str = (val ?? input).trim();
    if (!str) return;
    setLoading(true);
    setError(null);
    setActiveStep(-1);
    try {
      const res = await checkFSM(str);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleInputChange = (v: string) => {
    // Only allow 0, 1, and space
    setInput(v.replace(/[^01\s]/g, ""));
    setResult(null);
    setActiveStep(-1);
  };

  const handleExample = (ex: string) => {
    setInput(ex);
    handleCheck(ex);
  };

  // Current highlighted state for diagram
  const currentState: FSMState | null =
    activeStep >= 0 && result
      ? result.steps[activeStep]?.next_state ?? null
      : result
      ? result.final_state
      : null;

  return (
    <div className={styles.container}>
      {/* Page header */}
      <div className={`${styles.pageHeader} animate-fade-up`}>
        <div>
          <span className={styles.pageBadge}>Praktikum 2</span>
          <h1 className={styles.pageTitle}>FSM String Checker</h1>
          <p className={styles.pageDesc}>
            Periksa apakah sebuah string biner termasuk dalam bahasa{" "}
            <strong>
              L = &#123; x ∈ (0+1)⁺ | karakter terakhir adalah &quot;1&quot; dan tidak
              mengandung substring &quot;00&quot; &#125;
            </strong>
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left: input + trace */}
        <div className={styles.left}>
          {/* Input panel */}
          <div className={`panel animate-fade-up-1`}>
            <div className="panel-header">
              <h2 className="panel-title"><span>⌨️</span> Input String</h2>
            </div>
            <div className={styles.inputBody}>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  className={styles.stringInput}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  placeholder="Ketik string biner (0 dan 1)..."
                  spellCheck={false}
                  aria-label="Input string biner"
                />
                <button
                  className="btn btn-primary"
                  style={{ flexShrink: 0 }}
                  onClick={() => handleCheck()}
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <div className="dot-flashing"><span /><span /><span /></div>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5"/>
                        <path d="M5 8l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Cek
                    </>
                  )}
                </button>
              </div>

              {/* Examples */}
              <div className={styles.examplesRow}>
                <span className={styles.exLabel}>Contoh:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    className={styles.exChip}
                    onClick={() => handleExample(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className={styles.errorBox}>⚠️ {error}</div>
              )}

              {/* Result banner */}
              {result && !loading && (
                <div className={`${styles.resultBanner} ${result.accepted ? styles.accepted : styles.rejected}`}>
                  <div className={styles.resultIcon}>
                    {result.accepted ? "✅" : "❌"}
                  </div>
                  <div className={styles.resultText}>
                    <div className={styles.resultTitle}>
                      {result.accepted ? "DITERIMA" : "DITOLAK"}
                    </div>
                    <div className={styles.resultReason}>{result.reason}</div>
                  </div>
                </div>
              )}

              {/* Info: language definition */}
              {!result && !loading && (
                <div className={styles.langDef}>
                  <div className={styles.langDefTitle}>Definisi Bahasa</div>
                  <div className={styles.langDefFormula}>
                    L = &#123; x ∈ (0+1)⁺ | last(x) = 1 ∧ ¬∃ &quot;00&quot; ⊆ x &#125;
                  </div>
                  <div className={styles.langDefRules}>
                    <span>✓ Minimal 1 karakter</span>
                    <span>✓ Diakhiri dengan &quot;1&quot;</span>
                    <span>✓ Tidak mengandung &quot;00&quot;</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step trace */}
          {result && (
            <div className={`animate-fade-up-2`}>
              <StepTrace
                steps={result.steps}
                activeStep={activeStep}
                onStepHover={setActiveStep}
              />
            </div>
          )}
        </div>

        {/* Right: FSM Diagram */}
        <div className={`${styles.right} animate-fade-up-2`}>
          <div className="panel" style={{ height: "100%" }}>
            <div className="panel-header">
              <h2 className="panel-title"><span>🗺️</span> Diagram FSM</h2>
              {currentState && (
                <span className={`${styles.currentStateBadge} ${styles[`state${currentState}`]}`}>
                  State: <strong>{currentState}</strong>
                </span>
              )}
            </div>
            <div className={styles.diagramWrap}>
              <FSMDiagram
                currentState={currentState}
                accepted={result?.accepted ?? null}
              />
            </div>

            {/* Transition table */}
            <div className={styles.transTable}>
              <div className={styles.transTitle}>Tabel Transisi δ</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Input 0</th>
                    <th>Input 1</th>
                    <th>Accept?</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: "S", i0: "A", i1: "B", acc: false, isStart: true },
                    { s: "A", i0: "C", i1: "B", acc: false, isStart: false },
                    { s: "B", i0: "A", i1: "B", acc: true,  isStart: false },
                    { s: "C", i0: "C", i1: "C", acc: false, isStart: false },
                  ].map((row) => (
                    <tr
                      key={row.s}
                      className={currentState === row.s ? styles.activeRow : ""}
                    >
                      <td>
                        {row.isStart && <span className={styles.startArrow}>→</span>}
                        <span className={`${styles.stateCell} ${styles[`state${row.s}`]}`}>
                          {row.acc ? `(${row.s})` : row.s}
                        </span>
                      </td>
                      <td><span className={styles.transCell}>{row.i0}</span></td>
                      <td><span className={styles.transCell}>{row.i1}</span></td>
                      <td>{row.acc ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
