-- +goose Up

-- Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, REVIEW, PUBLISHED, ARCHIVED
    published_at TIMESTAMP WITH TIME ZONE NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_pages_slug ON pages(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_pages_status ON pages(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_pages_deleted_created ON pages(deleted_at, created_at);

CREATE TRIGGER set_timestamp_pages
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Page Translations Table (5 Languages: th, en, cn, mm, jp)
CREATE TABLE IF NOT EXISTS page_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- th, en, cn, mm, jp
    title VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_page_lang UNIQUE (page_id, language_code)
);

CREATE INDEX idx_page_translations_lang ON page_translations(language_code);

CREATE TRIGGER set_timestamp_page_translations
BEFORE UPDATE ON page_translations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Page Sections Table (Section-based page builder)
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    section_type VARCHAR(100) NOT NULL, -- hero, feature_cards, products, about, statistics, services, sustainability, certs, news, cta, custom
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    config JSONB NOT NULL DEFAULT '{}'::jsonb, -- layout, background, theme tokens
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_page_sections_page ON page_sections(page_id, sort_order) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_page_sections
BEFORE UPDATE ON page_sections
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Page Section Translations Table
CREATE TABLE IF NOT EXISTS page_section_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- th, en, cn, mm, jp
    title VARCHAR(255),
    subtitle TEXT,
    content_body TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb, -- structured cards, items, links, metrics
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_section_lang UNIQUE (section_id, language_code)
);

CREATE INDEX idx_section_translations_lang ON page_section_translations(language_code);

CREATE TRIGGER set_timestamp_page_section_translations
BEFORE UPDATE ON page_section_translations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Content Revisions Table (Version history & restore)
CREATE TABLE IF NOT EXISTS content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- page, product, news, settings
    entity_id UUID NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    snapshot JSONB NOT NULL,
    change_summary TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_revisions_entity ON content_revisions(entity_type, entity_id, version_number DESC);

-- +goose Down
DROP TABLE IF EXISTS content_revisions;
DROP TABLE IF EXISTS page_section_translations;
DROP TABLE IF EXISTS page_sections;
DROP TABLE IF EXISTS page_translations;
DROP TABLE IF EXISTS pages;
