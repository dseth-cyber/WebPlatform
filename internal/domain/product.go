package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type ProductCategory struct {
	ID           uuid.UUID                             `json:"id"`
	Slug         string                                `json:"slug"`
	SortOrder    int                                   `json:"sortOrder"`
	IsActive     bool                                  `json:"isActive"`
	CreatedAt    time.Time                             `json:"createdAt"`
	UpdatedAt    time.Time                             `json:"updatedAt"`
	DeletedAt    *time.Time                            `json:"deletedAt,omitempty"`
	Translations map[string]ProductCategoryTranslation `json:"translations,omitempty"`
}

type ProductCategoryTranslation struct {
	ID           uuid.UUID `json:"id,omitempty"`
	CategoryID   uuid.UUID `json:"categoryId,omitempty"`
	LanguageCode string    `json:"languageCode"`
	Name         string    `json:"name"`
	Description  string    `json:"description,omitempty"`
}

type Product struct {
	ID                uuid.UUID                     `json:"id"`
	CategoryID        uuid.UUID                     `json:"categoryId"`
	CategorySlug      string                        `json:"categorySlug,omitempty"`
	SKU               string                        `json:"sku"`
	Status            ContentStatus                 `json:"status"`
	Specifications    json.RawMessage               `json:"specifications"`
	SortOrder         int                           `json:"sortOrder"`
	FeaturedImageID   *uuid.UUID                    `json:"featuredImageId,omitempty"`
	FeaturedImageKey  string                        `json:"featuredImageKey,omitempty"`
	FeaturedImageURL  string                        `json:"featuredImageUrl,omitempty"`
	CreatedBy         *uuid.UUID                    `json:"createdBy,omitempty"`
	UpdatedBy         *uuid.UUID                    `json:"updatedBy,omitempty"`
	CreatedAt         time.Time                     `json:"createdAt"`
	UpdatedAt         time.Time                     `json:"updatedAt"`
	DeletedAt         *time.Time                    `json:"deletedAt,omitempty"`
	Translations      map[string]ProductTranslation `json:"translations,omitempty"`
	Images            []ProductImage                `json:"images,omitempty"`
}

type ProductTranslation struct {
	ID              uuid.UUID `json:"id,omitempty"`
	ProductID       uuid.UUID `json:"productId,omitempty"`
	LanguageCode    string    `json:"languageCode"`
	Name            string    `json:"name"`
	Slug            string    `json:"slug"`
	Description     string    `json:"description,omitempty"`
	Features        string    `json:"features,omitempty"`
	Applications    string    `json:"applications,omitempty"`
	Material        string    `json:"material,omitempty"`
	CoatingType     string    `json:"coatingType,omitempty"`
	MetaTitle       string    `json:"metaTitle,omitempty"`
	MetaDescription string    `json:"metaDescription,omitempty"`
}

type ProductImage struct {
	ID         uuid.UUID       `json:"id"`
	ProductID  uuid.UUID       `json:"productId"`
	MediaID    uuid.UUID       `json:"mediaId"`
	Filename   string          `json:"filename,omitempty"`
	StorageKey string          `json:"storageKey,omitempty"`
	URL        string          `json:"url,omitempty"`
	SortOrder  int             `json:"sortOrder"`
	AltText    json.RawMessage `json:"altText,omitempty"`
}

// LocalizedProduct is formatted for public catalog consumption
type LocalizedProduct struct {
	ID              uuid.UUID       `json:"id"`
	CategoryID      uuid.UUID       `json:"categoryId"`
	CategorySlug    string          `json:"categorySlug"`
	CategoryName    string          `json:"categoryName"`
	SKU             string          `json:"sku"`
	Name            string          `json:"name"`
	Slug            string          `json:"slug"`
	Language        string          `json:"language"`
	Description     string          `json:"description"`
	Features        string          `json:"features"`
	Applications    string          `json:"applications"`
	Material        string          `json:"material"`
	CoatingType     string          `json:"coatingType"`
	Specifications  json.RawMessage `json:"specifications"`
	FeaturedImageURL string         `json:"featuredImageUrl,omitempty"`
	Images          []ProductImage  `json:"images,omitempty"`
	MetaTitle       string          `json:"metaTitle,omitempty"`
	MetaDescription string          `json:"metaDescription,omitempty"`
}
