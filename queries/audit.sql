-- name: CreateAuditLog :one
INSERT INTO audit_logs (user_id, action, resource, resource_id, ip_address, user_agent, old_values, new_values)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: ListAuditLogs :many
SELECT a.*, u.full_name as user_name, u.email as user_email
FROM audit_logs a
LEFT JOIN users u ON a.user_id = u.id
WHERE (sqlc.narg('resource')::text IS NULL OR a.resource = sqlc.narg('resource'))
  AND (sqlc.narg('action')::text IS NULL OR a.action = sqlc.narg('action'))
  AND (sqlc.narg('user_id')::uuid IS NULL OR a.user_id = sqlc.narg('user_id'))
ORDER BY a.created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountAuditLogs :one
SELECT COUNT(*) FROM audit_logs a
WHERE (sqlc.narg('resource')::text IS NULL OR a.resource = sqlc.narg('resource'))
  AND (sqlc.narg('action')::text IS NULL OR a.action = sqlc.narg('action'))
  AND (sqlc.narg('user_id')::uuid IS NULL OR a.user_id = sqlc.narg('user_id'));
