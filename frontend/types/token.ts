// Token types mirror backend/lexer/token.go
export type TokenType =
  | "reserved"
  | "symbol"
  | "variable"
  | "math"
  | "number"
  | "string"
  | "comment"
  | "unknown";

export interface Token {
  value: string;
  type: TokenType;
  line: number;
}

export interface Stats {
  total: number;
  reserved: number;
  symbol: number;
  variable: number;
  math: number;
  number: number;
  string: number;
  comment: number;
}

export interface AnalyzeRequest {
  code: string;
  lang: string;
}

export interface AnalyzeResponse {
  tokens: Token[];
  groups: Record<TokenType, Token[]>;
  errors: string[];
  stats: Stats;
}
