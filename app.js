/**
 * LexiScan — Application Controller
 * Handles UI interactions, rendering, and export features.
 */

'use strict';

/* ─── Sample Code Examples ──────────────────────────────────── */
const EXAMPLES = {
  c_basic: `#include <stdio.h>
#include <stdlib.h>

// Program menghitung faktorial
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int x = 10;
    float y = 3.14;
    char name[] = "LexiScan";
    
    if (x > 5 && y < 10.0) {
        printf("Hello, %s!\\n", name);
        printf("Factorial of %d = %d\\n", x, factorial(x));
    } else {
        printf("Kondisi tidak terpenuhi\\n");
    }
    
    for (int i = 0; i < 5; i++) {
        printf("i = %d\\n", i);
    }
    
    return 0;
}`,

  c_math: `#include <math.h>
#include <stdio.h>

/* Kalkulator ekspresi matematika */
double quadratic(double a, double b, double c) {
    double discriminant = b * b - 4.0 * a * c;
    double root1 = (-b + sqrt(discriminant)) / (2.0 * a);
    double root2 = (-b - sqrt(discriminant)) / (2.0 * a);
    return root1;
}

int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    int a = 0, b = 1, result = 0;
    for (int i = 2; i <= n; i++) {
        result = a + b;
        a = b;
        b = result;
    }
    return result;
}

int main() {
    double x = 2.5 * 3.0 + 1.0 / 4.0 - 0.75;
    int y = (10 % 3) * 2 + 5;
    int z = y << 2 | 0xFF & 0x0F;
    printf("x = %f, y = %d, z = %d\\n", x, y, z);
    return 0;
}`,

  python_basic: `# Program Python: Kelas Mahasiswa
import math
from typing import List

class Mahasiswa:
    def __init__(self, nama: str, nim: str, ipk: float):
        self.nama = nama
        self.nim  = nim
        self.ipk  = ipk

    def lulus(self) -> bool:
        return self.ipk >= 2.0

    def grade(self) -> str:
        if self.ipk >= 3.5:
            return "A"
        elif self.ipk >= 3.0:
            return "B"
        elif self.ipk >= 2.5:
            return "C"
        else:
            return "D"

def hitung_rata(nilai: List[float]) -> float:
    total = sum(nilai)
    return total / len(nilai)

# Main program
mahasiswa = [
    Mahasiswa("Alice", "12345", 3.75),
    Mahasiswa("Bob",   "12346", 2.80),
]

for mhs in mahasiswa:
    status = "Lulus" if mhs.lulus() else "Tidak Lulus"
    print(f"{mhs.nama}: IPK={mhs.ipk}, Grade={mhs.grade()}, {status}")

nilai = [85.5, 90.0, 78.3, 92.1]
print(f"Rata-rata: {hitung_rata(nilai):.2f}")`,

  java_basic: `import java.util.ArrayList;
import java.util.Scanner;

// Kelas untuk sistem manajemen nilai
public class NilaiManager {
    private ArrayList<Double> daftarNilai;
    private String namaMatkul;
    
    public NilaiManager(String matkul) {
        this.namaMatkul = matkul;
        this.daftarNilai = new ArrayList<>();
    }
    
    public void tambahNilai(double nilai) {
        if (nilai >= 0 && nilai <= 100) {
            daftarNilai.add(nilai);
        }
    }
    
    public double hitungRata() {
        if (daftarNilai.isEmpty()) return 0.0;
        double total = 0;
        for (double n : daftarNilai) {
            total += n;
        }
        return total / daftarNilai.size();
    }
    
    public static void main(String[] args) {
        NilaiManager nm = new NilaiManager("Otomata");
        int[] nilaiArray = {85, 90, 78, 92, 88};
        
        for (int n : nilaiArray) {
            nm.tambahNilai(n);
        }
        
        System.out.println("Mata Kuliah: " + nm.namaMatkul);
        System.out.printf("Rata-rata: %.2f%n", nm.hitungRata());
    }
}`,
};

