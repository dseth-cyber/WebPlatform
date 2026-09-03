package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type MediaFile struct {
	ID               uuid.UUID       `json:"id"`
	Filename         string          `json:"filename"`
	OriginalFilename string          `json:"originalFilename"`
	Bucket           string          `json:"bucket"`
	StorageKey       string          `json:"storageKey"`
	MimeType         string          `json:"mimeType"`
	FileSize         int64           `json:"fileSize"`
	Width            *int            `json:"width,omitempty"`
	Height           *int            `json:"height,omitempty"`
	HashSHA256       string          `json:"hashSha256"`
	AltText          json.RawMessage `json:"altText"` // {"th": "...", "en": "..."}
	Folder           string          `json:"folder"`
	URL              string          `json:"url,omitempty"`
	CreatedBy        *uuid.UUID      `json:"createdBy,omitempty"`
	UploaderName     string          `json:"uploaderName,omitempty"`
	CreatedAt        time.Time       `json:"createdAt"`
	UpdatedAt        time.Time       `json:"updatedAt"`
	DeletedAt        *time.Time      `json:"deletedAt,omitempty"`
}
