# Business Rules — DigiDukan

## Publish Preconditions

A shop can only be published if ALL of the following are true:

| Condition | Field / Check |
|-----------|--------------|
| Shop name exists | `shop.name` not empty |
| Unique slug exists | `shop.slug` not null, passes uniqueness check |
| Contact exists | `shop.whatsappNumber` OR `shop.phone` is set |
| At least 1 category | `categories.count >= 1` |
| At least 1 item | `items.count >= 1` |
| Active subscription | `ShopSubscription.isActive === true` |

---

## Plan Limits

### Free Plan
| Resource | Limit |
|----------|-------|
| Shops | 1 |
| Items per shop | 25 |
| Categories per shop | 3 |
| Collections per shop | 2 |
| Analytics | Locked |
| PDF Export | No |
| Watermark | Yes |
| Custom branding | Limited |

### Paid Monthly Plan
| Resource | Limit |
|----------|-------|
| Shops | 3 (configurable) |
| Items per shop | 500 |
| Categories per shop | Unlimited |
| Collections per shop | Unlimited |
| Analytics | Full (7d + 30d) |
| PDF Export | Yes |
| Watermark | No |
| Custom branding | Full |

### Plan Enforcement Layers
1. **Server Action / API** — check count before insert, return `PLAN_LIMIT_REACHED` error
2. **UI** — disable "Add" buttons, show upgrade prompt when limit reached
3. **Direct API call protection** — server always validates, UI state irrelevant

---

## Slug Rules

- Must be globally unique across all shops
- Must be URL-safe: lowercase letters, numbers, hyphens only (`/^[a-z0-9-]+$/`)
- Minimum 2 characters, maximum 60 characters
- Auto-generated from shop name during onboarding (e.g. "Sweet House LKO" → "sweet-house-lko")
- Owner can edit slug manually
- **When slug changes:**
  - Old public URL becomes invalid (no redirect in MVP)
  - QR code must be regenerated
  - Analytics remain linked to `shop.id`, not slug

---

## Deletion Strategy

Use **soft delete** (set `deletedAt` timestamp) for:
- Shops
- Items
- Categories
- Collections

**Hard delete** is avoided in MVP unless safe (e.g., ItemCollection join records).

### Category Delete Rules
- If category has active items → **block delete** (return error)
- Owner must reassign or delete items first
- Soft-deleted categories are hidden from storefront and owner UI

### Collection Delete Rules
- Deleting a collection removes all `ItemCollection` join records
- Items themselves are NOT deleted
- Collection is soft-deleted

---

## Item Visibility Rules

An item is hidden from storefront if ANY of these are true:
1. `shop.status !== 'PUBLISHED'`
2. `item.isActive === false` OR `item.deletedAt !== null`
3. (Optional enhancement) `item.isAvailable === false` AND shop configured to hide unavailable items

Default behavior (MVP): unavailable items remain visible with "Out of Stock" label.

---

## Shop Status Transitions

```
DRAFT → PUBLISHED    (owner publishes, all preconditions met)
PUBLISHED → DRAFT    (owner unpublishes)
PUBLISHED → SUSPENDED (admin suspends)
SUSPENDED → PUBLISHED (admin reactivates)
PUBLISHED → ARCHIVED  (admin archives)
DRAFT → ARCHIVED      (admin archives)
```

Suspended shops:
- Return "suspended" state page to public visitors
- Do NOT expose catalog data

---

## WhatsApp Cart Rules

- WhatsApp CTA requires `shop.whatsappNumber` to be set
- If no WhatsApp number → hide "Order on WhatsApp" CTA entirely
- WhatsApp inquiry button (without cart) may still be shown if `shop.phone` exists
- Empty cart → disable order button
- Message format uses URL-encoded WhatsApp deep link: `https://wa.me/{number}?text={encodedMessage}`

---

## Analytics Rules

- Events recorded for: QR_SCAN, PAGE_VIEW, WHATSAPP_CLICK, CALL_CLICK, SHARE_CLICK, MAP_CLICK, CART_ADD
- Analytics endpoint rate-limited to prevent abuse
- Free plan owners: analytics page shows locked/upgrade UI
- Paid plan owners: see last 7 days and 30 days summary
- Admin can see aggregated platform usage (not per-owner without impersonation)
- Analytics are tied to `shop.id`, not slug (slug can change)

---

## Impersonation Rules

- Only `SUPER_ADMIN` can impersonate
- Must provide a reason before starting
- Creates `SupportImpersonationLog` entry
- Visible banner shown during impersonation: "You are viewing as [Owner Name]"
- All write actions during impersonation tagged with `impersonationLogId`
- Session must be explicitly ended (or time-bound)
- Owner's original data/identity preserved in logs

---

## Multi-Shop Rules

- Owner can have multiple shops in backend from day 1
- Free plan: limited to 1 shop
- Paid plan: limited to 3 shops (configurable by admin)
- Admin can create shops on behalf of any owner
- Owner cannot access shops belonging to another owner

---

## Defaults

| Setting | Default Value |
|---------|--------------|
| Country | India |
| Currency | INR |
| Business type (onboarding) | Mixed |
| Storefront language | English |
| Plan on signup | Free |
| Watermark | Enabled on Free |
| Item availability | Available |
| Item dietary type | NA |
| Shop status after creation | Draft |
| Primary brand color | `#3B82F6` |
| Business hours enabled | false |
