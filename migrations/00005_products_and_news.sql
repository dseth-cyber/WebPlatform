-- +goose Up

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_product_categories_slug ON product_categories(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_categories_deleted_created ON product_categories(deleted_at, created_at);

CREATE TRIGGER set_timestamp_product_categories
BEFORE UPDATE ON product_categories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Product Category Translations (5 Languages)
CREATE TABLE IF NOT EXISTS product_category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- th, en, cn, mm, jp
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_category_lang UNIQUE (category_id, language_code)
);

CREATE TRIGGER set_timestamp_product_category_translations
BEFORE UPDATE ON product_category_translations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Products Table (Metal packaging specific: Tin Cans, Chemical Pails, Aerosol, Food Cans, Custom Drums)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, REVIEW, PUBLISHED, ARCHIVED
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb, -- diameter_mm, height_mm, volume_ml, thickness_mm, closure_type, printing_coating
    sort_order INT NOT NULL DEFAULT 0,
    featured_image_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status ON products(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_deleted_created ON products(deleted_at, created_at);

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Product Translations (5 Languages)
CREATE TABLE IF NOT EXISTS product_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- th, en, cn, mm, jp
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    features TEXT,
    applications TEXT, -- food, chemical, paint, lubricant
    material VARCHAR(100), -- Tinplate (ETP), TFS (Tin Free Steel), Aluminum
    coating_type VARCHAR(100), -- Gold lacquer, Clear lacquer, BPA-NI, White enamel
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_lang UNIQUE (product_id, language_code),
    CONSTRAINT uq_product_lang_slug UNIQUE (language_code, slug)
);

CREATE INDEX idx_product_translations_slug ON product_translations(language_code, slug);

CREATE TRIGGER set_timestamp_product_translations
BEFORE UPDATE ON product_translations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Product Images Gallery
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id, sort_order);

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, REVIEW, PUBLISHED, ARCHIVED
    published_at TIMESTAMP WITH TIME ZONE NULL,
    featured_image_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'COMPANY_NEWS', -- COMPANY_NEWS, SUSTAINABILITY, TECHNOLOGY, AWARDS
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_news_status_published ON news_articles(status, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_news_deleted_created ON news_articles(deleted_at, created_at);

CREATE TRIGGER set_timestamp_news_articles
BEFORE UPDATE ON news_articles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- News Article Translations (5 Languages)
CREATE TABLE IF NOT EXISTS news_article_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- th, en, cn, mm, jp
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    summary TEXT,
    content_body TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_news_lang UNIQUE (article_id, language_code),
    CONSTRAINT uq_news_lang_slug UNIQUE (language_code, slug)
);

CREATE INDEX idx_news_translations_slug ON news_article_translations(language_code, slug);

CREATE TRIGGER set_timestamp_news_article_translations
BEFORE UPDATE ON news_article_translations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- +goose Down
DROP TABLE IF EXISTS news_article_translations;
DROP TABLE IF EXISTS news_articles;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_translations;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_category_translations;
DROP TABLE IF EXISTS product_categories;
