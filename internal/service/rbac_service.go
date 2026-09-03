package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/pkg/hasher"
)

type RBACService struct {
	queries *sqlc.Queries
}

func NewRBACService(q *sqlc.Queries) *RBACService {
	return &RBACService{queries: q}
}

func (s *RBACService) ListUsers(ctx context.Context, search string, limit, offset int) ([]domain.User, int64, error) {
	rows, err := s.queries.ListUsers(ctx, sqlc.ListUsersParams{
		Search: repository.ToPGTextFromString(search),
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountUsers(ctx, repository.ToPGTextFromString(search))
	if err != nil {
		return nil, 0, err
	}

	users := make([]domain.User, len(rows))
	for i, r := range rows {
		roles, _ := s.queries.GetUserRoles(ctx, r.ID)
		roleNames := make([]string, len(roles))
		for j, role := range roles {
			roleNames[j] = role.Name
		}

		users[i] = domain.User{
			ID:          r.ID,
			Email:       r.Email,
			FullName:    r.FullName,
			Status:      r.Status,
			LastLoginAt: repository.FromPGTimestamptz(r.LastLoginAt),
			CreatedAt:   r.CreatedAt.Time,
			UpdatedAt:   r.UpdatedAt.Time,
			Roles:       roleNames,
		}
	}

	return users, total, nil
}

func (s *RBACService) CreateUser(ctx context.Context, email, password, fullName, status string, roleIDs []uuid.UUID) (*domain.User, error) {
	hashedPassword, err := hasher.GenerateHash(password, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user, err := s.queries.CreateUser(ctx, sqlc.CreateUserParams{
		Email:        email,
		PasswordHash: hashedPassword,
		FullName:     fullName,
		Status:       status,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	for _, rID := range roleIDs {
		_ = s.queries.AssignRoleToUser(ctx, sqlc.AssignRoleToUserParams{
			UserID: user.ID,
			RoleID: rID,
		})
	}

	return &domain.User{
		ID:        user.ID,
		Email:     user.Email,
		FullName:  user.FullName,
		Status:    user.Status,
		CreatedAt: user.CreatedAt.Time,
		UpdatedAt: user.UpdatedAt.Time,
	}, nil
}

func (s *RBACService) UpdateUser(ctx context.Context, id uuid.UUID, email, fullName, status string, roleIDs []uuid.UUID) (*domain.User, error) {
	user, err := s.queries.UpdateUser(ctx, sqlc.UpdateUserParams{
		ID:       id,
		Email:    email,
		FullName: fullName,
		Status:   status,
	})
	if err != nil {
		return nil, err
	}

	if roleIDs != nil {
		_ = s.queries.ClearUserRoles(ctx, id)
		for _, rID := range roleIDs {
			_ = s.queries.AssignRoleToUser(ctx, sqlc.AssignRoleToUserParams{
				UserID: id,
				RoleID: rID,
			})
		}
	}

	return &domain.User{
		ID:        user.ID,
		Email:     user.Email,
		FullName:  user.FullName,
		Status:    user.Status,
		CreatedAt: user.CreatedAt.Time,
		UpdatedAt: user.UpdatedAt.Time,
	}, nil
}

func (s *RBACService) SoftDeleteUser(ctx context.Context, id uuid.UUID) error {
	_ = s.queries.DeleteUserSessions(ctx, id)
	return s.queries.SoftDeleteUser(ctx, id)
}

func (s *RBACService) ListRoles(ctx context.Context) ([]domain.Role, error) {
	rows, err := s.queries.ListRoles(ctx)
	if err != nil {
		return nil, err
	}

	roles := make([]domain.Role, len(rows))
	for i, r := range rows {
		perms, _ := s.queries.GetRolePermissions(ctx, r.ID)
		domainPerms := make([]domain.Permission, len(perms))
		for j, p := range perms {
			domainPerms[j] = domain.Permission{
				ID:          p.ID,
				Code:        p.Code,
				Module:      p.Module,
				Description: repository.FromPGText(p.Description),
			}
		}

		roles[i] = domain.Role{
			ID:          r.ID,
			Name:        r.Name,
			Description: repository.FromPGText(r.Description),
			IsSystem:    r.IsSystem,
			Permissions: domainPerms,
			CreatedAt:   r.CreatedAt.Time,
			UpdatedAt:   r.UpdatedAt.Time,
		}
	}

	return roles, nil
}

func (s *RBACService) ListPermissions(ctx context.Context) ([]domain.Permission, error) {
	rows, err := s.queries.ListPermissions(ctx)
	if err != nil {
		return nil, err
	}

	perms := make([]domain.Permission, len(rows))
	for i, r := range rows {
		perms[i] = domain.Permission{
			ID:          r.ID,
			Code:        r.Code,
			Module:      r.Module,
			Description: repository.FromPGText(r.Description),
			CreatedAt:   r.CreatedAt.Time,
		}
	}
	return perms, nil
}