/* ─── Token group display config ────────────────────────────── */
const GROUP_CONFIG = {
  [TOKEN_TYPE.RESERVED]: {
    label: 'a. Reserved Words',
    dot: '#f59e0b',
    cls: 'token-reserved',
    desc: 'Kata kunci bawaan bahasa pemrograman',
    order: 1,
  },
  [TOKEN_TYPE.SYMBOL]: {
    label: 'b. Simbol & Tanda Baca',
    dot: '#e879f9',
    cls: 'token-symbol',
    desc: 'Tanda baca dan simbol non-operator',
    order: 2,
  },
  [TOKEN_TYPE.VARIABLE]: {
    label: 'c. Variabel / Identifier',
    dot: '#34d399',
    cls: 'token-variable',
    desc: 'Nama variabel, fungsi, atau identifier',
    order: 3,
  },
  [TOKEN_TYPE.MATH]: {
    label: 'd. Ekspresi Matematika',
    dot: '#fb923c',
    cls: 'token-math',
    desc: 'Operator matematika, relasi, dan ekspresi',
    order: 4,
  },
  [TOKEN_TYPE.NUMBER]: {
    label: 'Literal Angka',
    dot: '#60a5fa',
    cls: 'token-number',
    desc: 'Konstanta numerik (integer, float, hex)',
    order: 5,
  },
  [TOKEN_TYPE.STRING]: {
    label: 'Literal String / Char',
    dot: '#f87171',
    cls: 'token-string',
    desc: 'String dan karakter literal',
    order: 6,
  },
  [TOKEN_TYPE.COMMENT]: {
    label: 'Komentar',
    dot: '#6b7280',
    cls: 'token-comment',
    desc: 'Baris komentar (line/block)',
    order: 7,
  },
};

/* ─── App State ─────────────────────────────────────────────── */
const state = {
  currentView: 'grouped',
  lastResult: null,
  lastTokens: null,
};

/* ─── DOM References ────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const dom = {
  codeInput:    $('code-input'),
  lineNumbers:  $('line-numbers'),
  langSelect:   $('lang-select'),
  btnAnalyze:   $('btn-analyze'),
  btnClear:     $('btn-clear'),
  btnExport:    $('btn-export'),
  outputArea:   $('output-area'),
  emptyState:   $('empty-state'),
  statTotal:    $('stat-total'),
  statReserved: $('stat-reserved'),
  statSymbol:   $('stat-symbol'),
  statVariable: $('stat-variable'),
  statMath:     $('stat-math'),
  viewGrouped:  $('view-grouped'),
  viewTable:    $('view-table'),
  viewInline:   $('view-inline'),
};

/* ─── Line Numbers ──────────────────────────────────────────── */
function updateLineNumbers() {
  const lines = dom.codeInput.value.split('\n').length;
  dom.lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
}

/* ─── Analyze ───────────────────────────────────────────────── */
function analyzeCode() {
  const code = dom.codeInput.value.trim();
  if (!code) {
    showToast('Masukkan kode program terlebih dahulu!', 'warn');
    return;
  }

  const langKey = dom.langSelect.value;

  // Show analyzing animation
  dom.outputArea.innerHTML = `
    <div class="analyzing-anim">
      <div class="dot-flashing">
        <span></span><span></span><span></span>
      </div>
      <span>Menganalisis token...</span>
    </div>`;

  // Use setTimeout to allow UI repaint before heavy processing
  setTimeout(() => {
    try {
      const lexer  = new Lexer(code, langKey);
      const result = lexer.tokenize();
      const groups = groupTokens(result.tokens);

      state.lastResult  = { result, groups, langKey };
      state.lastTokens  = result.tokens;

      updateStats(result.tokens, groups);
      renderOutput(groups, result.errors);

      dom.btnExport.disabled = false;
    } catch (err) {
      dom.outputArea.innerHTML = `
        <div class="error-message">
          <span>⚠️</span>
          <span>Terjadi kesalahan: ${escapeHtml(err.message)}</span>
        </div>`;
      console.error(err);
    }
  }, 50);
}

/* ─── Update Stats ──────────────────────────────────────────── */
function updateStats(tokens, groups) {
  const total   = tokens.length;
  const reserved= groups[TOKEN_TYPE.RESERVED]?.length  ?? 0;
  const symbol  = groups[TOKEN_TYPE.SYMBOL]?.length    ?? 0;
  const variable= groups[TOKEN_TYPE.VARIABLE]?.length  ?? 0;
  const math    = groups[TOKEN_TYPE.MATH]?.length       ?? 0;

  // Animate numbers
  animateCount(dom.statTotal,    total);
  animateCount(dom.statReserved, reserved);
  animateCount(dom.statSymbol,   symbol);
  animateCount(dom.statVariable, variable);
  animateCount(dom.statMath,     math);
}

function animateCount(el, target) {
  let current = 0;
  const step  = Math.max(1, Math.ceil(target / 20));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 30);
}

