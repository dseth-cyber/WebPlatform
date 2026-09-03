package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/storage"
)

type TrashItem struct {
	ID         uuid.UUID `json:"id"`
	EntityType string    `json:"entityType"` // page, product, news, media, contact
	Title      string    `json:"title"`
	Identifier string    `json:"identifier"`
}

type TrashService struct {
	queries *sqlc.Queries
	storage storage.StorageProvider
}

func NewTrashService(q *sqlc.Queries, store storage.StorageProvider) *TrashService {
	return &TrashService{
		queries: q,
		storage: store,
	}
}

// Restore restores a soft-deleted item back to active
func (s *TrashService) Restore(ctx context.Context, entityType string, id uuid.UUID) error {
	switch entityType {
	case "page":
		return s.queries.RestorePage(ctx, id)
	case "product":
		return s.queries.RestoreProduct(ctx, id)
	case "news":
		return s.queries.RestoreNewsArticle(ctx, id)
	case "media":
		return s.queries.RestoreMedia(ctx, id)
	default:
		return fmt.Errorf("unsupported entity type: %s", entityType)
	}
}

// PermanentDelete permanently purges a record from the database and storage
func (s *TrashService) PermanentDelete(ctx context.Context, entityType string, id uuid.UUID) error {
	switch entityType {
	case "page":
		return s.queries.PermanentDeletePage(ctx, id)
	case "product":
		return s.queries.PermanentDeleteProduct(ctx, id)
	case "news":
		return s.queries.PermanentDeleteNewsArticle(ctx, id)
	case "media":
		media, err := s.queries.GetMediaByID(ctx, id)
		if err == nil && media.StorageKey != "" {
			_ = s.storage.Delete(ctx, media.StorageKey)
		}
		return s.queries.PermanentDeleteMedia(ctx, id)
	case "contact":
		return s.queries.PermanentDeleteContactInquiry(ctx, id)
	default:
		return fmt.Errorf("unsupported entity type: %s", entityType)
	}
}

// EmptyTrash permanently deletes all soft-deleted records across all entities
func (s *TrashService) EmptyTrash(ctx context.Context) error {
	// 1. Pages
	pages, _ := s.queries.ListPages(ctx, sqlc.ListPagesParams{Limit: 1000, Offset: 0})
	for _, p := range pages {
		if p.DeletedAt.Valid {
			_ = s.queries.PermanentDeletePage(ctx, p.ID)
		}
	}

	// 2. Products
	prods, _ := s.queries.ListProducts(ctx, sqlc.ListProductsParams{Limit: 1000, Offset: 0})
	for _, p := range prods {
		if p.DeletedAt.Valid {
			_ = s.queries.PermanentDeleteProduct(ctx, p.ID)
		}
	}

	// 3. News
	articles, _ := s.queries.ListNewsArticles(ctx, sqlc.ListNewsArticlesParams{Limit: 1000, Offset: 0})
	for _, a := range articles {
		if a.DeletedAt.Valid {
			_ = s.queries.PermanentDeleteNewsArticle(ctx, a.ID)
		}
	}

	return nil
}
