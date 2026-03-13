# API Reference — DigiDukan

All API routes are under `/api/`. Protected routes require session cookies (Auth.js).

---

## Authentication

All protected routes check `session.user.role`:
- `OWNER` routes → require role `OWNER` or `SUPER_ADMIN`
- `ADMIN` routes → require role `SUPER_ADMIN`
- `PUBLIC` routes → no auth required

---

## Public API

### Get Shop Data
```
GET /api/public/shop/[slug]
```
Returns: shop info, branding, banner, status
Used by: public storefront header

### Get Shop Catalog
```
GET /api/public/shop/[slug]/catalog
```
Returns: categories (with items), collections, featured items
Used by: public storefront browsing

### Track Analytics Event
```
POST /api/public/shop/[slug]/track
Body: { eventType: AnalyticsEventType, itemId?: string, metadata?: object }
```
Rate limited. No auth required.

---

## Owner API

### Shops

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/owner/shops` | Create new shop |
| `GET` | `/api/owner/shops` | List owner's shops |
| `GET` | `/api/owner/shops/:shopId` | Get single shop |
| `PATCH` | `/api/owner/shops/:shopId` | Update shop details |
| `POST` | `/api/owner/shops/:shopId/publish` | Publish shop (checks preconditions) |
| `POST` | `/api/owner/shops/:shopId/unpublish` | Unpublish shop |
| `POST` | `/api/owner/shops/:shopId/qr/regenerate` | Regenerate QR code |

### Categories

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/owner/shops/:shopId/categories` | List categories |
| `POST` | `/api/owner/shops/:shopId/categories` | Create category |
| `PATCH` | `/api/owner/categories/:categoryId` | Update category |
| `DELETE` | `/api/owner/categories/:categoryId` | Delete (blocked if has items) |
| `POST` | `/api/owner/shops/:shopId/categories/reorder` | Update display orders |

### Items

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/owner/shops/:shopId/items` | List items |
| `POST` | `/api/owner/shops/:shopId/items` | Create item |
| `PATCH` | `/api/owner/items/:itemId` | Update item |
| `DELETE` | `/api/owner/items/:itemId` | Soft delete item |
| `POST` | `/api/owner/items/:itemId/toggle-availability` | Toggle available/unavailable |
| `POST` | `/api/owner/shops/:shopId/items/reorder` | Update display orders |

### Collections

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/owner/shops/:shopId/collections` | List collections |
| `POST` | `/api/owner/shops/:shopId/collections` | Create collection |
| `PATCH` | `/api/owner/collections/:collectionId` | Update collection |
| `DELETE` | `/api/owner/collections/:collectionId` | Soft delete collection |
| `POST` | `/api/owner/collections/:collectionId/items` | Add items to collection |
| `DELETE` | `/api/owner/collections/:collectionId/items/:itemId` | Remove item from collection |

### Analytics

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/owner/shops/:shopId/analytics` | Get analytics (paid plan only) |

Query params: `period=7d|30d`

### Image Upload

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/upload` | Upload image to Cloudinary |
| `DELETE` | `/api/upload/:publicId` | Delete image from Cloudinary |

---

## Admin API

### Owners

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/admin/owners` | List all owners (paginated, filterable) |
| `POST` | `/api/admin/owners` | Create owner account |
| `GET` | `/api/admin/owners/:userId` | Get owner details |
| `PATCH` | `/api/admin/owners/:userId` | Update owner |

### Shops

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/admin/shops` | List all shops (paginated, filterable) |
| `POST` | `/api/admin/shops` | Create shop for an owner |
| `GET` | `/api/admin/shops/:shopId` | Get shop details |
| `PATCH` | `/api/admin/shops/:shopId/status` | Suspend/activate/archive shop |
| `PATCH` | `/api/admin/shops/:shopId/plan` | Assign plan to shop |
| `POST` | `/api/admin/shops/:shopId/grant-trial` | Grant free trial (1/2/3 months or custom) |

### Plans

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/admin/plans` | List all plans |
| `POST` | `/api/admin/plans` | Create plan |
| `PATCH` | `/api/admin/plans/:planId` | Update plan |

### Impersonation

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/admin/impersonation/start` | Start impersonating an owner |
| `POST` | `/api/admin/impersonation/end` | End impersonation session |

Body for start: `{ targetOwnerId: string, reason: string }`

### Logs & Flags

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/admin/logs` | Get admin action logs |
| `GET` | `/api/admin/impersonation-logs` | Get impersonation logs |
| `GET` | `/api/admin/flags` | Get issue flags |
| `POST` | `/api/admin/flags` | Create issue flag for a shop |
| `PATCH` | `/api/admin/flags/:flagId/resolve` | Resolve a flag |

---

## Validation (Zod)

All mutations validated server-side with Zod schemas. Key schemas:

```typescript
// Example: Create Shop
const CreateShopSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  businessType: z.enum(['RETAIL', 'SERVICE', 'MIXED']),
  phone: z.string().min(10),
  whatsappNumber: z.string().min(10),
  // ...optional fields
})
```

---

## Error Responses

```json
{ "error": "UNAUTHORIZED" }          // 401
{ "error": "FORBIDDEN" }             // 403
{ "error": "NOT_FOUND" }             // 404
{ "error": "PLAN_LIMIT_REACHED", "limit": 25, "current": 25 }  // 422
{ "error": "VALIDATION_ERROR", "issues": [...] }  // 400
{ "error": "SLUG_TAKEN" }            // 409
```
