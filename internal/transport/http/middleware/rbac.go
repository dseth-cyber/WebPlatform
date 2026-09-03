package middleware

import (
	"fmt"
	"net/http"

	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

// RequirePermission verifies the authenticated user holds the required permission
func RequirePermission(permCode string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := GetUserFromContext(r.Context())
			if user == nil {
				response.Error(w, r, domain.NewUnauthorizedError("Authentication required"))
				return
			}

			// Superadmin role bypass
			for _, role := range user.Roles {
				if role == "Superadmin" || role == "Admin" {
					next.ServeHTTP(w, r)
					return
				}
			}

			// Check explicit permission
			if user.Permissions != nil && user.Permissions[permCode] {
				next.ServeHTTP(w, r)
				return
			}

			response.Error(w, r, domain.NewForbiddenError(fmt.Sprintf("Missing required permission: %s", permCode)))
		})
	}
}
