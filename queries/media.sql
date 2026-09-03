-- name: GetMediaByID :one
SELECT m.*, u.full_name as uploader_name
FROM media_files m
LEFT JOIN users u ON m.created_by = u.id
WHERE m.id = $1 AND m.deleted_at IS NULL;

-- name: GetMediaByStorageKey :one
SELECT * FROM media_files WHERE storage_key = $1 AND deleted_at IS NULL;

-- name: ListMediaFiles :many
SELECT m.*, u.full_name as uploader_name
FROM media_files m
LEFT JOIN users u ON m.created_by = u.id
WHERE m.deleted_at IS NULL
  AND (sqlc.narg('folder')::text IS NULL OR m.folder = sqlc.narg('folder'))
  AND (sqlc.narg('mime_type')::text IS NULL OR m.mime_type ILIKE sqlc.narg('mime_type') || '%')
  AND (sqlc.narg('search')::text IS NULL OR m.filename ILIKE '%' || sqlc.narg('search') || '%' OR m.original_filename ILIKE '%' || sqlc.narg('search') || '%')
ORDER BY m.created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountMediaFiles :one
SELECT COUNT(*) FROM media_files m
WHERE m.deleted_at IS NULL
  AND (sqlc.narg('folder')::text IS NULL OR m.folder = sqlc.narg('folder'))
  AND (sqlc.narg('mime_type')::text IS NULL OR m.mime_type ILIKE sqlc.narg('mime_type') || '%')
  AND (sqlc.narg('search')::text IS NULL OR m.filename ILIKE '%' || sqlc.narg('search') || '%');

-- name: CreateMediaFile :one
INSERT INTO media_files (
    filename, original_filename, bucket, storage_key, mime_type, file_size, width, height, hash_sha256, alt_text, folder, created_by
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
RETURNING *;

-- name: UpdateMediaMetadata :one
UPDATE media_files
SET filename = $2, alt_text = $3, folder = $4, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: ReplaceMediaFile :one
UPDATE media_files
SET original_filename = $2,
    mime_type = $3,
    file_size = $4,
    width = $5,
    height = $6,
    hash_sha256 = $7,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteMedia :exec
UPDATE media_files
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: RestoreMedia :exec
UPDATE media_files
SET deleted_at = NULL
WHERE id = $1;

-- name: PermanentDeleteMedia :exec
DELETE FROM media_files WHERE id = $1;
