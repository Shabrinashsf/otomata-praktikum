"use client";
import { useState, useCallback } from "react";
import CodeEditor from "@/components/lexer/CodeEditor";
import TokenOutput from "@/components/lexer/TokenOutput";
import StatsBar from "@/components/lexer/StatsBar";
import { analyzeCode } from "@/lib/lexer-api";
import type { AnalyzeResponse } from "@/types/token";
import styles from "./page.module.css";

export default function Praktikum1Page() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [lang, setLang] = useState("c");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeCode(code, lang);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [code, lang]);

  return (
    <div className={styles.container}>
      {/* Page header */}
      <div className={`${styles.pageHeader} animate-fade-up`}>
        <div className={styles.pageHeaderLeft}>
          <span className={styles.pageBadge}>Praktikum 1</span>
          <h1 className={styles.pageTitle}>Lexical Analyzer</h1>
          <p className={styles.pageDesc}>
            Analisis kode program dan kelompokkan token berdasarkan kategori
            menggunakan algoritma DFA (Deterministic Finite Automaton).
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-fade-up-1">
        <StatsBar stats={result?.stats ?? null} />
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {/* Input panel */}
        <div className={`${styles.panelWrap} animate-fade-up-2`}>
          <CodeEditor
            code={code}
            lang={lang}
            onCodeChange={setCode}
            onLangChange={setLang}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>

        {/* Output panel */}
        <div className={`${styles.panelWrap} animate-fade-up-3`}>
          <TokenOutput result={result} loading={loading} error={error} />
        </div>
      </div>

      {/* Legend */}
      <div className={`${styles.legend} animate-fade-up-4`}>
        <span className={styles.legendLabel}>Legenda:</span>
        {LEGEND.map((l) => (
          <span key={l.cls} className={`token-badge ${l.cls}`}>
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const LEGEND = [
  { cls: "token-reserved", label: "Reserved Word" },
  { cls: "token-symbol",   label: "Simbol" },
  { cls: "token-variable", label: "Variabel" },
  { cls: "token-math",     label: "Matematika" },
  { cls: "token-number",   label: "Angka" },
  { cls: "token-string",   label: "String" },
  { cls: "token-comment",  label: "Komentar" },
];

const DEFAULT_CODE = `#include <stdio.h>

// Menghitung faktorial secara rekursif
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int x = 10;
    float y = 3.14;
    char name[] = "OtomataLab";

    if (x > 5 && y < 10.0) {
        printf("Hello, %s!\\n", name);
        printf("Factorial(%d) = %d\\n", x, factorial(x));
    }

    for (int i = 0; i < 5; i++) {
        printf("i = %d\\n", i);
    }

    return 0;
}`;
