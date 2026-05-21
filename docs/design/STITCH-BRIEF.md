# DigiDukan — Storefront Design Brief for Google Stitch

> Paste this entire document into Google Stitch and ask it to produce the deliverables listed in §10. The brief covers the public **customer-facing storefront only** — owner dashboard and admin panel are out of scope here.

---

## 1. Product Context

**DigiDukan** is a multi-tenant SaaS QR storefront for small Indian businesses — kirana stores, dhabas, boutiques, salons, cafes. Owners create a shop in 5 minutes, print a QR sticker, and customers scan it to browse the menu/catalogue on their phone and place orders via WhatsApp. There is **no checkout, no payment gateway, no customer login** — the QR scan is the entire funnel. Mobile is the primary surface; desktop is secondary.

We render the storefront in **two visual variants** today:

- **Variant A — Standard (Kirana).** The current default. Warm, hand-drawn, paper-and-ink bazaar aesthetic. Already shipped; this brief asks Stitch to **refine** it, not replace it.
- **Variant B — Premium (Heritage / Colonial).** A new look for "royal cafe / Taj-hotel-menu / ITC-catalogue" shops. Toggled per shop by a super-admin checkbox (`Shop.isPremium`). Same data, different chrome.

A shop is either A or B at any moment. Both variants must render the same data with no missing fields, and must respect each shop's `primaryColor` (see §9).

---

## 2. Audience & Device Profile

- **Customer device**: low-end Android, 360–414px viewport, 4G that drops to 3G, one-handed scroll, thumb reach matters.
- **Customer context**: standing in front of the shop, or sitting at a table — they want to find an item, see the price, tap WhatsApp. Total session is often under 90 seconds.
- **Owner device**: never sees the storefront in admin context except via preview. Owner is not the target user of this brief.
- **Performance budget**: mobile LCP ≤ 2.5s on a 4G connection. Hero image is the single biggest cost; design must accommodate optional/missing covers gracefully.
- **Accessibility**: WCAG AA contrast in both variants. Touch targets ≥ 44×44 px. No motion-required interactions.

---

## 3. User Journey

```
[QR scanned]
   ↓
Header glance     — Is this the right shop? (logo, name, "Open / Closed" pill)
   ↓
Banner (optional) — Is there a deal / announcement?
   ↓
Quick actions     — Call / WhatsApp / Directions / Share
   ↓
Browse            — Featured carousel → Collections chips → Category tabs → Item grid
   ↓
(Optional) Search — Find one specific item
   ↓
Item card         — Add to cart (with quantity stepper)
   ↓
Cart drawer       — Review items + add an order note
   ↓
WhatsApp handoff  — Pre-filled message opens in WhatsApp
```

The cart never leaves the device — there's no server-side order persistence. The WhatsApp handoff is the conversion event.

---

## 4. Data Contract

Stitch may compose with **only** these fields. Do not invent content (no ratings, no reviews, no delivery times, no stock counts).

| Source | Field | Notes |
|---|---|---|
| `Shop` | `name`, `description`, `phone`, `whatsappNumber`, `address`, `city`, `state`, `mapsUrl`, `isOpen`, `status` | `status` of `SUSPENDED` shows a dedicated suspended screen (not in this brief). |
| `ShopBranding` | `logoUrl`, `coverUrl`, `primaryColor` | `primaryColor` is the shop's accent hex; see §9. |
| `ShopBanner` | `text`, `isActive`, `expiresAt` | Banner shows only if `isActive` and not expired. |
| `ShopHours` | `dayOfWeek`, `openTime`, `closeTime`, `isClosed` | Only rendered if `businessHoursEnabled`. |
| `Category` | `name`, `slug`, `description`, `displayOrder`, `isActive` | Sticky tab filter. |
| `Collection` | `name`, `slug`, `type` (SEASONAL/OCCASION/FEATURED/CUSTOM), `coverUrl` | Renders as chips above the grid. |
| `Item` | `name`, `price`, `oldPrice`, `description`, `imageUrl`, `isAvailable`, `isFeatured`, `isBestseller`, `dietaryType` (VEG/NON_VEG/EGG/NA) | `oldPrice` shown struck-through next to `price` when present. `dietaryType` shows the green/red veg mark on food shops. |
| `Plan.watermarkEnabled` | boolean | When true, footer shows "Made with DigiDukan" watermark. |

