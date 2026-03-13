# Edge Cases — DigiDukan

All edge cases from the PRD that must be explicitly handled. Use this as a verification checklist.

---

## Shop Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 1 | Shop has no logo | Show initials avatar (first letter of shop name) |
| 2 | Shop has no cover image | Show gradient background using primary color |
| 3 | Shop has no collections | Hide collections section entirely from storefront |
| 4 | Shop has no map link | Hide "Directions" / map button |
| 5 | Shop has no WhatsApp number | Hide "Order on WhatsApp" CTA entirely |
| 6 | Shop has phone but no WhatsApp | Show "Call" button; hide WhatsApp order CTA |
| 7 | Shop is not published yet | Return 404 (treat as not found) |
| 8 | Shop is suspended | Show suspended state page (not catalog) |
| 9 | Slug changed after QR generation | Regenerate QR; old QR URL becomes invalid |
| 10 | Slug collision on creation/edit | Return `SLUG_TAKEN` error; suggest alternatives |

---

## Item Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 11 | Item has no image | Show placeholder icon/image |
| 12 | Item is unavailable | Show "Out of Stock" label; keep visible; disable "Add to Cart" |
| 13 | All items in category unavailable | Show category with "Out of Stock" items |
| 14 | Item deleted after added to cart | Remove from cart on next render; show toast warning |
| 15 | Item price changed after added to cart | Use latest price (not cached price) |

---

## Cart Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 16 | Empty cart + WhatsApp attempt | "Order on WhatsApp" button disabled/hidden |
| 17 | Quantity set to 0 | Remove item from cart |
| 18 | Very long customer note | Truncate or limit to reasonable max (500 chars) |
| 19 | Cart on different shop visited | Clear old cart; start new cart for new shop |

---

## Plan / Limit Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 20 | Owner hits Free item limit | Block add item in UI + server validation |
| 21 | Owner tries direct API call beyond item limit | Server returns `PLAN_LIMIT_REACHED` |
| 22 | Owner hits category limit | Block add category in UI + server validation |
| 23 | Owner hits collection limit | Block add collection in UI + server validation |
| 24 | Owner hits shop limit | Block create shop in UI + server validation |
| 25 | Plan downgraded (paid → free) | Existing items remain; new adds blocked at limit |

---

## Category Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 26 | Category has active items + delete attempt | Block delete; show "Move or delete items first" |
| 27 | Category set to inactive | Hide from storefront + category tabs |
| 28 | All categories inactive | Show all items without category filter |
| 29 | Category display order collision | Allow; sort by order then by name |

---

## Collection Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 30 | Collection deleted with linked items | Remove all ItemCollection records; items not deleted |
| 31 | Collection has no cover image | Use shop cover or gradient fallback |
| 32 | Collection with `endsAt` in the past | Auto-hide from storefront (filter by active + date) |
| 33 | Collection with no items | Show empty collection or hide from storefront (hide recommended) |

---

## Admin / Impersonation Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 34 | Admin impersonation session expires/ends | Clear impersonation from session; redirect to admin |
| 35 | Admin closes browser during impersonation | Session expires naturally; log shows no `endedAt` (handle gracefully) |
| 36 | Admin tries to impersonate another admin | Block (only OWNER accounts can be impersonated) |
| 37 | Admin suspends a shop with active impersonation | Suspend works; impersonation should be ended |

---

## Auth Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 38 | Owner tries to access `/admin` | 403 Forbidden |
| 39 | Unauthenticated user tries owner routes | Redirect to `/login` |
| 40 | Session expired during dashboard use | Redirect to `/login` on next request |
| 41 | Owner tries to access another owner's shop via URL | 403 or 404 (verify ownership in every API call) |

---

## Storefront Display Edge Cases

| # | Edge Case | Expected Behavior |
|---|-----------|------------------|
| 42 | Shop has 500 items | UI handles gracefully (pagination or virtualization) |
| 43 | Very long shop name | Text truncation / word break |
| 44 | Very long item name | Truncate to 2 lines with ellipsis |
| 45 | Item description very long | Truncate with "Read more" or fixed 2-line display |
| 46 | Price is 0 | Show "Free" or "₹0.00" |
| 47 | Old price same as current price | Hide old price / strikethrough |
| 48 | Shop has offer banner expired | Hide banner (filter by `isActive === true && expiresAt > now`) |
| 49 | Storefront search returns no results | Show "No items found" message |
| 50 | Multiple shops under same owner | Dashboard lists all; owner can switch between them |

---

## Implementation Notes

- Items 1–3 (no logo/cover/collections): Handle with CSS fallbacks in `StorefrontHeader`
- Items 20–24 (plan limits): One central `checkPlanLimit(shopId, resource)` function
- Item 41 (cross-owner access): Every API route must verify `shop.ownerId === session.userId`
- Item 42 (500 items): Use intersection observer for infinite scroll or pagination on storefront
