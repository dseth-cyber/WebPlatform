package http

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/transport/http/handler"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/pkg/logger"
)

type mockSessionStore struct {
	user    *middleware.AuthUser
	session *domain.Session
}

func (m *mockSessionStore) GetSessionAndUser(ctx context.Context, token string) (*domain.Session, *middleware.AuthUser, error) {
	if token == "valid-token" {
		return m.session, m.user, nil
	}
	return nil, nil, domain.ErrUnauthorized
}

func TestHealthEndpoints(t *testing.T) {
	cfg := config.Load()
	log := logger.New(nil, -4)
	h := handler.NewHealthHandler(nil)

	router := NewRouter(RouterParams{
		Config:        cfg,
		Logger:        log,
		HealthHandler: h,
	})

	// Test Liveness
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("Expected status 200 for /healthz, got %d", rec.Code)
	}

	// Test Readiness
	req = httptest.NewRequest(http.MethodGet, "/readyz", nil)
	rec = httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("Expected status 200 for /readyz, got %d", rec.Code)
	}
}

func TestSecurityHeadersApplied(t *testing.T) {
	cfg := config.Load()
	log := logger.New(nil, -4)
	h := handler.NewHealthHandler(nil)

	router := NewRouter(RouterParams{
		Config:        cfg,
		Logger:        log,
		HealthHandler: h,
	})

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Error("Expected X-Content-Type-Options header to be nosniff")
	}
	if rec.Header().Get("X-Frame-Options") != "DENY" {
		t.Error("Expected X-Frame-Options header to be DENY")
	}
	if rec.Header().Get("X-Request-ID") == "" {
		t.Error("Expected X-Request-ID header in response")
	}
}

func TestRequireAuthMiddleware(t *testing.T) {
	cfg := config.Load()
	log := logger.New(nil, -4)
	h := handler.NewHealthHandler(nil)

	router := NewRouter(RouterParams{
		Config:        cfg,
		Logger:        log,
		SessionStore:  &mockSessionStore{},
		HealthHandler: h,
	})

	// Unauthorized request to admin
	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/audit-logs", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Errorf("Expected status 401 Unauthorized for unauthenticated admin access, got %d", rec.Code)
	}
}

func TestReAuthRequirementForDestructiveAction(t *testing.T) {
	cfg := config.Load()
	log := logger.New(nil, -4)
	h := handler.NewHealthHandler(nil)

	// User without recent reauth timestamp
	now := time.Now()
	expiredReauth := now.Add(-10 * time.Minute) // older than 5 min
	uid := uuid.New()

	mockStore := &mockSessionStore{
		user: &middleware.AuthUser{
			ID:          uid,
			Email:       "admin@lohakit.co.th",
			FullName:    "System Admin",
			Roles:       []string{"Superadmin"},
			Permissions: map[string]bool{"trash.permanent_delete": true},
		},
		session: &domain.Session{
			ID:                uuid.New(),
			UserID:            uid,
			SessionToken:      "valid-token",
			CSRFToken:         "csrf-123",
			ReauthenticatedAt: &expiredReauth,
			ExpiresAt:         now.Add(24 * time.Hour),
		},
	}

	router := NewRouter(RouterParams{
		Config:        cfg,
		Logger:        log,
		SessionStore:  mockStore,
		HealthHandler: h,
	})

	targetID := uuid.New()
	req := httptest.NewRequest(http.MethodPost, "/api/v1/admin/trash/page/"+targetID.String()+"/permanent", nil)
	req.AddCookie(&http.Cookie{Name: middleware.CookieSessionName, Value: "valid-token"})
	req.Header.Set("X-CSRF-Token", "csrf-123")

	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	// Should block with 403 REAUTH_REQUIRED
	if rec.Code != http.StatusForbidden {
		t.Errorf("Expected status 403 Forbidden for permanent delete without recent reauth, got %d", rec.Code)
	}
}
