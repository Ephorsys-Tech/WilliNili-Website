# Willy Nilly Horticulture & Agro Tourism — Architecture Documentation

## 1. Executive Summary

Willy Nilly is an enterprise-grade web application built for **Mr. Sarat Kumar Singh** to represent the Willy Nilly Horticulture & Agro Tourism destination. The system follows a clean architecture pattern separating public client interfaces, administrative management portals, client API callers, server controllers, services, database models, and security layers.

The project is developed using **Next.js App Router** with **pure JavaScript** (`.js` and `.jsx`, zero TypeScript), **MongoDB (Mongoose)**, and a **dynamic design token system** supporting runtime theme switching across curated palettes.

---

## 2. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (ESNext, React 18)
- **Database:** MongoDB 7.0+ via Mongoose 8 (with connection caching & pooling)
- **Security & Cryptography:** `bcryptjs` (salt rounds 12), `jose` (HS256 JWTs), `crypto`
- **Validation:** Zod 3 schema validation on every inbound request
- **Styling:** Tailwind CSS + CSS Custom Properties Design Tokens (Dynamic Themes)
- **Testing:** Vitest 2 + MongoDB Memory Server for isolated integration & security tests
- **Icons:** Lucide React

---

## 3. Directory Structure

```
willy-nilly/
├── public/
│   ├── images/                  # Static brand photography & visual assets
│   ├── icons/                   # Custom icons & badges
│   └── uploads/                 # Strictly controlled image storage (UUID named)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (website)/           # Public visitor routes (Header + Footer layout)
│   │   │   ├── page.jsx         # Home page with hero, categories, features
│   │   │   ├── about/           # About Us & Founder profile (Mr. Sarat Kumar Singh)
│   │   │   ├── guest-house/     # Guest House room listing & details
│   │   │   │   ├── [roomId]/    # Room detail view
│   │   │   │   └── booking/     # Booking request form (Reference: WN-BK-YYYYMMDD-XXXX)
│   │   │   ├── farm-house/      # Farm House open celebration grounds & event enquiry
│   │   │   ├── resort/          # Resort showcase (Launching Soon, bookings disabled)
│   │   │   ├── horticulture/    # Plant catalogue & purchase enquiry
│   │   │   │   └── [plantId]/   # Plant detail & order enquiry
│   │   │   ├── shop-rental/     # Commercial shops (Guarded: 404 when inactive)
│   │   │   │   └── [shopId]/    # Shop detail & lease enquiry
│   │   │   ├── gallery/         # Categorized photo gallery with lightbox modal
│   │   │   ├── contact/         # Contact guide, map transit, and contact form
│   │   │   └── enquiry/         # General service enquiry form
│   │   ├── (admin-auth)/        # Administrator login page
│   │   │   └── admin/login/     # Protected login with brute-force rate limiting
│   │   ├── admin/               # Authenticated Administrator management console
│   │   │   ├── layout.jsx       # Session verification guard & AdminSidebar
│   │   │   ├── page.jsx         # Overview dashboard with live real-time metrics
│   │   │   ├── business-info/   # Business identity & founder management
│   │   │   ├── guest-house/     # Room inventory, tariffs, and amenities
│   │   │   ├── bookings/        # Booking request review & status transition
│   │   │   ├── farm-house/      # Farm house capacity, lawn info & facilities
│   │   │   ├── resort/          # Resort concept & launching message
│   │   │   ├── horticulture/    # Plant catalogue & stock management
│   │   │   ├── shop-rental/     # Module activation toggle & shop units
│   │   │   ├── gallery/         # Photo upload, curation, and ordering
│   │   │   ├── enquiries/       # Unified customer message pipeline
│   │   │   └── settings/        # Dynamic theme switcher & server health
│   │   ├── api/                 # Next.js Route Handlers (Server-only endpoints)
│   │   │   ├── auth/            # /login, /logout, /session
│   │   │   ├── bookings/        # POST (public request), GET/PATCH (admin)
│   │   │   ├── enquiries/       # POST (public enquiry), GET/PATCH (admin)
│   │   │   ├── rooms/           # GET (public/admin), POST/PATCH/DELETE (admin)
│   │   │   ├── farm-house/      # GET (public), PUT (admin)
│   │   │   ├── horticulture/    # GET (public), POST/PATCH/DELETE (admin)
│   │   │   ├── shop-rental/     # GET (guarded 404 if inactive), POST (admin)
│   │   │   ├── shop-rental/toggle # POST (admin activation toggle)
│   │   │   ├── gallery/         # GET (public/admin), POST/PATCH/DELETE (admin)
│   │   │   ├── resort/          # GET (public), PUT (admin)
│   │   │   ├── settings/        # GET (public), PUT (admin)
│   │   │   ├── upload/          # POST (admin secure image upload)
│   │   │   └── health/          # GET (MongoDB status & server uptime)
│   │   ├── layout.jsx           # Root layout with ThemeProvider & metadata
│   │   ├── globals.css          # CSS tokens & dynamic theme classes
│   │   ├── loading.jsx          # Accessible loading spinner
│   │   ├── error.jsx            # Error boundary with retry
│   │   └── not-found.jsx        # 404 handler
│   │
│   ├── api/                     # CLIENT-SIDE API callers ONLY (Safe for browser)
│   │   ├── client.js            # Fetch wrapper with JSON parsing & error normalization
│   │   ├── auth.api.js          # loginAdmin, logoutAdmin, getAdminSession
│   │   ├── booking.api.js       # submitBookingRequest, getAdminBookings, updateBookingStatus
│   │   ├── enquiry.api.js       # submitEnquiry, getAdminEnquiries, updateEnquiryStatus
│   │   ├── room.api.js          # getPublicRooms, getAdminRooms, createRoom, updateRoom
│   │   ├── farm-house.api.js    # getFarmHouseContent, updateFarmHouseContent
│   │   ├── horticulture.api.js  # getPublicPlants, createPlant, updatePlant, archivePlant
│   │   ├── shop-rental.api.js   # getPublicShops, toggleShopRentalModule, createShop
│   │   ├── gallery.api.js       # getPublicGallery, createGalleryItem, deleteGalleryItem
│   │   └── settings.api.js      # getPublicSettings, updateAdminSettings, uploadImage
│   │
│   ├── backend/                 # SERVER-ONLY application layer (Never imported in client)
│   │   ├── config/              # env.js (Zod validation), db.js (Mongoose cache)
│   │   ├── errors/              # AppError hierarchy (NotFoundError, UnauthorizedError...)
│   │   ├── logging/             # logger.js (Redacted JSON structured logger)
│   │   ├── middleware/          # authMiddleware.js, routeHandler.js (Unified wrapper)
│   │   ├── security/            # passwords.js, tokens.js, rateLimiter.js, sanitizer.js, csrf.js, uploads.js
│   │   ├── services/            # auth, booking, enquiry, room, plant, shopRental, gallery, settings, dashboard
│   │   └── validators/          # Zod schemas for all inbound mutations
│   │
│   ├── models/                  # Mongoose Models (Admin, Room, BookingRequest, FarmHouse, Resort, Plant, ShopRental, GalleryItem, Enquiry, SiteSettings, AuditLog)
│   ├── components/              # UI Component Library
│   │   ├── ui/                  # Button, Input, Textarea, Select, Badge, Card, Modal, Alert, Spinner, ThemeSwitcher
│   │   └── layout/              # Header, Footer, AdminSidebar, AdminHeader
│   ├── context/                 # ThemeContext (Dynamic client theme switcher)
│   └── types/                   # JSDoc typedefs
├── tests/                       # Automated test suites
│   ├── unit/                    # security.test.js, validators.test.js
│   ├── integration/             # booking.test.js, shopRental.test.js
│   └── security/                # api-security.test.js (OWASP & SANS verification)
├── docs/                        # Architecture, Security, Test Matrix, Deployment
├── scripts/                     # create-admin.js, seed-demo.js
├── .env.example                 # Production configuration template
├── next.config.mjs              # Security headers & image optimization
├── tailwind.config.js           # Dynamic theme token extension
└── package.json
```

