-- name: CreateContactInquiry :one
INSERT INTO contact_inquiries (name, company_name, email, phone, subject, message, interest_category, ip_address, user_agent, is_spam)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: ListContactInquiries :many
SELECT * FROM contact_inquiries
WHERE deleted_at IS NULL
  AND (sqlc.narg('status')::text IS NULL OR status = sqlc.narg('status'))
  AND (sqlc.narg('is_spam')::boolean IS NULL OR is_spam = sqlc.narg('is_spam'))
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: CountContactInquiries :one
SELECT COUNT(*) FROM contact_inquiries
WHERE deleted_at IS NULL
  AND (sqlc.narg('status')::text IS NULL OR status = sqlc.narg('status'))
  AND (sqlc.narg('is_spam')::boolean IS NULL OR is_spam = sqlc.narg('is_spam'));

-- name: GetContactInquiryByID :one
SELECT * FROM contact_inquiries WHERE id = $1 AND deleted_at IS NULL;

-- name: UpdateContactInquiryStatus :one
UPDATE contact_inquiries
SET status = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteContactInquiry :exec
UPDATE contact_inquiries
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: PermanentDeleteContactInquiry :exec
DELETE FROM contact_inquiries WHERE id = $1;
