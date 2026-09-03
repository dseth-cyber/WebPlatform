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

type MediaHandler struct {
	mediaSvc *service.MediaService
	auditSvc *service.AuditService
}

func NewMediaHandler(ms *service.MediaService, aud *service.AuditService) *MediaHandler {
	return &MediaHandler{
		mediaSvc: ms,
		auditSvc: aud,
	}
}

func (h *MediaHandler) ListMedia(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	folder := r.URL.Query().Get("folder")
	mimeType := r.URL.Query().Get("mimeType")

	items, total, err := h.mediaSvc.List(r.Context(), folder, mimeType, p.Search, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Paginated(w, r, items, p.Page, p.PageSize, total)
}

func (h *MediaHandler) Upload(w http.ResponseWriter, r *http.Request) {
	// Parse multipart (up to 50MB)
	err := r.ParseMultipartForm(50 << 20)
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid multipart form", nil))
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		response.Error(w, r, domain.NewValidationError("File is required", nil))
		return
	}
	defer file.Close()

	folder := r.FormValue("folder")
	if folder == "" {
		folder = "general"
	}

	altTextMap := make(map[string]string)
	if altJSON := r.FormValue("altText"); altJSON != "" {
		_ = json.Unmarshal([]byte(altJSON), &altTextMap)
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	if user != nil {
		uid = user.ID
	}

	media, err := h.mediaSvc.Upload(r.Context(), service.UploadParams{
		Filename: header.Filename,
		Folder:   folder,
		AltText:  altTextMap,
		Reader:   file,
		Size:     header.Size,
		UserID:   uid,
	})
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &uid,
		Action:     "UPLOAD",
		Resource:   "media",
		ResourceID: media.ID.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  media,
	})

	response.Created(w, r, media)
}

func (h *MediaHandler) Replace(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid media ID", nil))
		return
	}

	err = r.ParseMultipartForm(50 << 20)
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid multipart form", nil))
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		response.Error(w, r, domain.NewValidationError("File is required", nil))
		return
	}
	defer file.Close()

	updated, err := h.mediaSvc.Replace(r.Context(), id, file, header.Filename, header.Size)
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
		Action:     "REPLACE",
		Resource:   "media",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  updated,
	})

	response.OK(w, r, updated)
}

func (h *MediaHandler) DeleteMedia(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid media ID", nil))
		return
	}

	err = h.mediaSvc.SoftDelete(r.Context(), id)
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
		Resource:   "media",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Media moved to trash"})
}
