package lexer

import (
	"strings"
	"unicode"
)

// ── DFA States ────────────────────────────────────────────────
type state int

const (
	stStart       state = iota
	stIdentifier        // reading identifier or keyword
	stNumber            // reading integer part
	stFloat             // reading float fraction / exponent
	stStringDQ          // inside double-quoted string
	stStringSQ          // inside single-quoted string
	stCommentLine       // inside // or # line comment
	stCommentBlk        // inside /* block comment */
	stPreproc           // inside #directive (C only)
)

// ── Lexer ─────────────────────────────────────────────────────

// Lexer tokenizes source code using a DFA.
type Lexer struct {
	src  []rune
	pos  int
	line int
	lang *LangConfig

	tokens []Token
	errors []string
}

// NewLexer creates a Lexer for the given source and language key.
func NewLexer(src, langKey string) *Lexer {
	return &Lexer{
		src:  []rune(src),
		pos:  0,
		line: 1,
		lang: GetLang(langKey),
	}
}

// ── helpers ───────────────────────────────────────────────────

func (l *Lexer) peek(offset int) rune {
	i := l.pos + offset
	if i >= len(l.src) {
		return 0
	}
	return l.src[i]
}

func (l *Lexer) advance() rune {
	ch := l.src[l.pos]
	l.pos++
	if ch == '\n' {
		l.line++
	}
	return ch
}

func (l *Lexer) startsWith(s string) bool {
	runes := []rune(s)
	if l.pos+len(runes) > len(l.src) {
		return false
	}
	for i, r := range runes {
		if l.src[l.pos+i] != r {
			return false
		}
	}
	return true
}

func (l *Lexer) skipRunes(n int) {
	for i := 0; i < n; i++ {
		l.advance()
	}
}

func (l *Lexer) emit(value string, typ TokenType, line int) {
	if strings.TrimSpace(value) == "" {
		return
	}
	l.tokens = append(l.tokens, Token{Value: value, Type: typ, Line: line})
}

// classify decides the final type of an identifier-like token.
func (l *Lexer) classify(raw string) TokenType {
	if l.lang.Reserved[raw] {
		return RESERVED
	}
	if l.lang.MathOps[raw] {
		return MATH
	}
	if l.lang.Symbols[raw] {
		return SYMBOL
	}
	return VARIABLE
}

// ── Main DFA ──────────────────────────────────────────────────

