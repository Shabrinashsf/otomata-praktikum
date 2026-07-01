/**
 * LexiScan — Lexical Analyzer Core
 * =========================================
 * Implements a Deterministic Finite Automaton (DFA)-based lexer
 * that tokenizes source code into categories:
 *   a. Reserved Words
 *   b. Symbols & Punctuation
 *   c. Variables / Identifiers
 *   d. Mathematical Expressions / Operators
 *   + Bonus: Literals (numbers, strings, chars), Comments
 *
 * Supports: C, C++, Java, Python (configurable)
 */

'use strict';

/* ─── Token Types ───────────────────────────────────────────── */
const TOKEN_TYPE = Object.freeze({
  RESERVED:  'reserved',   // a. Reserved words / keywords
  SYMBOL:    'symbol',     // b. Symbols & punctuation
  VARIABLE:  'variable',   // c. Variable / identifier
  MATH:      'math',       // d. Math operators & expressions
  NUMBER:    'number',     // Numeric literals
  STRING:    'string',     // String / char literals
  COMMENT:   'comment',    // Comments
  UNKNOWN:   'unknown',    // Unrecognized
});

/* ─── Language Configurations ───────────────────────────────── */
const LANG_CONFIGS = {
  c: {
    name: 'C / C++',
    reserved: new Set([
      'auto','break','case','char','const','continue','default','do',
      'double','else','enum','extern','float','for','goto','if','inline',
      'int','long','register','restrict','return','short','signed','sizeof',
      'static','struct','switch','typedef','union','unsigned','void',
      'volatile','while','_Bool','_Complex','_Imaginary',
      // C++ additions
      'and','and_eq','asm','bitand','bitor','bool','catch','class',
      'compl','const_cast','delete','dynamic_cast','explicit','export',
      'false','friend','mutable','namespace','new','not','not_eq','nullptr',
      'operator','or','or_eq','private','protected','public','reinterpret_cast',
      'static_assert','static_cast','template','this','throw','true','try',
      'typeid','typename','using','virtual','wchar_t','xor','xor_eq',
      // Common macros/functions treated as keywords
      'printf','scanf','malloc','free','NULL','main','#include','#define',
      '#ifdef','#ifndef','#endif','#if','#else','#elif','#pragma',
    ]),
    mathOps: new Set(['+','-','*','/','%','**','=','==','!=','<','>','<=','>=',
                      '&&','||','!','&','|','^','~','<<','>>','++','--',
                      '+=','-=','*=','/=','%=','&=','|=','^=','<<=','>>=']),
    symbols: new Set(['(',')','{','}','[',']',';',',','.',':','?','#','\\',"'"]),
    stringDelimiters: ['"', "'"],
    lineComment: '//',
    blockComment: { open: '/*', close: '*/' },
  },
  python: {
    name: 'Python',
    reserved: new Set([
      'False','None','True','and','as','assert','async','await',
      'break','class','continue','def','del','elif','else','except',
      'finally','for','from','global','if','import','in','is','lambda',
      'nonlocal','not','or','pass','raise','return','try','while','with',
      'yield','print','input','range','len','type','int','float','str',
      'list','dict','tuple','set','bool','open','super','self','__init__',
      '__main__','__name__','append','extend','pop','remove','format',
    ]),
    mathOps: new Set(['+','-','*','/','//','%','**','=','==','!=','<','>','<=','>=',
                      'and','or','not','&','|','^','~','<<','>>',
                      '+=','-=','*=','/=','//=','%=','**=','&=','|=','^=','<<=','>>=']),
    symbols: new Set(['(',')','{','}','[',']',':',',','.','#','@',"'"]),
    stringDelimiters: ['"', "'", '"""', "'''"],
    lineComment: '#',
    blockComment: null,
  },
  java: {
    name: 'Java',
    reserved: new Set([
      'abstract','assert','boolean','break','byte','case','catch','char',
      'class','const','continue','default','do','double','else','enum',
      'extends','final','finally','float','for','goto','if','implements',
      'import','instanceof','int','interface','long','native','new',
      'package','private','protected','public','return','short','static',
      'strictfp','super','switch','synchronized','this','throw','throws',
      'transient','try','void','volatile','while','true','false','null',
      'String','System','out','println','print','main','args','Scanner',
      'ArrayList','HashMap','List','Map','Override','SuppressWarnings',
    ]),
    mathOps: new Set(['+','-','*','/','%','=','==','!=','<','>','<=','>=',
                      '&&','||','!','&','|','^','~','<<','>>','>>>',
                      '++','--','+=','-=','*=','/=','%=','&=','|=','^=']),
    symbols: new Set(['(',')','{','}','[',']',';',',','.','?',':','@',"'"]),
    stringDelimiters: ['"', "'"],
    lineComment: '//',
    blockComment: { open: '/*', close: '*/' },
  },
  custom: {
    name: 'Kustom (Generik)',
    reserved: new Set([
      // merge of common keywords across languages
      'if','else','while','for','do','switch','case','break','continue',
      'return','true','false','null','void','int','float','double','char',
      'string','bool','class','function','def','var','let','const',
      'new','delete','import','export','try','catch','throw','and','or','not',
      'in','is','as','from','with','pass','None','True','False',
    ]),
    mathOps: new Set(['+','-','*','/','%','**','//','=','==','!=','<','>','<=','>=',
                      '&&','||','!','&','|','^','~','<<','>>',
                      '++','--','+=','-=','*=','/=','%=']),
    symbols: new Set(['(',')','{','}','[',']',';',',','.','?',':','#','@',"'"]),
    stringDelimiters: ['"', "'"],
    lineComment: '//',
    blockComment: { open: '/*', close: '*/' },
  },
};

