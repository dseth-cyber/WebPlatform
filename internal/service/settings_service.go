package service

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
)

type SettingsService struct {
	queries *sqlc.Queries
}

func NewSettingsService(q *sqlc.Queries) *SettingsService {
	return &SettingsService{queries: q}
}

func (s *SettingsService) ListAll(ctx context.Context) ([]domain.SiteSetting, error) {
	rows, err := s.queries.ListSiteSettings(ctx)
	if err != nil {
		return nil, err
	}

	settings := make([]domain.SiteSetting, len(rows))
	for i, r := range rows {
		settings[i] = domain.SiteSetting{
			ID:          r.ID,
			Group:       r.SettingGroup,
			Key:         r.SettingKey,
			Value:       r.Value,
			IsPublic:    r.IsPublic,
			Description: repository.FromPGText(r.Description),
			UpdatedBy:   repository.FromPGUUID(r.UpdatedBy),
			CreatedAt:   r.CreatedAt.Time,
			UpdatedAt:   r.UpdatedAt.Time,
		}
	}

	return settings, nil
}

func (s *SettingsService) ListPublic(ctx context.Context) (map[string]json.RawMessage, error) {
	rows, err := s.queries.ListPublicSettings(ctx)
	if err != nil {
		return nil, err
	}

	res := make(map[string]json.RawMessage, len(rows))
	for _, r := range rows {
		res[r.SettingKey] = r.Value
	}

	return res, nil
}

func (s *SettingsService) Upsert(ctx context.Context, group, key string, value json.RawMessage, isPublic bool, description string, userID uuid.UUID) (*domain.SiteSetting, error) {
	if len(value) == 0 {
		value = json.RawMessage("{}")
	}

	row, err := s.queries.UpsertSetting(ctx, sqlc.UpsertSettingParams{
		SettingGroup: group,
		SettingKey:   key,
		Value:        value,
		IsPublic:     isPublic,
		Description:  repository.ToPGTextFromString(description),
		UpdatedBy:    repository.ToPGUUID(&userID),
	})
	if err != nil {
		return nil, err
	}

	return &domain.SiteSetting{
		ID:          row.ID,
		Group:       row.SettingGroup,
		Key:         row.SettingKey,
		Value:       row.Value,
		IsPublic:    row.IsPublic,
		Description: repository.FromPGText(row.Description),
		CreatedAt:   row.CreatedAt.Time,
		UpdatedAt:   row.UpdatedAt.Time,
	}, nil
}

// Theme management
func (s *SettingsService) ListThemes(ctx context.Context) ([]domain.ThemeConfig, error) {
	rows, err := s.queries.ListThemeConfigs(ctx)
	if err != nil {
		return nil, err
	}

	themes := make([]domain.ThemeConfig, len(rows))
	for i, r := range rows {
		themes[i] = domain.ThemeConfig{
			ID:        r.ID,
			Code:      r.Code,
			Name:      r.Name,
			IsActive:  r.IsActive,
			Tokens:    r.Tokens,
			CreatedAt: r.CreatedAt.Time,
			UpdatedAt: r.UpdatedAt.Time,
		}
	}

	return themes, nil
}

func (s *SettingsService) GetActiveTheme(ctx context.Context) (*domain.ThemeConfig, error) {
	r, err := s.queries.GetActiveThemeConfig(ctx)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.NewNotFoundError("Active theme")
		}
		return nil, err
	}

	return &domain.ThemeConfig{
		ID:        r.ID,
		Code:      r.Code,
		Name:      r.Name,
		IsActive:  r.IsActive,
		Tokens:    r.Tokens,
		CreatedAt: r.CreatedAt.Time,
		UpdatedAt: r.UpdatedAt.Time,
	}, nil
}

func (s *SettingsService) SetActiveTheme(ctx context.Context, themeCode string) error {
	return s.queries.SetActiveTheme(ctx, themeCode)
}

func (s *SettingsService) UpsertTheme(ctx context.Context, code, name string, isActive bool, tokens json.RawMessage) (*domain.ThemeConfig, error) {
	if len(tokens) == 0 {
		tokens = json.RawMessage("{}")
	}

	row, err := s.queries.UpsertThemeConfig(ctx, sqlc.UpsertThemeConfigParams{
		Code:     code,
		Name:     name,
		IsActive: isActive,
		Tokens:   tokens,
	})
	if err != nil {
		return nil, err
	}

	return &domain.ThemeConfig{
		ID:        row.ID,
		Code:      row.Code,
		Name:      row.Name,
		IsActive:  row.IsActive,
		Tokens:    row.Tokens,
		CreatedAt: row.CreatedAt.Time,
		UpdatedAt: row.UpdatedAt.Time,
	}, nil
}
