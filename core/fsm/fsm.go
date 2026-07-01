package fsm

import "fmt"

// ── State definitions ─────────────────────────────────────────

// State represents a state in the FSM.
type State string

const (
	StateS State = "S" // Start state
	StateA State = "A" // Read a single '0'; waiting for next
	StateB State = "B" // Accepting — last char was '1', no "00" seen
	StateC State = "C" // Trap — substring "00" has been seen
)

// ── Transition table ──────────────────────────────────────────
//
// Language: L = { x ∈ (0+1)⁺ | last char of x is '1' AND x has no "00" }
//
// | State | '0' | '1' | Accepting? |
// |-------|-----|-----|-----------|
// | S     |  A  |  B  |     ✗     |
// | A     |  C  |  B  |     ✗     |
// | B     |  A  |  B  |     ✓     |
// | C     |  C  |  C  |     ✗     |

var transition = map[State]map[rune]State{
	StateS: {'0': StateA, '1': StateB},
	StateA: {'0': StateC, '1': StateB},
	StateB: {'0': StateA, '1': StateB},
	StateC: {'0': StateC, '1': StateC},
}

// accepting states
var accepting = map[State]bool{
	StateB: true,
}

// ── Types ─────────────────────────────────────────────────────

// Step records a single transition in the FSM trace.
type Step struct {
	CurrentState State  `json:"current_state"`
	Input        string `json:"input"`        // the character read ("0" or "1")
	NextState    State  `json:"next_state"`
	IsAccepting  bool   `json:"is_accepting"` // is next_state an accepting state?
}

// CheckRequest is the JSON body from the frontend.
type CheckRequest struct {
	Input string `json:"input"`
}

// CheckResponse is the JSON body returned to the frontend.
type CheckResponse struct {
	Input      string `json:"input"`
	Accepted   bool   `json:"accepted"`
	FinalState State  `json:"final_state"`
	Steps      []Step `json:"steps"`
	Reason     string `json:"reason"`
}

// ── FSM runner ────────────────────────────────────────────────

// Check runs the FSM on the given input string and returns a full trace.
func Check(input string) CheckResponse {
	// Validate: only '0' and '1' allowed
	for _, ch := range input {
		if ch != '0' && ch != '1' {
			return CheckResponse{
				Input:      input,
				Accepted:   false,
				FinalState: StateS,
				Steps:      []Step{},
				Reason:     fmt.Sprintf("Input tidak valid: karakter '%c' bukan anggota alfabet {0, 1}", ch),
			}
		}
	}

	// Empty string is not in L (L requires x ∈ (0+1)⁺, at least 1 char)
	if len(input) == 0 {
		return CheckResponse{
			Input:      input,
			Accepted:   false,
			FinalState: StateS,
			Steps:      []Step{},
			Reason:     "String kosong tidak termasuk bahasa L (L ⊆ (0+1)⁺, minimal 1 karakter)",
		}
	}

	current := StateS
	steps := make([]Step, 0, len(input))

	for _, ch := range input {
		next, ok := transition[current][ch]
		if !ok {
			// Should not happen for valid '0'/'1' input, but handle defensively
			next = StateC
		}
		steps = append(steps, Step{
			CurrentState: current,
			Input:        string(ch),
			NextState:    next,
			IsAccepting:  accepting[next],
		})
		current = next
	}

	accepted := accepting[current]

	// Build a human-readable reason
	reason := buildReason(input, current, accepted)

	return CheckResponse{
		Input:      input,
		Accepted:   accepted,
		FinalState: current,
		Steps:      steps,
		Reason:     reason,
	}
}

// buildReason explains why the string is accepted or rejected.
func buildReason(input string, final State, accepted bool) string {
	if accepted {
		return fmt.Sprintf(
			"String \"%s\" DITERIMA ✓ — karakter terakhir adalah '1' dan tidak mengandung substring \"00\"",
			input,
		)
	}

	switch final {
	case StateC:
		// Find where "00" appears
		for i := 0; i < len(input)-1; i++ {
			if input[i] == '0' && input[i+1] == '0' {
				return fmt.Sprintf(
					"String \"%s\" DITOLAK ✗ — ditemukan substring \"00\" pada posisi %d-%d",
					input, i+1, i+2,
				)
			}
		}
		return fmt.Sprintf("String \"%s\" DITOLAK ✗ — mengandung substring \"00\"", input)
	case StateA:
		return fmt.Sprintf(
			"String \"%s\" DITOLAK ✗ — karakter terakhir adalah '0' (harus '1')",
			input,
		)
	case StateS:
		return fmt.Sprintf("String \"%s\" DITOLAK ✗ — string kosong tidak termasuk bahasa L", input)
	default:
		return fmt.Sprintf("String \"%s\" DITOLAK ✗ — tidak memenuhi syarat bahasa L", input)
	}
}
