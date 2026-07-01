# OtomataLab — Simulator Teori Otomata

OtomataLab adalah aplikasi *monorepo* (gabungan *Frontend* Next.js dan *Backend* Go) yang dibangun untuk menyelesaikan tugas praktikum mata kuliah Teori Otomata. Aplikasi ini mensimulasikan berbagai jenis mesin otomata, dari penganalisis leksikal sederhana hingga *Pushdown Automaton* dengan penyimpanan *stack*.

Proyek ini terkompilasi menjadi satu file **single binary executable**, berkat fitur `//go:embed` yang menyematkan hasil *build static* dari Next.js langsung ke dalam *backend* Go HTTP server.

<img width="1920" height="1583" alt="image" src="https://github.com/user-attachments/assets/4e888211-5e12-4ccc-9206-f1329c89ed05" />


## 🚀 Fitur Utama

Aplikasi ini mencakup 3 modul praktikum utama:

1. **Praktikum 1 — Lexical Analyzer (DFA)**
   Sebuah *tokenizer* pintar berbasis mesin *Deterministic Finite Automaton*. Modul ini dapat membaca baris kode sumber dari pengguna dan secara otomatis memecah serta mengkategorikannya menjadi token, seperti *Reserve words*, Simbol/Tanda baca, Variabel, dan Ekspresi Matematika.

2. **Praktikum 2 — FSM Simulator**
   Sebuah *Finite State Machine* yang akan menguji string berbasis biner (0 dan 1). Mesin secara otomatis menerima atau menolak input string berdasarkan aturan (*rule*): *"Karakter terakhir harus 1, dan tidak boleh mengandung substring 00"*. Dilengkapi dengan animasi *glow state diagram* interaktif!

3. **Praktikum 3 — Pushdown Automaton (PDA)**
   Mesin PDA untuk mengevaluasi *Context-Free Grammar* (CFG). Pengguna dapat menguji *string* berdasarkan 3 *preset* klasik:
   - **Balanced Brackets:** Cek apakah tumpukan kurung `( [ { } ] )` seimbang.
   - **a^n b^n:** String berurutan di mana jumlah karakter *a* sama dengan karakter *b*.
   - **Palindrome w c w^R:** Memeriksa simetri *string* biner di sekitar titik pusat `c`.
   Modul ini memvisualisasikan bagaimana sebuah *Stack* (Tumpukan) memori bekerja dalam arsitektur LIFO (Last-In First-Out) dengan *Trace* langkah yang interaktif.

---

## 🛠 Teknologi yang Digunakan

* **Backend:** Go (Golang) — *Fast & Lightweight Engine, HTTP Web Server*
* **Frontend:** Next.js (React, TypeScript) — *App Router, Static Export*
* **Styling:** CSS Modules — *Desain Dark Mode yang minimalis dan premium*
* **Kompilasi:** Makefile & Embedded Filesystem (`//go:embed`)

---

## 💻 Cara Menjalankan secara Lokal

Aplikasi sudah disiapkan agar sangat mudah untuk di- *build* dan dijalankan.
Pastikan perangkat Anda sudah terinstal **Go**, **Node.js (NPM)**, dan **Make** (opsional, jika di Windows bisa menggunakan MinGW32-make atau jalankan perintah secara manual).

### Opsi 1: Menjalankan dalam Mode Development (Dev Mode)
Mode ini direkomendasikan jika Anda ingin melihat dan mengubah kode. Server Go dan server Next.js akan menyala bersamaan.

```bash
# Menjalankan frontend dan backend secara paralel
make dev
## Cara Menjalankan di Lokal (Vercel Native)

Karena proyek ini sekarang menggunakan arsitektur **Vercel Serverless Functions**, pastikan Anda memiliki **Vercel CLI** terinstal (`npm i -g vercel`).

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Development Server:**
   ```bash
   vercel dev
   # Atau bisa dengan make dev
   ```

3. **Buka Aplikasi:**
   Buka browser Anda dan kunjungi **http://localhost:3000** (atau sesuai port yang diberikan oleh Vercel). Vercel akan secara otomatis menghubungkan frontend Next.js dengan fungsi Go di dalam folder `/api/`.

## Deployment ke Vercel

Cukup hubungkan repositori GitHub Anda ke Vercel Dashboard, dan Vercel akan otomatis mengenali proyek ini sebagai aplikasi Next.js dengan API Go Serverless. Tidak perlu konfigurasi tambahan!

## 📁 Struktur Direktori

```text
otomata-praktikum/
│
├── backend/                  # Kode Engine (Go)
│   ├── fsm/                  # Mesin State Praktikum 2
│   ├── lexer/                # Tokenizer Praktikum 1
│   ├── pda/                  # Mesin PDA Praktikum 3
│   └── main.go               # Server HTTP & Embedded Routing
│
├── frontend/                 # UI (Next.js & TypeScript)
│   ├── app/                  # Route Pages (Landing, Praktikum 1-3)
│   ├── components/           # Komponen UI (React)
│   ├── lib/                  # Fungsi API Fetcher
│   └── types/                # Definisi Tipe (Interfaces)
│
├── Makefile                  # Skrip otomatisasi (Build, Dev, Clean)
└── README.md                 # Dokumentasi Global (File ini)
```

> **Catatan Akademik:** Proyek ini dikerjakan khusus untuk memenuhi kriteria penilaian Praktikum mata kuliah Teori Otomata. Dilarang melakukan plagiasi utuh *(copy-paste)* terhadap algoritma maupun desain untuk mematuhi integritas penilaian.
