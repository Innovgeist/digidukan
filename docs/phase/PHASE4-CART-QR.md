# Phase 4 — Cart + WhatsApp + QR

## Goal
Customers can add items to cart and send order via WhatsApp. Owner can download QR code.

## Prerequisite
Phase 3 complete: public storefront rendering correctly.

---

## Step-by-Step Tasks

### 4.1 Cart State Management

Use React Context + `useState` (or Zustand if needed).

**Cart Store Shape**
```typescript
interface CartItem {
  itemId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartStore {
  shopId: string
  items: CartItem[]
  customerNote: string
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, qty: number) => void
  setNote: (note: string) => void
  clearCart: () => void
  total: number
  itemCount: number
}
```

**Behavior**
- Cart is **scoped to current shop** (slug)
- Cart is **client-side only** (no server persistence in MVP)
- Cart persists in `localStorage` per shopId (optional enhancement)
- Cart cleared after WhatsApp order sent

### 4.2 Cart UI

**Item Card — Add to Cart**
- "Add" button → adds item to cart with qty 1
- If item in cart → show `[-] [qty] [+]` quantity selector
- "Out of Stock" items → disabled add button

**Floating Cart Button**
- Fixed bottom button: "🛒 Cart (N items) — ₹X,XXX"
- Opens Cart Drawer/Sheet

**Cart Drawer (shadcn Sheet component)**
- List of cart items: image, name, price × qty, remove button
- Subtotal
- Customer note textarea
- "Order on WhatsApp" button (primary CTA)
- "Continue Shopping" link

### 4.3 WhatsApp Order Generation

```typescript
function generateWhatsAppMessage(
  shopName: string,
  items: CartItem[],
  total: number,
  customerNote?: string
): string {
  const itemLines = items
    .map((item, i) =>
      `${i + 1}. ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n')

  let message = `Hello, I want to order from *${shopName}*.\n\nItems:\n${itemLines}\n\nEstimated Total: ₹${total.toFixed(2)}`

  if (customerNote) {
    message += `\n\nCustomer Note: ${customerNote}`
  }

  message += '\n\nPlease confirm availability.'

  return message
}

function getWhatsAppUrl(whatsappNumber: string, message: string): string {
  // Clean number: remove +, spaces, dashes
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}
```

**Rules**
- WhatsApp number must be set → check before showing CTA
- Empty cart → disable "Order on WhatsApp" button
- On click → open WhatsApp URL in new tab
- Track `WHATSAPP_CLICK` analytics event

### 4.4 QR Code Generation

**Generation**
```typescript
import QRCode from 'qrcode'

async function generateQRCode(shopSlug: string): Promise<{ pngUrl: string; svgUrl?: string }> {
  const targetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${shopSlug}`

  // Generate PNG as data URL
  const pngDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' }
  })

  // Optionally upload to Cloudinary for persistent URL
  // ...

  return { pngUrl: pngDataUrl }
}
```

**Storage**
- Save QR PNG to Cloudinary: `digidukan/qr/[shopId]/`
- Store URL in `QRCodeAsset` table
- Regenerate when slug changes

**Download**
```typescript
// Client-side download
function downloadQR(pngUrl: string, shopName: string) {
  const link = document.createElement('a')
  link.href = pngUrl
  link.download = `${shopName}-qr.png`
  link.click()
}
```

### 4.5 QR Owner Page
Route: `/shops/[shopId]/qr`

- Show QR code preview (large)
- Show target URL it encodes
- Download PNG button
- Download QR Poster button (shop name + QR, simple layout)
- "Regenerate QR" button (use when slug changes)
- Warning: "Regenerating QR will invalidate the old one"

### 4.6 QR Poster
Simple poster layout (can be HTML→Canvas or just a styled div for screenshot):
```
┌──────────────────────┐
│   [Shop Logo/Name]   │
│                      │
│    [QR CODE]         │
│                      │
│  Scan to view our    │
│  menu & catalog      │
│                      │
│  [Shop Phone/WA]     │
└──────────────────────┘
```
Download via `html2canvas` or similar.

### 4.7 Publish Flow (Final)

Trigger on "Publish Shop" button:
```
1. Run precondition checks (name, slug, contact, category, item, subscription)
2. If any fail → show specific error messages
3. If all pass → SET shop.status = 'PUBLISHED', shop.lastPublishedAt = now()
4. Generate QR if none exists
5. Redirect to /shops/[shopId]/qr
```

---

## Key Files to Create

```
components/storefront/
├── CartProvider.tsx             ← React context
├── CartDrawer.tsx               ← Sheet component
├── CartItem.tsx
└── CartFloatingButton.tsx
lib/
├── cart.ts                      ← Cart store logic
├── whatsapp.ts                  ← Message generation
└── qr.ts                        ← QR generation
app/(owner)/shops/[shopId]/
└── qr/page.tsx
app/api/owner/shops/[shopId]/
└── qr/
    └── regenerate/route.ts
```

---

## Analytics Events to Track

| Event | When |
|-------|------|
| `CART_ADD` | Item added to cart |
| `WHATSAPP_CLICK` | "Order on WhatsApp" clicked |
| `CALL_CLICK` | Call button clicked |
| `MAP_CLICK` | Map button clicked |
| `SHARE_CLICK` | Share button clicked |

---

## Acceptance Criteria

- [ ] Customer can add items to cart
- [ ] Customer can adjust quantities (+ / -)
- [ ] Customer can remove items from cart
- [ ] Customer can add a note
- [ ] Cart drawer opens and shows correct totals
- [ ] "Order on WhatsApp" opens WhatsApp with pre-filled message
- [ ] WhatsApp message contains correct item names, quantities, and totals
- [ ] Empty cart → "Order on WhatsApp" button disabled
- [ ] No WhatsApp number configured → CTA hidden
- [ ] Owner can view QR code at `/shops/[shopId]/qr`
- [ ] Owner can download QR as PNG
- [ ] QR scans resolve to correct public storefront URL
- [ ] Publish flow checks all preconditions
- [ ] QR regenerated when slug changes
