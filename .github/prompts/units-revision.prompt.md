---
mode: agent
---

# Copilot Prompt — Correct Units (kg vs pieza), Rescrape PDF, and Verify Markups

**Objective**

1. Parse the distributor PDF so each product has **exactly one** unit: `"kg"` **or** `"pieza"` (never both).
2. Apply regional markups correctly: Guadalajara **+15%**, Colima **+20%** (from our wholesale base).
3. Update the UI to clearly display the single available unit; hide the other.
4. Add unit tests asserting the markup math across the dataset.

---

## Tech Context

- Next.js 15 (App Router), TypeScript, Tailwind, pnpm
- Server-side parsing uses our API route and a local script
- No new runtime deps; dev deps ok for tests (Vitest or Jest)

---

## Data Model (types)

**`lib/menu/types.ts`** — Replace/align types:

```ts
export type UnitType = "kg" | "pieza";

export interface MenuItem {
  id: string; // slug(category)+":"+slug(name)
  name: string;
  category: string;
  unit: UnitType; // exactly one
  basePrice: number; // wholesale LISTA 2
  price: {
    // computed with markup
    guadalajara?: number;
    colima?: number;
  };
  notes?: string; // parser hints or flags
}
```

---

## Parsing the PDF (single-unit assignment)

**Files**:

- `scripts/parse-pdf-local.mjs` (local CLI)
- `app/api/parse-menu/route.ts` (server API)

**Requirements**

- Re-parse LISTA 2 so that for each line item:
  - Detect the **active unit column** (`KILO` or `PIEZA`) in the current table section and assign `unit` accordingly.
  - Extract the **base wholesale price** from that column.
  - Compute `price.guadalajara = round2(base * 1.15)` and `price.colima = round2(base * 1.20)`.
- Use **robust column alignment**:
  - Locate a `KILO`/`PIEZA` header in that page/section.
  - For every subsequent non-empty product row, map the numeric token to its column by **character x-position windows** (if the PDF text extractor supplies x coordinates) or by **token count alignment** (fallback).
- Regex helpers:
  - Money: `/\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2}|[0-9]{1,4}(?:[.,][0-9]{2}))/`
  - Normalize “es-MX” decimals: replace `.` thousands, `,` decimal → float.
- Category scoping:
  - Category name is the last seen heading before rows (e.g., “Cerdo”, “Res”, “Pollo”, etc.).
- Output arrays (keep current filenames):
  - `data/menu_guadalajara_list2.json`
  - `data/menu_colima_list2.json`
  - Each file contains `MenuItem` with both region prices precomputed (the `unit` is **single**).

**Edge handling**

- If a row has a price only under KILO → `unit="kg"`.
- If only under PIEZA → `unit="pieza"`.
- If both present (rare), default to the column that has the numeric value on that line; if still ambiguous, log a warning and **skip** the other to enforce single unit.
- Guardrails: if computed region price `< 10` MXN or `> 2000` MXN, set that region price `undefined` and append diagnostic to `notes`.

**CLI**

```bash
pnpm parse:local ./input/LISTA2.pdf
# writes region JSONs and a parse log
```

---

## Markup application

**`lib/menu/pricing.ts`**

```ts
export const REGION_MULTIPLIER = {
  guadalajara: 1.15,
  colima: 1.2,
} as const;

export function computeRegionPrices(base: number) {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    guadalajara: round2(base * REGION_MULTIPLIER.guadalajara),
    colima: round2(base * REGION_MULTIPLIER.colima),
  };
}
```

Apply only to **base wholesale** (LISTA 2), not public prices.

---

## UI updates (show single unit only)

**`components/menu/ProductCard.tsx`**

- Replace any dual-unit chips with a single chip from `item.unit`.
  - Examples: `"$189/kg"` **or** `"$45/pieza"`.
- If a region price is `undefined` (guardrail), render `“—”` and show a small “Consultar” link to WhatsApp.

**`components/menu/FilterPanel.tsx`**

- Add Unit filter with **radio** (not multi-select): `Kilo` or `Pieza` or `Todos`.
- Filtering rule: item passes if `unit` equals selected radio or if `Todos`.

---

## Tests — verify markup math & units

Use **Vitest** (preferred) or Jest.

**1) Markup math**
**`__tests__/pricing.test.ts`**

```ts
import { computeRegionPrices } from "@/lib/menu/pricing";

describe("computeRegionPrices", () => {
  it("applies +15% (GDL) and +20% (Colima)", () => {
    const base = 100;
    const { guadalajara, colima } = computeRegionPrices(base);
    expect(guadalajara).toBe(115.0);
    expect(colima).toBe(120.0);
  });
});
```

**2) Dataset integrity (snapshot)**
**`__tests__/dataset-markup.test.ts`**

```ts
import path from "node:path";
import fs from "node:fs";
import { REGION_MULTIPLIER } from "@/lib/menu/pricing";

function toNum(n: unknown) {
  return typeof n === "number" ? n : Number(n);
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

const gdl = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/menu_guadalajara_list2.json"),
    "utf8"
  )
);
const col = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/menu_colima_list2.json"),
    "utf8"
  )
);

describe("dataset markup verification", () => {
  it("every GDL price is base * 1.15 (±0.01)", () => {
    for (const item of gdl) {
      const base = toNum(item.basePrice);
      const expected = round2(base * REGION_MULTIPLIER.guadalajara);
      if (item.price.guadalajara !== undefined) {
        expect(Math.abs(item.price.guadalajara - expected)).toBeLessThanOrEqual(
          0.01
        );
      }
    }
  });

  it("every Colima price is base * 1.20 (±0.01)", () => {
    for (const item of col) {
      const base = toNum(item.basePrice);
      const expected = round2(base * REGION_MULTIPLIER.colima);
      if (item.price.colima !== undefined) {
        expect(Math.abs(item.price.colima - expected)).toBeLessThanOrEqual(
          0.01
        );
      }
    }
  });

  it("every item has exactly one unit", () => {
    const all = [...gdl, ...col];
    for (const item of all) {
      expect(item.unit === "kg" || item.unit === "pieza").toBe(true);
    }
  });
});
```

**3) Parser spot checks**

- Seed a tiny fixture with rows that clearly sit under the **KILO** vs **PIEZA** column and assert `unit` chooses the correct one.

---

## Acceptance criteria

- Parsing yields **one** unit per item (`kg` or `pieza`), consistent with the PDF column where the price appears.
- Guadalajara = **base × 1.15**; Colima = **base × 1.20**; tests confirm within ±$0.01.
- UI shows only the available unit; the other never appears.
- Guardrails suppress absurd outliers and annotate `notes`.
- `pnpm test` passes locally and on CI; `pnpm build` passes.

---

## Notes for Copilot

- Prefer robust parsing if the PDF text extractor provides x/y positions; else, default to conservative heuristics using the `KILO` / `PIEZA` header in each section.
- When in doubt, do **not** assign both units; pick one or skip with a warning.
- Keep changes ESM/TypeScript; return **complete file contents** when replacing files; document new exports in comments.
