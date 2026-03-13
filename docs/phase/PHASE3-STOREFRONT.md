# Phase 3 — Collections + Public Storefront

## Goal
Collections management + fully functional, mobile-first public storefront at `/s/[slug]`.

## Prerequisite
Phase 2 complete: shop, categories, and items working.

---

## Step-by-Step Tasks

### 3.1 Collection Management
Route: `/shops/[shopId]/collections`

**Collection List Page**
- Grid/list of collections with status badges
- Plan limit indicator (Free: 2 max)

**Create/Edit Collection Form**
- Name, slug (auto-generated), type (SEASONAL/OCCASION/FEATURED/CUSTOM)
- Description (optional)
- Cover image (Cloudinary, optional)
- Start date / end date (optional)
- Active toggle
- Display order

**Manage Items in Collection**
Route: `/shops/[shopId]/collections/[collectionId]`
- Shows all items in the collection
- "Add Items" modal: multi-select from shop's items
- Remove item from collection
- Items can belong to multiple collections

### 3.2 Public Storefront

Route: `/s/[slug]`

**Data Fetching**
```typescript
// app/s/[slug]/page.tsx
export const revalidate = 60 // ISR: revalidate every 60 seconds

async function StorefrontPage({ params }) {
  const shop = await getPublishedShop(params.slug)
  if (!shop) notFound()
  if (shop.status === 'SUSPENDED') return <SuspendedPage />
  // render storefront
}
```

**Storefront Sections**

1. **Header**
   - Shop logo (fallback: initials avatar)
   - Shop name + description
   - Open/Closed badge (based on `shop.isOpen` + optional business hours)
   - Last updated timestamp

2. **Banner Area**
   - Offer/announcement banner (if `ShopBanner.isActive === true`)
   - Auto-hide if `expiresAt` is past

3. **Action Buttons**
   - Call: `tel:{phone}` link
   - WhatsApp Inquiry: `https://wa.me/{whatsapp}?text=Hi, I want to enquire about your shop`
   - Share: Web Share API or copy link
   - Map/Directions: `shop.mapsUrl` link (hidden if not set)

4. **Collections Section**
   - Horizontal scrollable chips/tabs for active collections
   - Collection cover image + name card
   - Clicking collection filters items

5. **Category Tabs**
   - Sticky tabs for each active category
   - "All" tab as default
   - Clicking tab scrolls to section or filters

6. **Search Bar**
   - Client-side search (filter by item name/description)
   - Clear button

7. **Featured Items Section**
   - Shows items where `isFeatured === true`
   - Horizontal scroll carousel or 2-col grid

8. **Item Cards**
   - Image (with fallback icon)
   - Name
   - Price (INR format: ₹X,XXX)
   - Old price (strikethrough, if set)
   - Short description (truncated)
   - Dietary badge (veg/non-veg/egg, if applicable)
   - Bestseller badge
   - "Out of Stock" overlay if `!item.isAvailable`
   - "Add to Cart" button (or quantity selector if already in cart)

9. **Footer**
   - "Powered by DigiDukan" watermark (Free plan)
   - Hidden for Paid plan

### 3.3 Analytics Events
Track on storefront:
- `PAGE_VIEW` — on page load
- `QR_SCAN` — detect via `?ref=qr` query param
- `CALL_CLICK` — on call button click
- `SHARE_CLICK` — on share button click
- `MAP_CLICK` — on map button click

Fire via `POST /api/public/shop/[slug]/track` (non-blocking, fire-and-forget)

### 3.4 Error States
- Shop not found → Next.js `notFound()` → 404 page
- Shop suspended → Custom suspended page
- Shop unpublished → 404 or "Coming Soon" page (treat as not found)
- Shop has no logo → Initials avatar fallback
- Shop has no cover → Gradient or solid color background
- Shop has no collections → Hide collections section
- Shop has no map link → Hide map button
- Item has no image → Placeholder icon

---

## Key Files to Create

```
app/s/[slug]/
├── page.tsx                    ← Server component, data fetch
├── loading.tsx                 ← Skeleton
└── not-found.tsx
components/storefront/
├── StorefrontHeader.tsx
├── StorefrontBanner.tsx
├── StorefrontActions.tsx
├── CollectionChips.tsx
├── CategoryTabs.tsx
├── SearchBar.tsx
├── ItemGrid.tsx
├── ItemCard.tsx
├── FeaturedSection.tsx
├── CartButton.tsx              ← Floating cart button
└── StorefrontFooter.tsx
app/(owner)/shops/[shopId]/
└── collections/
    ├── page.tsx
    ├── new/page.tsx
    └── [collectionId]/page.tsx
lib/actions/
└── collection.ts
lib/validations/
└── collection.ts
```

---

## Acceptance Criteria

- [ ] Owner can create, edit, delete collections
- [ ] Owner can assign items to collections
- [ ] Owner can remove items from collections
- [ ] Free plan limited to 2 collections (enforced server + UI)
- [ ] Public storefront loads at `/s/[slug]`
- [ ] Published shop renders correctly
- [ ] Suspended shop shows suspended page
- [ ] Unknown slug shows 404
- [ ] Category tabs filter items
- [ ] Collection filter works
- [ ] Search filters items client-side
- [ ] Storefront works without logo, cover, collections
- [ ] Watermark visible on Free plan storefronts
- [ ] Mobile-first layout renders correctly
- [ ] Analytics events fired on page load
