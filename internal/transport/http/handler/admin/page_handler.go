package admin

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type PageHandler struct {
	pageSvc  *service.PageService
	auditSvc *service.AuditService
}

func NewPageHandler(ps *service.PageService, aud *service.AuditService) *PageHandler {
	return &PageHandler{
		pageSvc:  ps,
		auditSvc: aud,
	}
}

type CreatePageRequest struct {
	Slug         string                   `json:"slug"`
	Status       domain.ContentStatus     `json:"status"`
	Translations []domain.PageTranslation `json:"translations"`
}

type AddSectionRequest struct {
	SectionType  string                          `json:"sectionType"`
	SortOrder    int                             `json:"sortOrder"`
	Config       json.RawMessage                 `json:"config"`
	Translations []domain.PageSectionTranslation `json:"translations"`
}

type ReorderSectionsRequest struct {
	Orders map[uuid.UUID]int `json:"orders"`
}

func (h *PageHandler) ListPages(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	status := r.URL.Query().Get("status")

	pages, total, err := h.pageSvc.ListPages(r.Context(), status, p.Search, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Paginated(w, r, pages, p.Page, p.PageSize, total)
}

func (h *PageHandler) GetPage(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page ID", nil))
		return
	}

	page, err := h.pageSvc.GetPageByID(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, page)
}

func (h *PageHandler) CreatePage(w http.ResponseWriter, r *http.Request) {
	var req CreatePageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page payload", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	if user != nil {
		uid = user.ID
	}

	page, err := h.pageSvc.CreatePage(r.Context(), service.CreatePageParams{
		Slug:         req.Slug,
		Status:       req.Status,
		CreatedBy:    uid,
		Translations: req.Translations,
	})
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &uid,
		Action:     "CREATE",
		Resource:   "page",
		ResourceID: page.ID.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  page,
	})

	response.Created(w, r, page)
}

func (h *PageHandler) PublishPage(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page ID", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	if user != nil {
		uid = user.ID
	}

	page, err := h.pageSvc.PublishPage(r.Context(), id, uid)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &uid,
		Action:     "PUBLISH",
		Resource:   "page",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, page)
}

func (h *PageHandler) UnpublishPage(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page ID", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	if user != nil {
		uid = user.ID
	}

	page, err := h.pageSvc.UnpublishPage(r.Context(), id, uid)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &uid,
		Action:     "UNPUBLISH",
		Resource:   "page",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, page)
}

func (h *PageHandler) ListRevisions(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page ID", nil))
		return
	}

	revs, err := h.pageSvc.ListRevisions(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, revs)
}

func (h *PageHandler) AddSection(w http.ResponseWriter, r *http.Request) {
	pageID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page ID", nil))
		return
	}

	var req AddSectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid section payload", nil))
		return
	}

	sec, err := h.pageSvc.AddSection(r.Context(), pageID, req.SectionType, req.SortOrder, req.Config, req.Translations)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Created(w, r, sec)
}

func (h *PageHandler) ReorderSections(w http.ResponseWriter, r *http.Request) {
	var req ReorderSectionsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid reorder payload", nil))
		return
	}

	err := h.pageSvc.ReorderSections(r.Context(), req.Orders)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, map[string]string{"message": "Sections reordered successfully"})
}

func (h *PageHandler) DeletePage(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid page ID", nil))
		return
	}

	err = h.pageSvc.SoftDeletePage(r.Context(), id)
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
		Resource:   "page",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Page moved to trash"})
}

func (h *PageHandler) DeleteSection(w http.ResponseWriter, r *http.Request) {
	sectionID, err := uuid.Parse(chi.URLParam(r, "sectionId"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid section ID", nil))
		return
	}

	err = h.pageSvc.SoftDeleteSection(r.Context(), sectionID)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, map[string]string{"message": "Section deleted successfully"})
}
