"use client";
import type { FSMStep } from "@/types/fsm";
import styles from "./StepTrace.module.css";

const STATE_COLOR: Record<string, string> = {
  S: "#818cf8",
  A: "#fbbf24",
  B: "#34d399",
  C: "#f87171",
};

interface Props {
  steps: FSMStep[];
  activeStep: number;
  onStepHover: (i: number) => void;
}

export default function StepTrace({ steps, activeStep, onStepHover }: Props) {
  return (
    <div className={`panel ${styles.trace}`}>
      <div className="panel-header">
        <h2 className="panel-title">
          <span>🔢</span> Step-by-Step Trace
        </h2>
        <span className={styles.stepCount}>{steps.length} langkah</span>
      </div>

      <div className={styles.content}>
        {steps.length === 0 ? (
          <div className={styles.empty}>Tidak ada langkah (string kosong)</div>
        ) : (
          <div className={styles.table}>
            {/* Header */}
            <div className={styles.headerRow}>
              <span>Langkah</span>
              <span>State Saat Ini</span>
              <span>Input</span>
              <span>State Berikutnya</span>
              <span>Accept?</span>
            </div>

            {/* Rows */}
            {steps.map((step, i) => (
              <div
                key={i}
                className={`${styles.row} ${activeStep === i ? styles.activeRow : ""}`}
                onMouseEnter={() => onStepHover(i)}
                onMouseLeave={() => onStepHover(-1)}
              >
                <span className={styles.stepNum}>{i + 1}</span>
                <StateChip state={step.current_state} />
                <span className={styles.inputCell}>
                  <code>{step.input}</code>
                </span>
                <StateChip state={step.next_state} />
                <span className={styles.acceptCell}>
                  {step.is_accepting ? (
                    <span className={styles.yes}>✓</span>
                  ) : (
                    <span className={styles.no}>✗</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StateChip({ state }: { state: string }) {
  const color = STATE_COLOR[state] ?? "#8b90a8";
  return (
    <span
      className={styles.stateChip}
      style={{
        color,
        background: `${color}1a`,
        borderColor: `${color}44`,
      }}
    >
      {state}
    </span>
  );
}
