package logger

import (
	"context"
	"io"
	"log/slog"
	"os"
)

type ctxKey string

const (
	RequestIDKey ctxKey = "request_id"
	UserIDKey    ctxKey = "user_id"
)

// MaskingHandler customizes slog JSON output to strip or mask sensitive data
type MaskingHandler struct {
	handler slog.Handler
}

func NewMaskingHandler(h slog.Handler) *MaskingHandler {
	return &MaskingHandler{handler: h}
}

func (h *MaskingHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return h.handler.Enabled(ctx, level)
}

func (h *MaskingHandler) Handle(ctx context.Context, r slog.Record) error {
	// Inject Context metadata if available
	if reqID, ok := ctx.Value(RequestIDKey).(string); ok && reqID != "" {
		r.AddAttrs(slog.String("request_id", reqID))
	}
	if userID, ok := ctx.Value(UserIDKey).(string); ok && userID != "" {
		r.AddAttrs(slog.String("user_id", userID))
	}

	// Mask sensitive keys
	var cleanAttrs []slog.Attr
	r.Attrs(func(a slog.Attr) bool {
		switch a.Key {
		case "password", "password_hash", "token", "session_token", "cookie", "secret", "csrf_token":
			cleanAttrs = append(cleanAttrs, slog.String(a.Key, "[REDACTED]"))
		default:
			cleanAttrs = append(cleanAttrs, a)
		}
		return true
	})

	newRecord := slog.NewRecord(r.Time, r.Level, r.Message, r.PC)
	newRecord.AddAttrs(cleanAttrs...)
	return h.handler.Handle(ctx, newRecord)
}

func (h *MaskingHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &MaskingHandler{handler: h.handler.WithAttrs(attrs)}
}

func (h *MaskingHandler) WithGroup(name string) slog.Handler {
	return &MaskingHandler{handler: h.handler.WithGroup(name)}
}

// New creates a new structured JSON logger
func New(w io.Writer, level slog.Level) *slog.Logger {
	if w == nil {
		w = os.Stdout
	}
	opts := &slog.HandlerOptions{
		Level: level,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				a.Value = slog.StringValue(a.Value.Time().UTC().Format("2006-01-02T15:04:05.000Z07:00"))
			}
			return a
		},
	}
	baseHandler := slog.NewJSONHandler(w, opts)
	return slog.New(NewMaskingHandler(baseHandler))
}
