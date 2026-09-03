package public

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
	"github.com/lohakit/cms-backend/pkg/utils"
)

type PublicPageHandler struct {
	pageSvc *service.PageService
}

func NewPublicPageHandler(ps *service.PageService) *PublicPageHandler {
	return &PublicPageHandler{pageSvc: ps}
}

// GetPage retrieves localized published page with all active sections
func (h *PublicPageHandler) GetPage(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	if slug == "" {
		slug = "home"
	}

	targetLang := r.URL.Query().Get("lang")
	if targetLang == "" {
		targetLang = utils.LangTH
	}

	page, err := h.pageSvc.GetLocalizedPublishedPage(r.Context(), slug, targetLang)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, page)
}
