"use client";
import { useRef, useEffect, useCallback } from "react";
import styles from "./CodeEditor.module.css";

const EXAMPLES: Record<string, { lang: string; code: string }> = {
  c_basic: {
    lang: "c",
    code: `#include <stdio.h>

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
    }
    return 0;
}`,
  },
  c_math: {
    lang: "c",
    code: `#include <math.h>
#include <stdio.h>

/* Kalkulator ekspresi matematika */
double quadratic(double a, double b, double c) {
    double disc = b * b - 4.0 * a * c;
    return (-b + sqrt(disc)) / (2.0 * a);
}

int main() {
    double x = 2.5 * 3.0 + 1.0 / 4.0 - 0.75;
    int y = (10 % 3) * 2 + 5;
    int z = y << 2 | 0xFF & 0x0F;
    printf("x=%.2f y=%d z=%d\\n", x, y, z);
    return 0;
}`,
  },
  python: {
    lang: "python",
    code: `# Kelas Mahasiswa
class Mahasiswa:
    def __init__(self, nama: str, ipk: float):
        self.nama = nama
        self.ipk  = ipk

    def lulus(self) -> bool:
        return self.ipk >= 2.0

    def grade(self) -> str:
        if self.ipk >= 3.5:
            return "A"
        elif self.ipk >= 3.0:
            return "B"
        else:
            return "C"

mhs = Mahasiswa("Alice", 3.75)
print(f"{mhs.nama}: {mhs.grade()}")`,
  },
  java: {
    lang: "java",
    code: `import java.util.ArrayList;

public class NilaiManager {
    private ArrayList<Double> nilai;

    public NilaiManager() {
        this.nilai = new ArrayList<>();
    }

    public void tambah(double n) {
        if (n >= 0 && n <= 100) nilai.add(n);
    }

    public double rata() {
        double total = 0;
        for (double n : nilai) total += n;
        return nilai.isEmpty() ? 0 : total / nilai.size();
    }

    public static void main(String[] args) {
        NilaiManager nm = new NilaiManager();
        int[] data = {85, 90, 78, 92};
        for (int n : data) nm.tambah(n);
        System.out.printf("Rata-rata: %.2f%n", nm.rata());
    }
}`,
  },
};

interface Props {
  code: string;
  lang: string;
  onCodeChange: (v: string) => void;
  onLangChange: (v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export default function CodeEditor({
  code, lang, onCodeChange, onLangChange, onAnalyze, loading,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef  = useRef<HTMLDivElement>(null);

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");

  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const el = e.currentTarget;
        const { selectionStart: s, selectionEnd: end } = el;
        const next = el.value.slice(0, s) + "    " + el.value.slice(end);
        onCodeChange(next);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = s + 4;
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onAnalyze();
      }
    },
    [onCodeChange, onAnalyze]
  );

  const loadExample = (key: string) => {
    const ex = EXAMPLES[key];
    if (!ex) return;
    onLangChange(ex.lang);
    onCodeChange(ex.code);
  };

  return (
    <div className={`panel ${styles.editor}`}>
      {/* Header */}
      <div className="panel-header">
        <h2 className="panel-title">
          <span>📝</span> Kode Sumber
        </h2>
        <div className={styles.headerControls}>
          <select
            className={styles.langSelect}
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            title="Pilih bahasa"
          >
            <option value="c">C / C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="custom">Kustom</option>
          </select>
          <button
            className="btn btn-ghost"
            onClick={() => onCodeChange("")}
            title="Hapus kode"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Hapus
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className={styles.editorArea}>
        <div ref={lineNumRef} className={styles.lineNumbers} aria-hidden="true">
          {lineNumbers}
        </div>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="// Ketik atau paste kode program di sini..."
        />
      </div>

      {/* Examples */}
      <div className={styles.examplesRow}>
        <span className={styles.examplesLabel}>Contoh:</span>
        {Object.keys(EXAMPLES).map((key) => (
          <button
            key={key}
            className={styles.exampleChip}
            onClick={() => loadExample(key)}
          >
            {key.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Analyze button */}
      <div className={styles.analyzeWrap}>
        <button
          className="btn btn-primary"
          style={{ width: "100%" }}
          onClick={onAnalyze}
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <>
              <div className="dot-flashing">
                <span /><span /><span />
              </div>
              Menganalisis...
            </>
          ) : (
            <>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="8.5" r="6.5" stroke="white" strokeWidth="1.5"/>
                <path d="M5.5 8.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Analisis Token
              <kbd className={styles.kbd}>Ctrl+↵</kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
