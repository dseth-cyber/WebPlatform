package public

import (
	"net/http"

	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type PublicSettingsHandler struct {
	settingsSvc *service.SettingsService
}

func NewPublicSettingsHandler(ss *service.SettingsService) *PublicSettingsHandler {
	return &PublicSettingsHandler{settingsSvc: ss}
}

// GetPublicSettings returns public settings (contact address, phones, business hours, social links, SEO defaults)
func (h *PublicSettingsHandler) GetPublicSettings(w http.ResponseWriter, r *http.Request) {
	settings, err := h.settingsSvc.ListPublic(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, settings)
}

// GetActiveTheme returns active theme configuration tokens (DARK, LIGHT, or MODERN)
func (h *PublicSettingsHandler) GetActiveTheme(w http.ResponseWriter, r *http.Request) {
	theme, err := h.settingsSvc.GetActiveTheme(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, theme)
}
