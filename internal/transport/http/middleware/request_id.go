package middleware

import (
	"context"
	"net/http"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/pkg/logger"
)

const HeaderXRequestID = "X-Request-ID"

// RequestID attaches a unique request identifier to the context and response header
func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqID := r.Header.Get(HeaderXRequestID)
		if reqID == "" {
			reqID = uuid.New().String()
		}

		ctx := context.WithValue(r.Context(), logger.RequestIDKey, reqID)
		w.Header().Set(HeaderXRequestID, reqID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
