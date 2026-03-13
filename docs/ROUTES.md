# Route Structure — DigiDukan

## Public Routes (No Auth Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/(public)/page.tsx` | Landing page |
| `/pricing` | `app/(public)/pricing/page.tsx` | Pricing page |
| `/features` | `app/(public)/features/page.tsx` | Features page |
| `/s/[slug]` | `app/s/[slug]/page.tsx` | Public storefront |

### Public Storefront Sub-routes
The public storefront is a single page but supports URL hash/query navigation:
- `/s/[slug]` — default view (all items, categories)
- `/s/[slug]?category=[categorySlug]` — filtered by category
- `/s/[slug]?collection=[collectionSlug]` — filtered by collection
- `/s/[slug]?q=[searchTerm]` — search results

---

## Auth Routes (Unauthenticated Only)

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `app/(auth)/login/page.tsx` | Owner login |
| `/signup` | `app/(auth)/signup/page.tsx` | Owner registration |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Password reset request |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Password reset (with token) |

> Logged-in users visiting auth routes are redirected to `/dashboard`

---

## Owner Routes (Requires `OWNER` or `SUPER_ADMIN` role)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `app/(owner)/dashboard/page.tsx` | Owner home — shop overview |
| `/onboarding` | `app/(owner)/onboarding/page.tsx` | Multi-step onboarding wizard |
| `/shops` | `app/(owner)/shops/page.tsx` | List all owner's shops |
| `/shops/new` | `app/(owner)/shops/new/page.tsx` | Create new shop |
| `/shops/[shopId]` | `app/(owner)/shops/[shopId]/page.tsx` | Shop overview |
| `/shops/[shopId]/settings` | `.../settings/page.tsx` | Shop settings (hours, banner, contact) |
| `/shops/[shopId]/categories` | `.../categories/page.tsx` | Manage categories |
| `/shops/[shopId]/items` | `.../items/page.tsx` | Manage items |
| `/shops/[shopId]/items/new` | `.../items/new/page.tsx` | Create item |
| `/shops/[shopId]/items/[itemId]` | `.../items/[itemId]/page.tsx` | Edit item |
| `/shops/[shopId]/collections` | `.../collections/page.tsx` | Manage collections |
| `/shops/[shopId]/collections/new` | `.../collections/new/page.tsx` | Create collection |
| `/shops/[shopId]/collections/[collId]` | `.../collections/[collId]/page.tsx` | Edit collection + manage items |
| `/shops/[shopId]/qr` | `.../qr/page.tsx` | View and download QR code |
| `/shops/[shopId]/analytics` | `.../analytics/page.tsx` | Analytics dashboard (paid only) |

### Onboarding Wizard Steps
The onboarding wizard is a single route `/onboarding` with step state:

| Step | Name | Required |
|------|------|----------|
| 1 | Account confirmation | Yes |
| 2 | Select business type | Yes |
| 3 | Create first shop (name, slug, phone, WhatsApp) | Yes |
| 4 | Branding (logo, cover, primary color) | No (skippable) |
| 5 | Add first category | Yes |
| 6 | Add first 1–3 items | Yes |
| 7 | Publish shop + view QR | Yes |

---

## Admin Routes (Requires `SUPER_ADMIN` role)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | `app/(admin)/admin/page.tsx` | Admin dashboard overview |
| `/admin/owners` | `.../owners/page.tsx` | List all owners |
| `/admin/owners/new` | `.../owners/new/page.tsx` | Create owner account |
| `/admin/owners/[userId]` | `.../owners/[userId]/page.tsx` | Owner details + shops |
| `/admin/shops` | `.../shops/page.tsx` | List all shops (filterable) |
| `/admin/shops/new` | `.../shops/new/page.tsx` | Create shop for owner |
| `/admin/shops/[shopId]` | `.../shops/[shopId]/page.tsx` | Shop admin view |
| `/admin/plans` | `.../plans/page.tsx` | Manage plans |
| `/admin/logs` | `.../logs/page.tsx` | Admin action logs |
| `/admin/logs/impersonation` | `.../logs/impersonation/page.tsx` | Impersonation audit logs |
| `/admin/flags` | `.../flags/page.tsx` | Issue flags |

---

## Middleware Route Guards

`middleware.ts` protects routes based on session:

```typescript
// Pseudo-logic
const protectedOwnerPaths = ['/dashboard', '/onboarding', '/shops']
const protectedAdminPaths = ['/admin']

if (isAdminPath && role !== 'SUPER_ADMIN') → 403
if (isOwnerPath && !session) → redirect('/login')
if (isAuthPath && session) → redirect('/dashboard')
if (isPublicPath) → allow
```

### Special: Impersonation
When admin is impersonating an owner:
- Session contains `impersonating: { targetOwnerId, logId }`
- Visible banner shown on all owner routes
- All write operations tagged with impersonation log ID

---

## Route Access Matrix

| Route Group | No Auth | OWNER | SUPER_ADMIN |
|-------------|---------|-------|-------------|
| Public (`/`, `/s/*`) | ✅ | ✅ | ✅ |
| Auth (`/login`, `/signup`) | ✅ | Redirect | Redirect |
| Owner (`/dashboard`, `/shops/*`) | Redirect | ✅ | ✅ |
| Admin (`/admin/*`) | Redirect | ❌ 403 | ✅ |
