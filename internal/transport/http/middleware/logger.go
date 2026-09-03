package middleware

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/lohakit/cms-backend/pkg/logger"
)

type responseWriterWrapper struct {
	http.ResponseWriter
	statusCode int
	bytesRead  int
}

func (rw *responseWriterWrapper) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriterWrapper) Write(b []byte) (int, error) {
	if rw.statusCode == 0 {
		rw.statusCode = http.StatusOK
	}
	n, err := rw.ResponseWriter.Write(b)
	rw.bytesRead += n
	return n, err
}

// StructuredLogger logs HTTP request duration, status, and metadata in JSON format
func StructuredLogger(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			wrapper := &responseWriterWrapper{
				ResponseWriter: w,
				statusCode:     http.StatusOK,
			}

			next.ServeHTTP(wrapper, r)

			duration := time.Since(start)
			reqID, _ := r.Context().Value(logger.RequestIDKey).(string)

			log.InfoContext(r.Context(), "http_request",
				slog.String("request_id", reqID),
				slog.String("method", r.Method),
				slog.String("path", r.URL.Path),
				slog.String("remote_addr", r.RemoteAddr),
				slog.String("user_agent", r.UserAgent()),
				slog.Int("status", wrapper.statusCode),
				slog.Int64("duration_ms", duration.Milliseconds()),
				slog.Int("bytes", wrapper.bytesRead),
			)
		})
	}
}
