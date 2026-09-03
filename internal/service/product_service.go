package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/storage"
	"github.com/lohakit/cms-backend/pkg/utils"
)

type ProductService struct {
	queries *sqlc.Queries
	storage storage.StorageProvider
}

func NewProductService(q *sqlc.Queries, store storage.StorageProvider) *ProductService {
	return &ProductService{
		queries: q,
		storage: store,
	}
}

type CreateProductParams struct {
	CategoryID      uuid.UUID
	SKU             string
	Status          domain.ContentStatus
	Specifications  json.RawMessage
	SortOrder       int
	FeaturedImageID *uuid.UUID
	CreatedBy       uuid.UUID
	Translations    []domain.ProductTranslation
	ImageIDs        []uuid.UUID
}

func (s *ProductService) CreateProduct(ctx context.Context, p CreateProductParams) (*domain.Product, error) {
	statusStr := string(p.Status)
	if statusStr == "" {
		statusStr = string(domain.StatusDraft)
	}
	if len(p.Specifications) == 0 {
		p.Specifications = json.RawMessage("{}")
	}

	prod, err := s.queries.CreateProduct(ctx, sqlc.CreateProductParams{
		CategoryID:      p.CategoryID,
		Sku:             p.SKU,
		Status:          statusStr,
		Specifications:  p.Specifications,
		SortOrder:       int32(p.SortOrder),
		FeaturedImageID: repository.ToPGUUID(p.FeaturedImageID),
		CreatedBy:       repository.ToPGUUID(&p.CreatedBy),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	for _, t := range p.Translations {
		lang := utils.NormalizeLanguage(t.LanguageCode)
		_, _ = s.queries.UpsertProductTranslation(ctx, sqlc.UpsertProductTranslationParams{
			ProductID:       prod.ID,
			LanguageCode:    lang,
			Name:            t.Name,
			Slug:            t.Slug,
			Description:     repository.ToPGTextFromString(t.Description),
			Features:        repository.ToPGTextFromString(t.Features),
			Applications:    repository.ToPGTextFromString(t.Applications),
			Material:        repository.ToPGTextFromString(t.Material),
			CoatingType:     repository.ToPGTextFromString(t.CoatingType),
			MetaTitle:       repository.ToPGTextFromString(t.MetaTitle),
			MetaDescription: repository.ToPGTextFromString(t.MetaDescription),
		})
	}

	for i, mediaID := range p.ImageIDs {
		_, _ = s.queries.AddProductImage(ctx, sqlc.AddProductImageParams{
			ProductID: prod.ID,
			MediaID:   mediaID,
			SortOrder: int32(i),
		})
	}

	return s.GetProductByID(ctx, prod.ID)
}

func (s *ProductService) GetProductByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	p, err := s.queries.GetProductByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.NewNotFoundError("Product")
		}
		return nil, err
	}

	transRows, _ := s.queries.GetProductTranslations(ctx, p.ID)
	transMap := make(map[string]domain.ProductTranslation, len(transRows))
	for _, t := range transRows {
		transMap[t.LanguageCode] = domain.ProductTranslation{
			ID:              t.ID,
			ProductID:       t.ProductID,
			LanguageCode:    t.LanguageCode,
			Name:            t.Name,
			Slug:            t.Slug,
			Description:     repository.FromPGText(t.Description),
			Features:        repository.FromPGText(t.Features),
			Applications:    repository.FromPGText(t.Applications),
			Material:        repository.FromPGText(t.Material),
			CoatingType:     repository.FromPGText(t.CoatingType),
			MetaTitle:       repository.FromPGText(t.MetaTitle),
			MetaDescription: repository.FromPGText(t.MetaDescription),
		}
	}

	// Fetch gallery images
	imgRows, _ := s.queries.GetProductImages(ctx, p.ID)
	images := make([]domain.ProductImage, len(imgRows))
	for i, img := range imgRows {
		url, _ := s.storage.GetURL(ctx, img.StorageKey, true)
		images[i] = domain.ProductImage{
			ID:         img.ID,
			ProductID:  img.ProductID,
			MediaID:    img.MediaID,
			Filename:   img.Filename,
			StorageKey: img.StorageKey,
			URL:        url,
			SortOrder:  int(img.SortOrder),
			AltText:    img.AltText,
		}
	}

	featURL := ""
	featKey := repository.FromPGText(p.FeaturedImageKey)
	if featKey != "" {
		featURL, _ = s.storage.GetURL(ctx, featKey, true)
	}

	return &domain.Product{
		ID:               p.ID,
		CategoryID:       p.CategoryID,
		CategorySlug:     p.CategorySlug,
		SKU:              p.Sku,
		Status:           domain.ContentStatus(p.Status),
		Specifications:   p.Specifications,
		SortOrder:        int(p.SortOrder),
		FeaturedImageID:  repository.FromPGUUID(p.FeaturedImageID),
		FeaturedImageKey: featKey,
		FeaturedImageURL: featURL,
		CreatedBy:        repository.FromPGUUID(p.CreatedBy),
		UpdatedBy:        repository.FromPGUUID(p.UpdatedBy),
		CreatedAt:        p.CreatedAt.Time,
		UpdatedAt:        p.UpdatedAt.Time,
		Translations:     transMap,
		Images:           images,
	}, nil
}

