# Security Architecture & Acceptance Criteria Matrix

**Corporate System:** บริษัท ไคโอทรอน เทคโนโลยี จำกัด (CHIOTRON TECHNOLOGY CO., LTD.)  
**Security Baseline:** OWASP Top 10 + Industrial Corporate Security Hardening (Target Score: 9.8 / 10)

---

## 🛡️ Security Acceptance Criteria Matrix

| Security Domain | Mitigation / Technology | Status |
| :--- | :--- | :---: |
| **SQL Injection (SQLi)** | 100% Parameterized queries via `pgx/v5` & `sqlc` compile-time type-safe code generation. Zero string concatenation. | ✅ PASS |
| **Cross-Site Scripting (XSS)** | React JSX auto-escaping + `DOMPurify` sanitizer for all rich content. CSP headers enabled. | ✅ PASS |
| **Cross-Site Request Forgery (CSRF)**| Double Submit Cookie pattern (`X-CSRF-Token` header validated against cryptographically signed cookie). | ✅ PASS |
| **Broken Access Control & RBAC** | Strict role and permission middleware (`Superadmin`, `Editor`) with scope verification per route. | ✅ PASS |
| **Insecure Direct Object Reference (IDOR)**| UUIDv4 non-sequential resource keys with tenant/role authorization check on every entity access. | ✅ PASS |
| **Brute Force & Credential Stuffing** | Token Bucket Rate Limiting (5 requests/sec per IP on auth endpoints) + account lockout. | ✅ PASS |
| **Password Hashing** | Industry-standard **Argon2id** (`time=1, memory=64MB, parallelism=4, salt=16B, key=32B`). | ✅ PASS |
| **Session Security** | Ephemeral UUID session tokens stored in secure PostgreSQL, delivered via `HttpOnly`, `SameSite=Strict` cookies. | ✅ PASS |
| **File Upload Vulnerabilities** | Magic Bytes MIME inspection (`http.DetectContentType`), strictly whitelist extensions, filename sanitization with UUID prefix. | ✅ PASS |
| **Path Traversal** | Canonical path resolution (`filepath.Clean` and `filepath.Abs`) ensuring files never escape storage boundaries. | ✅ PASS |
| **Rate Limiting & DDoS Prevention** | Multi-tier in-memory rate limiting middleware per IP on public and admin routes. | ✅ PASS |
| **Security Headers** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`. | ✅ PASS |
| **Audit Trail (Append-Only)** | Immutable append-only audit log recording Actor, Action, Resource, Before/After Diff, IP, Timestamp. | ✅ PASS |
| **Re-Authentication for Destructive Actions** | Mandatory password verification for Permanent Delete and Empty Trash (5-minute security window). | ✅ PASS |
| **Secrets in Source Code** | **Zero hardcoded credentials**. All secrets injected via environment variables (`.env`). | ❌ NEVER ALLOWED |
| **JWT in localStorage** | Avoided entirely in favor of secure HttpOnly server-backed sessions to eliminate token theft. | ❌ NEVER ALLOWED |
| **Root Container Execution** | Docker multi-stage build runs as non-root user `appuser (10001:10001)`. | ❌ NEVER ALLOWED |
| **Hard Deletion without Trash Bin** | All entities use `deleted_at` soft-delete with Trash Bin recovery prior to permanent purge. | ❌ NEVER ALLOWED |

---

## 🔒 Destructive Action Security Workflow

```
[ Admin requests "Permanent Delete" / "Empty Trash" ]
                      │
                      ▼
[ Backend checks if session has active Re-Auth Token (< 5 min) ]
         ┌────────────┴────────────┐
       VALID                    EXPIRED / NONE
         │                             │
         ▼                             ▼
[ Execute Permanent Purge ]     [ Return 403 Forbidden: Re-Auth Required ]
[ Write Immutable Audit Log ]          │
                                       ▼
                         [ Frontend displays Password Modal ]
                                       │
                                       ▼
                         [ Verify Argon2id Password Hash ]
                                       │
                                       ▼
                         [ Generate 5-min Re-Auth Token ]
```
