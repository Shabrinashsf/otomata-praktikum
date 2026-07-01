"use client";
import styles from "./StackVisualizer.module.css";

interface Props {
  stack: string[];
}

export default function StackVisualizer({ stack }: Props) {
  // We'll reverse the stack so the top of the stack is visually at the top
  const reversed = [...stack].reverse();
  const maxVisualItems = 10;
  const showMore = reversed.length > maxVisualItems;
  const itemsToDisplay = showMore ? reversed.slice(0, maxVisualItems) : reversed;

  return (
    <div className={`panel ${styles.wrapper}`}>
      <div className="panel-header">
        <h2 className="panel-title">
          <span>📚</span> Memori Stack
        </h2>
        <span className={styles.countBadge}>{stack.length} item</span>
      </div>

      <div className={styles.container}>
        <div className={styles.stackArea}>
          {itemsToDisplay.length === 0 ? (
            <div className={styles.emptyStack}>Stack Kosong</div>
          ) : (
            <>
              {itemsToDisplay.map((item, i) => (
                <div
                  key={`${i}-${item}`}
                  className={`${styles.item} ${i === 0 ? styles.topItem : ""}`}
                >
                  <span className={styles.itemValue}>{item}</span>
                  {i === 0 && <span className={styles.topLabel}>TOP</span>}
                </div>
              ))}
              {showMore && (
                <div className={styles.moreItem}>
                  +{reversed.length - maxVisualItems} lebih...
                </div>
              )}
            </>
          )}

          {/* Base platform for stack */}
          <div className={styles.base}></div>
        </div>

        <div className={styles.info}>
          <p>
            <strong>Stack (Tumpukan)</strong> adalah struktur data LIFO (Last In First Out)
            yang digunakan oleh mesin PDA untuk "mengingat" informasi.
          </p>
        </div>
      </div>
    </div>
  );
}
