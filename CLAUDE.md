# CLAUDE.md — DigiDukan Development Guide

This file is the single source of truth for how I (Claude) navigate and maintain this codebase throughout all development phases. Read this before every session.

---

## Project Identity

**Name:** DigiDukan
**Type:** Multi-tenant SaaS — QR Storefront for local businesses
**Stack:** Next.js (App Router) + TypeScript + PostgreSQL + Prisma + Tailwind + shadcn/ui + Auth.js + Cloudinary
**Architecture:** Modular Monolith — no microservices, no overengineering
**Deployment Target:** Vercel + Neon Postgres

---

## Documentation Map

Every doc has a specific purpose. Use the right doc for the right question.

| Question | Doc to check |
|----------|-------------|
| What are we building overall? | `README.md` |
| What phase are we in? What's next? | `docs/PHASES.md` |
| How is the system designed? | `docs/ARCHITECTURE.md` |
| What does the DB schema look like? | `docs/DATABASE.md` |
| What API route do I need? | `docs/API.md` |
| What app route/page do I need? | `docs/ROUTES.md` |
| What business rule applies here? | `docs/BUSINESS-RULES.md` |
| What edge case must I handle? | `docs/EDGE-CASES.md` |
| Is this feature done correctly? | `docs/ACCEPTANCE-TESTS.md` |
| What are the tasks for this phase? | `docs/phase/PHASE{N}-*.md` |

### Phase Detail Files
Each phase file contains: goals, prerequisites, step-by-step tasks with code snippets, key files to create, and acceptance criteria.

| Phase | File | Status |
|-------|------|--------|
| 1 — Foundation | `docs/phase/PHASE1-FOUNDATION.md` | ✅ Complete |
| 2 — Core Owner Flow | `docs/phase/PHASE2-OWNER-FLOW.md` | ✅ Complete |
| 3 — Collections + Storefront | `docs/phase/PHASE3-STOREFRONT.md` | ✅ Complete |
| 4 — Cart + WhatsApp + QR | `docs/phase/PHASE4-CART-QR.md` | ✅ Complete |
| 5 — Plans + Analytics | `docs/phase/PHASE5-PLANS-ANALYTICS.md` | ✅ Complete |
| 6 — Super Admin | `docs/phase/PHASE6-ADMIN.md` | ✅ Complete |
| 7 — Polish | `docs/phase/PHASE7-POLISH.md` | ✅ Complete |

**Update this table as phases complete.**

---

## How to Use Docs During Development

### Before starting any task
1. Check which phase we are in (table above)
2. Read the corresponding `docs/phase/PHASE{N}-*.md` for detailed tasks
3. Cross-reference `docs/BUSINESS-RULES.md` for any rule that applies
4. Cross-reference `docs/EDGE-CASES.md` for cases to handle in the feature

### Before writing any API route
1. Check `docs/API.md` for the expected method, path, and response format
2. Check `docs/DATABASE.md` for the Prisma models involved
3. Apply Zod validation on all inputs (server-side, always)
4. Enforce plan limits where applicable (see `docs/BUSINESS-RULES.md` § Plan Limits)

### Before writing any page/route
1. Check `docs/ROUTES.md` for the correct path and auth requirements
2. Check middleware rules — owner routes need session, admin routes need SUPER_ADMIN

### Before marking a phase complete
1. Go through the acceptance criteria checklist in `docs/phase/PHASE{N}-*.md`
2. Go through relevant items in `docs/ACCEPTANCE-TESTS.md`
3. Check relevant edge cases from `docs/EDGE-CASES.md`
4. Update the phase status in this file (🔲 → ✅)

---

## Non-Negotiable Rules

These are hard rules throughout all phases. Never deviate.

### Security
- Every owner API route MUST verify `shop.ownerId === session.userId` — no exceptions
- Every admin API route MUST verify `session.role === 'SUPER_ADMIN'`
- All mutations MUST have server-side Zod validation
- Plan limits MUST be enforced server-side, not just in UI

