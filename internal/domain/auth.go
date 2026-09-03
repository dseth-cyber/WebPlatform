package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID  `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	FullName     string     `json:"fullName"`
	Status       string     `json:"status"` // ACTIVE, SUSPENDED, INACTIVE
	LastLoginAt  *time.Time `json:"lastLoginAt,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
	DeletedAt    *time.Time `json:"deletedAt,omitempty"`
	Roles        []string   `json:"roles,omitempty"`
	Permissions  []string   `json:"permissions,omitempty"`
}

type Role struct {
	ID          uuid.UUID    `json:"id"`
	Name        string       `json:"name"`
	Description string       `json:"description"`
	IsSystem    bool         `json:"isSystem"`
	Permissions []Permission `json:"permissions,omitempty"`
	CreatedAt   time.Time    `json:"createdAt"`
	UpdatedAt   time.Time    `json:"updatedAt"`
}

type Permission struct {
	ID          uuid.UUID `json:"id"`
	Code        string    `json:"code"`
	Module      string    `json:"module"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Session struct {
	ID                uuid.UUID  `json:"id"`
	UserID            uuid.UUID  `json:"userId"`
	SessionToken      string     `json:"-"`
	CSRFToken         string     `json:"csrfToken"`
	IPAddress         string     `json:"ipAddress"`
	UserAgent         string     `json:"userAgent"`
	ExpiresAt         time.Time  `json:"expiresAt"`
	ReauthenticatedAt *time.Time `json:"reauthenticatedAt,omitempty"`
	CreatedAt         time.Time  `json:"createdAt"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	User         User   `json:"user"`
	CSRFToken    string `json:"csrfToken"`
	SessionToken string `json:"sessionToken,omitempty"`
}

type ReAuthRequest struct {
	Password string `json:"password"`
}
