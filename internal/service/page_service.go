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
	"github.com/lohakit/cms-backend/pkg/utils"
)

type PageService struct {
	queries *sqlc.Queries
}

func NewPageService(q *sqlc.Queries) *PageService {
	return &PageService{queries: q}
}

type CreatePageParams struct {
	Slug         string
	Status       domain.ContentStatus
	CreatedBy    uuid.UUID
	Translations []domain.PageTranslation
}

func (s *PageService) CreatePage(ctx context.Context, p CreatePageParams) (*domain.Page, error) {
	statusStr := string(p.Status)
	if statusStr == "" {
		statusStr = string(domain.StatusDraft)
	}

	page, err := s.queries.CreatePage(ctx, sqlc.CreatePageParams{
		Slug:      p.Slug,
		Status:    statusStr,
		CreatedBy: repository.ToPGUUID(&p.CreatedBy),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create page: %w", err)
	}

	for _, t := range p.Translations {
		lang := utils.NormalizeLanguage(t.LanguageCode)
		ogMeta := t.OGMetadata
		if len(ogMeta) == 0 {
			ogMeta = json.RawMessage("{}")
		}

		_, _ = s.queries.UpsertPageTranslation(ctx, sqlc.UpsertPageTranslationParams{
			PageID:          page.ID,
			LanguageCode:    lang,
			Title:           t.Title,
			MetaTitle:       repository.ToPGTextFromString(t.MetaTitle),
			MetaDescription: repository.ToPGTextFromString(t.MetaDescription),
			MetaKeywords:    repository.ToPGTextFromString(t.MetaKeywords),
			OgMetadata:      ogMeta,
		})
	}

	return s.GetPageByID(ctx, page.ID)
}

func (s *PageService) GetPageByID(ctx context.Context, id uuid.UUID) (*domain.Page, error) {
	page, err := s.queries.GetPageByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.NewNotFoundError("Page")
		}
		return nil, err
	}

	transRows, _ := s.queries.GetPageTranslations(ctx, page.ID)
	transMap := make(map[string]domain.PageTranslation, len(transRows))
	for _, t := range transRows {
		transMap[t.LanguageCode] = domain.PageTranslation{
			ID:              t.ID,
			PageID:          t.PageID,
			LanguageCode:    t.LanguageCode,
			Title:           t.Title,
			MetaTitle:       repository.FromPGText(t.MetaTitle),
			MetaDescription: repository.FromPGText(t.MetaDescription),
			MetaKeywords:    repository.FromPGText(t.MetaKeywords),
			OGMetadata:      t.OgMetadata,
		}
	}

	sectionRows, _ := s.queries.ListPageSections(ctx, page.ID)
	sections := make([]domain.PageSection, len(sectionRows))
	for i, sec := range sectionRows {
		secTransRows, _ := s.queries.GetSectionTranslations(ctx, sec.ID)
		secTransMap := make(map[string]domain.PageSectionTranslation, len(secTransRows))
		for _, st := range secTransRows {
			secTransMap[st.LanguageCode] = domain.PageSectionTranslation{
				ID:           st.ID,
				SectionID:    st.SectionID,
				LanguageCode: st.LanguageCode,
				Title:        repository.FromPGText(st.Title),
				Subtitle:     repository.FromPGText(st.Subtitle),
				ContentBody:  repository.FromPGText(st.ContentBody),
				Payload:      st.Payload,
			}
		}

		sections[i] = domain.PageSection{
			ID:           sec.ID,
			PageID:       sec.PageID,
			SectionType:  sec.SectionType,
			SortOrder:    int(sec.SortOrder),
			IsActive:     sec.IsActive,
			Config:       sec.Config,
			CreatedAt:    sec.CreatedAt.Time,
			UpdatedAt:    sec.UpdatedAt.Time,
			Translations: secTransMap,
		}
	}

	return &domain.Page{
		ID:           page.ID,
		Slug:         page.Slug,
		Status:       domain.ContentStatus(page.Status),
		PublishedAt:  repository.FromPGTimestamptz(page.PublishedAt),
		CreatedBy:    repository.FromPGUUID(page.CreatedBy),
		UpdatedBy:    repository.FromPGUUID(page.UpdatedBy),
		CreatedAt:    page.CreatedAt.Time,
		UpdatedAt:    page.UpdatedAt.Time,
		Translations: transMap,
		Sections:     sections,
	}, nil
}

