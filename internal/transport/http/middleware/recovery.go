package middleware

import (
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"

	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

// Recovery recovers from panics and returns a generic 500 error envelope
func Recovery(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rvr := recover(); rvr != nil {
					stack := debug.Stack()
					log.ErrorContext(r.Context(), "panic_recovered",
						slog.Any("error", rvr),
						slog.String("stack", string(stack)),
						slog.String("path", r.URL.Path),
					)

					response.Error(w, r, fmt.Errorf("internal server error"))
				}
			}()

			next.ServeHTTP(w, r)
		})
	}
}
