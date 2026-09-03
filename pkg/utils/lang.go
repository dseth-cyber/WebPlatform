package utils

import "strings"

// SupportedLanguages represents the 5 supported corporate languages
const (
	LangTH = "th" // Thai (Default/Root)
	LangEN = "en" // English
	LangCN = "cn" // Chinese
	LangMM = "mm" // Myanmar
	LangJP = "jp" // Japanese
)

var SupportedLanguages = []string{LangTH, LangEN, LangCN, LangMM, LangJP}

// IsValidLanguage checks if a language code is one of the supported 5
func IsValidLanguage(lang string) bool {
	switch strings.ToLower(strings.TrimSpace(lang)) {
	case LangTH, LangEN, LangCN, LangMM, LangJP:
		return true
	default:
		return false
	}
}

// NormalizeLanguage cleans and validates language, defaulting to "th" if empty or invalid
func NormalizeLanguage(lang string) string {
	cleaned := strings.ToLower(strings.TrimSpace(lang))
	if IsValidLanguage(cleaned) {
		return cleaned
	}
	return LangTH
}

// GetFallbackOrder returns the prioritized list of language codes to search for a translation
func GetFallbackOrder(targetLang string) []string {
	target := NormalizeLanguage(targetLang)
	switch target {
	case LangCN:
		return []string{LangCN, LangEN, LangTH}
	case LangMM:
		return []string{LangMM, LangEN, LangTH}
	case LangJP:
		return []string{LangJP, LangEN, LangTH}
	case LangEN:
		return []string{LangEN, LangTH}
	default:
		return []string{LangTH}
	}
}