func (s *PageService) ListPages(ctx context.Context, status, search string, limit, offset int) ([]domain.Page, int64, error) {
	rows, err := s.queries.ListPages(ctx, sqlc.ListPagesParams{
		Status: repository.ToPGTextFromString(status),
		Search: repository.ToPGTextFromString(search),
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountPages(ctx, sqlc.CountPagesParams{
		Status: repository.ToPGTextFromString(status),
		Search: repository.ToPGTextFromString(search),
	})
	if err != nil {
		return nil, 0, err
	}

	pages := make([]domain.Page, len(rows))
	for i, r := range rows {
		pages[i] = domain.Page{
			ID:          r.ID,
			Slug:        r.Slug,
			Status:      domain.ContentStatus(r.Status),
			PublishedAt: repository.FromPGTimestamptz(r.PublishedAt),
			CreatedAt:   r.CreatedAt.Time,
			UpdatedAt:   r.UpdatedAt.Time,
		}
	}

	return pages, total, nil
}

func (s *PageService) GetLocalizedPublishedPage(ctx context.Context, slug, targetLang string) (*domain.LocalizedPage, error) {
	page, err := s.queries.GetPublishedPageBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.NewNotFoundError(fmt.Sprintf("Page with slug '%s'", slug))
		}
		return nil, err
	}

	fallbackOrder := utils.GetFallbackOrder(targetLang)
	allTrans, _ := s.queries.GetPageTranslations(ctx, page.ID)
	transMap := make(map[string]sqlc.PageTranslation, len(allTrans))
	for _, t := range allTrans {
		transMap[t.LanguageCode] = t
	}

	var resolvedTrans *sqlc.PageTranslation
	for _, lang := range fallbackOrder {
		if t, ok := transMap[lang]; ok && t.Title != "" {
			resolvedTrans = &t
			break
		}
	}
	if resolvedTrans == nil && len(allTrans) > 0 {
		resolvedTrans = &allTrans[0]
	}

	title, metaTitle, metaDesc, metaKeys := "", "", "", ""
	var ogMeta json.RawMessage = json.RawMessage("{}")
	if resolvedTrans != nil {
		title = resolvedTrans.Title
		metaTitle = repository.FromPGText(resolvedTrans.MetaTitle)
		metaDesc = repository.FromPGText(resolvedTrans.MetaDescription)
		metaKeys = repository.FromPGText(resolvedTrans.MetaKeywords)
		if len(resolvedTrans.OgMetadata) > 0 {
			ogMeta = resolvedTrans.OgMetadata
		}
	}

	sectionRows, err := s.queries.ListActivePageSections(ctx, page.ID)
	if err != nil {
		return nil, err
	}

	localizedSections := make([]domain.LocalizedPageSection, 0, len(sectionRows))
	for _, sec := range sectionRows {
		secTransRows, _ := s.queries.GetSectionTranslations(ctx, sec.ID)
		secTransMap := make(map[string]sqlc.PageSectionTranslation, len(secTransRows))
		for _, st := range secTransRows {
			secTransMap[st.LanguageCode] = st
		}

		var resolvedSecTrans *sqlc.PageSectionTranslation
		for _, lang := range fallbackOrder {
			if st, ok := secTransMap[lang]; ok {
				resolvedSecTrans = &st
				break
			}
		}
		if resolvedSecTrans == nil && len(secTransRows) > 0 {
			resolvedSecTrans = &secTransRows[0]
		}

		secTitle, secSubtitle, secContent := "", "", ""
		var payload json.RawMessage = json.RawMessage("{}")
		if resolvedSecTrans != nil {
			secTitle = repository.FromPGText(resolvedSecTrans.Title)
			secSubtitle = repository.FromPGText(resolvedSecTrans.Subtitle)
			secContent = repository.FromPGText(resolvedSecTrans.ContentBody)
			if len(resolvedSecTrans.Payload) > 0 {
				payload = resolvedSecTrans.Payload
			}
		}

		localizedSections = append(localizedSections, domain.LocalizedPageSection{
			ID:          sec.ID,
			SectionType: sec.SectionType,
			SortOrder:   int(sec.SortOrder),
			Config:      sec.Config,
			Title:       secTitle,
			Subtitle:    secSubtitle,
			ContentBody: secContent,
			Payload:     payload,
		})
	}

	return &domain.LocalizedPage{
		ID:          page.ID,
		Slug:        page.Slug,
		Language:    utils.NormalizeLanguage(targetLang),
		Title:       title,
		MetaTitle:   metaTitle,
		MetaDesc:    metaDesc,
		MetaKeys:    metaKeys,
		OGMetadata:  ogMeta,
		Sections:    localizedSections,
		PublishedAt: repository.FromPGTimestamptz(page.PublishedAt),
	}, nil
}

