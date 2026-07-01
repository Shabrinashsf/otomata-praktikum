package pda

import (
	"fmt"
	"strings"
)

type State string

const (
	StateStart  State = "q_start"
	StateRead   State = "q_read"
	StateMatch  State = "q_match"
	StateAccept State = "q_accept"
	StateReject State = "q_reject"
)

// Step records a single transition in the PDA trace.
type Step struct {
	CurrentState State    `json:"current_state"`
	Input        string   `json:"input"`
	TopStack     string   `json:"top_stack"`
	Action       string   `json:"action"` // e.g., "PUSH X", "POP X", "REJECT"
	NextState    State    `json:"next_state"`
	StackAfter   []string `json:"stack_after"`
}

type CheckRequest struct {
	Input    string `json:"input"`
	Language string `json:"language"` // "brackets", "anbn", "palindrome"
}

type CheckResponse struct {
	Input      string `json:"input"`
	Language   string `json:"language"`
	Accepted   bool   `json:"accepted"`
	FinalState State  `json:"final_state"`
	Steps      []Step `json:"steps"`
	Reason     string `json:"reason"`
}

// ── Runner ───────────────────────────────────────────────────

func Check(input, lang string) CheckResponse {
	// Initialize stack with initial symbol Z0
	stack := []string{"Z0"}
	steps := []Step{}

	var runner func(string) (bool, State, string)

	switch lang {
	case "brackets":
		runner = func(in string) (bool, State, string) {
			return runBrackets(in, &stack, &steps)
		}
	case "anbn":
		runner = func(in string) (bool, State, string) {
			return runAnBn(in, &stack, &steps)
		}
	case "palindrome":
		runner = func(in string) (bool, State, string) {
			return runPalindrome(in, &stack, &steps)
		}
	default:
		return CheckResponse{
			Input: input, Language: lang, Accepted: false,
			FinalState: StateReject, Steps: []Step{},
			Reason: fmt.Sprintf("Bahasa '%s' tidak didukung", lang),
		}
	}

	// S push Z0 is implicit as start state
	steps = append(steps, Step{
		CurrentState: StateStart,
		Input:        "ε",
		TopStack:     "ε",
		Action:       "PUSH Z0",
		NextState:    StateRead,
		StackAfter:   cloneStack(stack),
	})

	accepted, finalState, reason := runner(input)

	return CheckResponse{
		Input:      input,
		Language:   lang,
		Accepted:   accepted,
		FinalState: finalState,
		Steps:      steps,
		Reason:     reason,
	}
}

// ── Handlers for each language ───────────────────────────────

// 1. Balanced Brackets ((), [], {})
func runBrackets(in string, stack *[]string, steps *[]Step) (bool, State, string) {
	current := StateRead
	pairs := map[rune]string{
		')': "(", ']': "[", '}': "{",
	}
	openers := map[rune]bool{
		'(': true, '[': true, '{': true,
	}

	for _, ch := range in {
		charStr := string(ch)
		top := peek(stack)

		if openers[ch] {
			// Push
			*stack = append(*stack, charStr)
			addStep(steps, current, charStr, top, "PUSH "+charStr, current, *stack)
		} else if match, ok := pairs[ch]; ok {
			// Must pop matching opener
			if top == match {
				*stack = (*stack)[:len(*stack)-1] // pop
				addStep(steps, current, charStr, top, "POP "+top, current, *stack)
			} else {
				addStep(steps, current, charStr, top, "REJECT (Mismatch)", StateReject, *stack)
				return false, StateReject, fmt.Sprintf("Ditolak: Kurung tutup '%s' tidak cocok dengan stack top '%s'", charStr, top)
			}
		} else {
			addStep(steps, current, charStr, top, "REJECT (Invalid char)", StateReject, *stack)
			return false, StateReject, fmt.Sprintf("Ditolak: Karakter '%s' tidak valid", charStr)
		}
	}

	// End of string, check if stack only has Z0
	top := peek(stack)
	if top == "Z0" {
		addStep(steps, current, "ε", top, "POP Z0 (Accept)", StateAccept, []string{})
		return true, StateAccept, "Diterima: Semua kurung seimbang dan stack kosong."
	}
	addStep(steps, current, "ε", top, "REJECT (Stack not empty)", StateReject, *stack)
	return false, StateReject, "Ditolak: Masih ada kurung buka yang belum ditutup."
}

