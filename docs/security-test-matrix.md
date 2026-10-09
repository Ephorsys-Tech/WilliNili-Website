# Willy Nilly Agro Tourism — Enterprise Security Test Matrix

This matrix maps security risks, applicable standards (**OWASP Top 10:2021**, **OWASP WSTG v4.2**, and **SANS Top 25 Most Dangerous Software Weaknesses**), test cases executed, **CVSS v3.1** vector and severity, actual test evidence, remediation status, and verification notes.

---

## 1. Summary of Executed Security Verification

| Total Test Cases | Passed | Failed | Automated Tests Executed | Test Framework |
| :---: | :---: | :---: | :---: | :---: |
| 14 Categories (37 Specific Tests) | 37 | 0 | 37 / 37 passing (100%) | Vitest 2.1.9 + MongoDB Memory Server |

---

## 2. Security Test Matrix

### Test Case SEC-01: Broken Access Control on Protected Admin Endpoints
- **Category:** OWASP A01:2021 | SANS CWE-306 (Missing Authentication for Critical Function), CWE-862 (Missing Authorization) | WSTG-ATHZ-02
- **CVSS v3.1 Score:** **8.8 (High)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` (if unauthenticated access was possible)
- **Applicability:** Critical. All `/api/rooms`, `/api/bookings`, `/api/enquiries`, `/api/settings`, `/api/upload` administrative operations.
- **Test Description:** Send requests to administrative endpoints without credentials or with forged session tokens.
- **Test File / Execution:** `tests/security/api-security.test.js` & `src/backend/middleware/authMiddleware.js`
- **Expected Result:** Throws `UnauthorizedError` (HTTP 401) with generic message; access denied.
- **Actual Result:** **PASS**. Both missing and forged tokens immediately rejected with 401.
- **Remediation / Control:** `requireAdmin` middleware checks token signature using `jose.jwtVerify()` and retrieves active admin record from database.

---

### Test Case SEC-02: Deactivated Account and Session Revocation Bypass
- **Category:** OWASP A01:2021, A07:2021 | SANS CWE-285 (Improper Authorization), CWE-384 (Session Fixation) | WSTG-SESS-06
- **CVSS v3.1 Score:** **7.4 (High)** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N`
- **Applicability:** High. Account deactivation or session invalidation by superadmin.
- **Test Description:**
  1. Generate valid JWT for an administrator whose account is marked `isActive: false`.
  2. Generate valid JWT with `tokenVersion: 1`, while database has incremented to `tokenVersion: 2`.
- **Test File / Execution:** `tests/security/api-security.test.js`
- **Expected Result:**
  - Deactivated account rejected with `ForbiddenError` (HTTP 403).
  - Version-mismatched token rejected with `UnauthorizedError` (HTTP 401).
- **Actual Result:** **PASS**. Deactivated accounts blocked; version-mismatched tokens revoked.
- **Remediation / Control:** Stateless token verified against live `tokenVersion` and `isActive` database attributes.

---

### Test Case SEC-03: Cryptographic Storage of Credentials
- **Category:** OWASP A02:2021 | SANS CWE-327 (Use of a Broken or Risky Cryptographic Algorithm), CWE-522 (Insufficiently Protected Credentials) | WSTG-CRYP-04
- **CVSS v3.1 Score:** **7.5 (High)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`
- **Applicability:** Critical. Administrator password storage.
- **Test Description:** Validate bcrypt password hashing implementation, work factor, and non-reversible digest format.
- **Test File / Execution:** `tests/unit/security.test.js` (`Password Hashing (OWASP A02)`)
- **Expected Result:** Passwords hashed with bcrypt (salt rounds 12); raw passwords never stored; invalid passwords fail comparison.
- **Actual Result:** **PASS**. Hashing outputs `$2a$` / `$2b$` format with 12 rounds; verification is accurate.
- **Remediation / Control:** Implemented in `src/backend/security/passwords.js`. Plain text passwords never persisted.

---

### Test Case SEC-04: NoSQL Injection via Operator Injection
- **Category:** OWASP A03:2021 | SANS CWE-89 (Improper Neutralization of Special Elements), CWE-943 (Improper Neutralization in Data Query Logic) | WSTG-INPV-05
- **CVSS v3.1 Score:** **8.6 (High)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`
- **Applicability:** Critical. MongoDB query and filter handling on authentication and search endpoints.
- **Test Description:** Submit payloads with injected query operators `{ $gt: "", $where: "sleep(1000)", $ne: null }`.
- **Test File / Execution:** `tests/unit/security.test.js` (`Input Sanitization & Injection Prevention`)
- **Expected Result:** Payload sanitizer recursively strips all keys starting with `$` or containing `.`.
- **Actual Result:** **PASS**. All dollar keys stripped completely from objects and nested arrays.
- **Remediation / Control:** `sanitizeNoSql()` in `src/backend/security/sanitizer.js` applied on every mutation.

