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

type UserHandler struct {
	rbacSvc  *service.RBACService
	auditSvc *service.AuditService
}

func NewUserHandler(rs *service.RBACService, aud *service.AuditService) *UserHandler {
	return &UserHandler{
		rbacSvc:  rs,
		auditSvc: aud,
	}
}

type CreateUserRequest struct {
	Email    string      `json:"email"`
	Password string      `json:"password"`
	FullName string      `json:"fullName"`
	Status   string      `json:"status"`
	RoleIDs  []uuid.UUID `json:"roleIds"`
}

type UpdateUserRequest struct {
	Email    string      `json:"email"`
	FullName string      `json:"fullName"`
	Status   string      `json:"status"`
	RoleIDs  []uuid.UUID `json:"roleIds"`
}

func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	users, total, err := h.rbacSvc.ListUsers(r.Context(), p.Search, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Paginated(w, r, users, p.Page, p.PageSize, total)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid user payload", nil))
		return
	}

	status := req.Status
	if status == "" {
		status = "ACTIVE"
	}

	user, err := h.rbacSvc.CreateUser(r.Context(), req.Email, req.Password, req.FullName, status, req.RoleIDs)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	currUser := middleware.GetUserFromContext(r.Context())
	var currUID *uuid.UUID
	if currUser != nil {
		currUID = &currUser.ID
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     currUID,
		Action:     "CREATE",
		Resource:   "user",
		ResourceID: user.ID.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  user,
	})

	response.Created(w, r, user)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid user ID", nil))
		return
	}

	var req UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid payload", nil))
		return
	}

	user, err := h.rbacSvc.UpdateUser(r.Context(), id, req.Email, req.FullName, req.Status, req.RoleIDs)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	currUser := middleware.GetUserFromContext(r.Context())
	var currUID *uuid.UUID
	if currUser != nil {
		currUID = &currUser.ID
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     currUID,
		Action:     "UPDATE",
		Resource:   "user",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  user,
	})

	response.OK(w, r, user)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid user ID", nil))
		return
	}

	err = h.rbacSvc.SoftDeleteUser(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	currUser := middleware.GetUserFromContext(r.Context())
	var currUID *uuid.UUID
	if currUser != nil {
		currUID = &currUser.ID
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     currUID,
		Action:     "DELETE",
		Resource:   "user",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "User deleted successfully"})
}

func (h *UserHandler) ListRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := h.rbacSvc.ListRoles(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.OK(w, r, roles)
}

func (h *UserHandler) ListPermissions(w http.ResponseWriter, r *http.Request) {
	perms, err := h.rbacSvc.ListPermissions(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.OK(w, r, perms)
}