/* ─── Render Output ─────────────────────────────────────────── */
function renderOutput(groups, errors = []) {
  const view = state.currentView;

  let html = '';

  // Show errors first
  if (errors.length > 0) {
    html += errors.map(e => `
      <div class="error-message">
        <span>⚠️</span><span>${escapeHtml(e)}</span>
      </div>`).join('');
  }

  if (view === 'grouped') {
    html += renderGroupedView(groups);
  } else if (view === 'table') {
    html += renderTableView(state.lastTokens);
  } else {
    html += renderInlineView(state.lastTokens);
  }

  dom.outputArea.innerHTML = html || `<div class="empty-state">
    <div class="empty-icon">📭</div>
    <p class="empty-title">Tidak ada token ditemukan</p>
    <p class="empty-sub">Pastikan kode tidak kosong</p>
  </div>`;

  // Re-attach group collapse listeners
  dom.outputArea.querySelectorAll('.group-header').forEach(header => {
    header.addEventListener('click', () => {
      const body    = header.nextElementSibling;
      const chevron = header.querySelector('.group-chevron');
      const isOpen  = !body.classList.contains('collapsed');
      body.classList.toggle('collapsed', isOpen);
      chevron.classList.toggle('open', !isOpen);
    });
  });
}

/* ── Grouped View ───────────────────────────────────────────── */
function renderGroupedView(groups) {
  const order = Object.entries(GROUP_CONFIG).sort((a, b) => a[1].order - b[1].order);
  let html = '<div class="token-groups">';

  for (const [type, config] of order) {
    const tokens = groups[type];
    if (!tokens || tokens.length === 0) continue;

    const unique = uniqueTokens(tokens);
    const tokenBadges = unique.map(t => {
      const display = escapeHtml(t.value.length > 40 ? t.value.slice(0, 37) + '…' : t.value);
      const countBadge = t.count > 1
        ? `<span class="token-count-badge" title="${t.count}x">${t.count}</span>`
        : '';
      return `<span class="token-badge ${config.cls}" title="Line ${t.line}: ${escapeHtml(t.value)}">${display}${countBadge}</span>`;
    }).join('');

    html += `
      <div class="token-group">
        <div class="group-header">
          <div class="group-title-row">
            <span class="group-dot" style="background:${config.dot}"></span>
            <span class="group-label">${config.label}</span>
            <span class="group-count">${tokens.length} token · ${unique.length} unik</span>
          </div>
          <span class="group-chevron open">▼</span>
        </div>
        <div class="group-body">
          ${tokenBadges}
        </div>
      </div>`;
  }

  html += '</div>';
  return html;
}

/* ── Table View ─────────────────────────────────────────────── */
function renderTableView(tokens) {
  if (!tokens || tokens.length === 0) return '';
  const rows = tokens.map((t, i) => {
    const cfg   = GROUP_CONFIG[t.type] || GROUP_CONFIG[TOKEN_TYPE.VARIABLE];
    const badge = `<span class="token-badge ${cfg.cls}" style="font-size:0.7rem;padding:2px 8px">${cfg.label.replace(/^[a-d]\. /, '')}</span>`;
    const display = escapeHtml(t.value.length > 50 ? t.value.slice(0, 47) + '…' : t.value);
    return `<tr>
      <td class="col-idx">${i + 1}</td>
      <td class="col-value"><code>${display}</code></td>
      <td>${badge}</td>
      <td class="col-line">${t.line}</td>
    </tr>`;
  }).join('');

  return `
    <div class="token-table-wrapper">
      <table class="token-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th>Kategori</th>
            <th>Baris</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ── Inline View ────────────────────────────────────────────── */
function renderInlineView(tokens) {
  if (!tokens || tokens.length === 0) return '';
  const spans = tokens.map(t => {
    const cfg     = GROUP_CONFIG[t.type] || GROUP_CONFIG[TOKEN_TYPE.VARIABLE];
    const display = escapeHtml(t.value.replace(/\n/g, '↵'));
    return `<span class="token-badge ${cfg.cls}" title="${cfg.label}: ${escapeHtml(t.value)} (baris ${t.line})" style="margin:2px">${display}</span>`;
  }).join(' ');

  return `<div class="inline-view">${spans}</div>`;
}

/* ─── Export ────────────────────────────────────────────────── */
function exportResults() {
  if (!state.lastResult) return;
  const { result, groups, langKey } = state.lastResult;
  const lang = LANG_CONFIGS[langKey].name;
  const now  = new Date().toLocaleString('id-ID');

  let text = `========================================\n`;
  text += `   LEXISCAN — HASIL ANALISIS LEKSIKAL\n`;
  text += `========================================\n`;
  text += `Bahasa  : ${lang}\n`;
  text += `Tanggal : ${now}\n`;
  text += `Total Token : ${result.tokens.length}\n\n`;

  const order = Object.entries(GROUP_CONFIG).sort((a, b) => a[1].order - b[1].order);
  for (const [type, config] of order) {
    const tokens = groups[type];
    if (!tokens || tokens.length === 0) continue;
    const unique = uniqueTokens(tokens);
    text += `----------------------------------------\n`;
    text += `${config.label.toUpperCase()} (${tokens.length} token, ${unique.length} unik)\n`;
    text += `----------------------------------------\n`;
    unique.forEach((t, i) => {
      text += `  [${String(i+1).padStart(3)}] "${t.value}"${t.count > 1 ? ` (×${t.count})` : ''}\n`;
    });
    text += '\n';
  }

  if (result.errors.length > 0) {
    text += `========================================\n`;
    text += `PERINGATAN:\n`;
    result.errors.forEach(e => { text += `  - ${e}\n`; });
  }

  text += `\n========================================\n`;
  text += `Dibuat oleh LexiScan v1.0\n`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `lexiscan_result_${langKey}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Hasil berhasil di-export!', 'success');
}