func (s *ProductService) ListProducts(ctx context.Context, categoryID *uuid.UUID, status, search string, limit, offset int) ([]domain.Product, int64, error) {
	rows, err := s.queries.ListProducts(ctx, sqlc.ListProductsParams{
		CategoryID: repository.ToPGUUID(categoryID),
		Status:     repository.ToPGTextFromString(status),
		Search:     repository.ToPGTextFromString(search),
		Limit:      int32(limit),
		Offset:     int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountProducts(ctx, sqlc.CountProductsParams{
		CategoryID: repository.ToPGUUID(categoryID),
		Status:     repository.ToPGTextFromString(status),
		Search:     repository.ToPGTextFromString(search),
	})
	if err != nil {
		return nil, 0, err
	}

	products := make([]domain.Product, len(rows))
	for i, r := range rows {
		featURL := ""
		featKey := repository.FromPGText(r.FeaturedImageKey)
		if featKey != "" {
			featURL, _ = s.storage.GetURL(ctx, featKey, true)
		}

		products[i] = domain.Product{
			ID:               r.ID,
			CategoryID:       r.CategoryID,
			CategorySlug:     r.CategorySlug,
			SKU:              r.Sku,
			Status:           domain.ContentStatus(r.Status),
			Specifications:   r.Specifications,
			SortOrder:        int(r.SortOrder),
			FeaturedImageID:  repository.FromPGUUID(r.FeaturedImageID),
			FeaturedImageKey: featKey,
			FeaturedImageURL: featURL,
			CreatedAt:        r.CreatedAt.Time,
			UpdatedAt:        r.UpdatedAt.Time,
		}
	}

	return products, total, nil
}

func (s *ProductService) GetLocalizedProduct(ctx context.Context, slug, targetLang string) (*domain.LocalizedProduct, error) {
	fallbackOrder := utils.GetFallbackOrder(targetLang)

	var row *sqlc.GetProductTranslationBySlugAndLangRow
	for _, lang := range fallbackOrder {
		r, err := s.queries.GetProductTranslationBySlugAndLang(ctx, sqlc.GetProductTranslationBySlugAndLangParams{
			Slug:         slug,
			LanguageCode: lang,
		})
		if err == nil {
			row = &r
			break
		}
	}

	if row == nil {
		return nil, domain.NewNotFoundError(fmt.Sprintf("Product '%s'", slug))
	}

	featURL := ""
	featKey := repository.FromPGText(row.FeaturedImageKey)
	if featKey != "" {
		featURL, _ = s.storage.GetURL(ctx, featKey, true)
	}

	// Fetch gallery images
	imgRows, _ := s.queries.GetProductImages(ctx, row.ProductID)
	images := make([]domain.ProductImage, len(imgRows))
	for i, img := range imgRows {
		url, _ := s.storage.GetURL(ctx, img.StorageKey, true)
		images[i] = domain.ProductImage{
			ID:         img.ID,
			ProductID:  img.ProductID,
			MediaID:    img.MediaID,
			Filename:   img.Filename,
			StorageKey: img.StorageKey,
			URL:        url,
			SortOrder:  int(img.SortOrder),
			AltText:    img.AltText,
		}
	}

	return &domain.LocalizedProduct{
		ID:               row.ProductID,
		CategoryID:       row.CategoryID,
		SKU:              row.Sku,
		Name:             row.Name,
		Slug:             row.Slug,
		Language:         row.LanguageCode,
		Description:      repository.FromPGText(row.Description),
		Features:         repository.FromPGText(row.Features),
		Applications:     repository.FromPGText(row.Applications),
		Material:         repository.FromPGText(row.Material),
		CoatingType:      repository.FromPGText(row.CoatingType),
		Specifications:   row.Specifications,
		FeaturedImageURL: featURL,
		Images:           images,
		MetaTitle:        repository.FromPGText(row.MetaTitle),
		MetaDescription:  repository.FromPGText(row.MetaDescription),
	}, nil
}

func (s *ProductService) ListCategories(ctx context.Context) ([]domain.ProductCategory, error) {
	rows, err := s.queries.ListProductCategories(ctx)
	if err != nil {
		return nil, err
	}

	cats := make([]domain.ProductCategory, len(rows))
	for i, r := range rows {
		transRows, _ := s.queries.GetCategoryTranslations(ctx, r.ID)
		transMap := make(map[string]domain.ProductCategoryTranslation, len(transRows))
		for _, t := range transRows {
			transMap[t.LanguageCode] = domain.ProductCategoryTranslation{
				ID:           t.ID,
				CategoryID:   t.CategoryID,
				LanguageCode: t.LanguageCode,
				Name:         t.Name,
				Description:  repository.FromPGText(t.Description),
			}
		}

		cats[i] = domain.ProductCategory{
			ID:           r.ID,
			Slug:         r.Slug,
			SortOrder:    int(r.SortOrder),
			IsActive:     r.IsActive,
			CreatedAt:    r.CreatedAt.Time,
			UpdatedAt:    r.UpdatedAt.Time,
			Translations: transMap,
		}
	}

	return cats, nil
}

func (s *ProductService) CreateCategory(ctx context.Context, slug string, sortOrder int, translations []domain.ProductCategoryTranslation) (*domain.ProductCategory, error) {
	cat, err := s.queries.CreateProductCategory(ctx, sqlc.CreateProductCategoryParams{
		Slug:      slug,
		SortOrder: int32(sortOrder),
		IsActive:  true,
	})
	if err != nil {
		return nil, err
	}

	for _, t := range translations {
		lang := utils.NormalizeLanguage(t.LanguageCode)
		_, _ = s.queries.UpsertProductCategoryTranslation(ctx, sqlc.UpsertProductCategoryTranslationParams{
			CategoryID:   cat.ID,
			LanguageCode: lang,
			Name:         t.Name,
			Description:  repository.ToPGTextFromString(t.Description),
		})
	}

	return &domain.ProductCategory{
		ID:        cat.ID,
		Slug:      cat.Slug,
		SortOrder: int(cat.SortOrder),
		IsActive:  cat.IsActive,
		CreatedAt: cat.CreatedAt.Time,
		UpdatedAt: cat.UpdatedAt.Time,
	}, nil
}

func (s *ProductService) SoftDeleteProduct(ctx context.Context, id uuid.UUID) error {
	return s.queries.SoftDeleteProduct(ctx, id)
}
