# Architecture — DigiDukan

## Architecture Style
**Modular Monolith** — single Next.js App Router application with clear domain boundaries. No microservices.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14+ (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety throughout |
| ORM | Prisma | DB schema, migrations, type-safe queries |
| Database | PostgreSQL (Neon) | Relational data storage |
| Styling | Tailwind CSS + shadcn/ui | UI components, responsive design |
| Auth | Auth.js (NextAuth v5) | Session management, OAuth/credentials |
| Forms | React Hook Form + Zod | Client form state + server validation |
| Images | Cloudinary | Image upload, optimization, CDN |
| Deployment | Vercel | Hosting, edge functions |
| DB Hosting | Neon Postgres | Serverless PostgreSQL |

---

## Directory Structure (Planned)

```
digidukan/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public marketing pages
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/
│   │   └── features/
│   ├── s/[slug]/                 # Public storefront
│   │   └── page.tsx
│   ├── (auth)/                   # Auth pages (unauthenticated)
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (owner)/                  # Owner dashboard (authenticated)
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   └── shops/
│   │       └── [shopId]/
│   │           ├── settings/
│   │           ├── categories/
│   │           ├── items/
│   │           ├── collections/
│   │           ├── qr/
│   │           └── analytics/
│   └── (admin)/                  # Admin dashboard
│       └── admin/
│           ├── owners/
│           ├── shops/
│           ├── plans/
│           ├── logs/
│           └── flags/
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── storefront/               # Public storefront components
│   ├── owner/                    # Owner dashboard components
│   ├── admin/                    # Admin components
│   └── shared/                   # Shared across contexts
├── lib/
│   ├── auth.ts                   # Auth.js config
│   ├── db.ts                     # Prisma client singleton
│   ├── validations/              # Zod schemas
│   ├── actions/                  # Next.js Server Actions
│   └── utils/                    # Utilities (QR gen, WhatsApp, etc.)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
└── middleware.ts                  # Route guards (RBAC)
```

---

## Authentication Flow

```
User visits /dashboard
    ↓
middleware.ts checks session
    ↓
No session → redirect to /login
    ↓
Login → Auth.js creates JWT session
    ↓
Session contains: userId, role (OWNER | SUPER_ADMIN)
    ↓
Role check in middleware → grant/deny access
```

**Roles stored in JWT:**
- `OWNER` → access to `/dashboard`, `/shops/*`, `/onboarding`
- `SUPER_ADMIN` → access to `/admin/*` (+ owner routes)

---

## Image Upload Flow (Cloudinary)

```
Owner selects image in form
    ↓
Client uploads to /api/upload (server action)
    ↓
Server validates file type/size
    ↓
Upload to Cloudinary via SDK
    ↓
Cloudinary returns secure URL + public_id
    ↓
URL saved to Prisma (shop logo / item image)
    ↓
Public storefront uses Cloudinary URL with transformations
```

---

## Public Storefront Flow

```
Customer scans QR / opens /s/[slug]
    ↓
Next.js fetches shop data server-side
    ↓
Check: shop.status === 'published' → render storefront
Check: shop.status === 'suspended' → show suspended page
Check: shop not found → 404
    ↓
Storefront renders categories, items, collections
    ↓
Analytics event tracked (page view, QR scan)
    ↓
Customer adds items to cart (client-side state)
    ↓
Customer clicks "Order on WhatsApp"
    ↓
App opens WhatsApp deep link with pre-filled message
```

---

## Plan Enforcement Strategy

Plan limits are enforced at **three layers**:

1. **Server Actions / API handlers** — Zod + DB check before any mutation
2. **Prisma** — no DB-level constraint but server validates
3. **UI** — show warnings, disable CTAs, upgrade prompts

---

## Middleware (RBAC)

`middleware.ts` handles:
- Unauthenticated access → redirect to `/login`
- `OWNER` accessing `/admin/*` → 403
- `SUPER_ADMIN` during impersonation → special session flag
- Public routes (`/s/*`, `/`, `/pricing`) → always allowed

---

## Key Libraries

| Library | Usage |
|---------|-------|
| `next-auth` / Auth.js v5 | Session, JWT, role in token |
| `@prisma/client` | DB queries |
| `zod` | Server-side validation schemas |
| `react-hook-form` | Form state management |
| `cloudinary` | Image SDK |
| `qrcode` | QR code generation (npm package) |
| `shadcn/ui` | Pre-built accessible components |
| `tailwindcss` | Utility-first CSS |

---

## Caching Strategy

- Public storefront pages: use `revalidate` (ISR) for performance
- Owner dashboard: no caching (always fresh)
- Analytics: server-side, no caching
