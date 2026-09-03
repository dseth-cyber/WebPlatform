-- name: GetPageByID :one
SELECT * FROM pages WHERE id = $1 AND deleted_at IS NULL;

-- name: GetPageBySlug :one
SELECT * FROM pages WHERE slug = $1 AND deleted_at IS NULL;

-- name: GetPublishedPageBySlug :one
SELECT * FROM pages WHERE slug = $1 AND status = 'PUBLISHED' AND deleted_at IS NULL;

-- name: ListPages :many
SELECT * FROM pages
WHERE deleted_at IS NULL
  AND (sqlc.narg('status')::text IS NULL OR status = sqlc.narg('status'))
  AND (sqlc.narg('search')::text IS NULL OR slug ILIKE '%' || sqlc.narg('search') || '%')
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountPages :one
SELECT COUNT(*) FROM pages
WHERE deleted_at IS NULL
  AND (sqlc.narg('status')::text IS NULL OR status = sqlc.narg('status'))
  AND (sqlc.narg('search')::text IS NULL OR slug ILIKE '%' || sqlc.narg('search') || '%');

-- name: CreatePage :one
INSERT INTO pages (slug, status, created_by, updated_by)
VALUES ($1, $2, $3, $3)
RETURNING *;

-- name: UpdatePage :one
UPDATE pages
SET slug = $2, updated_by = $3, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SetPageStatus :one
UPDATE pages
SET status = $2, 
    published_at = CASE WHEN $2 = 'PUBLISHED' THEN NOW() ELSE published_at END,
    updated_by = $3,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeletePage :exec
UPDATE pages
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: RestorePage :exec
UPDATE pages
SET deleted_at = NULL
WHERE id = $1;

-- name: PermanentDeletePage :exec
DELETE FROM pages WHERE id = $1;

-- name: UpsertPageTranslation :one
INSERT INTO page_translations (page_id, language_code, title, meta_title, meta_description, meta_keywords, og_metadata)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (page_id, language_code) DO UPDATE
SET title = EXCLUDED.title,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    og_metadata = EXCLUDED.og_metadata,
    updated_at = NOW()
RETURNING *;

-- name: GetPageTranslations :many
SELECT * FROM page_translations WHERE page_id = $1;

-- name: GetPageTranslationByLang :one
SELECT * FROM page_translations WHERE page_id = $1 AND language_code = $2;

-- name: ListPageSections :many
SELECT * FROM page_sections
WHERE page_id = $1 AND deleted_at IS NULL
ORDER BY sort_order ASC, created_at ASC;

-- name: ListActivePageSections :many
SELECT * FROM page_sections
WHERE page_id = $1 AND is_active = TRUE AND deleted_at IS NULL
ORDER BY sort_order ASC;

-- name: GetPageSectionByID :one
SELECT * FROM page_sections WHERE id = $1 AND deleted_at IS NULL;

-- name: CreatePageSection :one
INSERT INTO page_sections (page_id, section_type, sort_order, is_active, config)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdatePageSection :one
UPDATE page_sections
SET section_type = $2, sort_order = $3, is_active = $4, config = $5, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateSectionSortOrder :exec
UPDATE page_sections
SET sort_order = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeletePageSection :exec
UPDATE page_sections
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: UpsertPageSectionTranslation :one
INSERT INTO page_section_translations (section_id, language_code, title, subtitle, content_body, payload)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (section_id, language_code) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content_body = EXCLUDED.content_body,
    payload = EXCLUDED.payload,
    updated_at = NOW()
RETURNING *;

-- name: GetSectionTranslations :many
SELECT * FROM page_section_translations WHERE section_id = $1;

-- name: CreateContentRevision :one
INSERT INTO content_revisions (entity_type, entity_id, version_number, snapshot, change_summary, created_by)
VALUES (
    $1, 
    $2, 
    COALESCE((SELECT MAX(version_number) + 1 FROM content_revisions WHERE entity_type = $1 AND entity_id = $2), 1),
    $3, 
    $4, 
    $5
)
RETURNING *;

-- name: ListContentRevisions :many
SELECT r.*, u.full_name as author_name, u.email as author_email
FROM content_revisions r
LEFT JOIN users u ON r.created_by = u.id
WHERE r.entity_type = $1 AND r.entity_id = $2
ORDER BY r.version_number DESC;

-- name: GetContentRevisionByID :one
SELECT * FROM content_revisions WHERE id = $1;
