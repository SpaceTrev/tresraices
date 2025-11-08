---
mode: agent
---

# Copilot Prompt — Add Per-Unit Pricing (kilo vs pieza), Correct Markups, and Safeguards

**Goal:** Fix pricing accuracy by distinguishing **per kilo** vs **per pieza** across parsing, data, UI, and WhatsApp checkout. If an item is not sold in a certain unit, that unit should not appear. Add guardrails to prevent absurd prices (e.g., manteca at >$1,000). Ensure regional markups (+15% GDL, +20% Colima) are applied on the **correct base price**.

---

## Constraints & Context

- Next.js 15 (App Router), TS, Tailwind. No new deps.
- Existing data source: `data/menu_{guadalajara|colima}_list2.json` derived from distributor **LISTA 2** (our wholesale).
- Current state has a single `price` per item. We need **structured unit prices**.
- Regional multipliers remain: Guadalajara = 1.15, Colima = 1.20 (applied to **our** base price).

---

## Deliverables (write full files / rewrites where noted)

### 1) **Data Model (Types)** — `lib/menu/types.ts`

Add strong types for units and item:

```ts
export type UnitType = "kg" | "pieza";

export type UnitPrice = {
  unit: UnitType;
  basePrice: number; // our wholesale price for that unit
  regionPrice: {
    // computed at build for display
    guadalajara?: number; // if undefined => not sold in that region for that unit
    colima?: number;
  };
};

export type MenuItem = {
  id: string; // slug(category)+":"+slug(name)
  name: string;
  category: string;
  units: UnitPrice[]; // one or two entries: kg and/or pieza
  notes?: string;
};
```

### 2) **Override Map** — `data/overrides.units.json`

Create a JSON file to define per-item unit configuration when PDF parsing doesn’t make it explicit or when business rules require it:

```json
{
  "Cerdo::Manteca": { "units": ["kg"] },
  "Pollo::Pechuga brasileña": { "units": ["kg"] },
  "Res::Arrachera marinada": { "units": ["kg", "pieza"] },
  "Queso::Oaxaca": { "units": ["kg"] }
}
```

- Keys are `"Category::Item Name"` (case-insensitive match after trim).
- Values: `units` = allowed unit types. (Optional future: `basePriceOverrides`.)

### 3) **Parser Update** — `scripts/parse-pdf-local.mjs` and `app/api/parse-menu/route.ts`

- After extracting `{ category, name, base_price }`, **assign units** by:
  1. Checking `overrides.units.json` for the key.
  2. If not present, infer with heuristics (simple and conservative):
     - If name contains patterns like `pieza`, `entero`, `media`, `½`, set `["pieza"]`.
     - Else default to `["kg"]`.
- Build `MenuItem.units` with `basePrice` duplicated per unit if needed.
- **Compute regional prices** per unit with precise rounding:
  ```ts
  const roundMXN = (v: number) => Math.round(v * 100) / 100;
  GDL = roundMXN(basePrice * 1.15);
  COL = roundMXN(basePrice * 1.2);
  ```
- Write final JSONs as arrays of `MenuItem` at:
  - `data/menu_guadalajara_list2.json`
  - `data/menu_colima_list2.json`
    (These can remain region-specific for backward compatibility, but each item now contains both units with `regionPrice` per region.)

### 4) **Guardrails** — `lib/menu/validate.ts`

Add a validator used in both the parser and at page build:

```ts
export function validateItem(item: MenuItem) {
  // prevent absurd or negative values
  const MAX_REASONABLE = 2000; // MXN per kg/pieza cap (adjustable)
  const MIN_REASONABLE = 10; // MXN floor

  item.units.forEach((u) => {
    ["guadalajara", "colima"].forEach((r) => {
      const v = (u.regionPrice as any)[r];
      if (v !== undefined) {
        if (v < MIN_REASONABLE || v > MAX_REASONABLE) {
          (u.regionPrice as any)[r] = undefined; // hide/display as unavailable
          item.notes =
            (item.notes || "") + ` [auto-hidden ${u.unit} ${r}=${v}]`;
        }
      }
    });
  });
  return item;
}
```

- Any hidden price should display as “—” in UI (unit not sold).

### 5) **UI Changes** — `components/menu/ProductCard.tsx`

- Show **unit chips** for each available unit with its price for the **current region**:
  - Example: `[$189/kg]  [$49/pieza]` styled as chips; only render chips for units with a defined price.
- If only one unit exists, show just that chip.
- If **none** exists (shouldn’t happen), show “Consultar precio” and a WhatsApp link.
- Add a tiny muted line with `Precio base` (our base, per unit) to help internal QA (can hide via CSS if needed).

### 6) **Filter Panel** — `components/menu/FilterPanel.tsx`

- Add a **Unit filter** with checkboxes: `Kilo` and `Pieza`. Defaults: both checked.
- When filtering, an item matches if it has **at least one** unit present in selected units for the current region.

### 7) **Formatting & Helpers** — `lib/menu/format.ts`

- Add `formatPriceMXN(n: number) => "$1,234.00"`.
- Add `prettyUnit(u: UnitType) => "kg"|"pieza"`.
- Ensure `slugify` keeps IDs stable.

### 8) **Cards with Cart (if cart enabled)** — `components/menu/ProductCard.tsx`

- If cart is present, quantity steppers should be **per selected unit** (ID becomes `id + "|" + unit`).
- WhatsApp single-item CTA should include unit:  
  `Hola, quiero {name} ({unit}) — {region}`.

### 9) **WhatsApp Cart Builder** — `lib/cart/whatsapp.ts`

- Include unit per line:
  `• {name} ({unit}) x{qty} — {lineTotal}`

### 10) **Empty/Missing Unit UX**

- If a product has `kg` but not `pieza` for region, render the `pieza` chip as **disabled** or don’t show it; prefer **not showing**.
- Tooltip or title attr: “No disponible por {unit}”.

### 11) **README Update** — `README.md`

Add a section **“Units & Pricing”** explaining:

- Our prices come from **LISTA 2** (wholesale).
- Regional markup percentages applied to our base price.
- `overrides.units.json` is the source of truth for per-item unit availability.
- Guardrails hide suspicious prices; internal notes surface in build logs.

### 12) **Acceptance Criteria**

1. Each product shows correct prices per available unit (kg/pieza) for the selected region.
2. Items not sold by a unit do **not** show that unit.
3. Regional markups compute from **our** base price (LISTA 2).
4. Guardrails prevent outliers; no absurd values like manteca > $1,000.
5. Filter panel includes unit filtering and works with other filters.
6. WhatsApp single-item and cart messages include unit labels.
7. Build passes locally and on Netlify with no new dependencies.

### 13) **Quick Tests (seed in code comments)**

- Cerdo::Manteca — only `kg`, final GDL price < $500.
- Pollo::Pechuga brasileña — `kg` available; prices reflect markup.
- Any item with “pieza” in name — includes `pieza` unit unless overridden.

---

**Implement all of the above.** Keep code typed, minimal, and aligned with current folder structure. When editing files, output full file contents (not diffs), and document any new exports.
