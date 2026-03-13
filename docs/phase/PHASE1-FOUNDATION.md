# Phase 1 — Foundation

## Goal
Working skeleton: project setup, auth, database schema, role-based route guards.

## Prerequisites
- Node.js 18+
- PostgreSQL (Neon recommended)
- Cloudinary account (for later phases)

---

## Step-by-Step Tasks

### 1.1 Project Initialization
```bash
npx create-next-app@latest digidukan --typescript --tailwind --app --src-dir=no
cd digidukan
npx shadcn@latest init
```

Install core dependencies:
```bash
npm install prisma @prisma/client
npm install next-auth@beta @auth/prisma-adapter
npm install zod react-hook-form @hookform/resolvers
npm install cloudinary
npm install qrcode @types/qrcode
```

### 1.2 Environment Variables
```env
# .env.local
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.3 Prisma Setup
```bash
npx prisma init
# Copy full schema from docs/DATABASE.md into prisma/schema.prisma
npx prisma generate
npx prisma migrate dev --name init
```

### 1.4 Seed Database
Create `prisma/seed.ts`:
- Seed default plans: FREE, PAID_MONTHLY
- Optionally seed a SUPER_ADMIN user for development

```bash
npx prisma db seed
```

### 1.5 Auth.js Configuration
Create `lib/auth.ts`:
- Credentials provider (email + password)
- Prisma adapter
- JWT strategy with `role` in token
- Callbacks: include `userId` and `role` in session

Create `app/api/auth/[...nextauth]/route.ts`

### 1.6 Middleware
Create `middleware.ts`:
```typescript
// Protected paths
// /dashboard, /onboarding, /shops → require session
// /admin/* → require SUPER_ADMIN role
// /login, /signup → redirect if already logged in
// /s/* → always public
```

### 1.7 Layout Shells
- `app/(auth)/layout.tsx` — centered card layout
- `app/(owner)/layout.tsx` — sidebar + topbar
- `app/(admin)/layout.tsx` — admin sidebar + topbar
- `app/s/[slug]/layout.tsx` — minimal public layout

### 1.8 Auth Pages
- `/signup` — email, name, password form → creates User + OwnerProfile + assigns FREE plan
- `/login` — email + password → Auth.js sign in
- `/forgot-password` — email form (can stub out in MVP)

---

## Key Files to Create

```
app/
├── api/auth/[...nextauth]/route.ts
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── forgot-password/page.tsx
├── (owner)/
│   ├── layout.tsx
│   └── dashboard/page.tsx      ← stub
└── (admin)/
    ├── layout.tsx
    └── admin/page.tsx          ← stub
lib/
├── auth.ts
├── db.ts                       ← Prisma singleton
└── validations/
    └── auth.ts                 ← Zod schemas for signup/login
prisma/
├── schema.prisma
└── seed.ts
middleware.ts
```

---

## Acceptance Criteria

- [ ] `npx prisma migrate dev` runs without errors
- [ ] Signup creates User + OwnerProfile + ShopSubscription (FREE plan)
- [ ] Login returns session with `userId` and `role`
- [ ] OWNER cannot access `/admin` (gets 403)
- [ ] Unauthenticated user is redirected from `/dashboard` to `/login`
- [ ] SUPER_ADMIN can access both `/dashboard` and `/admin`
- [ ] `/s/test` returns 404 or empty (public route accessible)

---

## Common Pitfalls

| Issue | Fix |
|-------|-----|
| Prisma client not regenerated | Run `npx prisma generate` after schema changes |
| Auth.js session missing role | Ensure `callbacks.jwt` adds `role` to token |
| Middleware runs on static assets | Exclude `_next/static`, `_next/image`, `favicon.ico` in matcher |
| Neon connection timeout | Use `?connect_timeout=10` in DATABASE_URL |
