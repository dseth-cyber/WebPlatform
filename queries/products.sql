-- name: ListProductCategories :many
SELECT * FROM product_categories
WHERE deleted_at IS NULL
ORDER BY sort_order ASC, created_at ASC;

-- name: GetProductCategoryByID :one
SELECT * FROM product_categories WHERE id = $1 AND deleted_at IS NULL;

-- name: GetProductCategoryBySlug :one
SELECT * FROM product_categories WHERE slug = $1 AND deleted_at IS NULL;

-- name: CreateProductCategory :one
INSERT INTO product_categories (slug, sort_order, is_active)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateProductCategory :one
UPDATE product_categories
SET slug = $2, sort_order = $3, is_active = $4, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteProductCategory :exec
UPDATE product_categories
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: UpsertProductCategoryTranslation :one
INSERT INTO product_category_translations (category_id, language_code, name, description)
VALUES ($1, $2, $3, $4)
ON CONFLICT (category_id, language_code) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW()
RETURNING *;

-- name: GetCategoryTranslations :many
SELECT * FROM product_category_translations WHERE category_id = $1;

-- name: ListProducts :many
SELECT p.*, c.slug as category_slug, m.storage_key as featured_image_key
FROM products p
JOIN product_categories c ON p.category_id = c.id
LEFT JOIN media_files m ON p.featured_image_id = m.id
WHERE p.deleted_at IS NULL
  AND (sqlc.narg('category_id')::uuid IS NULL OR p.category_id = sqlc.narg('category_id'))
  AND (sqlc.narg('status')::text IS NULL OR p.status = sqlc.narg('status'))
  AND (sqlc.narg('search')::text IS NULL OR p.sku ILIKE '%' || sqlc.narg('search') || '%')
ORDER BY p.sort_order ASC, p.created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountProducts :one
SELECT COUNT(*) FROM products p
WHERE p.deleted_at IS NULL
  AND (sqlc.narg('category_id')::uuid IS NULL OR p.category_id = sqlc.narg('category_id'))
  AND (sqlc.narg('status')::text IS NULL OR p.status = sqlc.narg('status'))
  AND (sqlc.narg('search')::text IS NULL OR p.sku ILIKE '%' || sqlc.narg('search') || '%');

-- name: GetProductByID :one
SELECT p.*, c.slug as category_slug, m.storage_key as featured_image_key
FROM products p
JOIN product_categories c ON p.category_id = c.id
LEFT JOIN media_files m ON p.featured_image_id = m.id
WHERE p.id = $1 AND p.deleted_at IS NULL;

-- name: GetProductBySKU :one
SELECT * FROM products WHERE sku = $1 AND deleted_at IS NULL;

-- name: CreateProduct :one
INSERT INTO products (
    category_id, sku, status, specifications, sort_order, featured_image_id, created_by, updated_by
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
RETURNING *;

-- name: UpdateProduct :one
UPDATE products
SET category_id = $2,
    sku = $3,
    status = $4,
    specifications = $5,
    sort_order = $6,
    featured_image_id = $7,
    updated_by = $8,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteProduct :exec
UPDATE products
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: RestoreProduct :exec
UPDATE products
SET deleted_at = NULL
WHERE id = $1;

-- name: PermanentDeleteProduct :exec
DELETE FROM products WHERE id = $1;

-- name: UpsertProductTranslation :one
INSERT INTO product_translations (
    product_id, language_code, name, slug, description, features, applications, material, coating_type, meta_title, meta_description
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
ON CONFLICT (product_id, language_code) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    applications = EXCLUDED.applications,
    material = EXCLUDED.material,
    coating_type = EXCLUDED.coating_type,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    updated_at = NOW()
RETURNING *;

-- name: GetProductTranslations :many
SELECT * FROM product_translations WHERE product_id = $1;

-- name: GetProductTranslationBySlugAndLang :one
SELECT pt.*, p.id as product_id, p.sku, p.category_id, p.specifications, p.status, m.storage_key as featured_image_key
FROM product_translations pt
JOIN products p ON pt.product_id = p.id
LEFT JOIN media_files m ON p.featured_image_id = m.id
WHERE pt.slug = $1 AND pt.language_code = $2 AND p.deleted_at IS NULL AND p.status = 'PUBLISHED';

-- name: AddProductImage :one
INSERT INTO product_images (product_id, media_id, sort_order)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DeleteProductImages :exec
DELETE FROM product_images WHERE product_id = $1;

-- name: GetProductImages :many
SELECT pi.*, m.filename, m.storage_key, m.mime_type, m.alt_text
FROM product_images pi
JOIN media_files m ON pi.media_id = m.id
WHERE pi.product_id = $1 AND m.deleted_at IS NULL
ORDER BY pi.sort_order ASC;
