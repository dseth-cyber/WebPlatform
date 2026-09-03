package admin

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type AuthHandler struct {
	authSvc  *service.AuthService
	auditSvc *service.AuditService
	cfg      *config.Config
}

func NewAuthHandler(as *service.AuthService, aud *service.AuditService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		authSvc:  as,
		auditSvc: aud,
		cfg:      cfg,
	}
}

// Login handles admin authentication and issues secure HTTP-only session cookie
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req domain.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid credentials payload", nil))
		return
	}

	ip := middleware.GetClientIP(r)
	ua := r.UserAgent()

	user, session, err := h.authSvc.Login(r.Context(), req.Email, req.Password, ip, ua)
	if err != nil {
		// Log failed attempt
		h.auditSvc.Log(r.Context(), service.RecordAuditParams{
			Action:     "LOGIN_FAILED",
			Resource:   "auth",
			ResourceID: req.Email,
			IPAddress:  ip,
			UserAgent:  ua,
		})
		response.Error(w, r, err)
		return
	}

	// Set HttpOnly, SameSite=Strict cookie
	http.SetCookie(w, &http.Cookie{
		Name:     middleware.CookieSessionName,
		Value:    session.SessionToken,
		Path:     "/",
		Expires:  session.ExpiresAt,
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: http.SameSiteStrictMode,
		Domain:   h.cfg.CookieDomain,
	})

	// Log successful login
	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &user.ID,
		Action:     "LOGIN_SUCCESS",
		Resource:   "auth",
		ResourceID: user.ID.String(),
		IPAddress:  ip,
		UserAgent:  ua,
	})

	response.OK(w, r, domain.LoginResponse{
		User:         *user,
		CSRFToken:    session.CSRFToken,
		SessionToken: session.SessionToken,
	})
}

// Logout clears the session and cookie
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	session := middleware.GetSessionFromContext(r.Context())
	if session != nil {
		_ = h.authSvc.Logout(r.Context(), session.SessionToken)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     middleware.CookieSessionName,
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure || h.cfg.IsProduction(),
		SameSite: http.SameSiteStrictMode,
	})

	response.OK(w, r, map[string]string{"message": "Logged out successfully"})
}

// Me returns the currently authenticated admin user
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	session := middleware.GetSessionFromContext(r.Context())

	if user == nil || session == nil {
		response.Error(w, r, domain.NewUnauthorizedError("Not authenticated"))
		return
	}

	response.OK(w, r, map[string]any{
		"user":      user,
		"csrfToken": session.CSRFToken,
	})
}

// ReAuth validates user password for destructive action authorization window
func (h *AuthHandler) ReAuth(w http.ResponseWriter, r *http.Request) {
	var req domain.ReAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Password is required for re-authentication", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	session := middleware.GetSessionFromContext(r.Context())
	if user == nil || session == nil {
		response.Error(w, r, domain.NewUnauthorizedError("Authentication required"))
		return
	}

	err := h.authSvc.ReAuthenticate(r.Context(), user.ID, session.SessionToken, req.Password)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &user.ID,
		Action:     "REAUTH_SUCCESS",
		Resource:   "auth",
		ResourceID: user.ID.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Re-authentication verified. 5-minute security window active."})
}
