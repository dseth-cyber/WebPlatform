package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/storage"
	"github.com/lohakit/cms-backend/pkg/utils"
)

type NewsService struct {
	queries *sqlc.Queries
	storage storage.StorageProvider
}

func NewNewsService(q *sqlc.Queries, store storage.StorageProvider) *NewsService {
	return &NewsService{
		queries: q,
		storage: store,
	}
}

type CreateNewsParams struct {
	Status          domain.ContentStatus
	PublishedAt     *time.Time
	FeaturedImageID *uuid.UUID
	Category        string
	CreatedBy       uuid.UUID
	Translations    []domain.NewsArticleTranslation
}

func (s *NewsService) CreateArticle(ctx context.Context, p CreateNewsParams) (*domain.NewsArticle, error) {
	statusStr := string(p.Status)
	if statusStr == "" {
		statusStr = string(domain.StatusDraft)
	}
	cat := p.Category
	if cat == "" {
		cat = "COMPANY_NEWS"
	}

	article, err := s.queries.CreateNewsArticle(ctx, sqlc.CreateNewsArticleParams{
		Status:          statusStr,
		PublishedAt:     repository.ToPGTimestamptz(p.PublishedAt),
		FeaturedImageID: repository.ToPGUUID(p.FeaturedImageID),
		Category:        cat,
		CreatedBy:       repository.ToPGUUID(&p.CreatedBy),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create news article: %w", err)
	}

	for _, t := range p.Translations {
		lang := utils.NormalizeLanguage(t.LanguageCode)
		_, _ = s.queries.UpsertNewsTranslation(ctx, sqlc.UpsertNewsTranslationParams{
			ArticleID:       article.ID,
			LanguageCode:    lang,
			Title:           t.Title,
			Slug:            t.Slug,
			Summary:         repository.ToPGTextFromString(t.Summary),
			ContentBody:     t.ContentBody,
			MetaTitle:       repository.ToPGTextFromString(t.MetaTitle),
			MetaDescription: repository.ToPGTextFromString(t.MetaDescription),
		})
	}

	return s.GetArticleByID(ctx, article.ID)
}

func (s *NewsService) GetArticleByID(ctx context.Context, id uuid.UUID) (*domain.NewsArticle, error) {
	n, err := s.queries.GetNewsArticleByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.NewNotFoundError("News article")
		}
		return nil, err
	}

	transRows, _ := s.queries.GetNewsTranslations(ctx, n.ID)
	transMap := make(map[string]domain.NewsArticleTranslation, len(transRows))
	for _, t := range transRows {
		transMap[t.LanguageCode] = domain.NewsArticleTranslation{
			ID:              t.ID,
			ArticleID:       t.ArticleID,
			LanguageCode:    t.LanguageCode,
			Title:           t.Title,
			Slug:            t.Slug,
			Summary:         repository.FromPGText(t.Summary),
			ContentBody:     t.ContentBody,
			MetaTitle:       repository.FromPGText(t.MetaTitle),
			MetaDescription: repository.FromPGText(t.MetaDescription),
		}
	}

	featURL := ""
	featKey := repository.FromPGText(n.FeaturedImageKey)
	if featKey != "" {
		featURL, _ = s.storage.GetURL(ctx, featKey, true)
	}

	return &domain.NewsArticle{
		ID:               n.ID,
		Status:           domain.ContentStatus(n.Status),
		PublishedAt:      repository.FromPGTimestamptz(n.PublishedAt),
		FeaturedImageID:  repository.FromPGUUID(n.FeaturedImageID),
		FeaturedImageKey: featKey,
		FeaturedImageURL: featURL,
		Category:         n.Category,
		CreatedBy:        repository.FromPGUUID(n.CreatedBy),
		UpdatedBy:        repository.FromPGUUID(n.UpdatedBy),
		CreatedAt:        n.CreatedAt.Time,
		UpdatedAt:        n.UpdatedAt.Time,
		Translations:     transMap,
	}, nil
}

func (s *NewsService) ListArticles(ctx context.Context, status, category string, limit, offset int) ([]domain.NewsArticle, int64, error) {
	rows, err := s.queries.ListNewsArticles(ctx, sqlc.ListNewsArticlesParams{
		Status:   repository.ToPGTextFromString(status),
		Category: repository.ToPGTextFromString(category),
		Limit:    int32(limit),
		Offset:   int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountNewsArticles(ctx, sqlc.CountNewsArticlesParams{
		Status:   repository.ToPGTextFromString(status),
		Category: repository.ToPGTextFromString(category),
	})
	if err != nil {
		return nil, 0, err
	}

	articles := make([]domain.NewsArticle, len(rows))
	for i, r := range rows {
		featURL := ""
		featKey := repository.FromPGText(r.FeaturedImageKey)
		if featKey != "" {
			featURL, _ = s.storage.GetURL(ctx, featKey, true)
		}

		articles[i] = domain.NewsArticle{
			ID:               r.ID,
			Status:           domain.ContentStatus(r.Status),
			PublishedAt:      repository.FromPGTimestamptz(r.PublishedAt),
			FeaturedImageID:  repository.FromPGUUID(r.FeaturedImageID),
			FeaturedImageKey: featKey,
			FeaturedImageURL: featURL,
			Category:         r.Category,
			CreatedAt:        r.CreatedAt.Time,
			UpdatedAt:        r.UpdatedAt.Time,
		}
	}

	return articles, total, nil
}

func (s *NewsService) GetLocalizedArticle(ctx context.Context, slug, targetLang string) (*domain.LocalizedNewsArticle, error) {
	fallbackOrder := utils.GetFallbackOrder(targetLang)

	var row *sqlc.GetNewsTranslationBySlugAndLangRow
	for _, lang := range fallbackOrder {
		r, err := s.queries.GetNewsTranslationBySlugAndLang(ctx, sqlc.GetNewsTranslationBySlugAndLangParams{
			Slug:         slug,
			LanguageCode: lang,
		})
		if err == nil {
			row = &r
			break
		}
	}

	if row == nil {
		return nil, domain.NewNotFoundError(fmt.Sprintf("Article '%s'", slug))
	}

	featURL := ""
	featKey := repository.FromPGText(row.FeaturedImageKey)
	if featKey != "" {
		featURL, _ = s.storage.GetURL(ctx, featKey, true)
	}

	return &domain.LocalizedNewsArticle{
		ID:               row.ArticleID,
		Category:         row.Category,
		Language:         row.LanguageCode,
		Title:            row.Title,
		Slug:             row.Slug,
		Summary:          repository.FromPGText(row.Summary),
		ContentBody:      row.ContentBody,
		FeaturedImageURL: featURL,
		PublishedAt:      repository.FromPGTimestamptz(row.PublishedAt),
		MetaTitle:        repository.FromPGText(row.MetaTitle),
		MetaDescription:  repository.FromPGText(row.MetaDescription),
	}, nil
}

func (s *NewsService) SoftDeleteArticle(ctx context.Context, id uuid.UUID) error {
	return s.queries.SoftDeleteNewsArticle(ctx, id)
}