---

## 4. Dynamic Theme Architecture

The system features a **production-ready dynamic theming engine**:
1. All design tokens are declared as CSS custom properties in `src/app/globals.css`:
   - `--color-primary`, `--color-primary-hover`, `--color-primary-light`
   - `--color-secondary`, `--color-accent`
   - `--color-bg`, `--color-surface`, `--color-border`
   - `--color-text-main`, `--color-text-muted`
2. Four curated presets are pre-configured:
   - **Nature (Default):** Lush Emerald (`#15803d`) & Golden Wheat (`#ca8a04`)
   - **Luxury:** British Racing Green (`#1e3a2f`) & Metallic Champagne Gold (`#d4af37`)
   - **Earth:** Warm Terracotta Clay (`#c25e2e`) & Olive Branch Green (`#3f6212`)
   - **Ocean:** Deep Sea Teal (`#0f766e`) & Coastal Sky Blue (`#0284c7`)
3. Switching themes can be performed live via:
   - The interactive `<ThemeSwitcher />` widget in the header.
   - The Administrator Settings console under `/admin/settings`.
   - Modifying `SiteSettings.theme` in the database.
4. Changes update instantly across every page without CSS recompilation or page reloads.

---

## 5. Data Flow and Separation of Concerns

```
[Public Visitor / Admin Browser]
              │
              ▼
   [Client Components & Pages]
              │
              ▼
    [src/api/*.api.js (Client)]  ──> [Fetch with CSRF Headers]
              │
              ▼
[src/app/api/**/route.js (App Router)]
              │
      ┌───────┴────────────────────────┐
      ▼                                ▼
[handleRoute Middleware]      [requireAdmin Middleware]
- Request ID generation       - HttpOnly Cookie check
- CSRF validation             - JWT verification (jose)
- Error catching & redaction  - Token version revocation
      │                                │
      └───────────────┬────────────────┘
                      ▼
            [Zod Schema Validation]
                      │
                      ▼
           [NoSQL Sanitizer & Strip]
                      │
                      ▼
          [src/backend/services/*]
                      │
                      ▼
          [Mongoose Models (MongoDB)]
```