/* ─── DFA States ────────────────────────────────────────────── */
const STATE = Object.freeze({
  START:          0,
  IN_IDENTIFIER:  1,
  IN_NUMBER:      2,
  IN_FLOAT:       3,
  IN_STRING_DQ:   4,  // double-quote string
  IN_STRING_SQ:   5,  // single-quote string
  IN_COMMENT_LINE:6,
  IN_COMMENT_BLCK:7,
  IN_OPERATOR:    8,
  IN_PREPROC:     9,  // preprocessor (#...)
  DONE:           10,
});

/* ─── Helper predicates (character classes) ─────────────────── */
const isAlpha     = c => /^[a-zA-Z_$]$/.test(c);
const isDigit     = c => /^[0-9]$/.test(c);
const isAlphaNum  = c => /^[a-zA-Z0-9_$]$/.test(c);
const isHexDigit  = c => /^[0-9a-fA-F]$/.test(c);
const isWhitespace= c => /^[ \t\r\n]$/.test(c);
const isOperChar  = c => /^[+\-*/%=!<>&|^~]$/.test(c);

/**
 * Core Lexer class.
 * Uses a hand-written DFA to scan source code character by character.
 */
class Lexer {
  /**
   * @param {string} source  - The source code to tokenize
   * @param {string} langKey - Language key (c|python|java|custom)
   */
  constructor(source, langKey = 'c') {
    this.source  = source;
    this.lang    = LANG_CONFIGS[langKey] || LANG_CONFIGS.c;
    this.langKey = langKey;
    this.pos     = 0;
    this.line    = 1;
    this.col     = 1;
    this.tokens  = [];
    this.errors  = [];
  }

  /* ── Character access helpers ─────────────────────────────── */
  peek(offset = 0) {
    return this.source[this.pos + offset] ?? '\0';
  }

  advance() {
    const ch = this.source[this.pos++];
    if (ch === '\n') { this.line++; this.col = 1; }
    else { this.col++; }
    return ch;
  }

  /* ── Emit a token ─────────────────────────────────────────── */
  emit(value, type, startLine) {
    this.tokens.push({ value, type, line: startLine, col: this.col });
  }

  /* ── Classify a finalized token ───────────────────────────── */
  classify(raw) {
    const { reserved, mathOps, symbols } = this.lang;
    if (reserved.has(raw))  return TOKEN_TYPE.RESERVED;
    if (symbols.has(raw))   return TOKEN_TYPE.SYMBOL;
    if (mathOps.has(raw))   return TOKEN_TYPE.MATH;
    return TOKEN_TYPE.VARIABLE;
  }

