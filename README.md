# Willy Nilly — Horticulture & Agro Tourism Platform (MVP)

A production-ready enterprise full-stack web application built for **Mr. Sarat Kumar Singh** using **Next.js App Router**, **pure JavaScript (ESNext, React 18, zero TypeScript)**, **MongoDB (Mongoose)**, and a **dynamic design token system**.

Built strictly in accordance with the *Willy Nilly Business Website Product Requirements Document (PRD Version 1.0)*.

---

## 🌾 Core Features & Scope Boundaries

### Public Visitors (No Accounts Required)
- **Home:** Welcoming hero section, category cards, featured rooms, highlights, gallery preview, and quick calls-to-action.
- **About Us:** Founder profile (**Mr. Sarat Kumar Singh**), business story, core vision, and mission.
- **Guest House:** Room listings with photos, AC/Non-AC badges, capacity, tariffs, and amenities.
- **Booking Requests:** Validated reservation request form (`guestName`, `mobile`, `email`, `checkInDate`, `checkOutDate`, `guestCount`, `roomsCount`, `room`, `specialRequest`). Generates reference `WN-BK-YYYYMMDD-XXXX`. **Request-only workflow** awaiting administrative review (no online payment, no instant locking).
- **Farm House:** 8-acre open-air property details, facilities, suitable celebration types (up to 800+ guests), and embedded event enquiry form.
- **Resort (Upcoming):** **Launching Soon** showcase. Bookings strictly disabled until official grand inauguration.
- **Horticulture Nursery:** Plant & sapling catalogue with pricing, stock status, and purchase/collection enquiry form (no online checkout/payment).
- **Shop Rental (Inactive by Default):** Completely hidden from navigation and direct URL access (returns 404). Exposes commercial listings and lease enquiries only when activated by the Administrator.
- **Gallery:** Responsive photo grid with category/album filter and interactive lightbox modal.
- **Contact Us:** Verified address, telephone lines, official email, operating schedule, and direct contact form.
- **General Enquiry:** Multi-category enquiry form for campus visits, group bookings, and custom requests.

### Administrator Portal (Protected Access)
- **Secure Authentication:** HttpOnly, SameSite cookies with JWT session validation, brute-force sliding window rate limiting, and instant session revocation via `tokenVersion`.
- **Overview Dashboard:** Real-time database metrics (new bookings, total bookings, new enquiries, total enquiries, active rooms, active plants, active shops, gallery counts) and recent activity pipelines.
- **Business Information Management:** Update business name, tagline, founder bio, story, vision, mission, and contact details.
- **Guest House Management:** Create, edit, and archive rooms; manage climate (AC/Non-AC), tariffs, and amenities.
- **Booking Requests Register:** Search, filter by status (`New`, `Under Review`, `Confirmed`, `Declined`, `Cancelled`), view guest details, transition status with audit history, and log internal admin notes.
- **Farm House Content:** Edit venue description, property area, guest capacity, and amenities.
- **Resort Showcase:** Edit launch messaging and concept text while bookings remain locked.
- **Horticulture Catalogue:** Add/edit plants and saplings, manage stock status, and review enquiries.
- **Shop Rental Control:** **One-click module activation/deactivation switch** and commercial unit management.
- **Gallery Curation:** Upload photos with signature validation, categorize into albums, reorder, publish/unpublish, and delete safely.
- **Unified Enquiries Pipeline:** Filter by source/type (`FarmHouse`, `Horticulture`, `ShopRental`, `General`, `Contact`), search, update follow-up status, and add notes.
- **Settings & Dynamic Theming:** Live theme switcher and server health monitor.

---

## 🎨 Dynamic Theme Engine

Switch themes effortlessly across the entire platform. Pre-configured presets include:
- **Nature (Default):** Lush Emerald (`#15803d`) & Golden Wheat (`#ca8a04`)
- **Luxury:** British Racing Green (`#1e3a2f`) & Metallic Champagne Gold (`#d4af37`)
- **Earth:** Warm Terracotta Clay (`#c25e2e`) & Olive Branch Green (`#3f6212`)
- **Ocean:** Deep Sea Teal (`#0f766e`) & Coastal Sky Blue (`#0284c7`)

Themes can be previewed live using the `<ThemeSwitcher />` widget or set globally in `/admin/settings`.

---

## 🛠️ Technology Stack & Architecture

- **Next.js App Router (14.2+)** — Pure JavaScript (`.js` & `.jsx`).
- **MongoDB & Mongoose (8.8+)** — Connection caching, indexing, and data models.
- **Tailwind CSS** — Extended with CSS custom properties.
- **Zod (3.23+)** — Schema validation on all requests.
- **jose (5.9+) & bcryptjs (2.4+)** — Session tokens & 12-round password hashing.
- **Vitest (2.1+) & MongoDB Memory Server** — Complete automated test suite.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Provision Initial Administrator
```bash
node scripts/create-admin.js --name "Sarat Kumar Singh" --email "admin@willynilly.in" --password "YourStrongPassword2026!"
```

### 4. (Optional) Seed Demo Content
```bash
node scripts/seed-demo.js
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public site, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the administrator console.

---

## 🧪 Testing & Security Verification

Run the complete automated test suite (37 tests across 5 test files):

```bash
# Run all unit, integration, and security tests
npm test

# Run security test suite only
npm run test:security
```

### Build for Production
```bash
npm run build
npm run start
```

---

## 📚 Project Documentation

- [Architecture Guide](file:///d:/Ephorsys/Projects/willy/docs/architecture.md)
- [Security Architecture & Controls](file:///d:/Ephorsys/Projects/willy/docs/security.md)
- [Security Test Matrix (OWASP & SANS)](file:///d:/Ephorsys/Projects/willy/docs/security-test-matrix.md)
- [Production Deployment & VPS Guide](file:///d:/Ephorsys/Projects/willy/docs/deployment.md)
