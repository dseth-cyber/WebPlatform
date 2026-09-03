# Database Architecture & Optimization

**Database Engine:** PostgreSQL 16+  
**Connection Pool:** pgxpool (Max 25 conns, Min 5 conns)  
**Code Generator:** sqlc v1.31+

---

## 1. Core Schema Principles

1. **UUID Primary Keys**: Generated with `gen_random_uuid()` for all entities.
2. **Soft Deletes**: `deleted_at TIMESTAMP WITH TIME ZONE NULL` on all searchable entities (`users`, `pages`, `page_sections`, `products`, `product_categories`, `news_articles`, `media_files`, `contact_inquiries`).
3. **Partial Indexing**: High-performance B-tree indexes filtered by `WHERE deleted_at IS NULL` to prevent bloated index scans.
4. **Append-Only Auditing**: `audit_logs` cannot be modified or deleted via application endpoints.

---

## 2. Table Summary

| Table | Purpose | Index Strategy |
|---|---|---|
| `users` | Admin accounts & statuses | `(email) WHERE deleted_at IS NULL`, `(deleted_at, created_at)` |
| `roles` / `permissions` | RBAC roles and module permissions | `(code)`, `(name)` |
| `user_roles` / `role_permissions` | Composite junction keys | `PRIMARY KEY (user_id, role_id)` |
| `sessions` | Active DB-backed sessions with CSRF | `(session_token)`, `(expires_at)`, `(user_id)` |
| `pages` / `page_translations` | Pages & 5-language meta | `(slug) WHERE deleted_at IS NULL`, `UNIQUE(page_id, language_code)` |
| `page_sections` / `page_section_translations` | Page builder blocks | `(page_id, sort_order) WHERE deleted_at IS NULL` |
| `content_revisions` | Version history snapshots | `(entity_type, entity_id, version_number DESC)` |
| `product_categories` | Packaging classification | `(slug) WHERE deleted_at IS NULL` |
| `products` / `product_translations` | Metal packaging specifications | `(category_id)`, `(sku)`, `UNIQUE(language_code, slug)` |
| `product_images` | Product gallery links | `(product_id, sort_order)` |
| `news_articles` / `news_article_translations` | News and sustainability | `(status, published_at DESC)`, `UNIQUE(language_code, slug)` |
| `media_files` | Media library assets | `(folder)`, `(mime_type)`, `(deleted_at, created_at)` |
| `site_settings` / `theme_configs` | Dynamic site configuration | `(setting_group)`, `(is_public)`, `(code)` |
| `contact_inquiries` | Form submissions & spam status | `(status, created_at DESC) WHERE deleted_at IS NULL` |
| `audit_logs` | Immutable audit trail | `(user_id, created_at DESC)`, `(resource, resource_id)`, `(created_at DESC)` |

---

## 3. Database Aggregation (Zero Go Memory Compute)

All analytics and counts are executed directly in PostgreSQL using `COUNT()`, `GROUP BY`, and `DATE_TRUNC()` rather than loading records into Go memory.
