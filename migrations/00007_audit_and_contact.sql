-- +goose Up

-- Audit Logs Table (Append-only)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH, RESTORE, PERMANENT_DELETE, LOGIN, LOGOUT, REAUTH
    resource VARCHAR(100) NOT NULL, -- page, section, product, news, media, setting, theme, user, role
    resource_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    old_values JSONB NULL,
    new_values JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    interest_category VARCHAR(100) NOT NULL DEFAULT 'GENERAL', -- GENERAL, TIN_CANS, METAL_DRUMS, AEROSOL, CUSTOM_PACKAGING
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, READ, CONTACTED, ARCHIVED
    is_spam BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_contact_inquiries_deleted_created ON contact_inquiries(deleted_at, created_at);

CREATE TRIGGER set_timestamp_contact_inquiries
BEFORE UPDATE ON contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- +goose Down
DROP TABLE IF EXISTS contact_inquiries;
DROP TABLE IF EXISTS audit_logs;