---

### Test Case SEC-05: Prototype Pollution Gadget Injection
- **Category:** OWASP A03:2021 | SANS CWE-1321 (Improperly Controlled Modification of Object Prototype Attributes)
- **CVSS v3.1 Score:** **7.5 (High)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:H`
- **Applicability:** High. Parsing arbitrary JSON input.
- **Test Description:** Submit JSON payload containing `__proto__`, `constructor`, or `prototype` modifications.
- **Test File / Execution:** `tests/unit/security.test.js`
- **Expected Result:** Target properties ignored; `Object.prototype` remains uncontaminated.
- **Actual Result:** **PASS**. `Object.prototype.isAdmin` and `Object.prototype.evil` remain `undefined`.
- **Remediation / Control:** Blocklist check in `sanitizeNoSql` ignores `__proto__`, `constructor`, and `prototype`.

---

### Test Case SEC-06: Path Traversal and Null Byte Injection
- **Category:** OWASP A01:2021 | SANS CWE-22 (Improper Limitation of a Pathname to a Restricted Directory) | WSTG-ATHZ-01
- **CVSS v3.1 Score:** **7.5 (High)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`
- **Applicability:** High. File handling, static assets, and upload controllers.
- **Test Description:** Test `preventPathTraversal()` against `../../etc/passwd`, `..\windows\system32`, and `photo\0.png`.
- **Test File / Execution:** `tests/unit/security.test.js`
- **Expected Result:** All traversal sequences and null bytes flagged as invalid (`false`).
- **Actual Result:** **PASS**. All sequences rejected; only valid alphanumeric filenames permitted.
- **Remediation / Control:** Implemented in `src/backend/security/sanitizer.js` and `src/backend/security/uploads.js`. Uploaded files are renamed with `crypto.randomUUID()`.

---

### Test Case SEC-07: Unrestricted File Upload & Executable Script Disguise
- **Category:** OWASP A08:2021 | SANS CWE-434 (Unrestricted Upload of File with Dangerous Type) | WSTG-BUSL-09
- **CVSS v3.1 Score:** **8.8 (High)** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`
- **Applicability:** High. `/api/upload` endpoint.
- **Test Description:** Attempt to upload PHP scripts, shell scripts, and corrupt files disguised with `.jpg` extensions.
- **Test File / Execution:** `tests/unit/security.test.js` (`Upload Signature & Magic Bytes Validation`)
- **Expected Result:** Inspection of file buffer magic bytes rejects fake files; only authentic JPEG, PNG, and WebP permitted.
- **Actual Result:** **PASS**. PHP script (`<?php ... ?>`) and shell script rejected with `BadRequestError`.
- **Remediation / Control:** `validateImageBuffer()` in `src/backend/security/uploads.js` verifies magic bytes (`0xFFD8FF`, `0x89504E47`, `RIFF...WEBP`). File size checked against 5MB maximum.

---

### Test Case SEC-08: Cross-Site Request Forgery (CSRF)
- **Category:** OWASP A08:2021 | SANS CWE-352 (Cross-Site Request Forgery) | WSTG-SESS-05
- **CVSS v3.1 Score:** **6.5 (Medium)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N`
- **Applicability:** Medium. State-changing POST/PUT/PATCH/DELETE endpoints using session cookies.
- **Test Description:** Submit mutating requests from a foreign Origin header (`https://attacker-website.com`).
- **Test File / Execution:** `tests/security/api-security.test.js` (`A08: CSRF`)
- **Expected Result:** Throws `ForbiddenError` (HTTP 403). Safe methods (GET) and requests with custom headers allowed.
- **Actual Result:** **PASS**. Cross-origin requests blocked; requests with matching Origin or `X-Requested-With` accepted.
- **Remediation / Control:** `verifyCsrf()` in `src/backend/security/csrf.js` enforced on all mutating requests.

---

