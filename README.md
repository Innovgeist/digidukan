# DigiDukan — QR Storefront SaaS MVP

**Version:** 1.0
**Stack:** Next.js (App Router) + TypeScript + PostgreSQL + Prisma + Tailwind CSS + shadcn/ui + Auth.js + Cloudinary
**Architecture:** Modular Monolith
**Deployment:** Vercel + Neon Postgres

---

## What is DigiDukan?

DigiDukan is a multi-tenant SaaS web application that allows local business owners to create a **public digital storefront** accessible via a QR code and public URL. Customers can browse the catalog and send cart orders directly to the shop owner via WhatsApp.

---

## User Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Platform administrator — manages all owners, shops, plans |
| `OWNER` | Business owner — manages their own shop(s), catalog, and settings |
| `PUBLIC_VISITOR` | Unauthenticated customer — browses storefront, adds to cart, orders via WhatsApp |

---

## Key Features

### Owner
- Self-serve onboarding wizard
- Multi-shop management (plan-gated)
- Shop branding (logo, cover, primary color)
- Category, item, and collection management
- Image uploads via Cloudinary
- Publish/unpublish shop
- QR code generation & download
- Analytics dashboard (paid plan only)

### Public Visitor
- Browse storefront via `/s/[slug]` or QR scan
- Search/filter by category or collection
- Add items to cart (client-side)
- Send cart order via WhatsApp deep link
- Call shop / open map / share storefront

### Super Admin
- View/manage all owners and shops
- Assign plans, grant free trials
- Suspend/activate shops
- Create shops on behalf of owners
- Impersonate owners (with audit logs)

---

## Route Overview

| Area | Base Path |
|------|-----------|
| Public landing | `/` `/pricing` `/features` |
| Public storefront | `/s/[slug]` |
| Auth | `/login` `/signup` `/forgot-password` |
| Owner dashboard | `/dashboard` `/onboarding` `/shops/...` |
| Admin dashboard | `/admin/...` |

---

## Plan Types

| Feature | Free | Paid Monthly |
|---------|------|--------------|
| Shops | 1 | 3+ |
| Items | 25 | 500 |
| Categories | 3 | Unlimited |
| Collections | 2 | Unlimited |
| Analytics | Locked | Full |
| Watermark | Shown | Hidden |
| PDF Export | No | Yes |
| Custom Branding | Limited | Full |

---

## Implementation Phases

| Phase | Name | Key Deliverables |
|-------|------|-----------------|
| 1 | Foundation | Auth, DB schema, role guards |
| 2 | Core Owner Flow | Onboarding, shops, categories, items, images |
| 3 | Collections + Storefront | Collections, public `/s/[slug]`, search/filter |
| 4 | Cart + WhatsApp + QR | Cart state, WhatsApp order, QR generation |
| 5 | Plans + Analytics | Plan gating, feature locks, analytics events |
| 6 | Super Admin | Admin dashboard, impersonation, audit logs |
| 7 | Polish | Mobile UX, edge cases, loading/empty states |

---

## Quick Reference Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System design, tech stack details
- [`docs/DATABASE.md`](docs/DATABASE.md) — Full data model & Prisma schema
- [`docs/ROUTES.md`](docs/ROUTES.md) — All application routes
- [`docs/API.md`](docs/API.md) — All API endpoints
- [`docs/PHASES.md`](docs/PHASES.md) — Phase plan with dependencies
- [`docs/phase/PHASE1-FOUNDATION.md`](docs/phase/PHASE1-FOUNDATION.md) — Phase 1 detail
- [`docs/phase/PHASE2-OWNER-FLOW.md`](docs/phase/PHASE2-OWNER-FLOW.md) — Phase 2 detail
- [`docs/phase/PHASE3-STOREFRONT.md`](docs/phase/PHASE3-STOREFRONT.md) — Phase 3 detail
- [`docs/phase/PHASE4-CART-QR.md`](docs/phase/PHASE4-CART-QR.md) — Phase 4 detail
- [`docs/phase/PHASE5-PLANS-ANALYTICS.md`](docs/phase/PHASE5-PLANS-ANALYTICS.md) — Phase 5 detail
- [`docs/phase/PHASE6-ADMIN.md`](docs/phase/PHASE6-ADMIN.md) — Phase 6 detail
- [`docs/phase/PHASE7-POLISH.md`](docs/phase/PHASE7-POLISH.md) — Phase 7 detail
- [`docs/EDGE-CASES.md`](docs/EDGE-CASES.md) — Edge cases to handle
- [`docs/ACCEPTANCE-TESTS.md`](docs/ACCEPTANCE-TESTS.md) — Acceptance test checklist
- [`docs/BUSINESS-RULES.md`](docs/BUSINESS-RULES.md) — Business rules & defaults

---

## MVP Definition of Done

The MVP is complete when:
- [ ] Owner can sign up and publish a shop
- [ ] Shop has categories, items, and collections
- [ ] Customer can browse the public storefront
- [ ] Customer can add items to cart and send via WhatsApp
- [ ] Owner can download a QR for the storefront
- [ ] Plan restrictions are enforced
- [ ] Paid analytics are visible
- [ ] Super admin can manage shops and plans
- [ ] Super admin can create shops on behalf of owners
- [ ] Super admin impersonation is logged and functional

---

## Defaults

| Setting | Default |
|---------|---------|
| Country | India |
| Currency | INR |
| Business Type (onboarding) | Mixed |
| Language | English |
| Plan on signup | Free |
| Watermark | Enabled on Free |
| Item availability | Available |
| Shop status after creation | Draft |
