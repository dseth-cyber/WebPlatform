package admin

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type SettingsHandler struct {
	settingsSvc *service.SettingsService
	auditSvc    *service.AuditService
}

func NewSettingsHandler(ss *service.SettingsService, aud *service.AuditService) *SettingsHandler {
	return &SettingsHandler{
		settingsSvc: ss,
		auditSvc:    aud,
	}
}

type UpsertSettingRequest struct {
	Group       string          `json:"group"`
	Key         string          `json:"key"`
	Value       json.RawMessage `json:"value"`
	IsPublic    bool            `json:"isPublic"`
	Description string          `json:"description"`
}

type SetThemeRequest struct {
	ThemeCode string `json:"themeCode"` // DARK, LIGHT, MODERN
}

func (h *SettingsHandler) ListSettings(w http.ResponseWriter, r *http.Request) {
	settings, err := h.settingsSvc.ListAll(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.OK(w, r, settings)
}

func (h *SettingsHandler) UpsertSetting(w http.ResponseWriter, r *http.Request) {
	var req UpsertSettingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid settings payload", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	var uidPtr *uuid.UUID
	if user != nil {
		uid = user.ID
		uidPtr = &uid
	} else {
		uid = uuid.MustParse("1c75c7f9-bf13-4e94-baa7-ccfbff150fd8")
		uidPtr = &uid
	}

	setting, err := h.settingsSvc.Upsert(r.Context(), req.Group, req.Key, req.Value, req.IsPublic, req.Description, uid)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     uidPtr,
		Action:     "UPDATE_SETTING",
		Resource:   "setting",
		ResourceID: req.Key,
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  setting,
	})

	response.OK(w, r, setting)
}

func (h *SettingsHandler) ListThemes(w http.ResponseWriter, r *http.Request) {
	themes, err := h.settingsSvc.ListThemes(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.OK(w, r, themes)
}

func (h *SettingsHandler) SetActiveTheme(w http.ResponseWriter, r *http.Request) {
	var req SetThemeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid theme payload", nil))
		return
	}

	err := h.settingsSvc.SetActiveTheme(r.Context(), req.ThemeCode)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid *uuid.UUID = nil
	if user != nil {
		uid = &user.ID
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     uid,
		Action:     "SET_THEME",
		Resource:   "theme",
		ResourceID: req.ThemeCode,
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Active theme updated successfully"})
}