---

## 5. Screen Inventory & States

Deliver designs for **each screen × each variant × {mobile 390px, desktop 1280px}**:

1. **Home — default** (cover, header, actions, featured, categories, item grid).
2. **Home — with banner active**.
3. **Home — shop closed** (header pill reads "Closed", actions still visible).
4. **Home — with watermark footer** (Free-plan shops).
5. **Home — empty catalogue** (shop published but no items — graceful empty state).
6. **Category filter active** (sticky tab pinned at top, grid filtered).
7. **Search results — matches** (search drawer/inline, list view).
8. **Search results — no matches** (helpful empty state).
9. **Cart drawer — empty** (placeholder + "Browse the menu" CTA).
10. **Cart drawer — with items** (qty steppers, order-notes textarea, WhatsApp CTA).

That's 10 screens × 2 variants × 2 widths = **40 frames** in the Figma deliverable.

---

## 6. Variant A — Standard (Kirana)

Anchor on the existing Tailwind v4 `@theme` block in `app/globals.css`. The tokens are already in production — Stitch must **refine** the rhythm and typographic detail, not introduce new colors.

**Palette (tokens already exist):**
- Paper backgrounds: `#fbf7ec` (paper), `#fffcf5` (paper-soft), `#f4edd9` (paper-deep), `#ebe1c7` (paper-edge).
- Ink (text): `#1f1812`, `#4a3f35`, `#8a7a66`.
- Ink lines (borders): `rgba(31, 24, 18, 0.12)` thin / `0.22` strong.
- Heritage accents: saffron `#d9622e` (default `primaryColor`), mango `#f2a93b`, leaf `#4a7c59`, brick `#a8331c`, egg `#d9941e`.

**Typography:**
- Display: serif (currently mapped to `--font-display`). Use for shop name, section headers, item names.
- Sans: secondary copy, labels, captions.
- Numerals tabular (`.tabular` utility) for prices.

**Texture & motifs (already shipped — keep using):**
- `.bg-grain` — subtle SVG noise overlay on paper backgrounds.
- `.rule-line` — hand-drawn divider SVG between sections.
- `.stamp` — rotated uppercase badge for "BESTSELLER" / "NEW".
- `.press-soft` — micro press-down on tap.

**Voice:** warm bazaar, slightly imperfect, hand-set. Section labels feel like a chalkboard menu, not a tech product.

**What Stitch should refine, not replace:**
- Tighten vertical rhythm (current spacing feels uneven).
- Propose a more confident hierarchy for the featured carousel.
- Refine item-card density on desktop so the grid doesn't feel sparse at 1280px.
- Improve the cart drawer's visual weight (currently feels lightweight given it's the conversion surface).

---

## 7. Variant B — Premium (Heritage / Colonial) **[FULLY DRAFTED]**

> Target feeling: a customer scans the QR at a Taj-hotel cafe, sits down, and the menu they see on their phone feels like the printed leather-bound menu on the table. Stately, generous, unhurried.

### 7.1 Palette

| Token | Hex | Role |
|---|---|---|
| `--color-heritage-cream` | `#f6efe1` | Default page background. |
| `--color-heritage-ivory` | `#fffaf0` | Card/surface background, contrasts with cream. |
| `--color-heritage-emerald` | `#0e4a3a` | Primary chrome (header, drawer header, dividers). |
| `--color-heritage-emerald-soft` | `#1d6650` | Hover / secondary emerald. |
| `--color-heritage-maroon` | `#6e1b1b` | CTA buttons, price highlights, "veg" no — see §9 for shop `primaryColor` interplay. |
| `--color-heritage-brass` | `#b08a3e` | Ornamental rules, frame borders, badge metal. |
| `--color-heritage-ink` | `#241910` | Body text (slightly warmer than pure black). |
| `--color-heritage-ink-soft` | `#5a4a3a` | Secondary text. |

The cream/emerald/maroon/brass set is the **chrome**. Each shop's `primaryColor` (e.g. a cafe brand teal) overlays the chrome on functional accents — see §9. Stitch must NOT replace `primaryColor` with maroon; it must blend.

### 7.2 Typography