func (s *PageService) PublishPage(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*domain.Page, error) {
	page, err := s.queries.SetPageStatus(ctx, sqlc.SetPageStatusParams{
		ID:        id,
		Status:    string(domain.StatusPublished),
		UpdatedBy: repository.ToPGUUID(&userID),
	})
	if err != nil {
		return nil, err
	}

	fullPage, err := s.GetPageByID(ctx, page.ID)
	if err != nil {
		return nil, err
	}

	snapshotBytes, _ := json.Marshal(fullPage)
	_, _ = s.queries.CreateContentRevision(ctx, sqlc.CreateContentRevisionParams{
		EntityType:    "page",
		EntityID:      page.ID,
		Snapshot:      snapshotBytes,
		ChangeSummary: repository.ToPGTextFromString("Published page version"),
		CreatedBy:     repository.ToPGUUID(&userID),
	})

	return fullPage, nil
}

func (s *PageService) UnpublishPage(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*domain.Page, error) {
	_, err := s.queries.SetPageStatus(ctx, sqlc.SetPageStatusParams{
		ID:        id,
		Status:    string(domain.StatusDraft),
		UpdatedBy: repository.ToPGUUID(&userID),
	})
	if err != nil {
		return nil, err
	}

	return s.GetPageByID(ctx, id)
}

func (s *PageService) ListRevisions(ctx context.Context, pageID uuid.UUID) ([]domain.ContentRevision, error) {
	rows, err := s.queries.ListContentRevisions(ctx, sqlc.ListContentRevisionsParams{
		EntityType: "page",
		EntityID:   pageID,
	})
	if err != nil {
		return nil, err
	}

	revs := make([]domain.ContentRevision, len(rows))
	for i, r := range rows {
		revs[i] = domain.ContentRevision{
			ID:            r.ID,
			EntityType:    r.EntityType,
			EntityID:      r.EntityID,
			VersionNumber: int(r.VersionNumber),
			Snapshot:      r.Snapshot,
			ChangeSummary: repository.FromPGText(r.ChangeSummary),
			CreatedBy:     repository.FromPGUUID(r.CreatedBy),
			AuthorName:    repository.FromPGText(r.AuthorName),
			CreatedAt:     r.CreatedAt.Time,
		}
	}
	return revs, nil
}

func (s *PageService) AddSection(ctx context.Context, pageID uuid.UUID, sectionType string, sortOrder int, config json.RawMessage, translations []domain.PageSectionTranslation) (*domain.PageSection, error) {
	if len(config) == 0 {
		config = json.RawMessage("{}")
	}

	sec, err := s.queries.CreatePageSection(ctx, sqlc.CreatePageSectionParams{
		PageID:      pageID,
		SectionType: sectionType,
		SortOrder:   int32(sortOrder),
		IsActive:    true,
		Config:      config,
	})
	if err != nil {
		return nil, err
	}

	for _, t := range translations {
		lang := utils.NormalizeLanguage(t.LanguageCode)
		payload := t.Payload
		if len(payload) == 0 {
			payload = json.RawMessage("{}")
		}

		_, _ = s.queries.UpsertPageSectionTranslation(ctx, sqlc.UpsertPageSectionTranslationParams{
			SectionID:    sec.ID,
			LanguageCode: lang,
			Title:        repository.ToPGTextFromString(t.Title),
			Subtitle:     repository.ToPGTextFromString(t.Subtitle),
			ContentBody:  repository.ToPGTextFromString(t.ContentBody),
			Payload:      payload,
		})
	}

	return &domain.PageSection{
		ID:          sec.ID,
		PageID:      sec.PageID,
		SectionType: sec.SectionType,
		SortOrder:   int(sec.SortOrder),
		IsActive:    sec.IsActive,
		Config:      sec.Config,
		CreatedAt:   sec.CreatedAt.Time,
		UpdatedAt:   sec.UpdatedAt.Time,
	}, nil
}

func (s *PageService) ReorderSections(ctx context.Context, sectionOrder map[uuid.UUID]int) error {
	for id, order := range sectionOrder {
		_ = s.queries.UpdateSectionSortOrder(ctx, sqlc.UpdateSectionSortOrderParams{
			ID:        id,
			SortOrder: int32(order),
		})
	}
	return nil
}

func (s *PageService) SoftDeletePage(ctx context.Context, id uuid.UUID) error {
	return s.queries.SoftDeletePage(ctx, id)
}

func (s *PageService) SoftDeleteSection(ctx context.Context, id uuid.UUID) error {
	return s.queries.SoftDeletePageSection(ctx, id)
}
