package middleware

import (
	"crypto/subtle"
	"net/http"

	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

// CSRF checks the X-CSRF-Token header against the active session's CSRF token for state-changing requests
func CSRF() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Safe methods bypass CSRF check
			switch r.Method {
			case http.MethodGet, http.MethodHead, http.MethodOptions, http.MethodTrace:
				next.ServeHTTP(w, r)
				return
			}

			// If request is authenticated via session cookie, verify CSRF token
			session := GetSessionFromContext(r.Context())
			if session != nil {
				clientToken := r.Header.Get(HeaderCSRFToken)
				if clientToken == "" {
					// Also check form value as fallback
					clientToken = r.FormValue("csrf_token")
				}

				if clientToken == "" || subtle.ConstantTimeCompare([]byte(clientToken), []byte(session.CSRFToken)) != 1 {
					response.Error(w, r, domain.NewAppError(
						"INVALID_CSRF_TOKEN",
						"CSRF token validation failed. Please refresh and try again.",
						http.StatusForbidden,
						domain.ErrInvalidCSRF,
					))
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