// 2. a^n b^n
func runAnBn(in string, stack *[]string, steps *[]Step) (bool, State, string) {
	current := StateRead
	hasSeenB := false

	for _, ch := range in {
		charStr := string(ch)
		top := peek(stack)

		if charStr == "a" {
			if hasSeenB {
				addStep(steps, current, charStr, top, "REJECT ('a' after 'b')", StateReject, *stack)
				return false, StateReject, "Ditolak: Karakter 'a' muncul setelah 'b'."
			}
			// Push 'A'
			*stack = append(*stack, "A")
			addStep(steps, current, charStr, top, "PUSH A", current, *stack)
		} else if charStr == "b" {
			if !hasSeenB {
				hasSeenB = true
				current = StateMatch
			}
			if top == "A" {
				// Pop 'A'
				*stack = (*stack)[:len(*stack)-1]
				addStep(steps, current, charStr, top, "POP A", current, *stack)
			} else {
				addStep(steps, current, charStr, top, "REJECT (Too many b's)", StateReject, *stack)
				return false, StateReject, "Ditolak: Jumlah 'b' lebih banyak dari 'a'."
			}
		} else {
			addStep(steps, current, charStr, top, "REJECT (Invalid char)", StateReject, *stack)
			return false, StateReject, fmt.Sprintf("Ditolak: Karakter '%s' tidak valid (harus 'a' atau 'b')", charStr)
		}
	}

	// Check if only Z0 remains
	top := peek(stack)
	if top == "Z0" {
		addStep(steps, current, "ε", top, "POP Z0 (Accept)", StateAccept, []string{})
		return true, StateAccept, "Diterima: String memiliki pola a^n b^n yang valid."
	}
	addStep(steps, current, "ε", top, "REJECT (Too many a's)", StateReject, *stack)
	return false, StateReject, "Ditolak: Jumlah 'a' lebih banyak dari 'b'."
}

// 3. Palindrome (w c w^R), w in {0,1}*
func runPalindrome(in string, stack *[]string, steps *[]Step) (bool, State, string) {
	current := StateRead
	seenCenter := false

	// If it doesn't contain 'c', reject early to provide a clear error message
	if !strings.Contains(in, "c") {
		return false, StateReject, "Ditolak: Palindrome khusus ini memerlukan karakter pusat 'c' (misal: 10c01)."
	}
	if strings.Count(in, "c") > 1 {
		return false, StateReject, "Ditolak: Karakter pusat 'c' tidak boleh lebih dari satu."
	}

	for _, ch := range in {
		charStr := string(ch)
		top := peek(stack)

		if charStr == "c" {
			seenCenter = true
			current = StateMatch
			addStep(steps, StateRead, charStr, top, "SKIP", current, *stack)
			continue
		}

		if charStr != "0" && charStr != "1" {
			addStep(steps, current, charStr, top, "REJECT (Invalid char)", StateReject, *stack)
			return false, StateReject, fmt.Sprintf("Ditolak: Karakter '%s' tidak valid (harus 0, 1, atau c)", charStr)
		}

		if !seenCenter {
			// Push
			*stack = append(*stack, charStr)
			addStep(steps, current, charStr, top, "PUSH "+charStr, current, *stack)
		} else {
			// Match and Pop
			if top == charStr {
				*stack = (*stack)[:len(*stack)-1]
				addStep(steps, current, charStr, top, "POP "+charStr, current, *stack)
			} else {
				addStep(steps, current, charStr, top, "REJECT (Mismatch)", StateReject, *stack)
				return false, StateReject, fmt.Sprintf("Ditolak: Karakter '%s' tidak cocok dengan cerminan stack '%s'.", charStr, top)
			}
		}
	}

	top := peek(stack)
	if top == "Z0" {
		addStep(steps, current, "ε", top, "POP Z0 (Accept)", StateAccept, []string{})
		return true, StateAccept, "Diterima: String adalah palindrome w c w^R yang valid."
	}
	addStep(steps, current, "ε", top, "REJECT (Stack not empty)", StateReject, *stack)
	return false, StateReject, "Ditolak: Bagian awal string lebih panjang dari bagian akhir."
}

// ── Utils ────────────────────────────────────────────────────

func peek(stack *[]string) string {
	if len(*stack) == 0 {
		return "ε" // Empty stack
	}
	return (*stack)[len(*stack)-1]
}

func cloneStack(stack []string) []string {
	cp := make([]string, len(stack))
	copy(cp, stack)
	return cp
}

func addStep(steps *[]Step, cur State, input, top, action string, next State, stack []string) {
	*steps = append(*steps, Step{
		CurrentState: cur,
		Input:        input,
		TopStack:     top,
		Action:       action,
		NextState:    next,
		StackAfter:   cloneStack(stack),
	})
}
