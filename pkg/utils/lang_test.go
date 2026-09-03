package utils

import (
	"reflect"
	"testing"
)

func TestLanguageValidationAndFallback(t *testing.T) {
	tests := []struct {
		name         string
		input        string
		expectedNorm string
		expectedFall []string
	}{
		{
			name:         "Thai (Default)",
			input:        "th",
			expectedNorm: "th",
			expectedFall: []string{"th"},
		},
		{
			name:         "English",
			input:        "en",
			expectedNorm: "en",
			expectedFall: []string{"en", "th"},
		},
		{
			name:         "Chinese",
			input:        "CN",
			expectedNorm: "cn",
			expectedFall: []string{"cn", "en", "th"},
		},
		{
			name:         "Myanmar",
			input:        "mm",
			expectedNorm: "mm",
			expectedFall: []string{"mm", "en", "th"},
		},
		{
			name:         "Japanese",
			input:        "jp",
			expectedNorm: "jp",
			expectedFall: []string{"jp", "en", "th"},
		},
		{
			name:         "Invalid fallback to Thai",
			input:        "fr",
			expectedNorm: "th",
			expectedFall: []string{"th"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			norm := NormalizeLanguage(tt.input)
			if norm != tt.expectedNorm {
				t.Errorf("NormalizeLanguage(%q) = %q; want %q", tt.input, norm, tt.expectedNorm)
			}

			fallback := GetFallbackOrder(tt.input)
			if !reflect.DeepEqual(fallback, tt.expectedFall) {
				t.Errorf("GetFallbackOrder(%q) = %v; want %v", tt.input, fallback, tt.expectedFall)
			}
		})
	}
}
