package service

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
)

type ContactService struct {
	queries *sqlc.Queries
}

func NewContactService(q *sqlc.Queries) *ContactService {
	return &ContactService{queries: q}
}

func (s *ContactService) SubmitInquiry(ctx context.Context, req domain.ContactSubmitRequest, ip, ua string) (*domain.ContactInquiry, error) {
	isSpam := false
	if strings.TrimSpace(req.Honeypot) != "" {
		isSpam = true
	}

	interest := req.InterestCategory
	if interest == "" {
		interest = "GENERAL"
	}

	inquiry, err := s.queries.CreateContactInquiry(ctx, sqlc.CreateContactInquiryParams{
		Name:             req.Name,
		CompanyName:      repository.ToPGTextFromString(req.CompanyName),
		Email:            req.Email,
		Phone:            repository.ToPGTextFromString(req.Phone),
		Subject:          req.Subject,
		Message:          req.Message,
		InterestCategory: interest,
		IpAddress:        ip,
		UserAgent:        repository.ToPGTextFromString(ua),
		IsSpam:           isSpam,
	})
	if err != nil {
		return nil, err
	}

	return &domain.ContactInquiry{
		ID:               inquiry.ID,
		Name:             inquiry.Name,
		CompanyName:      repository.FromPGText(inquiry.CompanyName),
		Email:            inquiry.Email,
		Phone:            repository.FromPGText(inquiry.Phone),
		Subject:          inquiry.Subject,
		Message:          inquiry.Message,
		InterestCategory: inquiry.InterestCategory,
		IPAddress:        inquiry.IpAddress,
		UserAgent:        repository.FromPGText(inquiry.UserAgent),
		Status:           inquiry.Status,
		IsSpam:           inquiry.IsSpam,
		CreatedAt:        inquiry.CreatedAt.Time,
		UpdatedAt:        inquiry.UpdatedAt.Time,
	}, nil
}

func (s *ContactService) ListInquiries(ctx context.Context, status string, isSpamFilter *bool, limit, offset int) ([]domain.ContactInquiry, int64, error) {
	rows, err := s.queries.ListContactInquiries(ctx, sqlc.ListContactInquiriesParams{
		Status: repository.ToPGTextFromString(status),
		IsSpam: repository.ToPGBool(isSpamFilter),
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountContactInquiries(ctx, sqlc.CountContactInquiriesParams{
		Status: repository.ToPGTextFromString(status),
		IsSpam: repository.ToPGBool(isSpamFilter),
	})
	if err != nil {
		return nil, 0, err
	}

	items := make([]domain.ContactInquiry, len(rows))
	for i, r := range rows {
		items[i] = domain.ContactInquiry{
			ID:               r.ID,
			Name:             r.Name,
			CompanyName:      repository.FromPGText(r.CompanyName),
			Email:            r.Email,
			Phone:            repository.FromPGText(r.Phone),
			Subject:          r.Subject,
			Message:          r.Message,
			InterestCategory: r.InterestCategory,
			IPAddress:        r.IpAddress,
			UserAgent:        repository.FromPGText(r.UserAgent),
			Status:           r.Status,
			IsSpam:           r.IsSpam,
			CreatedAt:        r.CreatedAt.Time,
			UpdatedAt:        r.UpdatedAt.Time,
		}
	}

	return items, total, nil
}

func (s *ContactService) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	_, err := s.queries.UpdateContactInquiryStatus(ctx, sqlc.UpdateContactInquiryStatusParams{
		ID:     id,
		Status: status,
	})
	return err
}

func (s *ContactService) SoftDelete(ctx context.Context, id uuid.UUID) error {
	return s.queries.SoftDeleteContactInquiry(ctx, id)
}