- **Display serif**: Cormorant Garamond (Google Fonts), weight 500 for shop name & item names, 600 for section titles, 700 only sparingly. Italic small-caps for section labels ("Featured Today", "Our Specialties").
- **Body sans**: Inter, weight 400 body / 500 emphasis. Tight letter-spacing `-0.005em`.
- **Numerals**: tabular, Cormorant Italic for the ₹ symbol, regular for digits.

### 7.3 Motifs & textures

- **Paisley corners** on featured cards and the cart drawer header — subtle, brass-coloured, ~12px tall, decorative only.
- **Damask micro-texture** as a 6% opacity SVG repeat on cream backgrounds (do not exceed 6% — it should read as "fine paper", not wallpaper).
- **Brass rule dividers** (`.paisley-divider` utility, to be built): a thin brass line interrupted by a small paisley diamond in the centre. Replaces `.rule-line`.
- **Cartouche frames** (`.cartouche-frame` utility): a thin double-line emerald border with brass corner caps. Used around featured items and the WhatsApp CTA in the cart.
- **No grain noise** — premium reads cleaner.

### 7.4 Motion

- Transitions: 280–400ms ease-out for all fades, opens, and reveals (slower than the kirana variant's snappy taps).
- Banner: very slow parallax on scroll (max 8px translation).
- Cart drawer: emerald-tinted scrim fade-in 320ms; drawer itself slides 380ms.
- No bounce, no spring — heritage is composed, not playful.

### 7.5 Voice

- Section labels in small-caps italic: "specialities", "today's selection", "our recommendations".
- Item descriptions allowed up to 2 lines (currently 1) — heritage UI breathes.
- Empty states use full sentences with a period ("There are no items in this collection yet.") not the kirana variant's casual fragments ("Nothing here.").

### 7.6 Hard rules

- Cream/ivory/emerald/maroon/brass is the **frame**. `primaryColor` is the **accent** (see §9).
- Mobile-first layout must remain. Heritage chrome adds visual weight, NOT scroll length.
- Generous whitespace beats density. If two items fit on screen instead of three, that's acceptable in premium.
- Every premium component must have a `*Premium` filename suffix (`ItemCardPremium`, `CartDrawerPremium`, etc.). One-to-one correspondence with the default variant so engineers can swap them in `app/s/[slug]/page.tsx`.

---

## 8. Component-by-Component Asks

For each component below, Stitch must produce: anatomy, states (default / hover / active / disabled / empty), and a **default → premium delta** note. Component #8 (`ItemCard`) is fully drafted as an exemplar; the rest are bullet-form.

### 8.1 StorefrontHeader
Default: cover image (16:9 mobile / 21:9 desktop), logo plate overlapping the cover, shop name in display serif, optional `description` line, "Open / Closed" pill, hand-drawn rule line.
Premium delta: emerald header bar above cover (no overlapping logo plate; logo sits inside an ivory cartouche to the left), serif shop name slightly larger, "Open / Closed" pill becomes a small brass-bordered badge.

### 8.2 StorefrontBanner
Default: warm mango background, ink text, slight tilt feel.
Premium delta: cream bar with a thin maroon top rule, italic small-caps text, no tilt.

### 8.3 StorefrontActions (Call / WhatsApp / Directions / Share)
Default: 4 paper tiles with icon + label, soft shadow, grid layout.
Premium delta: 4 ivory cartouche-framed tiles with brass icon strokes, no shadow (uses the cartouche frame for definition), label in small-caps.

### 8.4 CollectionChips
Default: horizontally-scrolling chips, active chip filled in `primaryColor`.
Premium delta: chips become small brass-bordered pills, active fill in `primaryColor` with emerald text-on-dark.

### 8.5 Sticky CategoryTabs
Default: underlined tab strip, active underline in `primaryColor`.
Premium delta: serif tab labels in small-caps, active underline becomes a brass rule with paisley diamond centered.

### 8.6 FeaturedSection
Default: 175px-wide card carousel, item image + name + price.
Premium delta: cartouche-framed cards, larger (200px), with the section label "Today's Specialities" in italic small-caps above a paisley divider.

### 8.7 ItemGrid
Default: 2-col mobile grid of `ItemCard`s, sparse on desktop.
Premium delta: 2-col mobile / 3-col desktop with **less density** — wider gutters, cards taller, name and description allowed more breathing room.

### 8.8 ItemCard **[FULLY DRAFTED]**

**Default variant — Standard (Kirana)**

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │     [item image]      │  │ ← 16:9 image area, paper fallback when missing
│  │                       │  │
│  │  🟢  ⭐ BESTSELLER     │  │ ← top-left: dietary mark (12×12)
│  └───────────────────────┘  │   top-right: optional stamp badge (rotated -3°)
│                              │
│  Paneer Tikka                │ ← display serif, 16px, ink-1
│  Marinated cottage cheese... │ ← sans, 13px, ink-2, single line, ellipsis
│                              │
│  ₹ 220   ₹ 280               │ ← tabular nums; price ink-1 16px;
│                              │   oldPrice ink-3 13px line-through
│                              │
│        [   + ADD   ]         │ ← saffron/primaryColor button, 36px tall
└─────────────────────────────┘
```

States: default / unavailable (image desaturated 30%, "Sold out" stamp overlay) / featured-on (the stamp shows "FEATURED") / bestseller-on (the stamp shows "BESTSELLER" — featured and bestseller can both apply; bestseller wins).

**Premium variant — Heritage**

```
╔═════════════════════════════╗  ← cartouche frame: emerald double-line +
║                             ║    brass corner caps
║   ┌───────────────────┐     ║
║   │                   │     ║  ← image area, 4:3 ratio (taller than default)
║   │   [item image]    │     ║    ivory background fallback
║   │                   │     ║
║   └───────────────────┘     ║
║                             ║
║   Paneer Tikka              ║  ← Cormorant Garamond 500, 18px, ink
║   ────────                  ║  ← brass hairline divider (24px wide)
║   Marinated cottage cheese  ║  ← Inter 400, 13px, ink-soft
║   from a tandoor — up to    ║    UP TO 2 LINES (default is 1)
║                             ║
║   ₹ 220        ₹ 280        ║  ← Cormorant italic ₹; numbers tabular
║                             ║    oldPrice ink-soft 13px strike
║                             ║
║   ┌─────────────────────┐   ║
║   │   ADD TO ORDER ›    │   ║  ← maroon button, ivory text, small-caps,
║   └─────────────────────┘   ║    NO icon (replaced by a chevron)
║                             ║    Hover: button fills with shop primaryColor
╚═════════════════════════════╝
```

States: same set as default, but "Sold out" becomes a brass-bordered banner across the lower third of the image area reading "Currently Unavailable" in italic small-caps. The cartouche frame's brass corner caps lighten by 20% on disabled cards.

**Rules common to both variants:**
- The CTA button must accept `style={{ backgroundColor: shopPrimaryColor }}` — Stitch should design with the saffron default but verify the design holds for `#0e4a3a`, `#9F7AEA`, `#2D3748`, and `#3B82F6` (the seed data uses these).
- Dietary mark is mandatory when `dietaryType !== "NA"`. Use the green/red square-with-dot convention (FSSAI standard).
- `oldPrice` is shown only when present; never inferred.
- Image fallback: cream/ivory placeholder with the item's first letter in display serif at 48px, centered.

### 8.9 CartDrawer
Default: bottom sheet, paper background, qty steppers per row, "Add note for shopkeeper" textarea, leaf-green WhatsApp CTA.
Premium delta: emerald drawer header with paisley corner motifs, ivory body, maroon WhatsApp CTA in a cartouche frame, italic small-caps "Your Order" title.

### 8.10 CartFloatingButton
Default: rounded pill bottom-right, ink background, item count badge.
Premium delta: brass-rimmed ivory pill with emerald text + count badge.

### 8.11 StorefrontFooter
Default: paper background, optional watermark "Made with DigiDukan", rule line above.
Premium delta: cream background, watermark in italic small-caps, paisley divider above instead of rule line, address block centered.

---

## 9. Per-Shop `primaryColor` Rule **(critical — read carefully)**

Every shop sets `ShopBranding.primaryColor`. Saffron `#d9622e` is the default but each shop can override (and many do — e.g. `#9F7AEA` for a boutique). **Both variants must respect this colour for functional accents.**

| Surface | Standard variant | Premium variant |
|---|---|---|
| Primary CTA (`+ ADD`, "WhatsApp") | Background = `primaryColor` | Background = maroon by default; on hover/active = `primaryColor` |
| Active category tab underline | `primaryColor` | Brass rule for inactive; brass + paisley diamond filled with `primaryColor` for active |
| Active collection chip fill | `primaryColor` | `primaryColor` (chrome stays brass-bordered) |
| Price highlight | Ink (not primaryColor) | Maroon, with `primaryColor` for `oldPrice` strike-through |
| Featured stamp | Background = `primaryColor` at 12% alpha | Cartouche corners tinted `primaryColor` at 30% alpha |

**Stitch deliverable for this section:** a one-page swatch sheet showing each component rendered with four sample `primaryColor` values (`#d9622e`, `#0e4a3a`, `#9F7AEA`, `#3B82F6`) in both variants, so engineers can verify the design holds across the colour space.

---

## 10. Deliverables Stitch Must Return

1. **Figma file** with:
   - 40 frames per §5 (10 screens × 2 variants × 2 widths).
   - Component library with anatomy + states per §8.
   - The `primaryColor` swatch sheet per §9.
2. **Design tokens table** (CSV or Figma table) with: color name, hex, role, variant. Must align with the token names suggested in §7.1.
3. **Type scale table**: family, weight, size (px and rem), line-height, letter-spacing, use case.
4. **Spacing scale**: base unit (suggest 4px), used multiples.
5. **Radius scale**: at minimum sm/md/lg/full + the cartouche frame's specific values.
6. **Shadow scale**: standard variant has 2 shadows max; premium variant should use the cartouche frame instead of shadows wherever possible — list any exceptions.
7. **Motion spec**: duration + easing per interaction type (tap, fade, drawer-open, parallax).
8. **Asset pack**: paisley SVGs, damask repeat tile, brass-rule SVG, all licensed for commercial use.

---

## 11. Constraints

- **Mobile-first.** All design decisions originate at 390px; desktop is an enhancement.
- **No new content.** Use only the fields in §4. If a layout requires a field that doesn't exist, redesign — don't add the field.
- **No icons not in `lucide-react`.** The codebase ships with lucide-react; any premium-specific icon (e.g. paisley) must be an SVG asset, not a font icon.
- **Tailwind v4 compatibility.** All tokens must be expressible as CSS custom properties under `@theme` in `app/globals.css`. No theme JS objects.
- **`primaryColor` must remain a runtime variable.** Designs must not hard-code shop colours.
- **Bundle budget.** Premium variant's incremental cost should be ≤ 30KB compressed (one extra font + paisley/damask SVGs). Stitch should flag any asset that would breach this.
- **Out of scope.** Owner dashboard, admin panel, signup/login pages, onboarding, QR poster — none of these need premium variants. This brief is the customer-facing storefront only.

---

## Appendix A — File mapping for engineering

After Stitch returns designs, components will be implemented as:

```
components/storefront/             (existing — refined per §6)
  StorefrontHeader.tsx
  StorefrontBanner.tsx
  StorefrontActions.tsx
  StorefrontClient.tsx
  StorefrontFooter.tsx
  ItemCard.tsx
  ItemGrid.tsx
  CollectionChips.tsx
  FeaturedSection.tsx
  CartDrawer.tsx
  CartFloatingButton.tsx

components/storefront/premium/     (new — one-to-one per §7.6)
  HeaderPremium.tsx
  BannerPremium.tsx
  ActionsPremium.tsx
  StorefrontClientPremium.tsx
  FooterPremium.tsx
  ItemCardPremium.tsx
  CategoryTabsPremium.tsx          (currently nested in StorefrontClient)
  CollectionChipsPremium.tsx
  FeaturedSectionPremium.tsx
  CartDrawerPremium.tsx
  CartFloatingButtonPremium.tsx
```

The dispatch happens in `app/s/[slug]/page.tsx`:

```ts
const Header = shop.isPremium ? HeaderPremium : StorefrontHeader;
const Banner = shop.isPremium ? BannerPremium : StorefrontBanner;
const Client = shop.isPremium ? StorefrontClientPremium : StorefrontClient;
const Footer = shop.isPremium ? FooterPremium : StorefrontFooter;
```

---

*End of brief. Reach back with questions before committing to the full Figma deliverable — small clarifications now save large reworks later.*
