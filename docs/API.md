# REST API Reference & Usage Guide

All endpoints return standardized JSON envelopes.

### Standard Response Envelope:
```json
{
  "data": {},
  "metadata": {},
  "error": null
}
```

### Standard Error Envelope:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name and email are required",
    "details": {},
    "requestId": "4fa6e382-7f2a-4340-8ea2-36c5332f913d"
  }
}
```

---

## 1. Public API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/public/pages/{slug}?lang=th` | Localized page with active sections |
| `GET` | `/api/v1/public/products?page=1&pageSize=20&lang=th` | Localized packaging catalog |
| `GET` | `/api/v1/public/products/{slug}?lang=th` | Single product specifications & gallery |
| `GET` | `/api/v1/public/categories?lang=th` | Product categories |
| `GET` | `/api/v1/public/news?lang=th` | News and sustainability updates |
| `GET` | `/api/v1/public/news/{slug}?lang=th` | Single news article |
| `GET` | `/api/v1/public/settings` | Public site configuration & contact details |
| `GET` | `/api/v1/public/theme` | Active theme tokens (`DARK`, `LIGHT`, `MODERN`) |
| `POST` | `/api/v1/public/contact` | Submit contact inquiry (with honeypot check) |
| `GET` | `/healthz` | Liveness probe |
| `GET` | `/readyz` | Readiness probe (database connectivity) |

---

## 2. Admin API Endpoints

### Authentication
- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/auth/logout`
- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/reauth`

### Page Builder & Content
- `GET /api/v1/admin/pages`
- `POST /api/v1/admin/pages`
- `GET /api/v1/admin/pages/{id}`
- `DELETE /api/v1/admin/pages/{id}`
- `POST /api/v1/admin/pages/{id}/publish`
- `POST /api/v1/admin/pages/{id}/unpublish`
- `GET /api/v1/admin/pages/{id}/revisions`
- `POST /api/v1/admin/pages/{id}/sections`
- `PUT /api/v1/admin/pages/{id}/sections/reorder`
- `DELETE /api/v1/admin/pages/{id}/sections/{sectionId}`

### Product Catalog
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `GET /api/v1/admin/products/{id}`
- `DELETE /api/v1/admin/products/{id}`
- `GET /api/v1/admin/product-categories`
- `POST /api/v1/admin/product-categories`

### Media Library
- `GET /api/v1/admin/media`
- `POST /api/v1/admin/media` (multipart/form-data)
- `PUT /api/v1/admin/media/{id}/replace`
- `DELETE /api/v1/admin/media/{id}`

### Settings & Themes
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings`
- `GET /api/v1/admin/themes`
- `PUT /api/v1/admin/themes/active`

### Audit Logs & Trash Bin
- `GET /api/v1/admin/audit-logs`
- `POST /api/v1/admin/trash/{entityType}/{id}/restore`
- `POST /api/v1/admin/trash/{entityType}/{id}/permanent` *(Requires Re-Auth)*
- `POST /api/v1/admin/trash/empty` *(Requires Re-Auth)*
