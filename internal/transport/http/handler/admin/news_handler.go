package admin

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type NewsHandler struct {
	newsSvc  *service.NewsService
	auditSvc *service.AuditService
}

func NewNewsHandler(ns *service.NewsService, aud *service.AuditService) *NewsHandler {
	return &NewsHandler{
		newsSvc:  ns,
		auditSvc: aud,
	}
}

type CreateNewsRequest struct {
	Status          domain.ContentStatus            `json:"status"`
	PublishedAt     *time.Time                      `json:"publishedAt"`
	FeaturedImageID *uuid.UUID                      `json:"featuredImageId"`
	Category        string                          `json:"category"`
	Translations    []domain.NewsArticleTranslation `json:"translations"`
}

func (h *NewsHandler) ListArticles(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	status := r.URL.Query().Get("status")
	category := r.URL.Query().Get("category")

	articles, total, err := h.newsSvc.ListArticles(r.Context(), status, category, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Paginated(w, r, articles, p.Page, p.PageSize, total)
}

func (h *NewsHandler) GetArticle(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid article ID", nil))
		return
	}

	article, err := h.newsSvc.GetArticleByID(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, article)
}

func (h *NewsHandler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	var req CreateNewsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid news payload", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	if user != nil {
		uid = user.ID
	}

	article, err := h.newsSvc.CreateArticle(r.Context(), service.CreateNewsParams{
		Status:          req.Status,
		PublishedAt:     req.PublishedAt,
		FeaturedImageID: req.FeaturedImageID,
		Category:        req.Category,
		CreatedBy:       uid,
		Translations:    req.Translations,
	})
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &uid,
		Action:     "CREATE",
		Resource:   "news",
		ResourceID: article.ID.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  article,
	})

	response.Created(w, r, article)
}

func (h *NewsHandler) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid article ID", nil))
		return
	}

	err = h.newsSvc.SoftDeleteArticle(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid *uuid.UUID
	if user != nil {
		uid = &user.ID
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     uid,
		Action:     "DELETE",
		Resource:   "news",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Article moved to trash"})
}
