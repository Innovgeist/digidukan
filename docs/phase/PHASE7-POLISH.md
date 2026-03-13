# Phase 7 — Polish

## Goal
Production-ready UX: mobile optimization, loading states, empty states, error handling, edge cases verified.

## Prerequisite
Phases 1–6 complete and all acceptance criteria passing.

---

## Step-by-Step Tasks

### 7.1 Loading Skeletons

Create skeleton variants for every async-loaded section:

| Component | Skeleton |
|-----------|----------|
| Shop list | `ShopCardSkeleton` × 3 |
| Item list | `ItemCardSkeleton` × 6 |
| Category list | `CategoryRowSkeleton` × 3 |
| Analytics | `AnalyticsCardSkeleton` × 7 |
| Admin owner list | `TableRowSkeleton` × 10 |
| Storefront | `StorefrontSkeleton` |

Use Next.js `loading.tsx` + `<Suspense>` boundaries.

### 7.2 Empty States

| Situation | Empty State Message |
|-----------|-------------------|
| No shops | "Create your first shop to get started" + CTA |
| No categories | "Add a category to organize your items" + CTA |
| No items | "Add your first item to start selling" + CTA |
| No collections | "Create a collection for seasonal offers" + CTA |
| No analytics data | "No activity yet. Share your QR to get started" |
| Storefront: no items | "No items available right now. Check back later!" |
| Storefront: search no results | "No items found for '{query}'" |
| Admin: no flags | "No flagged shops" |

### 7.3 Error Handling

**Error Boundaries**
- Wrap owner dashboard sections in error boundaries
- Show friendly error + "Try again" button

**Form Errors**
- Inline field validation errors (react-hook-form + Zod)
- Form-level error banner for server errors
- Network error toast

**Toast Notifications**
All mutations should show toasts:
- ✅ Success: "Category created", "Item saved", "Shop published"
- ❌ Error: "Failed to save. Please try again."
- ⚠️ Warning: "Item limit reached. Upgrade your plan."

Use shadcn/ui `Sonner` or `Toast` component.

### 7.4 Confirm Dialogs

Destructive actions require confirmation:

| Action | Confirm Message |
|--------|----------------|
| Delete item | "Delete this item? This cannot be undone." |
| Delete category | "Delete this category?" (blocked if has items) |
| Delete collection | "Delete this collection? Items will not be deleted." |
| Unpublish shop | "Unpublish shop? The storefront will go offline." |
| Archive shop (admin) | "Archive this shop? This will remove it from the storefront." |
| Suspend shop (admin) | "Suspend this shop? The owner will be notified." |
| Start impersonation | "You are about to impersonate [Owner Name]. Reason required." |

Use shadcn/ui `AlertDialog` component.

### 7.5 Mobile UX Review

**Public Storefront**
- [ ] Touch targets minimum 44×44px
- [ ] Cart drawer full-height on mobile
- [ ] Category tabs horizontally scrollable
- [ ] Item grid: 2-column on mobile, 3-4 on desktop
- [ ] Action buttons stack vertically on small screens
- [ ] WhatsApp button prominent and thumb-reachable

**Owner Dashboard**
- [ ] Sidebar collapses to bottom nav or hamburger on mobile
- [ ] Forms are single-column on mobile
- [ ] Tables have horizontal scroll on mobile
- [ ] Image upload previews show correctly on mobile

### 7.6 Performance

**Public Storefront**
- Use `next/image` with proper `width`/`height` for all images
- Cloudinary transformations: `f_auto,q_auto,w_400` for item images
- ISR: `export const revalidate = 60`
- Preload critical images (shop logo, first item images)

**Owner Dashboard**
- Paginate item lists (25 per page)
- Paginate admin lists (20 per page)

### 7.7 Edge Cases Verification

Run through all items in [`docs/EDGE-CASES.md`](../EDGE-CASES.md) and verify each is handled.

### 7.8 Accessibility

- All images have alt text
- Form labels associated with inputs
- Keyboard navigation works in modals/dialogs
- Color contrast meets WCAG AA

### 7.9 Security Hardening

- [ ] Rate limit `/api/public/shop/[slug]/track`
- [ ] Validate file type and size in `/api/upload`
- [ ] Sanitize all text rendered in storefront (no XSS)
- [ ] Verify RBAC on every API route (owner cannot access other owner's data)
- [ ] Verify admin routes all require SUPER_ADMIN
- [ ] Test: owner cannot exceed limits via direct API call

---

## Key Files to Create/Update

```
app/
├── **/loading.tsx               ← Skeleton screens
├── **/error.tsx                 ← Error boundaries
└── **/not-found.tsx
components/
├── shared/
│   ├── EmptyState.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ConfirmDialog.tsx
│   └── Toast.tsx (if not using Sonner)
└── storefront/
    └── SearchNoResults.tsx
```

---

## Acceptance Criteria

- [ ] All pages show loading skeletons while fetching
- [ ] All empty states render with helpful messages
- [ ] Mutations show success/error toasts
- [ ] Destructive actions have confirmation dialogs
- [ ] Mobile storefront is fully functional
- [ ] Owner dashboard usable on mobile
- [ ] Images load correctly with next/image
- [ ] All items from EDGE-CASES.md are handled
- [ ] No console errors in production build
- [ ] `npm run build` passes without errors
