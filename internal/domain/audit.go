package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type AuditLog struct {
	ID         uuid.UUID       `json:"id"`
	UserID     *uuid.UUID      `json:"userId,omitempty"`
	UserName   string          `json:"userName,omitempty"`
	UserEmail  string          `json:"userEmail,omitempty"`
	Action     string          `json:"action"` // CREATE, UPDATE, DELETE, PUBLISH, RESTORE, PERMANENT_DELETE, LOGIN, REAUTH
	Resource   string          `json:"resource"` // page, section, product, news, media, setting, theme, user
	ResourceID string          `json:"resourceId"`
	IPAddress  string          `json:"ipAddress"`
	UserAgent  string          `json:"userAgent"`
	OldValues  json.RawMessage `json:"oldValues,omitempty"`
	NewValues  json.RawMessage `json:"newValues,omitempty"`
	CreatedAt  time.Time       `json:"createdAt"`
}
