# Phase 2 — Core Owner Flow

## Goal
Owner can complete onboarding and manage their full shop catalog (shop, categories, items, images).

## Prerequisite
Phase 1 complete: auth working, DB migrated, route guards active.

---

## Step-by-Step Tasks

### 2.1 Owner Dashboard
- `/dashboard` — shows list of owner's shops, quick stats
- If `ownerProfile.onboardingDone === false` → redirect to `/onboarding`
- "Create Shop" CTA (plan-gated)

### 2.2 Onboarding Wizard
Route: `/onboarding`
State: stored in `OwnerProfile.onboardingStep` (persists on refresh/return)

**Step 1 — Account Confirmation**
- Display user's name and email
- "Looks good, continue" button

**Step 2 — Business Type**
- Radio: Retail / Service / Mixed
- Default: Mixed

**Step 3 — Create First Shop**
- Fields: shop name, slug (auto-generated + editable), phone, WhatsApp number
- Slug validation: uniqueness check on blur/submit
- Creates `Shop` record with `status: DRAFT`

**Step 4 — Branding (Skippable)**
- Logo upload (Cloudinary)
- Cover image upload (Cloudinary)
- Primary color picker
- "Skip for now" button

**Step 5 — Add First Category**
- Category name input
- Creates `Category` record

**Step 6 — Add First Items (1–3)**
- Add up to 3 items: name, price, item type
- Image upload optional
- "Add another" / "Done" controls

**Step 7 — Publish + QR**
- Run publish precondition checks
- Publish shop (`status: PUBLISHED`)
- Generate QR code
- Show QR preview + download button
- "Go to Dashboard" CTA

### 2.3 Shop Management
Route: `/shops/[shopId]`

**Shop Overview Page**
- Status badge (draft/published/suspended)
- Quick stats: item count, category count
- Actions: Edit, Publish/Unpublish, View Public Page, Download QR

**Shop Edit Page** (or modal)
- All required and optional fields
- Slug change warning (old URL invalidated, QR regenerated)

**Shop Settings** (`/shops/[shopId]/settings`)
- Manual open/closed toggle
- Business hours form (per day: open, close, closed all day)
- Offer banner (text, active toggle, optional expiry)

### 2.4 Category Management
Route: `/shops/[shopId]/categories`

- List with display order (drag-to-reorder or +/- arrows)
- Create modal: name → auto-slug
- Edit modal: name, description, display order, active toggle
- Delete: blocked if category has items (show error message)
- Plan limit indicator (Free: 3 max)

### 2.5 Item Management
Route: `/shops/[shopId]/items`

- Filterable list: by category, availability, featured
- Create/Edit form:
  - Name, item type (Product/Service), price, old price
  - Category selector (dropdown of shop's categories)
  - Description (optional)
  - Image upload (Cloudinary)
  - Dietary type (only shown for Retail/Mixed)
  - isFeatured, isBestseller toggles
  - Display order
- Availability toggle (quick toggle on list view)
- Delete: soft delete
- Plan limit indicator (Free: 25 max)

### 2.6 Image Upload
- `/api/upload` server action
- Validate: image only, max 5MB
- Upload to Cloudinary folder: `digidukan/shops/[shopId]/`
- Return: `{ url, publicId }`
- Delete old image when replaced

---

## Key Files to Create

```
app/(owner)/
├── dashboard/page.tsx
├── onboarding/
│   ├── page.tsx                ← Wizard container
│   └── steps/
│       ├── Step1Account.tsx
│       ├── Step2BusinessType.tsx
│       ├── Step3CreateShop.tsx
│       ├── Step4Branding.tsx
│       ├── Step5Category.tsx
│       ├── Step6Items.tsx
│       └── Step7Publish.tsx
└── shops/
    ├── page.tsx                ← Shop list
    ├── new/page.tsx
    └── [shopId]/
        ├── page.tsx            ← Shop overview
        ├── settings/page.tsx
        ├── categories/page.tsx
        └── items/
            ├── page.tsx
            ├── new/page.tsx
            └── [itemId]/page.tsx
components/owner/
├── ShopCard.tsx
├── CategoryList.tsx
├── ItemCard.tsx
├── ItemForm.tsx
└── ImageUpload.tsx             ← Cloudinary upload widget
lib/actions/
├── shop.ts                     ← Server actions for shop CRUD
├── category.ts
├── item.ts
└── upload.ts
lib/validations/
├── shop.ts
├── category.ts
└── item.ts
```

---

## Plan Limit Enforcement

```typescript
// Example: before creating item
const itemCount = await prisma.item.count({
  where: { shopId, deletedAt: null }
})
const plan = await getShopPlan(shopId)
if (itemCount >= plan.maxItems && plan.maxItems !== -1) {
  throw new Error('PLAN_LIMIT_REACHED')
}
```

---

## Acceptance Criteria

- [ ] Owner can complete all 7 onboarding steps
- [ ] Onboarding step persists on page refresh
- [ ] Onboarding can be exited and resumed
- [ ] Shop is created with status DRAFT
- [ ] Publishing shop checks all preconditions
- [ ] Owner can create, edit, delete categories
- [ ] Category delete blocked if items exist
- [ ] Owner can create, edit, soft-delete items
- [ ] Item images upload to Cloudinary and URLs saved
- [ ] Free plan owner blocked at 25 items (UI warning + server error)
- [ ] Free plan owner blocked at 3 categories
- [ ] Slug uniqueness enforced on creation and edit
