---
name: DigiDukan - Variant A (Standard Kirana)
colors:
  surface: '#fff8f5'
  surface-dim: '#e6d7cd'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e8'
  surface-container: '#faebe1'
  surface-container-high: '#f4e5db'
  surface-container-highest: '#efe0d6'
  on-surface: '#211a14'
  on-surface-variant: '#57423a'
  inverse-surface: '#372f28'
  inverse-on-surface: '#fdeee4'
  outline: '#8b7268'
  outline-variant: '#dfc0b5'
  surface-tint: '#a53c06'
  primary: '#a13a04'
  on-primary: '#ffffff'
  primary-container: '#c2521e'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb599'
  secondary: '#376847'
  on-secondary: '#ffffff'
  secondary-container: '#b6edc2'
  on-secondary-container: '#3b6d4b'
  tertiary: '#805200'
  on-tertiary: '#ffffff'
  tertiary-container: '#a16900'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb599'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7f2b00'
  secondary-fixed: '#b9efc5'
  secondary-fixed-dim: '#9dd3aa'
  on-secondary-fixed: '#00210e'
  on-secondary-fixed-variant: '#1e5031'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb956'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#fff8f5'
  on-background: '#211a14'
  surface-variant: '#efe0d6'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  item-name:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  price-display:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
  price-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is built on the concept of "Digital Parchment." It evokes the tactile, reliable warmth of a local Kirana shop—a place defined by personal connection, hand-written ledger books, and the vibrant sensory experience of an Indian bazaar. 

The aesthetic is **Tactile and Artisanal**, leaning heavily into paper-and-ink textures. It rejects the clinical perfection of modern SaaS in favor of "warm imperfection." Key visual drivers include:
- **Paper-centricity:** Layers are defined by subtle color shifts in paper stocks rather than digital shadows.
- **Ink-on-Surface:** Strokes emulate felt-tip pens or fountain ink, featuring slightly irregular weights.
- **Stamp & Press:** Brand highlights and badges behave like rubber stamps—rotated, high-contrast, and textured.
- **Sensory Presence:** The use of grain noise and hand-drawn dividers makes the interface feel physical, approachable, and trustworthy for small business owners and their patrons.

## Colors

The palette is derived from natural pigments and paper aging. 

- **The Canvas:** Use `background_paper` as the primary application surface. Use `soft` for card backgrounds and `deep` for recessed areas like footers or input wells.
- **The Ink:** All text and borders use the Ink series. Avoid pure black; `#1f1812` provides the necessary depth while remaining warm.
- **The Accents:** 
  - **Saffron:** Primary actions, brand moments, and primary buttons.
  - **Mango & Egg:** Warm highlights, warnings, or category tags.
  - **Leaf:** Success states and "In Stock" indicators.
  - **Brick:** Errors, deletions, and urgent price drops.

## Typography

Typography balances the literary charm of a serif with the functional clarity of a modern sans.

1.  **Literata (Serif):** Used for headlines, store names, and product titles. Its slightly irregular, warm rhythm mimics printed type.
2.  **Plus Jakarta Sans (Sans):** Used for all secondary copy, descriptions, and UI controls to ensure high legibility at small sizes.
3.  **JetBrains Mono (Tabular Numerals):** Strictly for prices, quantities, and weights. The monospaced nature ensures that decimal points align in lists and receipts, evoking a printed ledger or calculator tape.

**Note:** For "Bestseller" or "Discount" stamps, use **Plus Jakarta Sans Bold** set in all-caps with a 3-degree rotation.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a "loose" aesthetic. 

- **Grid:** On desktop, use a 12-column grid. On mobile, a 2-column grid for product cards.
- **Rhythm:** Use an 8px base unit for structural spacing (margins/padding), but allow for 4px increments for fine-tuned alignment in labels.
- **Human Touch:** Avoid perfect symmetry where possible. Layouts should feel organized but not rigid. Use `xl` spacing (40px+) between major sections to allow the paper background to "breathe."
- **Dividers:** Do not use CSS `border-bottom`. Use hand-drawn SVG lines with slight wobbles to separate sections.

## Elevation & Depth

This system eschews standard box-shadows. Depth is achieved through **Tonal Layering** and **Line Weight**:

- **Level 0 (Base):** `background_paper`. 
- **Level 1 (Cards):** `background_paper_soft`. These should have a thin border (`rgba(31, 18, 12, 0.12)`).
- **Level 2 (Modals/Popovers):** `background_paper_soft` with a slightly thicker ink border (`0.22` opacity) and a very soft, tinted ambient shadow (e.g., `8px 8px 0px rgba(31, 18, 12, 0.05)` to mimic paper thickness).
- **Backdrop:** Use a grain noise SVG overlay (opacity 0.03) across the entire UI to give the "ink" something to bite into.

## Shapes

Shapes are **Soft** but intentionally imperfect. 

- **Standard Elements:** Buttons and cards use a 4px (`0.25rem`) radius.
- **Container Corners:** For larger paper blocks, use slightly mismatched corner radii (e.g., top-left 4px, bottom-right 8px) via custom paths to simulate hand-cut paper.
- **Stamps:** Badges are rectangular but must be rotated between -2 and +2 degrees.
- **Inputs:** Square corners with a weighted bottom border to look like a ledger entry line.

## Components

### Buttons
- **Primary:** Background `primary_color_hex` (Saffron), text `background_paper_soft`. No roundedness—clean, sharp edges.
- **Secondary:** Transparent background, `ink_text_main` border (1px), slight "wobble" in the border stroke via SVG mask if possible.

### Cards (Product)
- Use `background_paper_soft`. Product titles in `item-name` (Literata). Prices in `price-display` (JetBrains Mono) at the bottom right.
- Images should have a 1px `paper_edge` border to separate them from the card background.

### Input Fields
- Transparent background with a 1px solid `ink_text_muted` bottom border only. 
- Labels sit above the line in `label-caps`. 
- Focus state: The bottom border thickens to 2px and changes to `primary_color_hex`.

### Stamps (Badges)
- High-contrast background (Brick or Saffron). 
- Text in `label-caps` (White/Paper).
- CSS Transform: `rotate(-3deg)`. Apply a "rough-edge" mask to the container.

### Lists
- Use hand-drawn horizontal dividers.
- Chevron icons should look like hand-drawn arrows (`->` style).

### Checkboxes
- Custom hand-drawn "X" mark instead of a standard tick. 
- The box itself should have a slightly irregular border weight.