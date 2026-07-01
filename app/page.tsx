import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OtomataLab — Praktikum Teori Otomata",
  description:
    "Pilih praktikum: Lexical Analyzer (Praktikum 1) atau FSM String Checker (Praktikum 2).",
};

const PRACTICUMS = [
  {
    href: "/praktikum-1",
    num: "01",
    title: "Lexical Analyzer",
    subtitle: "Praktikum 1 — Analisis Leksikal",
    description:
      "Analisis kode program dan kelompokkan token-tokennya berdasarkan kategori: Reserved Words, Simbol, Variabel, dan Ekspresi Matematika.",
    features: ["DFA-based lexer", "C / Python / Java", "3 view mode", "Export hasil"],
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    glow: "rgba(99, 102, 241, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 10l5 5-5 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 20h8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/praktikum-2",
    num: "02",
    title: "FSM String Checker",
    subtitle: "Praktikum 2 — Finite State Machine",
    description:
      'Periksa apakah sebuah string biner termasuk dalam bahasa L = { x ∈ (0+1)⁺ | karakter terakhir x adalah "1" dan x tidak mengandung substring "00" }.',
    features: ["FSM 4-state", "Step-by-step trace", "Diagram interaktif", "Penjelasan alasan"],
    gradient: "linear-gradient(135deg, #06b6d4, #6366f1)",
    glow: "rgba(6, 182, 212, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="8" cy="16" r="4" stroke="white" strokeWidth="2" />
        <circle cx="24" cy="10" r="4" stroke="white" strokeWidth="2" />
        <circle cx="24" cy="22" r="4" strokeWidth="2.5" stroke="white" />
        <path d="M12 16h4M16 16l4-4M16 16l4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/praktikum-3",
    num: "03",
    title: "Mesin PDA Simulator",
    subtitle: "Praktikum 3 — Pushdown Automaton",
    description:
      'Uji string dengan simulasi Pushdown Automaton (PDA). Pilih preset bahasa seperti Palindrom, Kurung Seimbang, atau a^n b^n, dan amati perubahan memori stack-nya.',
    features: ["Visualisasi Stack", "Step-by-step Trace", "3 Preset Bahasa", "Validasi Real-time"],
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    glow: "rgba(16, 185, 129, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="10" y="8" width="12" height="16" rx="2" stroke="white" strokeWidth="2" />
        <path d="M10 14h12M10 20h12" stroke="white" strokeWidth="2" />
        <path d="M16 4v4M13 6l3-2 3 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={`${styles.hero} animate-fade-up`}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Teori Otomata — Teknik Informatika
        </div>
        <h1 className={`${styles.heroTitle} animate-fade-up-1`}>
          Selamat Datang di <br />
          <span className={styles.heroTitleGradient}>OtomataLab</span>
        </h1>
        <p className={styles.heroDesc}>
          Platform interaktif untuk praktikum Teori Otomata. Pilih modul
          praktikum di bawah untuk memulai.
        </p>
      </section>

      {/* Cards */}
      <section className={`${styles.cards} animate-fade-up-1`}>
        {PRACTICUMS.map((p, i) => (
          <Link
            key={p.href}
            href={p.href}
            className={`${styles.card} animate-fade-up-${i + 2}`}
            style={{ "--card-glow": p.glow } as React.CSSProperties}
          >
            {/* Card header */}
            <div className={styles.cardTop}>
              <div
                className={styles.cardIcon}
                style={{ background: p.gradient }}
              >
                {p.icon}
              </div>
              <span className={styles.cardNum}>{p.num}</span>
            </div>

            {/* Content */}
            <div className={styles.cardContent}>
              <p className={styles.cardSubtitle}>{p.subtitle}</p>
              <h2 className={styles.cardTitle}>{p.title}</h2>
              <p className={styles.cardDesc}>{p.description}</p>
            </div>

            {/* Features */}
            <div className={styles.cardFeatures}>
              {p.features.map((f) => (
                <span key={f} className={styles.featureChip}>
                  ✓ {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className={styles.cardCta}>
              <span>Buka Praktikum</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      {/* Info footer */}
      <footer className={`${styles.info} animate-fade-up-5`}>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>🎓</span>
          <span>Tugas Praktikum Teori Otomata</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>⚙️</span>
          <span>Next.js + Go Backend</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>🔢</span>
          <span>DFA, FSM, & PDA Simulator</span>
        </div>
      </footer>
    </div>
  );
}
