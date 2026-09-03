-- +goose Up

-- Site Settings Table (Generic JSONB settings)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_group VARCHAR(100) NOT NULL, -- company, contact, seo, legal, cookie, general
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_settings_group ON site_settings(setting_group);
CREATE INDEX idx_site_settings_public ON site_settings(is_public);

CREATE TRIGGER set_timestamp_site_settings
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Theme Configurations Table (DARK, LIGHT, MODERN)
CREATE TABLE IF NOT EXISTS theme_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE, -- DARK, LIGHT, MODERN
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    tokens JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_theme_configs
BEFORE UPDATE ON theme_configs
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- +goose Down
DROP TABLE IF EXISTS theme_configs;
DROP TABLE IF EXISTS site_settings;
