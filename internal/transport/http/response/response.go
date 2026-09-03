package response

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/pkg/logger"
)

type Envelope struct {
	Data     any      `json:"data,omitempty"`
	Metadata any      `json:"metadata,omitempty"`
	Error    *APIError `json:"error,omitempty"`
}

type APIError struct {
	Code      string            `json:"code"`
	Message   string            `json:"message"`
	Details   map[string]string `json:"details,omitempty"`
	RequestID string            `json:"requestId"`
}

// JSON sends a JSON response with status code and data envelope
func JSON(w http.ResponseWriter, r *http.Request, status int, data any, metadata any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)

	env := Envelope{
		Data:     data,
		Metadata: metadata,
	}

	_ = json.NewEncoder(w).Encode(env)
}

// OK responds with 200 OK and data
func OK(w http.ResponseWriter, r *http.Request, data any) {
	JSON(w, r, http.StatusOK, data, nil)
}

// Created responds with 201 Created and data
func Created(w http.ResponseWriter, r *http.Request, data any) {
	JSON(w, r, http.StatusCreated, data, nil)
}

// NoContent responds with 204 No Content
func NoContent(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

// Error handles error responses uniformly, masking raw DB errors
func Error(w http.ResponseWriter, r *http.Request, err error) {
	reqID, _ := r.Context().Value(logger.RequestIDKey).(string)

	var appErr *domain.AppError
	if !errors.As(err, &appErr) {
		appErr = domain.NewInternalError(err)
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(appErr.HTTPStatus)

	env := Envelope{
		Error: &APIError{
			Code:      appErr.Code,
			Message:   appErr.Message,
			Details:   appErr.Details,
			RequestID: reqID,
		},
	}

	_ = json.NewEncoder(w).Encode(env)
}
