"use client";
import type { PDAStep } from "@/types/pda";
import styles from "./PDAStepTrace.module.css";

const STATE_COLOR: Record<string, string> = {
  q_start: "#818cf8",
  q_read: "#fbbf24",
  q_match: "#34d399",
  q_accept: "#10b981",
  q_reject: "#f87171",
};

interface Props {
  steps: PDAStep[];
  activeStep: number;
  onStepHover: (i: number) => void;
}

export default function PDAStepTrace({ steps, activeStep, onStepHover }: Props) {
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
          <div className={styles.empty}>Tidak ada langkah</div>
        ) : (
          <div className={styles.table}>
            {/* Header */}
            <div className={styles.headerRow}>
              <span>#</span>
              <span>State</span>
              <span>Input</span>
              <span>Top Stack</span>
              <span>Action</span>
              <span>Next State</span>
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
                <span className={styles.stackCell}>
                  <code>{step.top_stack}</code>
                </span>
                <span className={styles.actionCell}>
                  <ActionBadge action={step.action} />
                </span>
                <StateChip state={step.next_state} />
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
  // remove "q_" for display
  const display = state.replace("q_", "");
  return (
    <span
      className={styles.stateChip}
      style={{
        color,
        background: `${color}1a`,
        borderColor: `${color}44`,
      }}
    >
      {display}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  let cls = styles.actionNeutral;
  if (action.startsWith("PUSH")) cls = styles.actionPush;
  else if (action.startsWith("POP")) cls = styles.actionPop;
  else if (action.startsWith("REJECT")) cls = styles.actionReject;

  return <span className={`${styles.actionBadge} ${cls}`}>{action}</span>;
}
