# Phase 5 — Plans + Analytics

## Goal
Plan gating fully enforced end-to-end. Analytics events recorded and visible to paid owners.

## Prerequisite
Phase 4 complete: cart, WhatsApp, QR all working.

---

## Step-by-Step Tasks

### 5.1 Plan Helper Utilities

```typescript
// lib/plan.ts

export async function getShopPlan(shopId: string) {
  const sub = await prisma.shopSubscription.findUnique({
    where: { shopId },
    include: { plan: true },
  })
  return sub?.plan ?? DEFAULT_FREE_PLAN
}

export function isFeatureAllowed(plan: Plan, feature: string): boolean {
  switch (feature) {
    case 'analytics': return plan.analyticsEnabled
    case 'pdf_export': return plan.pdfExportEnabled
    case 'no_watermark': return !plan.watermarkEnabled
    case 'custom_branding': return plan.customBranding
    default: return false
  }
}

export function checkItemLimit(plan: Plan, currentCount: number): boolean {
  return plan.maxItems === -1 || currentCount < plan.maxItems
}
```

### 5.2 Server-Side Plan Enforcement

Add plan checks to all mutation server actions:

**Item creation:**
```typescript
const count = await prisma.item.count({ where: { shopId, deletedAt: null } })
const plan = await getShopPlan(shopId)
if (!checkItemLimit(plan, count)) {
  return { error: 'PLAN_LIMIT_REACHED', limit: plan.maxItems, feature: 'items' }
}
```

**Category creation:**
```typescript
const count = await prisma.category.count({ where: { shopId, deletedAt: null } })
if (plan.maxCategories !== -1 && count >= plan.maxCategories) {
  return { error: 'PLAN_LIMIT_REACHED', limit: plan.maxCategories, feature: 'categories' }
}
```

**Collection creation:**
```typescript
const count = await prisma.collection.count({ where: { shopId, deletedAt: null } })
if (plan.maxCollections !== -1 && count >= plan.maxCollections) {
  return { error: 'PLAN_LIMIT_REACHED', limit: plan.maxCollections, feature: 'collections' }
}
```

**Shop creation:**
```typescript
const shopCount = await prisma.shop.count({ where: { ownerId, deletedAt: null } })
if (plan.maxShops !== -1 && shopCount >= plan.maxShops) {
  return { error: 'PLAN_LIMIT_REACHED', limit: plan.maxShops, feature: 'shops' }
}
```

### 5.3 UI Plan Limit Indicators

**Plan Limit Banner (component)**
```tsx
// components/owner/PlanLimitBanner.tsx
interface PlanLimitBannerProps {
  feature: string  // 'items' | 'categories' | 'collections'
  current: number
  limit: number
  planType: string
}
// Shows: "You've used 24/25 items on Free plan. Upgrade for more."
// At limit: "Item limit reached. Upgrade to add more items."
```

**Feature Lock Component**
```tsx
// components/owner/FeatureLock.tsx
// Wraps locked features (analytics, PDF export, custom branding)
// Shows: "This feature requires a paid plan" + upgrade CTA
```

### 5.4 Watermark on Storefront

```tsx
// components/storefront/StorefrontFooter.tsx
{shop.subscription.plan.watermarkEnabled && (
  <footer className="text-center py-4 text-xs text-gray-400">
    Powered by <a href="/">DigiDukan</a>
  </footer>
)}
```

### 5.5 Analytics Event Recording

**Track endpoint:**
```typescript
// app/api/public/shop/[slug]/track/route.ts
export async function POST(req: Request, { params }) {
  const { eventType, itemId, metadata } = await req.json()

  // Rate limiting (simple: check IP or use Upstash)
  // Validate eventType is valid enum

  const shop = await prisma.shop.findUnique({ where: { slug: params.slug } })
  if (!shop || shop.status !== 'PUBLISHED') return Response.json({ ok: false })

  await prisma.analyticsEvent.create({
    data: { shopId: shop.id, eventType, itemId, metadata }
  })

  return Response.json({ ok: true })
}
```

**Client-side tracking:**
```typescript
// lib/analytics.ts
export async function trackEvent(
  shopSlug: string,
  eventType: string,
  extra?: object
) {
  // Fire and forget — don't await in UI
  fetch(`/api/public/shop/${shopSlug}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, ...extra })
  }).catch(() => {}) // Swallow errors silently
}
```

### 5.6 Analytics Dashboard (Owner)

Route: `/shops/[shopId]/analytics`

**If Free Plan:** Show locked view with upgrade prompt.

**If Paid Plan:** Show metrics for last 7 days and 30 days:

| Metric | Icon | Event Type |
|--------|------|-----------|
| Storefront views | 👁 | PAGE_VIEW |
| QR scans | 📱 | QR_SCAN |
| WhatsApp orders | 💬 | WHATSAPP_CLICK |
| Call clicks | 📞 | CALL_CLICK |
| Share clicks | 🔗 | SHARE_CLICK |
| Map clicks | 📍 | MAP_CLICK |
| Cart adds | 🛒 | CART_ADD |

**Query:**
```typescript
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
const events = await prisma.analyticsEvent.groupBy({
  by: ['eventType'],
  where: { shopId, createdAt: { gte: sevenDaysAgo } },
  _count: { eventType: true }
})
```

### 5.7 Admin Trial Grant

Route: Admin shop detail → "Grant Trial" button
Form: duration (1/2/3 months or custom start/end), notes

```typescript
// Creates new ShopSubscription with PAID_MONTHLY plan
// Sets endsAt = now + duration
// Sets grantedByAdminId = admin.id
// Logs to AdminActionLog
```

---

## Key Files to Create

```
lib/
├── plan.ts                      ← Plan helper functions
└── analytics.ts                 ← Client-side tracking
app/api/public/shop/[slug]/
└── track/route.ts
app/(owner)/shops/[shopId]/
└── analytics/page.tsx
components/owner/
├── PlanLimitBanner.tsx
├── FeatureLock.tsx
└── AnalyticsCard.tsx
```

---

## Acceptance Criteria

- [ ] Free plan owner cannot exceed 25 items (server + UI)
- [ ] Free plan owner cannot exceed 3 categories (server + UI)
- [ ] Free plan owner cannot exceed 2 collections (server + UI)
- [ ] Free plan owner cannot exceed 1 shop (server + UI)
- [ ] Direct API call beyond limits returns `PLAN_LIMIT_REACHED`
- [ ] Free plan storefront shows watermark
- [ ] Paid plan storefront has no watermark
- [ ] Analytics events recorded on storefront interactions
- [ ] Paid owner sees analytics at `/shops/[shopId]/analytics`
- [ ] Free owner sees locked analytics view
- [ ] Admin can grant free trial (updates subscription, logs action)
