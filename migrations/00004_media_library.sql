-- +goose Up

-- Media Files Table
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    bucket VARCHAR(100) NOT NULL,
    storage_key VARCHAR(500) NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INT NULL,
    height INT NULL,
    hash_sha256 VARCHAR(64) NOT NULL,
    alt_text JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"th": "...", "en": "...", "cn": "...", "mm": "...", "jp": "..."}
    folder VARCHAR(100) NOT NULL DEFAULT 'general',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_media_files_folder ON media_files(folder) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_files_mime ON media_files(mime_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_files_deleted_created ON media_files(deleted_at, created_at);

CREATE TRIGGER set_timestamp_media_files
BEFORE UPDATE ON media_files
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- +goose Down
DROP TABLE IF EXISTS media_files;
