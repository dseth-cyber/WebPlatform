package admin

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type AuditHandler struct {
	auditSvc *service.AuditService
}

func NewAuditHandler(as *service.AuditService) *AuditHandler {
	return &AuditHandler{auditSvc: as}
}

func (h *AuditHandler) ListAuditLogs(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	resource := r.URL.Query().Get("resource")
	action := r.URL.Query().Get("action")

	var userID *uuid.UUID
	userParam := r.URL.Query().Get("userId")
	if userParam != "" {
		if u, err := uuid.Parse(userParam); err == nil {
			userID = &u
		}
	}

	logs, total, err := h.auditSvc.ListLogs(r.Context(), resource, action, userID, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Paginated(w, r, logs, p.Page, p.PageSize, total)
}