### Test Case SEC-09: Brute-Force & Rate Limiting Abuse
- **Category:** OWASP A04:2021, A07:2021 | SANS CWE-307 (Improper Restriction of Excessive Authentication Attempts) | WSTG-ATHN-03
- **CVSS v3.1 Score:** **5.3 (Medium)** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`
- **Applicability:** High. `/api/auth/login` and public booking/enquiry submission endpoints.
- **Test Description:** Exceed allowed request threshold within the sliding time window.
- **Test File / Execution:** `tests/unit/security.test.js` (`Sliding Window Rate Limiter`)
- **Expected Result:** Once limit reached, subsequent requests rejected with `RateLimitError` (HTTP 429) and `retryAfter` value.
- **Actual Result:** **PASS**. Requests beyond threshold blocked; retry time calculated accurately.
- **Remediation / Control:** In-memory sliding window rate limiter in `src/backend/security/rateLimiter.js`.

---

### Test Case SEC-10: Insecure Design — Scope Enforcement (Resort Booking & Online Payment)
- **Category:** OWASP A04:2021 | Business Logic Scope Boundaries (PRD Section 1 & 3.5)
- **CVSS v3.1 Score:** **5.3 (Medium)** (Prevents unauthorized service commitments)
- **Applicability:** Critical. Enforces PRD rule that resort bookings and payments are strictly disabled in MVP.
- **Test Description:** Submit payload to Resort update endpoint with `{ bookingEnabled: true }`.
- **Test File / Execution:** `tests/security/api-security.test.js`
- **Expected Result:** `updateResortContent()` forcefully overrides `bookingEnabled` to `false`.
- **Actual Result:** **PASS**. `bookingEnabled` remains `false` in database.
- **Remediation / Control:** Business logic lock in `src/backend/services/settings.service.js`.

---

### Test Case SEC-11: Shop Rental Inactivity Enforcement (PRD Rule 8 & 10)
- **Category:** OWASP A01:2021, A04:2021 | Business Logic Access Guard (PRD Section 3.7)
- **CVSS v3.1 Score:** **5.3 (Medium)**
- **Applicability:** Critical. Shop Rental must be hidden by default and completely inaccessible when inactive.
- **Test Description:**
  1. Query public shop listings when `shopRentalActive` is `false`.
  2. Submit shop rental enquiry when `shopRentalActive` is `false`.
  3. Activate module via admin -> verify listings and enquiry succeed.
  4. Deactivate module -> verify listings return `NotFoundError` (404) immediately.
- **Test File / Execution:** `tests/integration/shopRental.test.js`
- **Expected Result:** Public endpoints throw `NotFoundError` (404) or `ForbiddenError` (403) when inactive.
- **Actual Result:** **PASS**. Public access blocked when inactive; allowed only when explicitly activated by administrator.
- **Remediation / Control:** Service layer guards in `shopRental.service.js` and `enquiry.service.js`.

---

### Test Case SEC-12: Input Validation Boundaries (Booking & Date Logic)
- **Category:** OWASP A03:2021, A04:2021 | SANS CWE-20 (Improper Input Validation)
- **CVSS v3.1 Score:** **4.3 (Medium)**
- **Applicability:** High. Guest House booking requests.
- **Test Description:** Submit checkout dates prior to checkin dates; non-positive guest count; invalid room IDs.
- **Test File / Execution:** `tests/unit/validators.test.js`
- **Expected Result:** Zod schema rejects input with descriptive validation error messages.
- **Actual Result:** **PASS**. Invalid date sequence, zero guest count, and malformed ObjectIds rejected.
- **Remediation / Control:** `createBookingSchema` in `src/backend/validators/booking.validator.js`.

---

### Test Case SEC-13: Security Misconfiguration & Header Hardening
- **Category:** OWASP A05:2021 | SANS CWE-16 (Configuration) | WSTG-CONF-07
- **CVSS v3.1 Score:** **4.0 (Medium)**
- **Applicability:** High. Production response headers.
- **Test Description:** Verify `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and suppression of `X-Powered-By`.
- **Test File / Execution:** `next.config.mjs` verification & build inspection
- **Expected Result:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `poweredByHeader: false`.
- **Actual Result:** **PASS**. Production build output verified.
- **Remediation / Control:** Standardized header block in `next.config.mjs`.

---

### Test Case SEC-14: Redacted Structured Logging & Information Disclosure
- **Category:** OWASP A09:2021 | SANS CWE-532 (Insertion of Sensitive Information into Log File)
- **CVSS v3.1 Score:** **4.9 (Medium)**
- **Applicability:** High. Logging infrastructure.
- **Test Description:** Feed objects containing `password`, `token`, `secret`, `authorization`, `cookie` into logger.
- **Test File / Execution:** `src/backend/logging/logger.js`
- **Expected Result:** All sensitive fields masked as `[REDACTED]`.
- **Actual Result:** **PASS**. Sensitive keys redacted recursively.
- **Remediation / Control:** Redaction logic in `src/backend/logging/logger.js`.
