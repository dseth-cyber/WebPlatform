package domain

import (
	"time"

	"github.com/google/uuid"
)

type NewsArticle struct {
	ID               uuid.UUID                         `json:"id"`
	Status           ContentStatus                     `json:"status"`
	PublishedAt      *time.Time                        `json:"publishedAt,omitempty"`
	FeaturedImageID  *uuid.UUID                        `json:"featuredImageId,omitempty"`
	FeaturedImageKey string                            `json:"featuredImageKey,omitempty"`
	FeaturedImageURL string                            `json:"featuredImageUrl,omitempty"`
	Category         string                            `json:"category"` // COMPANY_NEWS, SUSTAINABILITY, TECHNOLOGY, AWARDS
	CreatedBy        *uuid.UUID                        `json:"createdBy,omitempty"`
	UpdatedBy        *uuid.UUID                        `json:"updatedBy,omitempty"`
	CreatedAt        time.Time                         `json:"createdAt"`
	UpdatedAt        time.Time                         `json:"updatedAt"`
	DeletedAt        *time.Time                        `json:"deletedAt,omitempty"`
	Translations     map[string]NewsArticleTranslation `json:"translations,omitempty"`
}

type NewsArticleTranslation struct {
	ID              uuid.UUID `json:"id,omitempty"`
	ArticleID       uuid.UUID `json:"articleId,omitempty"`
	LanguageCode    string    `json:"languageCode"`
	Title           string    `json:"title"`
	Slug            string    `json:"slug"`
	Summary         string    `json:"summary,omitempty"`
	ContentBody     string    `json:"contentBody"`
	MetaTitle       string    `json:"metaTitle,omitempty"`
	MetaDescription string    `json:"metaDescription,omitempty"`
}

type LocalizedNewsArticle struct {
	ID               uuid.UUID  `json:"id"`
	Category         string     `json:"category"`
	Language         string     `json:"language"`
	Title            string     `json:"title"`
	Slug             string     `json:"slug"`
	Summary          string     `json:"summary"`
	ContentBody      string     `json:"contentBody"`
	FeaturedImageURL string     `json:"featuredImageUrl,omitempty"`
	PublishedAt      *time.Time `json:"publishedAt,omitempty"`
	MetaTitle        string     `json:"metaTitle,omitempty"`
	MetaDescription  string     `json:"metaDescription,omitempty"`
}
