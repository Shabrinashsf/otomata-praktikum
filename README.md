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
```
Buka browser di: **http://localhost:3000** (Next.js Dev Server)

*(Jika Anda tidak punya `make`, Anda bisa membuka 2 terminal terpisah: terminal 1 jalankan `cd frontend && npm run dev`, terminal 2 jalankan `cd backend && go run main.go`)*.

### Opsi 2: Build & Jalankan Production Binary (Single Exe)
Langkah ini akan mem- *build* frontend Anda menjadi statik, meletakkannya di backend, lalu mengkompilasi Go menjadi sebuah file `.exe`.

1. **Jalankan perintah Build:**
   ```bash
   make build
   ```
   *Note: Ini akan memakan waktu sejenak karena sistem perlu menjalankan `npm run build` dan `go build`.*

2. **Jalankan Aplikasi:**
   Setelah selesai, file bernama `otomatalab.exe` (atau *executable* sejenis sesuai OS Anda) akan muncul di folder utama proyek. Cukup jalankan:
   ```bash
   ./otomatalab.exe
   ```

3. **Buka Aplikasi:**
   Buka browser Anda dan kunjungi **http://localhost:8888**.

---

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
