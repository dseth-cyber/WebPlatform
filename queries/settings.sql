-- name: ListSiteSettings :many
SELECT * FROM site_settings
ORDER BY setting_group ASC, setting_key ASC;

-- name: ListPublicSettings :many
SELECT setting_key, value FROM site_settings
WHERE is_public = TRUE;

-- name: GetSettingByKey :one
SELECT * FROM site_settings WHERE setting_key = $1;

-- name: UpsertSetting :one
INSERT INTO site_settings (setting_group, setting_key, value, is_public, description, updated_by)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (setting_key) DO UPDATE
SET setting_group = EXCLUDED.setting_group,
    value = EXCLUDED.value,
    is_public = EXCLUDED.is_public,
    description = EXCLUDED.description,
    updated_by = EXCLUDED.updated_by,
    updated_at = NOW()
RETURNING *;

-- name: ListThemeConfigs :many
SELECT * FROM theme_configs
ORDER BY code ASC;

-- name: GetActiveThemeConfig :one
SELECT * FROM theme_configs
WHERE is_active = TRUE
LIMIT 1;

-- name: SetActiveTheme :exec
UPDATE theme_configs
SET is_active = (code = $1),
    updated_at = NOW();

-- name: UpsertThemeConfig :one
INSERT INTO theme_configs (code, name, is_active, tokens)
VALUES ($1, $2, $3, $4)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    tokens = EXCLUDED.tokens,
    updated_at = NOW()
RETURNING *;
