package middleware

import (
	"net/http"
	"time"

	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

// RequireReAuth enforces that destructive operations (e.g. permanent deletion, empty trash)
// require re-authentication within the specified window (e.g. 5 minutes).
func RequireReAuth(validWindow time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session := GetSessionFromContext(r.Context())
			if session == nil {
				response.Error(w, r, domain.NewUnauthorizedError("Authentication required"))
				return
			}

			if session.ReauthenticatedAt == nil || time.Since(*session.ReauthenticatedAt) > validWindow {
				response.Error(w, r, domain.NewReAuthRequiredError())
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
