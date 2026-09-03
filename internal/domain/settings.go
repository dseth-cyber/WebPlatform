package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type SiteSetting struct {
	ID          uuid.UUID       `json:"id"`
	Group       string          `json:"group"`
	Key         string          `json:"key"`
	Value       json.RawMessage `json:"value"`
	IsPublic    bool            `json:"isPublic"`
	Description string          `json:"description,omitempty"`
	UpdatedBy   *uuid.UUID      `json:"updatedBy,omitempty"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

type ThemeConfig struct {
	ID        uuid.UUID       `json:"id"`
	Code      string          `json:"code"` // DARK, LIGHT, MODERN
	Name      string          `json:"name"`
	IsActive  bool            `json:"isActive"`
	Tokens    json.RawMessage `json:"tokens"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}
