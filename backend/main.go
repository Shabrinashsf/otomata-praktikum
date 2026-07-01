package main

import (
	"embed"
	"encoding/json"
	"io"
	"io/fs"
	"log"
	"net/http"
	"strings"

	"otomatalab/fsm"
	"otomatalab/lexer"
	"otomatalab/pda"
)

// static/ is populated by the Makefile: cp frontend/out → backend/static
// before running go build.

//go:embed all:static
var frontendFS embed.FS

// ── Middleware ────────────────────────────────────────────────

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func jsonResponse(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("json encode error: %v", err)
	}
}

func decodeBody(r *http.Request, v any) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	return json.Unmarshal(body, v)
}

// ── Handlers ─────────────────────────────────────────────────

// POST /api/analyze — Lexical Analyzer (Praktikum 1)
func analyzeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req lexer.AnalyzeRequest
	if err := decodeBody(r, &req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Code) == "" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{
			"error": "Field 'code' tidak boleh kosong",
		})
		return
	}

	l := lexer.NewLexer(req.Code, req.Lang)
	tokens, errors := l.Tokenize()
	groups := lexer.GroupTokens(tokens)
	stats := lexer.BuildStats(groups)

	jsonResponse(w, http.StatusOK, lexer.AnalyzeResponse{
		Tokens: tokens,
		Groups: groups,
		Errors: errors,
		Stats:  stats,
	})
}

// POST /api/fsm — FSM String Checker (Praktikum 2)
func fsmHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req fsm.CheckRequest
	if err := decodeBody(r, &req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	result := fsm.Check(req.Input)
	jsonResponse(w, http.StatusOK, result)
}

// POST /api/pda — PDA Simulator (Praktikum 3)
func pdaHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req pda.CheckRequest
	if err := decodeBody(r, &req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	result := pda.Check(req.Input, req.Language)
	jsonResponse(w, http.StatusOK, result)
}

// GET /api/health — health check
func healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, http.StatusOK, map[string]string{
		"status":  "ok",
		"service": "OtomataLab API",
		"version": "1.0.0",
	})
}

// ── Static file server ────────────────────────────────────────

func staticHandler(stripped fs.FS) http.HandlerFunc {
	fileServer := http.FileServer(http.FS(stripped))
	return func(w http.ResponseWriter, r *http.Request) {
		// Try to serve the file; if not found, serve index.html (SPA fallback)
		path := r.URL.Path
		if path == "/" {
			path = "/index.html"
		}
		// Check if file exists in embedded FS
		if _, err := fs.Stat(stripped, strings.TrimPrefix(path, "/")); err != nil {
			// Serve index.html for client-side routing
			f, err2 := stripped.Open("index.html")
			if err2 != nil {
				http.NotFound(w, r)
				return
			}
			defer f.Close()
			info, _ := f.Stat()
			http.ServeContent(w, r, "index.html", info.ModTime(), f.(io.ReadSeeker))
			return
		}
		fileServer.ServeHTTP(w, r)
	}
}

// ── Main ──────────────────────────────────────────────────────

func main() {
	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("/api/analyze", corsMiddleware(analyzeHandler))
	mux.HandleFunc("/api/fsm", corsMiddleware(fsmHandler))
	mux.HandleFunc("/api/pda", corsMiddleware(pdaHandler))
	mux.HandleFunc("/api/health", corsMiddleware(healthHandler))

	// Serve embedded Next.js static files.
	// The embed path is "../frontend/out" which Go stores verbatim
	// (dots and slashes are normalized), so we sub on that path.
	stripped, err := fs.Sub(frontendFS, "static")
	if err != nil {
		log.Fatalf("failed to sub embedded FS: %v", err)
	}
	mux.HandleFunc("/", staticHandler(stripped))

	addr := ":8888"
	log.Printf("🚀 OtomataLab server running on http://localhost%s", addr)
	log.Printf("   Praktikum 1 (Lexer) : http://localhost%s/praktikum-1", addr)
	log.Printf("   Praktikum 2 (FSM)   : http://localhost%s/praktikum-2", addr)
	log.Printf("   Praktikum 3 (PDA)   : http://localhost%s/praktikum-3", addr)
	log.Printf("   API Health          : http://localhost%s/api/health", addr)

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
