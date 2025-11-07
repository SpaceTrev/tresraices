---
mode: agent
---

# Copilot Prompt — Add Cart + WhatsApp Checkout + Category Badges/Sections (FULL SPEC)

**Goal:** Evolve `/menu/[region]` into a cart-enabled catalogue. Users can add items to a client-side cart and “checkout” via WhatsApp, which opens a prefilled message containing order details and contact info. Add visual category markers (badge/logo) and optional **sectioned** rendering by category.

**Constraints**

- Next.js 15 App Router, TypeScript, Tailwind.
- **No new dependencies.** Use React Context + `useReducer` for cart; persist in `localStorage`.
- Keep current data source (`/data/menu_{guadalajara|colima}_list2.json`) and existing filter/sort/search.
- Maintain Spanish UI text and current palette/components.
- Preserve existing FilterPanel/Search/Sort URL params (`q`, `cat`, `sort`). Add `view` param for sectioned view.

---

## Deliverables (create/modify these files with full content)

### 1) Cart state & utilities

**`lib/cart/types.ts`**

```ts
export type CartItem = {
  id: string; // stable key: slug(category)+":"+slug(name)
  name: string;
  category: string;
  unitPrice: number; // MXN, already region-adjusted
  quantity: number; // integer >= 1
};
export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: "ADD"; payload: Omit<CartItem, "quantity"> } // if exists -> +1, else quantity=1
  | { type: "INC"; payload: { id: string } }
  | { type: "DEC"; payload: { id: string } } // if qty would drop to 0 -> remove
  | { type: "SETQTY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };
```

**`lib/cart/store.tsx`**

- Exports `CartProvider`, `useCart()`, and a reducer with the `CartAction` union.
- Hydrate from `localStorage` key `"tr-cart-v1"` on mount; save on every change (debounce ~150ms).
- Derive selectors:
  - `itemsCount` (sum of quantities)
  - `subtotal` (sum of `unitPrice * quantity`)
- Export helpers:
  - `useCartTotals()` returns `{ itemsCount, subtotal }`
  - `useCartActions()` returns `add, inc, dec, setQty, remove, clear`

**`lib/cart/whatsapp.ts`**

- Export `buildWhatsAppUrl({ region, items, subtotal })`:

  - Build a message:

    ```
    Hola, quiero realizar un pedido (Guadalajara).
    Artículos:
    • {item} x{qty} — ${lineTotal}

    Subtotal: ${subtotal}
    ——
    Nombre:
    Teléfono:
    Dirección:
    Notas:
    ```

  - URL-encode and return `https://wa.me/523315126548?text=${encoded}`

---

### 2) UI components

**`components/cart/CartButton.tsx`**

- Floating button (mobile) / header button (desktop) showing `{itemsCount}` and `subtotal` in MXN.
- Clicking opens `CartDrawer`. Basic Tailwind, no extra libraries.

**`components/cart/CartDrawer.tsx`**

- Right-side panel (`fixed inset-y-0 right-0 w-full sm:w-[380px]`) with backdrop.
- Lists items with:
  - Title (name), small category badge
  - Quantity stepper (+/–), line total
  - Remove item
- Footer shows subtotal and two CTAs:
  - `Continuar por WhatsApp` → `buildWhatsAppUrl()`
  - `Vaciar carrito` → clears state (confirm first)
- A11y: `role="dialog"`, `aria-modal="true"`, focus first actionable element, ESC closes.

**`components/menu/ProductCard.tsx`** (extend existing)

- Add “Agregar” button (primary). If item already in cart, show in-card controls:
  - `-` and `+` buttons to adjust quantity
  - Mini display “En carrito: {qty}”
- Keep current WhatsApp single-item CTA as a **secondary** small link (optional).
- Always show a category badge (see below).

**`components/menu/CategoryBadge.tsx`**

- Export a map and renderer for small rounded badges:

```ts
const MAP = {
  Res: { label: "Res", icon: "🥩", class: "bg-rose-100 text-rose-800" },
  Cerdo: { label: "Cerdo", icon: "🐖", class: "bg-pink-100 text-pink-800" },
  Pollo: { label: "Pollo", icon: "🐔", class: "bg-yellow-100 text-yellow-800" },
  Pavo: { label: "Pavo", icon: "🦃", class: "bg-amber-100 text-amber-800" },
  Cordero: { label: "Cordero", icon: "🐑", class: "bg-lime-100 text-lime-800" },
  Conejo: {
    label: "Conejo",
    icon: "🐇",
    class: "bg-emerald-100 text-emerald-800",
  },
  Jabalí: { label: "Jabalí", icon: "🐗", class: "bg-stone-100 text-stone-800" },
  Avestruz: { label: "Avestruz", icon: "🪶", class: "bg-sky-100 text-sky-800" },
  Queso: { label: "Queso", icon: "🧀", class: "bg-yellow-100 text-yellow-900" },
  // Add the remaining categories we use
} as const;
```

