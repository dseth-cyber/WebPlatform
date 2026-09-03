-- name: ListNewsArticles :many
SELECT n.*, m.storage_key as featured_image_key
FROM news_articles n
LEFT JOIN media_files m ON n.featured_image_id = m.id
WHERE n.deleted_at IS NULL
  AND (sqlc.narg('status')::text IS NULL OR n.status = sqlc.narg('status'))
  AND (sqlc.narg('category')::text IS NULL OR n.category = sqlc.narg('category'))
ORDER BY n.created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountNewsArticles :one
SELECT COUNT(*) FROM news_articles n
WHERE n.deleted_at IS NULL
  AND (sqlc.narg('status')::text IS NULL OR n.status = sqlc.narg('status'))
  AND (sqlc.narg('category')::text IS NULL OR n.category = sqlc.narg('category'));

-- name: GetNewsArticleByID :one
SELECT n.*, m.storage_key as featured_image_key
FROM news_articles n
LEFT JOIN media_files m ON n.featured_image_id = m.id
WHERE n.id = $1 AND n.deleted_at IS NULL;

-- name: CreateNewsArticle :one
INSERT INTO news_articles (status, published_at, featured_image_id, category, created_by, updated_by)
VALUES ($1, $2, $3, $4, $5, $5)
RETURNING *;

-- name: UpdateNewsArticle :one
UPDATE news_articles
SET status = $2,
    published_at = CASE WHEN $2 = 'PUBLISHED' AND published_at IS NULL THEN NOW() ELSE published_at END,
    featured_image_id = $3,
    category = $4,
    updated_by = $5,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteNewsArticle :exec
UPDATE news_articles
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: RestoreNewsArticle :exec
UPDATE news_articles
SET deleted_at = NULL
WHERE id = $1;

-- name: PermanentDeleteNewsArticle :exec
DELETE FROM news_articles WHERE id = $1;

-- name: UpsertNewsTranslation :one
INSERT INTO news_article_translations (article_id, language_code, title, slug, summary, content_body, meta_title, meta_description)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (article_id, language_code) DO UPDATE
SET title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    summary = EXCLUDED.summary,
    content_body = EXCLUDED.content_body,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    updated_at = NOW()
RETURNING *;

-- name: GetNewsTranslations :many
SELECT * FROM news_article_translations WHERE article_id = $1;

-- name: GetNewsTranslationBySlugAndLang :one
SELECT nt.*, n.id as article_id, n.status, n.published_at, n.category, m.storage_key as featured_image_key
FROM news_article_translations nt
JOIN news_articles n ON nt.article_id = n.id
LEFT JOIN media_files m ON n.featured_image_id = m.id
WHERE nt.slug = $1 AND nt.language_code = $2 AND n.deleted_at IS NULL AND n.status = 'PUBLISHED';
