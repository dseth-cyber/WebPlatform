package domain

import (
	"errors"
	"fmt"
	"net/http"
)

var (
	ErrNotFound            = errors.New("resource not found")
	ErrUnauthorized        = errors.New("authentication required")
	ErrForbidden           = errors.New("insufficient permissions")
	ErrInvalidCredentials  = errors.New("invalid email or password")
	ErrValidation          = errors.New("validation failed")
	ErrConflict            = errors.New("resource already exists")
	ErrRateLimited         = errors.New("rate limit exceeded")
	ErrReAuthRequired      = errors.New("re-authentication required for destructive operation")
	ErrInvalidFileType     = errors.New("unsupported or disallowed file type")
	ErrPayloadTooLarge     = errors.New("payload exceeds maximum allowed size")
	ErrInvalidCSRF         = errors.New("invalid or missing CSRF token")
	ErrInternal            = errors.New("internal server error")
)

type AppError struct {
	Code       string            `json:"code"`
	Message    string            `json:"message"`
	Details    map[string]string `json:"details,omitempty"`
	HTTPStatus int               `json:"-"`
	Err        error             `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func NewAppError(code, message string, status int, err error) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		HTTPStatus: status,
		Err:        err,
	}
}

func NewValidationError(message string, details map[string]string) *AppError {
	return &AppError{
		Code:       "VALIDATION_ERROR",
		Message:    message,
		Details:    details,
		HTTPStatus: http.StatusUnprocessableEntity,
		Err:        ErrValidation,
	}
}

func NewNotFoundError(resource string) *AppError {
	return &AppError{
		Code:       "NOT_FOUND",
		Message:    fmt.Sprintf("%s not found", resource),
		HTTPStatus: http.StatusNotFound,
		Err:        ErrNotFound,
	}
}

func NewUnauthorizedError(message string) *AppError {
	if message == "" {
		message = "Authentication required"
	}
	return &AppError{
		Code:       "UNAUTHORIZED",
		Message:    message,
		HTTPStatus: http.StatusUnauthorized,
		Err:        ErrUnauthorized,
	}
}

func NewForbiddenError(message string) *AppError {
	if message == "" {
		message = "You do not have permission to perform this action"
	}
	return &AppError{
		Code:       "FORBIDDEN",
		Message:    message,
		HTTPStatus: http.StatusForbidden,
		Err:        ErrForbidden,
	}
}

func NewReAuthRequiredError() *AppError {
	return &AppError{
		Code:       "REAUTH_REQUIRED",
		Message:    "Re-authentication with your password is required to perform this destructive action",
		HTTPStatus: http.StatusForbidden,
		Err:        ErrReAuthRequired,
	}
}

func NewInternalError(err error) *AppError {
	return &AppError{
		Code:       "INTERNAL_ERROR",
		Message:    "An unexpected error occurred. Please try again later.",
		HTTPStatus: http.StatusInternalServerError,
		Err:        err,
	}
}
