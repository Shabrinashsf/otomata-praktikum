package analyze

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"otomatalab/core/lexer"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req lexer.AnalyzeRequest
	body, err := io.ReadAll(r.Body)
	if err != nil || json.Unmarshal(body, &req) != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Code) == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Field 'code' tidak boleh kosong",
		})
		return
	}

	l := lexer.NewLexer(req.Code, req.Lang)
	tokens, errors := l.Tokenize()
	groups := lexer.GroupTokens(tokens)
	stats := lexer.BuildStats(groups)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lexer.AnalyzeResponse{
		Tokens: tokens,
		Groups: groups,
		Errors: errors,
		Stats:  stats,
	})
}
