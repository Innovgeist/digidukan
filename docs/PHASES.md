# Implementation Phases — DigiDukan

## Phase Overview

| # | Phase | Key Output | Blocked By |
|---|-------|-----------|------------|
| 1 | Foundation | Auth, DB, route guards | Nothing |
| 2 | Core Owner Flow | Onboarding, shop/category/item CRUD | Phase 1 |
| 3 | Collections + Storefront | Collections, public `/s/[slug]` | Phase 2 |
| 4 | Cart + WhatsApp + QR | Cart UI, WhatsApp order, QR download | Phase 3 |
| 5 | Plans + Analytics | Plan gating, analytics events | Phase 4 |
| 6 | Super Admin | Admin dashboard, impersonation | Phase 5 |
| 7 | Polish | Mobile UX, edge cases, error states | Phase 6 |

---

## Phase 1 — Foundation

**Goal:** Working skeleton with auth, DB, and role-based access.

### Deliverables
- [ ] Next.js project initialized with TypeScript, Tailwind, shadcn/ui
- [ ] Prisma schema with all models (full schema from day 1)
- [ ] PostgreSQL connected (Neon)
- [ ] Auth.js configured (credentials + optional OAuth)
- [ ] User model with roles (OWNER, SUPER_ADMIN)
- [ ] Sign up / Log in / Log out working
- [ ] Middleware route guards (RBAC)
- [ ] Seed: default plans (FREE, PAID_MONTHLY)
- [ ] Basic layout shells (owner layout, admin layout)

**See:** [`docs/phase/PHASE1-FOUNDATION.md`](phase/PHASE1-FOUNDATION.md)

---

## Phase 2 — Core Owner Flow

**Goal:** Owner can complete onboarding and manage their shop catalog.

### Deliverables
- [ ] Onboarding wizard (7 steps, resumable)
- [ ] Shop CRUD (create, read, update)
- [ ] Shop branding (logo, cover, primary color via Cloudinary)
- [ ] Category CRUD (create, edit, delete, reorder)
- [ ] Item CRUD (create, edit, delete, toggle availability)
- [ ] Item image upload (Cloudinary)
- [ ] Owner dashboard overview
- [ ] Plan limit enforcement (Free plan caps)
- [ ] Shop status flow (Draft → Published)

**See:** [`docs/phase/PHASE2-OWNER-FLOW.md`](phase/PHASE2-OWNER-FLOW.md)

---

## Phase 3 — Collections + Public Storefront

**Goal:** Collections management + fully functional public storefront.

### Deliverables
- [ ] Collection CRUD (create, edit, delete)
- [ ] Item ↔ Collection assignment
- [ ] Public storefront route `/s/[slug]`
- [ ] Storefront: header, banner, actions, category tabs
- [ ] Storefront: item cards, featured section, collections section
- [ ] Search bar (client-side or server-side)
- [ ] Category filter
- [ ] Collection filter
- [ ] Mobile-first responsive design
- [ ] Suspended/not-found shop states
- [ ] Analytics event: page view, QR scan

**See:** [`docs/phase/PHASE3-STOREFRONT.md`](phase/PHASE3-STOREFRONT.md)

---

## Phase 4 — Cart + WhatsApp + QR

**Goal:** Customers can order via WhatsApp; owner can download QR.

### Deliverables
- [ ] Cart state (client-side, Zustand or useState)
- [ ] Add to cart / adjust quantity / remove item
- [ ] Customer note field
- [ ] WhatsApp deep link order message generation
- [ ] Handle: no WhatsApp number → hide CTA
- [ ] Handle: empty cart → disabled order button
- [ ] QR code generation (npm `qrcode` library)
- [ ] QR download as PNG
- [ ] QR poster (simple, shop name + QR)
- [ ] Publish flow with precondition checks
- [ ] Regenerate QR when slug changes
- [ ] Analytics events: WhatsApp click, call click, cart add

**See:** [`docs/phase/PHASE4-CART-QR.md`](phase/PHASE4-CART-QR.md)

---

## Phase 5 — Plans + Analytics

**Goal:** Plan gating works end-to-end; analytics visible to paid owners.

### Deliverables
- [ ] Plan limits enforced server-side (items, categories, collections, shops)
- [ ] UI plan limit warnings and upgrade prompts
- [ ] Platform watermark on free plan storefronts
- [ ] Paid features locked for free plan (analytics, PDF, custom branding)
- [ ] Analytics event recording for all tracked events
- [ ] Owner analytics page (7d / 30d summary)
- [ ] Analytics locked/teaser for free plan owners
- [ ] Admin trial grant flow (1/2/3 months or custom dates)

**See:** [`docs/phase/PHASE5-PLANS-ANALYTICS.md`](phase/PHASE5-PLANS-ANALYTICS.md)

---

## Phase 6 — Super Admin

**Goal:** Super admin can manage the full platform.

### Deliverables
- [ ] Admin dashboard overview (platform stats)
- [ ] Owner list (paginated, filterable by plan/status/date)
- [ ] Shop list (paginated, filterable)
- [ ] Create owner account
- [ ] Create shop for owner
- [ ] Assign/change plan
- [ ] Grant free trial (with notes)
- [ ] Suspend / activate / archive shop
- [ ] Impersonation: start with reason, visible banner, end session
- [ ] Impersonation audit log
- [ ] Admin action log
- [ ] Issue flag create/resolve

**See:** [`docs/phase/PHASE6-ADMIN.md`](phase/PHASE6-ADMIN.md)

---

## Phase 7 — Polish

**Goal:** Production-ready UX, edge cases handled, performance optimized.

### Deliverables
- [ ] Mobile UX review and fixes
- [ ] Loading skeletons for all async components
- [ ] Empty state components (no items, no collections, etc.)
- [ ] Error boundaries
- [ ] Toast notifications for all mutations
- [ ] Form validation feedback (inline errors)
- [ ] Confirm dialogs for destructive actions
- [ ] Image optimization and lazy loading
- [ ] Storefront ISR / caching
- [ ] Rate limiting on analytics endpoint
- [ ] All edge cases from `EDGE-CASES.md` verified

**See:** [`docs/phase/PHASE7-POLISH.md`](phase/PHASE7-POLISH.md)

---

## MVP Definition of Done

> The MVP is complete when all items in the [Acceptance Tests](ACCEPTANCE-TESTS.md) pass.

Critical path: Phase 1 → 2 → 3 → 4 → 5 → 6 → 7
