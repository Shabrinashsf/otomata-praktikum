package lexer

// TokenType represents the category of a lexical token.
type TokenType string

const (
	RESERVED TokenType = "reserved"
	SYMBOL   TokenType = "symbol"
	VARIABLE TokenType = "variable"
	MATH     TokenType = "math"
	NUMBER   TokenType = "number"
	STRING   TokenType = "string"
	COMMENT  TokenType = "comment"
	UNKNOWN  TokenType = "unknown"
)

// Token is a single lexical unit extracted from source code.
type Token struct {
	Value string    `json:"value"`
	Type  TokenType `json:"type"`
	Line  int       `json:"line"`
}

// AnalyzeRequest is the JSON body received from the frontend.
type AnalyzeRequest struct {
	Code string `json:"code"`
	Lang string `json:"lang"`
}

// AnalyzeResponse is the JSON response sent to the frontend.
type AnalyzeResponse struct {
	Tokens []Token            `json:"tokens"`
	Groups map[string][]Token `json:"groups"`
	Errors []string           `json:"errors"`
	Stats  Stats              `json:"stats"`
}

// Stats holds token count per category.
type Stats struct {
	Total    int `json:"total"`
	Reserved int `json:"reserved"`
	Symbol   int `json:"symbol"`
	Variable int `json:"variable"`
	Math     int `json:"math"`
	Number   int `json:"number"`
	String   int `json:"string"`
	Comment  int `json:"comment"`
}
