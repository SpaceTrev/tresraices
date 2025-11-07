---
mode: agent
---

# Copilot Prompt — Refactor Menu Pages (Porter Road–Style Layout)

**Goal:** Redesign `/menu/[region]` to a modern catalogue layout inspired by Porter Road’s collection page (filters sidebar + product grid + clear CTAs), but using our existing JSON data and WhatsApp ordering (no cart yet).

**Context:**

- Next.js 15, App Router, TypeScript, Tailwind.
- Data source is `data/menu_{guadalajara|colima}_list2.json` shaped as `{ [category: string]: Array<{ item: string; price: number; base_price: number }> }`.
- Keep SSR static (`export const dynamic = "force-static"`), no DB fetch required.
- CTA = “Ordenar por WhatsApp” deep-link with prefilled message including item name and region.
- Inspiration only; do not copy design/assets from porterroad.com. Structure reference: sidebar filters, H1 + blurb, grid of product cards with price and badges. (Source reviewed: https://porterroad.com/collections/combo-kits-gifts)

---

## Deliverables (write full files)

### 1) Create reusable UI components under `components/menu/`:

- `MenuLayout.tsx` — two-column responsive layout with a left filter panel (collapsible on mobile) and right content area.
- `FilterPanel.tsx` — shows filters:
  - Category (multi-select from the categories present in the JSON)
  - Search (client-side substring match on item name)
  - Sort selector: “Relevancia (default)”, “Precio ↑”, “Precio ↓”, “A–Z”, “Z–A”
  - (Future) Unit toggle placeholder (kilo/pieza) — disabled for now
  - A “Clear filters” link
  - Persist state to the URL (`?q=&cat=Res,Cerdo&sort=priceAsc`) using `useSearchParams` + `useRouter`
- `ProductCard.tsx` — card with:
  - Title (item name)
  - Price in MXN with tabular numerals, e.g. `$249.00`
  - Subtext: `Precio base: $XXX` (small, muted)
  - Optional badges: `Nuevo` (if item name includes patterns like “nuevo” / leave a hook), `Popular` (placeholder)
  - CTA button: “WhatsApp” → `https://wa.me/523315126548?text=Hola,%20quiero%20{item}%20({PrettyRegion})`
- `RegionToggle.tsx` — small control to switch between Guadalajara (+15%) and Colima (+20%), implemented as two links with active styling.
- `Breadcrumbs.tsx` — `Inicio / Menú / Guadalajara` (static links).

### 2) Restructure page at `app/menu/[region]/page.tsx`:

- H1: `Menú {PrettyRegion}`
- Short description paragraph under H1 (one sentence).
- Use `MenuLayout`:
  - Left: `FilterPanel`
  - Right: results summary (“{N} productos”) and a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), each item rendered via `ProductCard`.
- Data handling:
  - Flatten grouped JSON into an array: `{ name, category, price, base_price }`.
  - Compute unique category set.
  - Apply URL-driven filters (search by name, category includes).
  - Sorting by selected option.
- Empty state when no results: friendly message with “Limpiar filtros”.

### 3) Add utility helpers under `lib/menu/`:

- `flatten.ts` — flatten grouped JSON to list.
- `filters.ts` — apply search/category filters and sorting.
- `format.ts` — currency formatter (`Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`), slug helpers.

### 4) Add small visual polish:

- Sticky filter panel on desktop (`sticky top-20`), collapsible on mobile with a “Filtros” button that toggles a `Dialog`/`details` pattern (keep it simple with Tailwind classes, no external libs).
- Price uses `tabular-nums` and bold.
- Cards have `.card` class already defined; add hover ring and subtle elevation.

### 5) Accessibility & SEO:

- Page `<h1>` is unique; filter headings use `<h2>`/`<h3>`.
- Buttons/links have accessible names; WhatsApp links have `rel="noopener"` and `target="_blank"`.
- Keep content server-rendered and deterministic.

### 6) Do **not** add cart/checkout, subscriptions, or 3rd-party UI libraries. Keep dependencies unchanged.

---

## File changes (create/replace with complete content)

- `components/menu/MenuLayout.tsx`
- `components/menu/FilterPanel.tsx`
- `components/menu/ProductCard.tsx`
- `components/menu/RegionToggle.tsx`
- `components/menu/Breadcrumbs.tsx`
- `lib/menu/flatten.ts`
- `lib/menu/filters.ts`
- `lib/menu/format.ts`
- `app/menu/[region]/page.tsx` (rewrite to use new components)
- Update `styles/globals.css` if needed with a `.filter-chip` utility (`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-cream`)

---

## Acceptance Criteria

- Visiting `/menu/guadalajara` shows the new layout with:
  - Sidebar filters (categories from data), a search box, sort dropdown.
  - A grid of product cards with name, price, base price, and WhatsApp CTA.
  - Region toggle that links to `/menu/colima` and vice-versa.
- Filters update the product grid instantly on the client and sync to the URL.
- Hard refresh with a filtered URL preserves state.
- No new dependencies. TypeScript passes, Next build passes.

---

## Notes

- Keep copy in Spanish (our current tone).
- We’ll plug in unit labels later when we add the override map.
- Inspiration reference only; don’t reproduce Porter Road’s copy, imagery, or brand.
