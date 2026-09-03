package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/pkg/hasher"
)

type AuthService struct {
	queries *sqlc.Queries
	cfg     *config.Config
}

func NewAuthService(q *sqlc.Queries, cfg *config.Config) *AuthService {
	return &AuthService{
		queries: q,
		cfg:     cfg,
	}
}

// GenerateRandomToken generates cryptographically secure hex tokens
func GenerateRandomToken(byteLength int) (string, error) {
	b := make([]byte, byteLength)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// Login authenticates an admin user and creates an active session
func (s *AuthService) Login(ctx context.Context, email, password, ip, userAgent string) (*domain.User, *domain.Session, error) {
	user, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil, domain.ErrInvalidCredentials
		}
		return nil, nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	if user.Status != "ACTIVE" {
		return nil, nil, domain.NewUnauthorizedError("Your account has been deactivated or suspended")
	}

	match, err := hasher.ComparePasswordAndHash(password, user.PasswordHash)
	if err != nil || !match {
		return nil, nil, domain.ErrInvalidCredentials
	}

	sessionToken, err := GenerateRandomToken(32)
	if err != nil {
		return nil, nil, err
	}

	csrfToken, err := GenerateRandomToken(32)
	if err != nil {
		return nil, nil, err
	}

	expiresAt := time.Now().Add(s.cfg.SessionTTL)

	dbSession, err := s.queries.CreateSession(ctx, sqlc.CreateSessionParams{
		UserID:       user.ID,
		SessionToken: sessionToken,
		CsrfToken:    csrfToken,
		IpAddress:    ip,
		UserAgent:    repository.ToPGTextFromString(userAgent),
		ExpiresAt:    repository.ToPGTimestamptz(&expiresAt),
	})
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create session: %w", err)
	}

	// Update last login
	_ = s.queries.UpdateUserLastLogin(ctx, user.ID)

	// Fetch roles & permissions
	roles, _ := s.queries.GetUserRoles(ctx, user.ID)
	roleNames := make([]string, len(roles))
	for i, r := range roles {
		roleNames[i] = r.Name
	}

	perms, _ := s.queries.GetUserPermissions(ctx, user.ID)

	domainUser := &domain.User{
		ID:          user.ID,
		Email:       user.Email,
		FullName:    user.FullName,
		Status:      user.Status,
		LastLoginAt: repository.FromPGTimestamptz(user.LastLoginAt),
		CreatedAt:   user.CreatedAt.Time,
		UpdatedAt:   user.UpdatedAt.Time,
		Roles:       roleNames,
		Permissions: perms,
	}

	domainSession := &domain.Session{
		ID:           dbSession.ID,
		UserID:       dbSession.UserID,
		SessionToken: dbSession.SessionToken,
		CSRFToken:    dbSession.CsrfToken,
		IPAddress:    dbSession.IpAddress,
		UserAgent:    userAgent,
		ExpiresAt:    dbSession.ExpiresAt.Time,
		CreatedAt:    dbSession.CreatedAt.Time,
	}

	return domainUser, domainSession, nil
}

// GetSessionAndUser implements middleware.SessionStore interface
func (s *AuthService) GetSessionAndUser(ctx context.Context, token string) (*domain.Session, *middleware.AuthUser, error) {
	row, err := s.queries.GetSessionByToken(ctx, token)
	if err != nil {
		return nil, nil, err
	}

	roles, err := s.queries.GetUserRoles(ctx, row.UserID)
	if err != nil {
		return nil, nil, err
	}
	roleNames := make([]string, len(roles))
	for i, r := range roles {
		roleNames[i] = r.Name
	}

	perms, err := s.queries.GetUserPermissions(ctx, row.UserID)
	if err != nil {
		return nil, nil, err
	}
	permMap := make(map[string]bool, len(perms))
	for _, p := range perms {
		permMap[p] = true
	}

	domainSession := &domain.Session{
		ID:                row.ID,
		UserID:            row.UserID,
		SessionToken:      row.SessionToken,
		CSRFToken:         row.CsrfToken,
		IPAddress:         row.IpAddress,
		UserAgent:         repository.FromPGText(row.UserAgent),
		ExpiresAt:         row.ExpiresAt.Time,
		ReauthenticatedAt: repository.FromPGTimestamptz(row.ReauthenticatedAt),
		CreatedAt:         row.CreatedAt.Time,
	}

	authUser := &middleware.AuthUser{
		ID:          row.UserID,
		Email:       row.Email,
		FullName:    row.FullName,
		Roles:       roleNames,
		Permissions: permMap,
	}

	return domainSession, authUser, nil
}

// Logout deletes the active session
func (s *AuthService) Logout(ctx context.Context, sessionToken string) error {
	return s.queries.DeleteSession(ctx, sessionToken)
}

// ReAuthenticate verifies user password and timestamps the session for destructive operations
func (s *AuthService) ReAuthenticate(ctx context.Context, userID uuid.UUID, sessionToken, password string) error {
	user, err := s.queries.GetUserByID(ctx, userID)
	if err != nil {
		return domain.ErrInvalidCredentials
	}

	match, err := hasher.ComparePasswordAndHash(password, user.PasswordHash)
	if err != nil || !match {
		return domain.ErrInvalidCredentials
	}

	return s.queries.UpdateSessionReauth(ctx, sessionToken)
}