// Tokenize runs the DFA and returns all tokens and any errors.
func (l *Lexer) Tokenize() ([]Token, []string) {
	src := l.src
	n := len(src)

	var (
		cur       state = stStart
		buf       []rune
		startLine int
	)

	flush := func() {
		if len(buf) == 0 {
			return
		}
		raw := string(buf)
		l.emit(raw, l.classify(raw), startLine)
		buf = buf[:0]
	}

	for l.pos <= n {
		ch := rune(0)
		if l.pos < n {
			ch = src[l.pos]
		}

		switch cur {

		// ── START ────────────────────────────────────────────
		case stStart:
			if l.pos >= n {
				goto done
			}

			// Whitespace
			if unicode.IsSpace(ch) {
				l.advance()
				continue
			}

			startLine = l.line

			// Block comment
			if l.lang.BlockOpen != "" && l.startsWith(l.lang.BlockOpen) {
				buf = append(buf, []rune(l.lang.BlockOpen)...)
				l.skipRunes(len([]rune(l.lang.BlockOpen)))
				cur = stCommentBlk
				continue
			}

			// Line comment
			if l.lang.LineComment != "" && l.startsWith(l.lang.LineComment) {
				buf = append(buf, []rune(l.lang.LineComment)...)
				l.skipRunes(len([]rune(l.lang.LineComment)))
				cur = stCommentLine
				continue
			}

			// Preprocessor directive (#include, etc.) — C only
			if l.lang.IsPreproc && ch == '#' {
				buf = append(buf, l.advance())
				cur = stPreproc
				continue
			}

			// String: double-quote
			if ch == '"' {
				buf = append(buf, l.advance())
				cur = stStringDQ
				continue
			}

			// String/char: single-quote
			if ch == '\'' {
				buf = append(buf, l.advance())
				cur = stStringSQ
				continue
			}

			// Identifier / keyword
			if unicode.IsLetter(ch) || ch == '_' || ch == '$' {
				buf = append(buf, l.advance())
				cur = stIdentifier
				continue
			}

			// Hex literal 0x...
			if ch == '0' && l.pos+1 < n && (src[l.pos+1] == 'x' || src[l.pos+1] == 'X') {
				buf = append(buf, l.advance(), l.advance()) // 0 x
				for l.pos < n && isHex(src[l.pos]) {
					buf = append(buf, l.advance())
				}
				l.emit(string(buf), NUMBER, startLine)
				buf = buf[:0]
				continue
			}

			// Numeric literal
			if unicode.IsDigit(ch) || (ch == '.' && l.pos+1 < n && unicode.IsDigit(src[l.pos+1])) {
				buf = append(buf, l.advance())
				cur = stNumber
				continue
			}

			// Multi-char operators (longest match first)
			if matched, op := l.matchMultiOp(); matched {
				if l.lang.MathOps[op] {
					l.emit(op, MATH, startLine)
				} else {
					l.emit(op, SYMBOL, startLine)
				}
				continue
			}

			// Single-char operator
			if isOperChar(ch) {
				op := string([]rune{l.advance()})
				if l.lang.MathOps[op] {
					l.emit(op, MATH, startLine)
				} else {
					l.emit(op, SYMBOL, startLine)
				}
				continue
			}

			// Symbol / punctuation
			sym := string([]rune{ch})
			if l.lang.Symbols[sym] || isPunct(ch) {
				l.emit(sym, SYMBOL, startLine)
				l.advance()
				continue
			}

			// Unknown character
			l.emit(sym, UNKNOWN, startLine)
			l.advance()

		// ── IDENTIFIER ───────────────────────────────────────
		case stIdentifier:
			if l.pos < n && (unicode.IsLetter(ch) || unicode.IsDigit(ch) || ch == '_' || ch == '$') {
				buf = append(buf, l.advance())
			} else {
				flush()
				cur = stStart
			}

		// ── NUMBER (integer part) ────────────────────────────
		case stNumber:
			if l.pos < n && unicode.IsDigit(ch) {
				buf = append(buf, l.advance())
			} else if ch == '.' && l.pos+1 < n && ch != '.' {
				buf = append(buf, l.advance())
				cur = stFloat
			} else if (ch == 'e' || ch == 'E') && l.pos+1 < n {
				buf = append(buf, l.advance())
				if l.pos < n && (src[l.pos] == '+' || src[l.pos] == '-') {
					buf = append(buf, l.advance())
				}
				cur = stFloat
			} else if l.pos < n && (ch == 'f' || ch == 'F' || ch == 'l' || ch == 'L' || ch == 'u' || ch == 'U') {
				buf = append(buf, l.advance())
				l.emit(string(buf), NUMBER, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				l.emit(string(buf), NUMBER, startLine)
				buf = buf[:0]
				cur = stStart
			}

		// ── FLOAT ────────────────────────────────────────────
		case stFloat:
			if l.pos < n && unicode.IsDigit(ch) {
				buf = append(buf, l.advance())
			} else if l.pos < n && (ch == 'f' || ch == 'F' || ch == 'l' || ch == 'L') {
				buf = append(buf, l.advance())
				l.emit(string(buf), NUMBER, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				l.emit(string(buf), NUMBER, startLine)
				buf = buf[:0]
				cur = stStart
			}

		// ── STRING (double-quote) ─────────────────────────────
		case stStringDQ:
			if l.pos >= n {
				l.errors = append(l.errors, formatErr(startLine, "String literal tidak ditutup"))
				l.emit(string(buf), STRING, startLine)
				buf = buf[:0]
				cur = stStart
			} else if ch == '\\' && l.pos+1 < n {
				buf = append(buf, l.advance(), l.advance()) // escape sequence
			} else if ch == '"' {
				buf = append(buf, l.advance())
				l.emit(string(buf), STRING, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				buf = append(buf, l.advance())
			}

		// ── STRING (single-quote) ─────────────────────────────
		case stStringSQ:
			if l.pos >= n {
				l.errors = append(l.errors, formatErr(startLine, "Char/string literal tidak ditutup"))
				l.emit(string(buf), STRING, startLine)
				buf = buf[:0]
				cur = stStart
			} else if ch == '\\' && l.pos+1 < n {
				buf = append(buf, l.advance(), l.advance())
			} else if ch == '\'' {
				buf = append(buf, l.advance())
				l.emit(string(buf), STRING, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				buf = append(buf, l.advance())
			}

		// ── LINE COMMENT ──────────────────────────────────────
		case stCommentLine:
			if l.pos >= n || ch == '\n' {
				l.emit(string(buf), COMMENT, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				buf = append(buf, l.advance())
			}

		// ── BLOCK COMMENT ─────────────────────────────────────
		case stCommentBlk:
			if l.pos >= n {
				l.errors = append(l.errors, formatErr(startLine, "Block comment tidak ditutup"))
				l.emit(string(buf), COMMENT, startLine)
				buf = buf[:0]
				cur = stStart
			} else if l.startsWith(l.lang.BlockClose) {
				buf = append(buf, []rune(l.lang.BlockClose)...)
				l.skipRunes(len([]rune(l.lang.BlockClose)))
				l.emit(string(buf), COMMENT, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				buf = append(buf, l.advance())
			}

		// ── PREPROCESSOR (#include …) ─────────────────────────
		case stPreproc:
			if l.pos >= n || ch == '\n' {
				raw := strings.TrimSpace(string(buf))
				l.emit(raw, RESERVED, startLine)
				buf = buf[:0]
				cur = stStart
			} else {
				buf = append(buf, l.advance())
			}
		}
	}

done:
	// Flush any remaining buffer
	if len(buf) > 0 {
		switch cur {
		case stIdentifier, stPreproc:
			flush()
		case stNumber, stFloat:
			l.emit(string(buf), NUMBER, startLine)
		case stStringDQ, stStringSQ:
			l.emit(string(buf), STRING, startLine)
		case stCommentLine, stCommentBlk:
			l.emit(string(buf), COMMENT, startLine)
		}
	}

	return l.tokens, l.errors
}

// matchMultiOp tries to match a multi-character operator at the current pos.
func (l *Lexer) matchMultiOp() (bool, string) {
	candidates := []string{
		">>>=", "**=", "//=", "<<=", ">>=",
		"===", "!==", ">>>",
		"**", "//", "==", "!=", "<=", ">=",
		"&&", "||", "++", "--",
		"+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
		"<<", ">>", "->", "...",
	}
	for _, op := range candidates {
		if l.startsWith(op) {
			l.skipRunes(len([]rune(op)))
			return true, op
		}
	}
	return false, ""
}

// ── Grouping ──────────────────────────────────────────────────

// GroupTokens groups tokens by type and marks math-adjacent tokens.
func GroupTokens(tokens []Token) map[string][]Token {
	groups := map[string][]Token{
		string(RESERVED): {},
		string(SYMBOL):   {},
		string(VARIABLE): {},
		string(MATH):     {},
		string(NUMBER):   {},
		string(STRING):   {},
		string(COMMENT):  {},
		string(UNKNOWN):  {},
	}

	// Mark indices adjacent to MATH operators
	mathAdj := make(map[int]bool)
	for i, t := range tokens {
		if t.Type == MATH {
			if i > 0 && (tokens[i-1].Type == VARIABLE || tokens[i-1].Type == NUMBER) {
				mathAdj[i-1] = true
			}
			if i < len(tokens)-1 && (tokens[i+1].Type == VARIABLE || tokens[i+1].Type == NUMBER) {
				mathAdj[i+1] = true
			}
			mathAdj[i] = true
		}
	}

	for i, t := range tokens {
		eff := t.Type
		if mathAdj[i] && eff != MATH {
			eff = MATH
		}
		t.Type = eff
		key := string(eff)
		if _, ok := groups[key]; !ok {
			groups[key] = []Token{}
		}
		groups[key] = append(groups[key], t)
	}
	return groups
}

// BuildStats counts tokens per category.
func BuildStats(groups map[string][]Token) Stats {
	total := 0
	for _, g := range groups {
		total += len(g)
	}
	return Stats{
		Total:    total,
		Reserved: len(groups[string(RESERVED)]),
		Symbol:   len(groups[string(SYMBOL)]),
		Variable: len(groups[string(VARIABLE)]),
		Math:     len(groups[string(MATH)]),
		Number:   len(groups[string(NUMBER)]),
		String:   len(groups[string(STRING)]),
		Comment:  len(groups[string(COMMENT)]),
	}
}

// ── Character helpers ─────────────────────────────────────────

func isHex(r rune) bool {
	return (r >= '0' && r <= '9') ||
		(r >= 'a' && r <= 'f') ||
		(r >= 'A' && r <= 'F')
}

func isOperChar(r rune) bool {
	return strings.ContainsRune("+-*/%=!<>&|^~", r)
}

func isPunct(r rune) bool {
	return strings.ContainsRune("(){}[];,.:?@\\#'", r)
}

func formatErr(line int, msg string) string {
	return "Baris " + itoa(line) + ": " + msg
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	s := ""
	for n > 0 {
		s = string(rune('0'+n%10)) + s
		n /= 10
	}
	return s
}