/* ─── Toast notification ────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${type === 'success' ? '#065f46' : type === 'warn' ? '#78350f' : '#1e1b4b'};
    border: 1px solid ${type === 'success' ? '#34d399' : type === 'warn' ? '#f59e0b' : '#6366f1'};
    color: ${type === 'success' ? '#6ee7b7' : type === 'warn' ? '#fde68a' : '#a5b4fc'};
    padding: 12px 20px; border-radius: 10px; font-size: 0.85rem;
    font-family: var(--font-sans); font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: slide-in 0.3s ease;
    max-width: 300px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ─── Utility ───────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─── Event Listeners ───────────────────────────────────────── */
function setupEvents() {
  // Code input: update line numbers
  dom.codeInput.addEventListener('input', updateLineNumbers);
  dom.codeInput.addEventListener('scroll', () => {
    dom.lineNumbers.scrollTop = dom.codeInput.scrollTop;
  });

  // Tab key support in editor
  dom.codeInput.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end } = dom.codeInput;
      dom.codeInput.value = dom.codeInput.value.slice(0, s) + '    ' + dom.codeInput.value.slice(end);
      dom.codeInput.selectionStart = dom.codeInput.selectionEnd = s + 4;
      updateLineNumbers();
    }

    // Ctrl+Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      analyzeCode();
    }
  });

  // Buttons
  dom.btnAnalyze.addEventListener('click', analyzeCode);
  dom.btnClear.addEventListener('click', () => {
    dom.codeInput.value = '';
    updateLineNumbers();
    dom.outputArea.innerHTML = document.getElementById('empty-state')?.outerHTML || '';
    resetStats();
    dom.btnExport.disabled = true;
    state.lastResult = null;
    state.lastTokens = null;
    dom.outputArea.innerHTML = `
      <div class="empty-state" id="empty-state">
        <div class="empty-icon">⚡</div>
        <p class="empty-title">Siap menganalisis!</p>
        <p class="empty-sub">Masukkan kode program lalu tekan <strong>Analisis Token</strong></p>
      </div>`;
  });
  dom.btnExport.addEventListener('click', exportResults);

  // View toggle
  [dom.viewGrouped, dom.viewTable, dom.viewInline].forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentView = btn.dataset.view;
      [dom.viewGrouped, dom.viewTable, dom.viewInline].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (state.lastResult) {
        renderOutput(state.lastResult.groups);
      }
    });
  });

  // Example chips
  document.querySelectorAll('.example-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const key  = chip.dataset.example;
      const code = EXAMPLES[key];
      if (!code) return;

      // Set language selector to match
      const langMap = { c_basic: 'c', c_math: 'c', python_basic: 'python', java_basic: 'java' };
      if (langMap[key]) dom.langSelect.value = langMap[key];

      dom.codeInput.value = code;
      updateLineNumbers();
    });
  });

  // Language change: clear output
  dom.langSelect.addEventListener('change', () => {
    // Keep code but re-analyze if there's output
    if (state.lastResult) analyzeCode();
  });
}

function resetStats() {
  [dom.statTotal, dom.statReserved, dom.statSymbol, dom.statVariable, dom.statMath].forEach(el => {
    el.textContent = '—';
  });
}

/* ─── Init ──────────────────────────────────────────────────── */
function init() {
  updateLineNumbers();
  setupEvents();

  // Load example on start
  dom.codeInput.value = EXAMPLES.c_basic;
  dom.langSelect.value = 'c';
  updateLineNumbers();
}

document.addEventListener('DOMContentLoaded', init);
