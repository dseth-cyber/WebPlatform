# System Architecture & Technical Specifications

**Client:** บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด (LOHAKIT RUNGCHAREONSAP CO., LTD.)  
**Industry:** Metal Packaging Manufacturing (Tin Cans, Industrial Pails, Closures)

---

## 1. Architectural Philosophy

The backend is architected following Clean Modular Architecture and Go idioms:
- **Zero Paid SaaS Dependencies**: The complete infrastructure runs independently on open-source components (PostgreSQL 16, MinIO, Nginx, Go standard library).
- **Explicit SQL Access (sqlc + pgx/v5)**: Zero reflection ORM overhead; all SQL queries are compile-time verified and indexed.
- **Storage Provider Abstraction**: A unified `StorageProvider` interface shields business logic from storage vendor specifics.
- **Strict Separation of Concerns**: Public APIs (`/api/v1/public/*`) never leak admin identities, private configurations, or soft-deleted records.

---

## 2. Multi-Language Content Engine

The system natively supports 5 target languages:
1. `th` - Thai (Root Fallback)
2. `en` - English
3. `cn` - Chinese (Simplified)
4. `mm` - Myanmar
5. `jp` - Japanese

### Fallback Cascade Matrix:
```
Request: cn  -->  Fallback: cn  -->  en  -->  th
Request: mm  -->  Fallback: mm  -->  en  -->  th
Request: jp  -->  Fallback: jp  -->  en  -->  th
Request: en  -->  Fallback: en  -->  th
Request: th  -->  Fallback: th
```

---

## 3. Dynamic Section Page Builder

Pages are composed of flexible sections stored as JSONB configurations:
- `hero`: Header banner, video background, CTA buttons, badges
- `feature_cards`: Value propositions (e.g. food safety, sustainability)
- `products`: Featured packaging categories and items
- `about`: Factory history, mission, registered capital
- `statistics`: Annual capacity, square meters, quality pass rates
- `services`: OEM/ODM custom tinplate fabrication, offset printing
- `sustainability`: 100% infinite recyclability, green manufacturing
- `certifications`: ISO 9001:2015, FSSC 22000, UN packaging ratings
- `news`: Company press releases, industry articles
- `cta`: Contact and request quotation triggers

Admins can activate/deactivate, reorder, duplicate, and restore revisions without modifying any Go code.
