package public

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type PublicContactHandler struct {
	contactSvc *service.ContactService
}

func NewPublicContactHandler(cs *service.ContactService) *PublicContactHandler {
	return &PublicContactHandler{contactSvc: cs}
}

// SubmitInquiry handles contact form submission with spam protection and rate limiting
func (h *PublicContactHandler) SubmitInquiry(w http.ResponseWriter, r *http.Request) {
	var req domain.ContactSubmitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid request body", nil))
		return
	}

	// Basic validation
	if strings.TrimSpace(req.Name) == "" || strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Message) == "" {
		response.Error(w, r, domain.NewValidationError("Name, email and message are required fields", nil))
		return
	}

	ip := middleware.GetClientIP(r)
	ua := r.UserAgent()

	inquiry, err := h.contactSvc.SubmitInquiry(r.Context(), req, ip, ua)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Created(w, r, map[string]any{
		"id":      inquiry.ID,
		"message": "Thank you for your inquiry. Our sales and engineering team will contact you shortly.",
	})
}
