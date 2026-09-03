package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type Pinger interface {
	Ping(ctx context.Context) error
}

type HealthHandler struct {
	db Pinger
}

func NewHealthHandler(db Pinger) *HealthHandler {
	return &HealthHandler{db: db}
}

// Liveness returns 200 OK if the web process is running
func (h *HealthHandler) Liveness(w http.ResponseWriter, r *http.Request) {
	response.OK(w, r, map[string]any{
		"status":    "UP",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// Readiness checks database connectivity
func (h *HealthHandler) Readiness(w http.ResponseWriter, r *http.Request) {
	status := "UP"
	dbStatus := "UP"

	if h.db != nil {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		if err := h.db.Ping(ctx); err != nil {
			status = "DEGRADED"
			dbStatus = "DOWN"
		}
	}

	response.OK(w, r, map[string]any{
		"status":    status,
		"database":  dbStatus,
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
