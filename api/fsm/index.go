package fsm

import (
	"encoding/json"
	"io"
	"net/http"

	"otomatalab/core/fsm"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req fsm.CheckRequest
	body, err := io.ReadAll(r.Body)
	if err != nil || json.Unmarshal(body, &req) != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	result := fsm.Check(req.Input)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}
