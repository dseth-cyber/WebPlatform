package public

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
	"github.com/lohakit/cms-backend/pkg/utils"
)

type PublicNewsHandler struct {
	newsSvc *service.NewsService
}

func NewPublicNewsHandler(ns *service.NewsService) *PublicNewsHandler {
	return &PublicNewsHandler{newsSvc: ns}
}

// ListNews lists published news articles
func (h *PublicNewsHandler) ListNews(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	category := r.URL.Query().Get("category")
	targetLang := utils.NormalizeLanguage(r.URL.Query().Get("lang"))

	articles, total, err := h.newsSvc.ListArticles(r.Context(), "PUBLISHED", category, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	fallbackOrder := utils.GetFallbackOrder(targetLang)
	localizedList := make([]map[string]any, len(articles))
	for i, a := range articles {
		fullArticle, _ := h.newsSvc.GetArticleByID(r.Context(), a.ID)
		title := ""
		slug := ""
		summary := ""

		if fullArticle != nil {
			for _, lang := range fallbackOrder {
				if t, ok := fullArticle.Translations[lang]; ok && t.Title != "" {
					title = t.Title
					slug = t.Slug
					summary = t.Summary
					break
				}
			}
		}

		localizedList[i] = map[string]any{
			"id":               a.ID,
			"category":         a.Category,
			"title":            title,
			"slug":             slug,
			"summary":          summary,
			"featuredImageUrl": a.FeaturedImageURL,
			"publishedAt":      a.PublishedAt,
		}
	}

	response.Paginated(w, r, localizedList, p.Page, p.PageSize, total)
}

// GetNews retrieves a single news article by slug
func (h *PublicNewsHandler) GetNews(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	targetLang := r.URL.Query().Get("lang")

	article, err := h.newsSvc.GetLocalizedArticle(r.Context(), slug, targetLang)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, article)
}
