package middleware

import (
	"net/http"

	"github.com/lohakit/cms-backend/internal/config"
)

// SecurityHeaders sets comprehensive HTTP response headers for protection
func SecurityHeaders(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			h := w.Header()

			// Content Security Policy
			h.Set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")

			// MIME Sniffing Protection
			h.Set("X-Content-Type-Options", "nosniff")

			// Clickjacking Protection
			h.Set("X-Frame-Options", "DENY")

			// Referrer Policy
			h.Set("Referrer-Policy", "strict-origin-when-cross-origin")

			// Feature/Permissions Policy
			h.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()")

			// XSS Protection for legacy browsers
			h.Set("X-XSS-Protection", "1; mode=block")

			// Strict-Transport-Security (HTTPS only)
			if cfg.IsProduction() || cfg.CookieSecure {
				h.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
			}

			next.ServeHTTP(w, r)
		})
	}
}