  /**
   * Main tokenization method.
   * Implements a DFA traversal over the source string.
   * @returns {{ tokens: Token[], errors: string[] }}
   */
  tokenize() {
    this.tokens = [];
    this.errors = [];
    const src   = this.source;
    const n     = src.length;
    let   state = STATE.START;
    let   buf   = '';
    let   startLine = 1;

    const flush = () => {
      if (!buf) return;
      const type = this.classify(buf);
      this.emit(buf, type, startLine);
      buf = '';
    };

    while (this.pos <= n) {
      const ch  = this.pos < n ? src[this.pos] : '\0';  // current char
      const ch2 = this.pos + 1 < n ? src[this.pos + 1] : '\0';  // lookahead

      switch (state) {
        /* ── START ──────────────────────────────────────────── */
        case STATE.START: {
          if (ch === '\0') break;

          // Whitespace: skip
          if (isWhitespace(ch)) { this.advance(); break; }

          startLine = this.line;

          // Line comment
          if (this.lang.lineComment && src.startsWith(this.lang.lineComment, this.pos)) {
            this.advance(); if (this.lang.lineComment.length > 1) this.advance();
            buf = this.lang.lineComment;
            state = STATE.IN_COMMENT_LINE;
            break;
          }

          // Block comment
          if (this.lang.blockComment && src.startsWith(this.lang.blockComment.open, this.pos)) {
            buf = this.lang.blockComment.open;
            this.advance(); this.advance();
            state = STATE.IN_COMMENT_BLCK;
            break;
          }

          // Preprocessor directive (#...)
          if (ch === '#' && this.langKey === 'c') {
            buf = '#';
            this.advance();
            state = STATE.IN_PREPROC;
            break;
          }

          // String literal (double-quote)
          if (ch === '"') {
            buf = '"';
            this.advance();
            state = STATE.IN_STRING_DQ;
            break;
          }

          // String/char literal (single-quote)
          if (ch === "'") {
            buf = "'";
            this.advance();
            state = STATE.IN_STRING_SQ;
            break;
          }

          // Identifier or keyword
          if (isAlpha(ch)) {
            buf = ch;
            this.advance();
            state = STATE.IN_IDENTIFIER;
            break;
          }

          // Hex literal (0x...)
          if (ch === '0' && (ch2 === 'x' || ch2 === 'X')) {
            buf = '0' + ch2;
            this.advance(); this.advance();
            while (this.pos < n && isHexDigit(src[this.pos])) buf += this.advance();
            this.emit(buf, TOKEN_TYPE.NUMBER, startLine);
            buf = '';
            break;
          }

          // Numeric literal
          if (isDigit(ch) || (ch === '.' && isDigit(ch2))) {
            buf = ch;
            this.advance();
            state = STATE.IN_NUMBER;
            break;
          }

          // Negative number after operator or start
          if (ch === '-' && isDigit(ch2) && this.tokens.length === 0) {
            buf = ch;
            this.advance();
            state = STATE.IN_NUMBER;
            break;
          }

          // Multi-char operators (try longest match first)
          const multiOps = ['>>>=','<<=','>>=','...','**=','//=',
                             '===','!==','>>>','<<=',
                             '**','//','==','!=','<=','>=','&&','||',
                             '++','--','+=','-=','*=','/=','%=','&=','|=','^=','<<','>>','->'
                            ];
          let matched = false;
          for (const op of multiOps) {
            if (src.startsWith(op, this.pos) && this.lang.mathOps.has(op)) {
              this.emit(op, TOKEN_TYPE.MATH, startLine);
              for (let i = 0; i < op.length; i++) this.advance();
              matched = true;
              break;
            }
          }
          if (matched) break;

          // Single-char operator
          if (isOperChar(ch)) {
            const op1 = ch;
            this.advance();
            if (this.lang.mathOps.has(op1)) {
              this.emit(op1, TOKEN_TYPE.MATH, startLine);
            } else {
              this.emit(op1, TOKEN_TYPE.SYMBOL, startLine);
            }
            break;
          }

          // Symbol / punctuation
          if (this.lang.symbols.has(ch) || /^[(){}[\];,.:?@\\]$/.test(ch)) {
            this.emit(ch, TOKEN_TYPE.SYMBOL, startLine);
            this.advance();
            break;
          }

          // Unknown character — emit as unknown but don't stop
          this.emit(ch, TOKEN_TYPE.UNKNOWN, startLine);
          this.advance();
          break;
        }

        /* ── IN_IDENTIFIER ──────────────────────────────────── */
        case STATE.IN_IDENTIFIER: {
          if (this.pos < n && isAlphaNum(ch)) {
            buf += this.advance();
          } else {
            flush();
            state = STATE.START;
          }
          break;
        }

        /* ── IN_NUMBER ──────────────────────────────────────── */
        case STATE.IN_NUMBER: {
          if (this.pos < n && isDigit(ch)) {
            buf += this.advance();
          } else if (ch === '.' && ch2 !== '.') {
            buf += this.advance();
            state = STATE.IN_FLOAT;
          } else if ((ch === 'e' || ch === 'E') && (isDigit(ch2) || ch2 === '+' || ch2 === '-')) {
            buf += this.advance();
            if (src[this.pos] === '+' || src[this.pos] === '-') buf += this.advance();
            state = STATE.IN_FLOAT;
          } else if ((ch === 'f' || ch === 'F' || ch === 'l' || ch === 'L' ||
                      ch === 'u' || ch === 'U') && this.pos < n) {
            buf += this.advance();
            this.emit(buf, TOKEN_TYPE.NUMBER, startLine);
            buf = ''; state = STATE.START;
          } else {
            this.emit(buf, TOKEN_TYPE.NUMBER, startLine);
            buf = ''; state = STATE.START;
          }
          break;
        }

        /* ── IN_FLOAT ───────────────────────────────────────── */
        case STATE.IN_FLOAT: {
          if (this.pos < n && isDigit(ch)) {
            buf += this.advance();
          } else if ((ch === 'f' || ch === 'F' || ch === 'l' || ch === 'L') && this.pos < n) {
            buf += this.advance();
            this.emit(buf, TOKEN_TYPE.NUMBER, startLine);
            buf = ''; state = STATE.START;
          } else {
            this.emit(buf, TOKEN_TYPE.NUMBER, startLine);
            buf = ''; state = STATE.START;
          }
          break;
        }

        /* ── IN_STRING_DQ ───────────────────────────────────── */
        case STATE.IN_STRING_DQ: {
          if (this.pos >= n) {
            this.errors.push(`Line ${startLine}: String literal tidak ditutup`);
            this.emit(buf, TOKEN_TYPE.STRING, startLine);
            buf = ''; state = STATE.START;
          } else if (ch === '\\') {
            buf += this.advance() + this.advance(); // escape sequence
          } else if (ch === '"') {
            buf += this.advance();
            this.emit(buf, TOKEN_TYPE.STRING, startLine);
            buf = ''; state = STATE.START;
          } else {
            buf += this.advance();
          }
          break;
        }

        /* ── IN_STRING_SQ ───────────────────────────────────── */
        case STATE.IN_STRING_SQ: {
          if (this.pos >= n) {
            this.errors.push(`Line ${startLine}: Char/string literal tidak ditutup`);
            this.emit(buf, TOKEN_TYPE.STRING, startLine);
            buf = ''; state = STATE.START;
          } else if (ch === '\\') {
            buf += this.advance() + this.advance();
          } else if (ch === "'") {
            buf += this.advance();
            this.emit(buf, TOKEN_TYPE.STRING, startLine);
            buf = ''; state = STATE.START;
          } else {
            buf += this.advance();
          }
          break;
        }

        /* ── IN_COMMENT_LINE ────────────────────────────────── */
        case STATE.IN_COMMENT_LINE: {
          if (this.pos >= n || ch === '\n') {
            this.emit(buf, TOKEN_TYPE.COMMENT, startLine);
            buf = ''; state = STATE.START;
          } else {
            buf += this.advance();
          }
          break;
        }

        /* ── IN_COMMENT_BLCK ────────────────────────────────── */
        case STATE.IN_COMMENT_BLCK: {
          if (this.pos >= n) {
            this.errors.push(`Line ${startLine}: Komentar blok tidak ditutup`);
            this.emit(buf, TOKEN_TYPE.COMMENT, startLine);
            buf = ''; state = STATE.START;
          } else if (src.startsWith(this.lang.blockComment.close, this.pos)) {
            buf += this.lang.blockComment.close;
            this.advance(); this.advance();
            this.emit(buf, TOKEN_TYPE.COMMENT, startLine);
            buf = ''; state = STATE.START;
          } else {
            buf += this.advance();
          }
          break;
        }

        /* ── IN_PREPROC ─────────────────────────────────────── */
        case STATE.IN_PREPROC: {
          if (this.pos >= n || ch === '\n') {
            // Check if it's a known directive
            const directive = buf.trim().split(/\s+/)[0];
            const type = this.lang.reserved.has(directive) ? TOKEN_TYPE.RESERVED : TOKEN_TYPE.RESERVED;
            this.emit(buf.trim(), type, startLine);
            buf = ''; state = STATE.START;
          } else {
            buf += this.advance();
          }
          break;
        }

        default:
          this.pos++;
          break;
      }

      // EOF
      if (this.pos >= n && state === STATE.START) break;
      if (this.pos >= n && buf) {
        // Flush remaining buffer
        if (state === STATE.IN_IDENTIFIER || state === STATE.IN_PREPROC) flush();
        else if (state === STATE.IN_NUMBER || state === STATE.IN_FLOAT)
          this.emit(buf, TOKEN_TYPE.NUMBER, startLine);
        else if (state === STATE.IN_STRING_DQ || state === STATE.IN_STRING_SQ)
          this.emit(buf, TOKEN_TYPE.STRING, startLine);
        else if (state === STATE.IN_COMMENT_LINE || state === STATE.IN_COMMENT_BLCK)
          this.emit(buf, TOKEN_TYPE.COMMENT, startLine);
        buf = '';
        break;
      }
    }

    return { tokens: this.tokens, errors: this.errors };
  }
}

