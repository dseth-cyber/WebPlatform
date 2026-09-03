package admin

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type TrashHandler struct {
	trashSvc *service.TrashService
	auditSvc *service.AuditService
}

func NewTrashHandler(ts *service.TrashService, aud *service.AuditService) *TrashHandler {
	return &TrashHandler{
		trashSvc: ts,
		auditSvc: aud,
	}
}

// Restore restores a soft-deleted item back to active
func (h *TrashHandler) Restore(w http.ResponseWriter, r *http.Request) {
	entityType := chi.URLParam(r, "entityType")
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid entity ID", nil))
		return
	}

	err = h.trashSvc.Restore(r.Context(), entityType, id)
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
		Action:     "RESTORE",
		Resource:   entityType,
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": fmt.Sprintf("%s restored successfully", entityType)})
}

// PermanentDelete purges the entity from database and storage (Requires Re-auth)
func (h *TrashHandler) PermanentDelete(w http.ResponseWriter, r *http.Request) {
	entityType := chi.URLParam(r, "entityType")
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid entity ID", nil))
		return
	}

	err = h.trashSvc.PermanentDelete(r.Context(), entityType, id)
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
		Action:     "PERMANENT_DELETE",
		Resource:   entityType,
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": fmt.Sprintf("%s permanently deleted", entityType)})
}

// EmptyTrash empties all soft deleted records (Requires Re-auth)
func (h *TrashHandler) EmptyTrash(w http.ResponseWriter, r *http.Request) {
	err := h.trashSvc.EmptyTrash(r.Context())
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
		Action:     "EMPTY_TRASH",
		Resource:   "trash",
		ResourceID: "all",
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Trash emptied successfully"})
}
