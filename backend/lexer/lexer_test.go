package lexer

import "testing"

func TestTokenize(t *testing.T) {
	code := `#include <stdio.h>

// Menghitung faktorial secara rekursif
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int x = 10;
    float y = 3.14;
    char name[] = "OtomataLab";

    if (x > 5 && y < 10.0) {
        printf("Hello, %s!\n", name);
        printf("Factorial(%d) = %d\n", x, factorial(x));
    }

    for (int i = 0; i < 5; i++) {
        printf("i = %d\n", i);
    }

    return 0;
}`
	l := NewLexer(code, "c")
	tokens, _ := l.Tokenize()
	if len(tokens) == 0 {
		t.Fatal("No tokens returned")
	}
}
