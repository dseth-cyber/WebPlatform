-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL;

-- name: ListUsers :many
SELECT * FROM users
WHERE deleted_at IS NULL
  AND (sqlc.narg('search')::text IS NULL OR email ILIKE '%' || sqlc.narg('search') || '%' OR full_name ILIKE '%' || sqlc.narg('search') || '%')
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountUsers :one
SELECT COUNT(*) FROM users
WHERE deleted_at IS NULL
  AND (sqlc.narg('search')::text IS NULL OR email ILIKE '%' || sqlc.narg('search') || '%' OR full_name ILIKE '%' || sqlc.narg('search') || '%');

-- name: CreateUser :one
INSERT INTO users (email, password_hash, full_name, status)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET email = $2, full_name = $3, status = $4, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: UpdateUserLastLogin :exec
UPDATE users
SET last_login_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- name: SoftDeleteUser :exec
UPDATE users
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: CreateSession :one
INSERT INTO sessions (user_id, session_token, csrf_token, ip_address, user_agent, expires_at)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetSessionByToken :one
SELECT s.*, u.email, u.full_name, u.status as user_status
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.session_token = $1 
  AND s.expires_at > NOW() 
  AND u.deleted_at IS NULL 
  AND u.status = 'ACTIVE';

-- name: UpdateSessionReauth :exec
UPDATE sessions
SET reauthenticated_at = NOW(), updated_at = NOW()
WHERE session_token = $1;

-- name: DeleteSession :exec
DELETE FROM sessions WHERE session_token = $1;

-- name: DeleteUserSessions :exec
DELETE FROM sessions WHERE user_id = $1;

-- name: CleanupExpiredSessions :exec
DELETE FROM sessions WHERE expires_at <= NOW();
