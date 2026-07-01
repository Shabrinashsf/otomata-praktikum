package lexer

// LangConfig holds the lexical rules for a programming language.
type LangConfig struct {
	Name        string
	Reserved    map[string]bool
	MathOps     map[string]bool
	Symbols     map[string]bool
	LineComment string
	BlockOpen   string
	BlockClose  string
	IsPreproc   bool // supports #include style directives
}

// strSet is a helper to build a bool map from a slice of strings.
func strSet(words []string) map[string]bool {
	m := make(map[string]bool, len(words))
	for _, w := range words {
		m[w] = true
	}
	return m
}

// Languages holds config for all supported languages.
var Languages = map[string]*LangConfig{
	"c": {
		Name: "C / C++",
		Reserved: strSet([]string{
			"auto", "break", "case", "char", "const", "continue", "default",
			"do", "double", "else", "enum", "extern", "float", "for", "goto",
			"if", "inline", "int", "long", "register", "restrict", "return",
			"short", "signed", "sizeof", "static", "struct", "switch",
			"typedef", "union", "unsigned", "void", "volatile", "while",
			"_Bool", "_Complex", "_Imaginary",
			// C++ keywords
			"and", "and_eq", "asm", "bitand", "bitor", "bool", "catch",
			"class", "compl", "const_cast", "delete", "dynamic_cast",
			"explicit", "export", "false", "friend", "mutable", "namespace",
			"new", "not", "not_eq", "nullptr", "operator", "or", "or_eq",
			"private", "protected", "public", "reinterpret_cast",
			"static_assert", "static_cast", "template", "this", "throw",
			"true", "try", "typeid", "typename", "using", "virtual",
			"wchar_t", "xor", "xor_eq",
			// Common stdlib identifiers
			"printf", "scanf", "malloc", "free", "NULL", "main",
			"#include", "#define", "#ifdef", "#ifndef", "#endif",
			"#if", "#else", "#elif", "#pragma",
		}),
		MathOps: strSet([]string{
			"+", "-", "*", "/", "%", "=", "==", "!=", "<", ">", "<=", ">=",
			"&&", "||", "!", "&", "|", "^", "~", "<<", ">>",
			"++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
			"<<=", ">>=", "->",
		}),
		Symbols:     strSet([]string{"(", ")", "{", "}", "[", "]", ";", ",", ".", ":", "?", "\\"}),
		LineComment:  "//",
		BlockOpen:   "/*",
		BlockClose:  "*/",
		IsPreproc:   true,
	},

	"python": {
		Name: "Python",
		Reserved: strSet([]string{
			"False", "None", "True", "and", "as", "assert", "async", "await",
			"break", "class", "continue", "def", "del", "elif", "else",
			"except", "finally", "for", "from", "global", "if", "import",
			"in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise",
			"return", "try", "while", "with", "yield",
			"print", "input", "range", "len", "type", "int", "float", "str",
			"list", "dict", "tuple", "set", "bool", "open", "super", "self",
			"__init__", "__main__", "__name__",
			"append", "extend", "pop", "remove", "format", "enumerate",
		}),
		MathOps: strSet([]string{
			"+", "-", "*", "/", "//", "%", "**", "=", "==", "!=",
			"<", ">", "<=", ">=", "and", "or", "not",
			"&", "|", "^", "~", "<<", ">>",
			"+=", "-=", "*=", "/=", "//=", "%=", "**=", "&=", "|=", "^=",
		}),
		Symbols:     strSet([]string{"(", ")", "{", "}", "[", "]", ":", ",", ".", "#", "@", "'"}),
		LineComment:  "#",
		BlockOpen:   "",
		BlockClose:  "",
		IsPreproc:   false,
	},

	"java": {
		Name: "Java",
		Reserved: strSet([]string{
			"abstract", "assert", "boolean", "break", "byte", "case", "catch",
			"char", "class", "const", "continue", "default", "do", "double",
			"else", "enum", "extends", "final", "finally", "float", "for",
			"goto", "if", "implements", "import", "instanceof", "int",
			"interface", "long", "native", "new", "package", "private",
			"protected", "public", "return", "short", "static", "strictfp",
			"super", "switch", "synchronized", "this", "throw", "throws",
			"transient", "try", "void", "volatile", "while",
			"true", "false", "null",
			"String", "System", "out", "println", "print", "main", "args",
			"Scanner", "ArrayList", "HashMap", "List", "Map",
			"Override", "SuppressWarnings",
		}),
		MathOps: strSet([]string{
			"+", "-", "*", "/", "%", "=", "==", "!=", "<", ">", "<=", ">=",
			"&&", "||", "!", "&", "|", "^", "~", "<<", ">>", ">>>",
			"++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
		}),
		Symbols:     strSet([]string{"(", ")", "{", "}", "[", "]", ";", ",", ".", "?", ":", "@"}),
		LineComment:  "//",
		BlockOpen:   "/*",
		BlockClose:  "*/",
		IsPreproc:   false,
	},

	"custom": {
		Name: "Kustom (Generik)",
		Reserved: strSet([]string{
			"if", "else", "while", "for", "do", "switch", "case", "break",
			"continue", "return", "true", "false", "null", "void",
			"int", "float", "double", "char", "string", "bool",
			"class", "function", "def", "var", "let", "const",
			"new", "delete", "import", "export", "try", "catch", "throw",
			"and", "or", "not", "in", "is", "as", "from", "with",
			"pass", "None", "True", "False",
		}),
		MathOps: strSet([]string{
			"+", "-", "*", "/", "%", "**", "//", "=", "==", "!=",
			"<", ">", "<=", ">=", "&&", "||", "!", "&", "|", "^", "~",
			"<<", ">>", "++", "--", "+=", "-=", "*=", "/=", "%=",
		}),
		Symbols:     strSet([]string{"(", ")", "{", "}", "[", "]", ";", ",", ".", "?", ":", "#", "@"}),
		LineComment:  "//",
		BlockOpen:   "/*",
		BlockClose:  "*/",
		IsPreproc:   false,
	},
}

// GetLang returns a language config, falling back to "custom".
func GetLang(key string) *LangConfig {
	if cfg, ok := Languages[key]; ok {
		return cfg
	}
	return Languages["custom"]
}
