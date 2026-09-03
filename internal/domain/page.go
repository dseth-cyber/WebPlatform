package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type ContentStatus string

const (
	StatusDraft     ContentStatus = "DRAFT"
	StatusReview    ContentStatus = "REVIEW"
	StatusPublished ContentStatus = "PUBLISHED"
	StatusArchived  ContentStatus = "ARCHIVED"
)

type Page struct {
	ID           uuid.UUID                  `json:"id"`
	Slug         string                     `json:"slug"`
	Status       ContentStatus              `json:"status"`
	PublishedAt  *time.Time                 `json:"publishedAt,omitempty"`
	CreatedBy    *uuid.UUID                 `json:"createdBy,omitempty"`
	UpdatedBy    *uuid.UUID                 `json:"updatedBy,omitempty"`
	CreatedAt    time.Time                  `json:"createdAt"`
	UpdatedAt    time.Time                  `json:"updatedAt"`
	DeletedAt    *time.Time                 `json:"deletedAt,omitempty"`
	Translations map[string]PageTranslation `json:"translations,omitempty"` // keyed by language code: th, en, cn, mm, jp
	Sections     []PageSection              `json:"sections,omitempty"`
}

type PageTranslation struct {
	ID              uuid.UUID       `json:"id,omitempty"`
	PageID          uuid.UUID       `json:"pageId,omitempty"`
	LanguageCode    string          `json:"languageCode"`
	Title           string          `json:"title"`
	MetaTitle       string          `json:"metaTitle,omitempty"`
	MetaDescription string          `json:"metaDescription,omitempty"`
	MetaKeywords    string          `json:"metaKeywords,omitempty"`
	OGMetadata      json.RawMessage `json:"ogMetadata,omitempty"`
}

type PageSection struct {
	ID           uuid.UUID                         `json:"id"`
	PageID       uuid.UUID                         `json:"pageId"`
	SectionType  string                            `json:"sectionType"`
	SortOrder    int                               `json:"sortOrder"`
	IsActive     bool                              `json:"isActive"`
	Config       json.RawMessage                   `json:"config"`
	CreatedAt    time.Time                         `json:"createdAt"`
	UpdatedAt    time.Time                         `json:"updatedAt"`
	DeletedAt    *time.Time                        `json:"deletedAt,omitempty"`
	Translations map[string]PageSectionTranslation `json:"translations,omitempty"`
}

type PageSectionTranslation struct {
	ID           uuid.UUID       `json:"id,omitempty"`
	SectionID    uuid.UUID       `json:"sectionId,omitempty"`
	LanguageCode string          `json:"languageCode"`
	Title        string          `json:"title"`
	Subtitle     string          `json:"subtitle,omitempty"`
	ContentBody  string          `json:"contentBody,omitempty"`
	Payload      json.RawMessage `json:"payload,omitempty"`
}

type ContentRevision struct {
	ID            uuid.UUID       `json:"id"`
	EntityType    string          `json:"entityType"`
	EntityID      uuid.UUID       `json:"entityId"`
	VersionNumber int             `json:"versionNumber"`
	Snapshot      json.RawMessage `json:"snapshot"`
	ChangeSummary string          `json:"changeSummary,omitempty"`
	CreatedBy     *uuid.UUID      `json:"createdBy,omitempty"`
	AuthorName    string          `json:"authorName,omitempty"`
	CreatedAt     time.Time       `json:"createdAt"`
}

// LocalizedPage represents the aggregated response for public view with language fallback resolved
type LocalizedPage struct {
	ID          uuid.UUID              `json:"id"`
	Slug        string                 `json:"slug"`
	Language    string                 `json:"language"`
	Title       string                 `json:"title"`
	MetaTitle   string                 `json:"metaTitle"`
	MetaDesc    string                 `json:"metaDescription"`
	MetaKeys    string                 `json:"metaKeywords"`
	OGMetadata  json.RawMessage        `json:"ogMetadata,omitempty"`
	Sections    []LocalizedPageSection `json:"sections"`
	PublishedAt *time.Time             `json:"publishedAt,omitempty"`
}

type LocalizedPageSection struct {
	ID          uuid.UUID       `json:"id"`
	SectionType string          `json:"sectionType"`
	SortOrder   int             `json:"sortOrder"`
	Config      json.RawMessage `json:"config"`
	Title       string          `json:"title"`
	Subtitle    string          `json:"subtitle,omitempty"`
	ContentBody string          `json:"contentBody,omitempty"`
	Payload     json.RawMessage `json:"payload,omitempty"`
}
