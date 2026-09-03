package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
	"github.com/lohakit/cms-backend/pkg/logger"
)

type ctxAuthKey string

const (
	UserContextKey        ctxAuthKey = "auth_user"
	SessionContextKey     ctxAuthKey = "auth_session"
	CookieSessionName                = "lohakit_session"
	HeaderCSRFToken                  = "X-CSRF-Token"
)

type AuthUser struct {
	ID          uuid.UUID
	Email       string
	FullName    string
	Roles       []string
	Permissions map[string]bool
}

type SessionStore interface {
	GetSessionAndUser(ctx context.Context, token string) (*domain.Session, *AuthUser, error)
}

// Authenticate extracts session cookie and injects AuthUser into request context
func Authenticate(store SessionStore) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := ""

			// 1. Check HTTP-Only Cookie
			if cookie, err := r.Cookie(CookieSessionName); err == nil && cookie.Value != "" {
				token = cookie.Value
			}

			// 2. Check Authorization Header fallback (for API clients)
			if token == "" {
				authHeader := r.Header.Get("Authorization")
				if strings.HasPrefix(authHeader, "Bearer ") {
					token = strings.TrimPrefix(authHeader, "Bearer ")
				}
			}

			if token != "" && store != nil {
				session, user, err := store.GetSessionAndUser(r.Context(), token)
				if err == nil && session != nil && user != nil {
					ctx := context.WithValue(r.Context(), UserContextKey, user)
					ctx = context.WithValue(ctx, SessionContextKey, session)
					ctx = context.WithValue(ctx, logger.UserIDKey, user.ID.String())
					r = r.WithContext(ctx)
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

// RequireAuth enforces that the caller must be authenticated
func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value(UserContextKey).(*AuthUser)
		if !ok || user == nil {
			response.Error(w, r, domain.NewUnauthorizedError("Authentication is required to access this resource"))
			return
		}
		next.ServeHTTP(w, r)
	})
}

// GetUserFromContext helper
func GetUserFromContext(ctx context.Context) *AuthUser {
	if u, ok := ctx.Value(UserContextKey).(*AuthUser); ok {
		return u
	}
	return nil
}

// GetSessionFromContext helper
func GetSessionFromContext(ctx context.Context) *domain.Session {
	if s, ok := ctx.Value(SessionContextKey).(*domain.Session); ok {
		return s
	}
	return nil
}
