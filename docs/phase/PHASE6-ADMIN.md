# Phase 6 — Super Admin

## Goal
Super admin can manage the full platform: owners, shops, plans, trials, and impersonation.

## Prerequisite
Phase 5 complete: plans and analytics working.

---

## Step-by-Step Tasks

### 6.1 Admin Dashboard Overview
Route: `/admin`

Stats overview:
- Total owners (active/inactive)
- Total shops (by status: draft/published/suspended)
- Total storefront views (last 30 days)
- Platform plan distribution (Free vs Paid)
- Recent admin actions log (last 10)
- Active impersonation sessions

### 6.2 Owner Management
Route: `/admin/owners`

**Owner List**
- Paginated table: name, email, sign-up date, plan, shop count, status
- Filters: plan type, join date range, search by email/name
- Actions: View, Create Shop for Owner, Suspend Owner

**Create Owner Account**
Route: `/admin/owners/new`
- Fields: name, email, password (auto-generated or set manually)
- Assigns FREE plan automatically
- Creates User + OwnerProfile + ShopSubscription

**Owner Detail**
Route: `/admin/owners/[userId]`
- Owner info + list of their shops
- "Impersonate" button
- "Create Shop for Owner" button

### 6.3 Shop Management
Route: `/admin/shops`

**Shop List**
- Paginated table: shop name, slug, owner, plan, status, item count, last published
- Filters: status (draft/published/suspended/archived), plan type, date range
- Search: by shop name, slug, owner email

**Shop Admin Actions**
Route: `/admin/shops/[shopId]`
- View shop details + catalog summary
- **Suspend** shop → sets `status: SUSPENDED`, logs action
- **Activate** shop → sets `status: PUBLISHED`, logs action
- **Archive** shop → sets `status: ARCHIVED`, logs action
- **Assign Plan** → update ShopSubscription
- **Grant Trial** → create/update ShopSubscription with custom dates + notes
- **View QR Code**
- **Flag Issue** → creates IssueFlag

**Create Shop for Owner**
Route: `/admin/shops/new`
- Select owner from dropdown (search by email)
- Fill shop required fields
- Assign plan
- Status: starts as DRAFT (owner must publish) or PUBLISHED (admin can force-publish)

### 6.4 Plan Management
Route: `/admin/plans`

- List all plans with limits
- Edit plan limits (max items, categories, etc.)
- Create new plan (for custom enterprise deals)
- Activate/deactivate plan

### 6.5 Impersonation

**Start Impersonation**
Route: Admin owner detail → "Impersonate" button
```typescript
// POST /api/admin/impersonation/start
// Body: { targetOwnerId, reason }
//
// 1. Validate admin is SUPER_ADMIN
// 2. Create SupportImpersonationLog { adminId, targetOwnerId, reason, startedAt, isActive: true }
// 3. Add impersonation flag to session: { impersonating: { targetOwnerId, logId } }
// 4. Redirect to /dashboard (now viewing as owner)
```

**Impersonation Banner**
```tsx
// components/ImpersonationBanner.tsx
// Shows on all owner route pages during impersonation
// "You are viewing as [Owner Name] — End Impersonation"
// Sticky top bar, warning color (amber/yellow)
```

**End Impersonation**
```typescript
// POST /api/admin/impersonation/end
// 1. Find active log by logId in session
// 2. Set SupportImpersonationLog.endedAt = now(), isActive = false
// 3. Clear impersonation from session
// 4. Redirect back to /admin/owners/[userId]
```

**Write Actions During Impersonation**
All server actions check for impersonation and tag the log:
```typescript
// In every server action that mutates data:
const session = await getSession()
if (session.impersonating) {
  // Log the action with impersonationLogId
  await prisma.adminActionLog.create({
    data: {
      adminId: session.impersonating.adminId,
      action: 'IMPERSONATED_ACTION',
      targetType: 'Shop',
      targetId: shopId,
      metadata: { impersonationLogId: session.impersonating.logId, action: 'UPDATE_SHOP' }
    }
  })
}
```

### 6.6 Audit Logs
Route: `/admin/logs`

**Admin Action Log**
- Table: admin name, action, target type/id, timestamp
- Filterable by admin, action type, date range

**Impersonation Log**
Route: `/admin/logs/impersonation`
- Table: admin name, target owner, reason, start time, end time, duration
- Active sessions highlighted

### 6.7 Issue Flags
Route: `/admin/flags`

- List flagged shops: shop name, reason, flagged by, date, resolved status
- Create flag: select shop, enter reason
- Resolve flag: mark as resolved + optional resolution note

---

## Key Files to Create

```
app/(admin)/admin/
├── page.tsx                    ← Dashboard overview
├── owners/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [userId]/page.tsx
├── shops/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [shopId]/page.tsx
├── plans/page.tsx
├── logs/
│   ├── page.tsx
│   └── impersonation/page.tsx
└── flags/page.tsx
app/api/admin/
├── owners/route.ts
├── owners/[userId]/route.ts
├── shops/route.ts
├── shops/[shopId]/status/route.ts
├── shops/[shopId]/plan/route.ts
├── shops/[shopId]/grant-trial/route.ts
├── impersonation/start/route.ts
├── impersonation/end/route.ts
└── logs/route.ts
components/
└── ImpersonationBanner.tsx
```

---

## Acceptance Criteria

- [ ] Admin can view list of all owners and shops
- [ ] Admin can filter shops by status and plan
- [ ] Admin can create owner account
- [ ] Admin can create shop for owner
- [ ] Admin can assign plan to shop
- [ ] Admin can grant free trial (1/2/3 months or custom)
- [ ] Admin can suspend a published shop
- [ ] Admin can activate a suspended shop
- [ ] Admin can archive a shop
- [ ] Admin can impersonate owner with required reason
- [ ] Impersonation banner visible during session
- [ ] All write actions during impersonation are logged
- [ ] Admin can end impersonation session
- [ ] Impersonation log created with start/end times
- [ ] Admin action log shows all admin mutations
- [ ] Admin can create and resolve issue flags
