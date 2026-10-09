# Willy Nilly Horticulture & Agro Tourism — Application Security Documentation

## 1. Security Overview

The Willy Nilly platform incorporates defensive, multi-layered security controls designed in compliance with the **OWASP Top 10 (2021)**, **OWASP Web Security Testing Guide (WSTG v4.2)**, and relevant **SANS/CWE Top 25 Most Dangerous Software Weaknesses**.

---

## 2. Threat Modeling & Scope Boundaries

### Protected Asset Classification
1. **Public Information & Catalogues:** Public read access (Rooms, Farm House, Horticulture, Gallery, Business Details).
2. **Shop Rental Module:** Guarded by `SiteSettings.shopRentalActive`. Deactivation blocks public navigation and server endpoints with `404 Not Found`.
3. **Resort Bookings:** Strictly disabled across the entire system.
4. **Online Payments:** Explicitly omitted from MVP scope. No credit card or banking data stored or processed.
5. **Customer Accounts:** Visitors do not register or maintain passwords. All visitor interactions occur through validated request forms.
6. **Administrator Credentials & Data:** Stored with bcrypt hashing (12 rounds) and protected behind HttpOnly, SameSite cookies.

---

## 3. Defense Implementation Matrix

### 3.1 OWASP A01:2021 — Broken Access Control (SANS CWE-862, CWE-306, CWE-285)
- **Zero Trust Role Verification:** Every protected endpoint (`/api/rooms` POST/PATCH/DELETE, `/api/bookings` GET/PATCH, `/api/enquiries` GET/PATCH, `/api/upload`, `/api/settings` PUT) explicitly invokes `requireAdmin(req)`.
- **Instant Session Revocation:** Administrator accounts feature a `tokenVersion` counter. Changing the counter invalidates all issued session tokens immediately.
- **Deactivated Account Termination:** Even if a valid JWT is presented, `requireAdmin` performs a database lookup to ensure `isActive === true`.

### 3.2 OWASP A02:2021 — Cryptographic Failures (SANS CWE-327)
- **Password Hashing:** Passwords hashed with `bcryptjs` using 12 salt rounds.
- **Stateless Session Tokens:** Signed using `jose` with HS256 and a 256-bit cryptographically secure secret key (`JWT_SECRET`).
- **Transport Security:** Production headers enforce `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

### 3.3 OWASP A03:2021 — Injection (SANS CWE-89, CWE-943, CWE-79)
- **NoSQL Injection Defense:** All incoming JSON payloads pass through `sanitizeNoSql()`, recursively stripping any object keys containing `$` (e.g. `$where`, `$gt`, `$ne`) or `.`.
- **Prototype Pollution Defense:** Keys matching `__proto__`, `constructor`, or `prototype` are stripped prior to processing.
- **XSS Defense:** React JSX automatically escapes dangerous markup. Input fields are strictly typed via Zod schemas.
- **Path Traversal Defense (CWE-22):** Uploaded files never retain client-supplied file paths or names. Random UUIDs are generated for filesystem persistence.

### 3.4 OWASP A04:2021 — Insecure Design (SANS CWE-799)
- **Resort Booking Lock:** Even if a client sends `{ bookingEnabled: true }` in a request, `updateResortContent()` forcefully overrides it to `false`.
- **Shop Rental Module Lock:** Server-side services check module activation status prior to querying or saving enquiries.
- **Rate Limiting:** Sliding window limiter prevents brute force attacks:
  - Admin login: 5 requests / 5 minutes per IP (`RATE_LIMIT_LOGIN_MAX`).
  - Public booking and enquiry submissions: 20 requests / 60 seconds per IP (`RATE_LIMIT_PUBLIC_MAX`).

### 3.5 OWASP A05:2021 — Security Misconfiguration (SANS CWE-16)
- **Security Headers:** Enforced via `next.config.mjs`:
  - `X-Frame-Options: DENY` (Clickjacking defense)
  - `X-Content-Type-Options: nosniff` (MIME sniffing defense)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-DNS-Prefetch-Control: on`
  - `poweredByHeader: false` (Suppresses `X-Powered-By: Next.js`)
- **Error Obfuscation:** In production, internal stack traces and database errors are suppressed. Clients receive generic error codes and user-friendly messages while details are logged server-side.

### 3.6 OWASP A07:2021 — Identification & Authentication Failures (SANS CWE-287, CWE-384)
- **HttpOnly Cookies:** Authentication tokens are stored exclusively in HttpOnly cookies with `SameSite: 'lax'` and `Secure: true` (in production).
- **Session Expiry:** Cookies expire after 24 hours (`SESSION_MAX_AGE_SECONDS=86400`).
- **Account Enumeration Defense:** The login service uses constant-time comparison techniques when an unrecognized email is queried.

### 3.7 OWASP A08:2021 — Software and Data Integrity Failures (SANS CWE-352, CWE-434)
- **CSRF Protection (CWE-352):** State-changing requests (POST, PUT, PATCH, DELETE) are validated by `verifyCsrf()` checking `Origin` and `Host` headers, as well as `X-Requested-With` AJAX tokens.
- **Unrestricted File Upload Defense (CWE-434):**
  - Maximum upload size capped at 5MB (`UPLOAD_MAX_BYTES=5242880`).
  - Allowed MIME types strictly limited to `image/jpeg`, `image/png`, and `image/webp`.
  - **Magic Number / Binary Signature Validation:** The first bytes of the uploaded file buffer are inspected (`0xFFD8FF` for JPEG, `0x89504E47` for PNG, `RIFF...WEBP` for WebP). Executable scripts, HTML, and SVGs are rejected.
  - Files are renamed using `crypto.randomUUID()` with verified extensions and stored under `public/uploads`.

### 3.8 OWASP A09:2021 — Security Logging and Monitoring Failures (SANS CWE-778)
- **Structured Redacted Logging:** All logs output JSON format with ISO timestamps and unique `X-Request-Id` UUIDs.
- **Sensitive Data Masking:** The logger automatically redacts passwords, tokens, cookies, authorization headers, and credit card numbers.
- **Audit Trails:** Significant administrative actions (room updates, status changes, module toggles, logins, logouts) write permanent audit records to the `AuditLog` collection.
