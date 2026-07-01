"use client";
import { useState, useCallback, useMemo } from "react";
import PDAStepTrace from "@/components/pda/PDAStepTrace";
import StackVisualizer from "@/components/pda/StackVisualizer";
import { checkPDA } from "@/lib/pda-api";
import type { CheckPDAResponse, PDAStep } from "@/types/pda";
import styles from "./page.module.css";

const PRESETS = [
  {
    id: "brackets",
    name: "Balanced Brackets",
    examples: ["()", "()[]{}", "([{}])", "((]", "}{"],
    formula: "L = { w ∈ {(, ), [, ], {, }}* | w seimbang }",
  },
  {
    id: "anbn",
    name: "a^n b^n",
    examples: ["ab", "aabb", "aaabbb", "aab", "ba"],
    formula: "L = { a^n b^n | n ≥ 1 }",
  },
  {
    id: "palindrome",
    name: "Palindrome (w c w^R)",
    examples: ["0c0", "11c11", "101c101", "10c1", "00c11"],
    formula: "L = { w c w^R | w ∈ {0,1}* }",
  },
];

export default function Praktikum3Page() {
  const [lang, setLang] = useState(PRESETS[0].id);
  const [input, setInput] = useState(PRESETS[0].examples[1]); // Default to "()[]{}"
  const [result, setResult] = useState<CheckPDAResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);

  const selectedPreset = useMemo(() => PRESETS.find((p) => p.id === lang)!, [lang]);

  const handleCheck = useCallback(async (val?: string) => {
    const str = (val ?? input).trim();
    if (!str && lang !== "brackets") return; // brackets can accept empty string depending on definition, but let's assume at least we try
    setLoading(true);
    setError(null);
    setActiveStepIdx(-1);
    try {
      const res = await checkPDA(str, lang);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [input, lang]);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    const preset = PRESETS.find((p) => p.id === newLang);
    setInput(preset ? preset.examples[1] ?? preset.examples[0] : "");
    setResult(null);
    setActiveStepIdx(-1);
  };

  const handleExample = (ex: string) => {
    setInput(ex);
    handleCheck(ex);
  };

  // Determine current stack based on hovered step
  const currentStack =
    activeStepIdx >= 0 && result
      ? result.steps[activeStepIdx]?.stack_after ?? []
      : result
      ? result.steps[result.steps.length - 1]?.stack_after ?? []
      : ["Z0"];

  return (
    <div className={styles.container}>
      {/* Page header */}
      <div className={`${styles.pageHeader} animate-fade-up`}>
        <div>
          <span className={styles.pageBadge}>Praktikum 3</span>
          <h1 className={styles.pageTitle}>Mesin PDA Simulator</h1>
          <p className={styles.pageDesc}>
            Simulasi Pushdown Automaton dengan memori Stack. Uji validitas string
            untuk bahasa konteks bebas (*Context-Free Language*).
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left: input + trace */}
        <div className={styles.left}>
          {/* Input panel */}
          <div className={`panel animate-fade-up-1`}>
            <div className="panel-header">
              <h2 className="panel-title"><span>⚙️</span> Konfigurasi PDA</h2>
            </div>
            <div className={styles.inputBody}>
              
              <div className={styles.langSelectWrap}>
                <label className={styles.langSelectLabel}>Pilih Bahasa (Context-Free Grammar):</label>
                <select
                  className={styles.langSelect}
                  value={lang}
                  onChange={(e) => handleLangChange(e.target.value)}
                >
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputRow}>
                <input
                  type="text"
                  className={styles.stringInput}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setResult(null);
                    setActiveStepIdx(-1);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  placeholder="Ketik string uji..."
                  spellCheck={false}
                />
                <button
                  className={styles.checkBtn}
                  onClick={() => handleCheck()}
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <div className="dot-flashing"><span /><span /><span /></div>
                  ) : (
                    "Uji String"
                  )}
                </button>
              </div>

              {/* Examples */}
              <div className={styles.examplesRow}>
                <span className={styles.exLabel}>Contoh:</span>
                {selectedPreset.examples.map((ex) => (
                  <button
                    key={ex}
                    className={styles.exChip}
                    onClick={() => handleExample(ex)}
                  >
                    {ex === "" ? "ε (kosong)" : ex}
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
                    {selectedPreset.formula}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step trace */}
          {result && (
            <div className={`animate-fade-up-2`}>
              <PDAStepTrace
                steps={result.steps}
                activeStep={activeStepIdx}
                onStepHover={setActiveStepIdx}
              />
            </div>
          )}
        </div>

        {/* Right: Stack Visualizer */}
        <div className={styles.right}>
          <div className="animate-fade-up-2" style={{ height: "100%" }}>
            <StackVisualizer stack={currentStack} />
          </div>
        </div>
      </div>
    </div>
  );
}