- `CategoryBadge` returns `<span className={"chip " + MAP[cat]?.class}> {MAP[cat]?.icon} {MAP[cat]?.label} </span>` with a safe fallback.

**`components/menu/SectionedList.tsx`**

- Accepts the **already filtered** product list.
- Groups by `category` and renders:
  - `<h2>` header with `CategoryBadge` and count
  - Grid of `ProductCard` below (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

**`components/menu/SectionToggle.tsx`**

- Two chip buttons: “Secciones” / “Lista”
- Sets URL param `view=sections|grid` and preserves other params.

**`components/menu/MenuLayout.tsx`**

- Two-column layout: sticky filter sidebar on desktop, collapsible on mobile.
- Right content holds results summary, `SectionToggle`, and product grid/sections.

---

### 3) Page wiring

**`app/menu/[region]/page.tsx`**

- Wrap the page in `<CartProvider>` (likely inside page component so cart is per-region view).
- Place `CartButton` at the layout root so it’s visible across scrolling.
- Render `SectionToggle` near results summary.
- Logic:
  - Flatten grouped JSON into an array `{ id, name, category, unitPrice: price, base_price }`.
  - Build category set for filters.
  - Apply filters/search/sort from URL.
  - If `view=sections` OR multiple categories selected, render `SectionedList`; else render the uniform grid.
  - Pass `region` to WhatsApp builder.

---

### 4) Utilities

**`lib/menu/flatten.ts`**

- Convert grouped JSON `{ [category: string]: Item[] }` into array of `{ id, name, category, unitPrice, base_price }` using `slugify` for `id`.

**`lib/menu/filters.ts`**

- Export `applyFilters(list, { q, cats, sort })`:
  - `q`: substring match (case-insensitive) on `name`
  - `cats`: include-only (if non-empty)
  - `sort`: `"relevance" | "priceAsc" | "priceDesc" | "az" | "za"`

**`lib/menu/format.ts`**

- `formatCurrency(mxn: number) => string` via `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`
- `slugify(str: string) => string` (lowercase, replace whitespace with `-`, strip accents)

---

### 5) Minor styles

**`styles/globals.css`**

- Add utilities if not present:
  - `.chip { @apply inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium }`
  - Ensure `.tabular-nums` applied to price elements.
- Drawer styles: basic backdrop (`fixed inset-0 bg-black/40`), panel transitions, focus outline.

---

## Behavior & UX Rules

- **Add to cart**: “Agregar” adds an item (`quantity=1`) or increments existing.
- **Quantity**: In-card stepper updates quantity; if it reaches 0, remove item.
- **Persistence**: Hydrate state from `localStorage` on mount; save on state change (debounce 150ms).
- **Cart button**: Shows `{itemsCount}` and `subtotal`; opens drawer.
- **WhatsApp checkout**: Drawer CTA builds encoded message and opens in a new tab.
- **Category badges**: Always visible on `ProductCard`. In sectioned view, show next to category header.
- **Sectioned rendering**: If multiple categories selected OR `view=sections`, render grouped sections.
- **URL sync**: Maintain `q`, `cat`, `sort`; add `view`. Use `useSearchParams` + `useRouter` to read/write query.
- **Accessibility**: Drawer is dismissible via ESC and backdrop click; focus trap basic without external lib.

---

## Example WhatsApp Message

```
Hola, quiero realizar un pedido (Guadalajara).
Artículos:
• Picaña x2 — $1,198.00
• Chorizo Argentino x1 — $189.00

Subtotal: $1,387.00
——
Nombre:
Teléfono:
Dirección:
Notas:
```

---

## Acceptance Criteria

1. Add/increment/decrement/remove works; cart persists across reloads.
2. Floating `CartButton` shows count + subtotal; opens `CartDrawer`.
3. “Continuar por WhatsApp” opens an encoded message with full order summary and region.
4. Category badges visible on every `ProductCard`; section headers show badges in sectioned view.
5. Sectioned view groups by category; default grid view still available.
6. Filters/search/sort continue to work and URL-sync; cart integration does not break them.
7. No new dependencies; TypeScript and `pnpm build` pass.

---

## Stretch Goals (scaffold only, no extra deps)

- Optional SVG icons for categories (`public/categories/*.svg`); wire `CategoryBadge` to prefer SVG when found.
- Unit badges (kilo/pieza) as a placeholder chip for a future `units` override map.

---

**Implement all of the above.** Keep code self-contained, typed, and aligned with the existing folder structure and styling.
