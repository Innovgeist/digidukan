# Acceptance Tests — DigiDukan

Complete checklist for MVP sign-off. All items must pass.

---

## Owner Acceptance Tests

### Authentication
- [ ] Owner can sign up with email + password
- [ ] Duplicate email registration shows error
- [ ] Owner can log in with correct credentials
- [ ] Wrong password shows error
- [ ] Owner can log out
- [ ] Logged-in owner redirected from `/login` to `/dashboard`
- [ ] Unauthenticated user redirected from `/dashboard` to `/login`

### Onboarding
- [ ] New owner is redirected to `/onboarding` on first login
- [ ] Can complete all 7 onboarding steps
- [ ] Can skip branding step (step 4)
- [ ] Onboarding state persists on page refresh
- [ ] Can exit and resume onboarding
- [ ] After completion, redirected to dashboard
- [ ] Onboarding not shown again after completion

### Shop Management
- [ ] Can create a new shop
- [ ] Slug is auto-generated from shop name
- [ ] Can edit slug (unique validation enforced)
- [ ] Can edit shop details (name, phone, WhatsApp, address, etc.)
- [ ] Can toggle shop open/closed
- [ ] Can update shop branding (logo, cover, color)
- [ ] Logo and cover images upload and display correctly
- [ ] Can configure business hours
- [ ] Can create/edit/delete offer banner
- [ ] Can publish shop (all preconditions must be met)
- [ ] Can unpublish shop
- [ ] Free plan limited to 1 shop (second shop blocked)

### Categories
- [ ] Can create a category
- [ ] Category slug auto-generated
- [ ] Can edit category name/description
- [ ] Can set category active/inactive
- [ ] Can reorder categories
- [ ] Cannot delete category with existing items
- [ ] Can delete empty category
- [ ] Free plan limited to 3 categories (4th blocked)

### Items
- [ ] Can create an item (name, price, category)
- [ ] Can create service item (no category required)
- [ ] Can upload item image
- [ ] Can edit item details
- [ ] Can toggle availability
- [ ] Can mark item as featured / bestseller
- [ ] Can set dietary type (veg/non-veg/egg)
- [ ] Can reorder items
- [ ] Can soft-delete item (disappears from storefront)
- [ ] Free plan limited to 25 items (26th blocked in UI + API)

### Collections
- [ ] Can create a collection with name + type
- [ ] Can add items to a collection
- [ ] Can remove items from a collection
- [ ] Can set collection start/end dates
- [ ] Can set collection active/inactive
- [ ] Can upload collection cover image
- [ ] Can delete collection (items not deleted)
- [ ] Free plan limited to 2 collections (3rd blocked)

### QR Code
- [ ] QR code generated on publish
- [ ] Can download QR as PNG from `/shops/[shopId]/qr`
- [ ] QR code scans to correct public storefront URL
- [ ] Can regenerate QR code
- [ ] QR regenerated automatically when slug changes

### Analytics
- [ ] Free plan owner sees locked/upgrade analytics view
- [ ] Paid plan owner sees analytics dashboard
- [ ] Analytics shows data for last 7 days and 30 days
- [ ] QR scans counted in analytics
- [ ] Page views counted in analytics
- [ ] WhatsApp click events counted

---

## Public Visitor Acceptance Tests

### Storefront Access
- [ ] Can open public shop page via `/s/[slug]`
- [ ] Published shop renders full storefront
- [ ] Suspended shop shows suspended page
- [ ] Unknown slug shows 404

### Browsing
- [ ] Shop logo, name, description visible
- [ ] Open/Closed badge shows correctly
- [ ] Offer banner shows when active
- [ ] All categories listed as tabs
- [ ] All items listed under correct categories
- [ ] Featured items shown in featured section
- [ ] Collections shown with cover images
- [ ] Can filter by category (click tab)
- [ ] Can filter by collection
- [ ] Can search items by name
- [ ] "No results" shown when search finds nothing
- [ ] Items with no image show placeholder
- [ ] Unavailable items show "Out of Stock"

### Actions
- [ ] Call button opens phone dialer
- [ ] WhatsApp inquiry button opens WhatsApp
- [ ] Share button copies link or uses Web Share API
- [ ] Map button opens Google Maps (if mapsUrl set)
- [ ] Map button hidden if no mapsUrl

### Cart
- [ ] Can add item to cart
- [ ] Cart button shows item count and total
- [ ] Can open cart drawer
- [ ] Can increase/decrease quantity
- [ ] Can remove item from cart
- [ ] Can add customer note
- [ ] Cart totals calculated correctly
- [ ] "Order on WhatsApp" button opens WhatsApp with pre-filled message
- [ ] Message contains correct items, quantities, and totals
- [ ] "Order on WhatsApp" disabled when cart is empty
- [ ] "Order on WhatsApp" hidden when no WhatsApp number configured

### Plan Visibility
- [ ] Free plan storefront shows "Powered by DigiDukan" watermark
- [ ] Paid plan storefront has no watermark

---

## Admin Acceptance Tests

### Owner Management
- [ ] Can list all owners (paginated)
- [ ] Can search/filter owners
- [ ] Can create owner account (name, email, password)
- [ ] New owner gets FREE plan subscription automatically

### Shop Management
- [ ] Can list all shops with status + plan info
- [ ] Can filter shops by status
- [ ] Can view shop details
- [ ] Can create shop on behalf of an owner
- [ ] Can assign/change plan on a shop
- [ ] Can grant free trial (1 month, 2 months, 3 months, custom dates)
- [ ] Can suspend a published shop
- [ ] Suspended shop not accessible via public URL
- [ ] Can activate (reactivate) a suspended shop
- [ ] Can archive a shop

### Impersonation
- [ ] "Impersonate" button visible on owner detail page
- [ ] Reason field required before starting impersonation
- [ ] After starting, redirected to owner's dashboard view
- [ ] Impersonation banner visible at top of page
- [ ] Banner shows correct owner name
- [ ] Can perform owner actions during impersonation
- [ ] All write actions logged with impersonation context
- [ ] Can end impersonation via banner
- [ ] After ending, redirected back to admin
- [ ] Impersonation log entry has both start and end times

### Audit Logs
- [ ] Admin action log shows all admin mutations
- [ ] Impersonation log lists all sessions with reasons
- [ ] Active impersonation sessions highlighted

---

## Non-Functional Tests

### Security
- [ ] Owner A cannot access Owner B's shops (403)
- [ ] OWNER role cannot access `/admin` routes (403)
- [ ] Direct API call beyond plan limit returns `PLAN_LIMIT_REACHED`
- [ ] Uploading non-image file is rejected

### Performance
- [ ] Public storefront loads within reasonable time on mobile
- [ ] Images optimized via Cloudinary + next/image

### Reliability
- [ ] Suspended shops do NOT expose catalog data
- [ ] Deleted items not shown on storefront
- [ ] Invalid slugs return 404 (not 500)
