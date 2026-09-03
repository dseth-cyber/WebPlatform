# Lohakit Rungchareonsap Corporate Website CMS Backend

Production-grade corporate website CMS backend for **บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด (LOHAKIT RUNGCHAREONSAP CO., LTD.)**, leading metal packaging manufacturer in Thailand (Food-grade tin cans, chemical pails, aerosol cans, and easy-open closures).

Built with **Go 1.24+**, **Chi HTTP Router**, **PostgreSQL 16+ (pgx/sqlc)**, **MinIO / S3 Storage Abstraction**, and **Docker**.

---

## 🌟 Key Features

- **Multi-Language Architecture**: 5 UI & Content Languages (`th` Thai, `en` English, `cn` Chinese, `mm` Myanmar, `jp` Japanese) with automated fallback hierarchy (`cn/mm/jp -> en -> th`, `en -> th`).
- **Section-Based Page Builder**: Dynamic section composition (`hero`, `feature_cards`, `products`, `about`, `statistics`, `services`, `sustainability`, `certs`, `news`, `cta`) with activation, ordering, and configuration.
- **Metal Packaging Catalog**: Specialized technical attributes (diameters, heights, coating types, BPA-NI compliance, UN packaging ratings).
- **Vendor-Independent Storage**: Unified `StorageProvider` interface supporting MinIO, AWS S3, or local filesystem with MIME magic sniffing and path traversal defense.
- **Enterprise Security (Score 9.8/10)**:
  - Argon2id password hashing
  - Database-backed sessions with secure `HttpOnly`, `SameSite=Strict` cookies
  - Synchronized CSRF token verification
  - Dynamic token bucket rate limiting per IP
  - Append-only immutable audit trail with actor IP, UA, old/new diffs
  - Re-authentication password guard for permanent deletion and trash emptying
- **Zero Paid SaaS Dependencies**: Fully self-hosted on Docker Compose (Postgres, MinIO, Go API, Nginx).

---

## 🚀 Quick Start (Docker Compose)

### 1. Clone & Configure Environment
```bash
cp .env.example .env
```

### 2. Start Services
```bash
docker compose up -d --build
```

### 3. Run Database Seeder
```bash
docker compose exec api /app/seeder
```

Default Superadmin Credentials:
- **Email**: `admin@lohakit.co.th`
- **Password**: `AdminLohakit2026!`

---

## 🛠 Local Development

```bash
# Install dependencies
go mod download

# Run test suite
go test -v ./...

# Start server
go run cmd/server/main.go
```

---

## 📚 Complete Documentation Suite

- [Architecture & System Design](docs/ARCHITECTURE.md)
- [Database Schema & ERD](docs/DATABASE.md)
- [REST API Specification](docs/API.md)
- [OpenAPI 3.0 Specification](docs/openapi.yaml)
- [Security Model & Hardening](docs/SECURITY.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Backup & Disaster Recovery](docs/BACKUP.md)
- [คู่มือการใช้งานระบบจัดการเว็บไซต์ (ภาษาไทย)](docs/SERVICE_MANUAL_TH.md)