/**
 * Post-process tokens:
 * - Identify mathematical expressions (sequences with operators)
 * - De-duplicate for unique token list
 * - Build grouped output
 * @param {Array} tokens
 * @returns {Object} Grouped results
 */
function groupTokens(tokens) {
  const groups = {
    [TOKEN_TYPE.RESERVED]: [],
    [TOKEN_TYPE.SYMBOL]:   [],
    [TOKEN_TYPE.VARIABLE]: [],
    [TOKEN_TYPE.MATH]:     [],
    [TOKEN_TYPE.NUMBER]:   [],
    [TOKEN_TYPE.STRING]:   [],
    [TOKEN_TYPE.COMMENT]:  [],
    [TOKEN_TYPE.UNKNOWN]:  [],
  };

  // Identify math expressions: sequences of identifiers/numbers + math ops
  // Mark tokens that are part of a math context
  const mathExprTokens = new Set();
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === TOKEN_TYPE.MATH) {
      // Mark neighboring identifiers/numbers as math-context
      if (i > 0 && (tokens[i-1].type === TOKEN_TYPE.VARIABLE || tokens[i-1].type === TOKEN_TYPE.NUMBER)) {
        mathExprTokens.add(i - 1);
      }
      if (i < tokens.length - 1 && (tokens[i+1].type === TOKEN_TYPE.VARIABLE || tokens[i+1].type === TOKEN_TYPE.NUMBER)) {
        mathExprTokens.add(i + 1);
      }
      mathExprTokens.add(i);
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    let effectiveType = t.type;

    // If a variable/number is adjacent to a math op, promote to math group too
    if (mathExprTokens.has(i) && effectiveType !== TOKEN_TYPE.MATH) {
      effectiveType = TOKEN_TYPE.MATH;
    }

    if (!groups[effectiveType]) groups[effectiveType] = [];
    groups[effectiveType].push({ ...t, effectiveType });
  }

  return groups;
}

/**
 * Get unique tokens (value+type) with counts.
 */
function uniqueTokens(tokenList) {
  const map = new Map();
  for (const t of tokenList) {
    const key = t.value + '|' + t.type;
    if (map.has(key)) {
      map.get(key).count++;
    } else {
      map.set(key, { ...t, count: 1 });
    }
  }
  return [...map.values()];
}

/* ─── Export ──────────────────────────────────────────────── */
window.Lexer        = Lexer;
window.groupTokens  = groupTokens;
window.uniqueTokens = uniqueTokens;
window.TOKEN_TYPE   = TOKEN_TYPE;
window.LANG_CONFIGS = LANG_CONFIGS;
