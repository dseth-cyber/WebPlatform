package service

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
)

type AuditService struct {
	queries *sqlc.Queries
}

func NewAuditService(q *sqlc.Queries) *AuditService {
	return &AuditService{queries: q}
}

type RecordAuditParams struct {
	UserID     *uuid.UUID
	Action     string
	Resource   string
	ResourceID string
	IPAddress  string
	UserAgent  string
	OldValues  any
	NewValues  any
}

func (s *AuditService) Log(ctx context.Context, p RecordAuditParams) {
	var oldJSON, newJSON []byte
	if p.OldValues != nil {
		oldJSON, _ = json.Marshal(p.OldValues)
	}
	if p.NewValues != nil {
		newJSON, _ = json.Marshal(p.NewValues)
	}

	_, _ = s.queries.CreateAuditLog(ctx, sqlc.CreateAuditLogParams{
		UserID:     repository.ToPGUUID(p.UserID),
		Action:     p.Action,
		Resource:   p.Resource,
		ResourceID: p.ResourceID,
		IpAddress:  p.IPAddress,
		UserAgent:  repository.ToPGTextFromString(p.UserAgent),
		OldValues:  oldJSON,
		NewValues:  newJSON,
	})
}

func (s *AuditService) ListLogs(ctx context.Context, resource, action string, userID *uuid.UUID, limit, offset int) ([]domain.AuditLog, int64, error) {
	rows, err := s.queries.ListAuditLogs(ctx, sqlc.ListAuditLogsParams{
		Resource: repository.ToPGTextFromString(resource),
		Action:   repository.ToPGTextFromString(action),
		UserID:   repository.ToPGUUID(userID),
		Limit:    int32(limit),
		Offset:   int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountAuditLogs(ctx, sqlc.CountAuditLogsParams{
		Resource: repository.ToPGTextFromString(resource),
		Action:   repository.ToPGTextFromString(action),
		UserID:   repository.ToPGUUID(userID),
	})
	if err != nil {
		return nil, 0, err
	}

	logs := make([]domain.AuditLog, len(rows))
	for i, r := range rows {
		logs[i] = domain.AuditLog{
			ID:         r.ID,
			UserID:     repository.FromPGUUID(r.UserID),
			UserName:   repository.FromPGText(r.UserName),
			UserEmail:  repository.FromPGText(r.UserEmail),
			Action:     r.Action,
			Resource:   r.Resource,
			ResourceID: r.ResourceID,
			IPAddress:  r.IpAddress,
			UserAgent:  repository.FromPGText(r.UserAgent),
			OldValues:  r.OldValues,
			NewValues:  r.NewValues,
			CreatedAt:  r.CreatedAt.Time,
		}
	}

	return logs, total, nil
}