### Data Integrity
- Use soft delete (`deletedAt`) for: Shop, Item, Category, Collection
- Never hard-delete unless it's a join table (e.g., ItemCollection)
- Slug must be globally unique on Shop; unique per shop on Category/Collection
- When slug changes → regenerate QR

### Code Quality
- Type-safe everywhere — no `any` types
- Server Actions preferred over API routes for mutations from owner dashboard
- API routes for: public endpoints, admin endpoints, file upload
- Reusable components — don't duplicate UI logic across owner/admin
- No feature flags, no backwards-compat shims

### Plan Enforcement Pattern
Always follow this 3-layer pattern:
1. **Server** — check count before insert, return `{ error: 'PLAN_LIMIT_REACHED' }`
2. **UI** — disable CTA + show limit banner when at/near limit
3. **Direct API** — server always re-validates, never trust client state

---

## Prisma Usage Rules

- Always use `prisma` singleton from `lib/db.ts`
- Always filter soft-deleted records: `where: { deletedAt: null }`
- Always scope queries to `ownerId` or `shopId` in owner context
- Use `include` sparingly — select only needed fields for performance
- After any schema change: `npx prisma generate` + `npx prisma migrate dev`

---

## Component Organization

```
components/
├── ui/           ← shadcn/ui primitives only (never modify)
├── storefront/   ← Public storefront components
├── owner/        ← Owner dashboard components
├── admin/        ← Admin panel components
└── shared/       ← Used across multiple contexts (EmptyState, ConfirmDialog, etc.)
```

Never put storefront components in owner/ and vice versa.

---

## Environment Variables Required

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_APP_URL=
```

---

## Current Build State

> Update this section at the end of every session.

**Current Phase:** Phase 7 — Polish
**Last Completed Task:** Phase 6 Super Admin complete — build passing (36 routes)
**Next Task:** Complete Polish phase (toasts, skeletons, error boundaries)
**Blockers:** None

### Completed Checklist
- [x] PRD analyzed
- [x] All documentation created (README, ARCHITECTURE, DATABASE, API, ROUTES, PHASES, BUSINESS-RULES, EDGE-CASES, ACCEPTANCE-TESTS, all 7 phase files)
- [x] Next.js 15 project initialized (manual setup, folder name issue resolved)
- [x] Prisma schema created with all 18 models (awaiting DB URL for migration)
- [x] Auth.js v5 configured (JWT strategy, credentials provider)
- [x] Route guards (middleware) working — edge-safe config split
- [x] Seed file ready (FREE/PAID plans + admin + demo user)
- [x] Owner layout + sidebar
- [x] Admin layout + sidebar
- [x] Login page (with Suspense boundary)
- [x] Signup page
- [x] Dashboard stub
- [x] Onboarding stub
- [x] Public storefront stub (/s/[slug])
- [x] `npm run build` passes with zero errors

### Node.js Note
Node v21.7.3 is EOL. Using Prisma 5 + Next.js 15 which are compatible.
Recommend upgrading to Node v20 LTS or v22 LTS for full ecosystem support.

---

## How to Update This File

After completing a phase or major task:
1. Update the phase status table (🔲 → ✅)
2. Update the **Current Build State** section
3. Note any deviations from the original plan and why

After discovering a new edge case or rule not in docs:
1. Add it to `docs/EDGE-CASES.md` or `docs/BUSINESS-RULES.md`
2. Note it here under a **Discovered During Build** section if it's critical

---

## Out of Scope (Do NOT Build)

Per PRD Section 17 — never implement these in MVP:
- Payment gateway / automatic billing
- Order management dashboard
- Server-side order persistence
- Inventory system
- Staff roles
- Customer accounts / login
- Reviews / ratings
- Coupon engine
- Multilingual content
- Custom domains
- POS integration
- Push notifications
