# Prompt: Show Supplier Per Product

You are assisting with an existing carnicería web app that is already working in production.

Goal: For each product on the site, we want to clearly show WHICH supplier it comes from (e.g. "Proveedor: El Barranqueño").

## Current State Analysis

**Data Model** (`lib/menu/types.ts`):
```typescript
export type MenuItem = {
  id: string;
  name: string;
  category: string;
  unit: UnitType;
  basePrice: number;
  price: { guadalajara?: number; colima?: number; };
  notes?: string;
};
```
**Finding**: No `supplier` field exists currently.

**Data Source**: Products are parsed from wholesale PDF (`scripts/parse-pdf-local.mjs`) → stored in `/data/menu_{region}_list2.json` → displayed via `components/menu/ProductCard.tsx`.

**UI Location**: `ProductCard.tsx` shows category badge, name, price per unit, and cart controls. No supplier displayed.

## Implementation Tasks

### 1. Add Supplier Field to Type Definition
**File**: `lib/menu/types.ts`
- Add optional `supplier?: string` to `MenuItem` type
- Keep backward compatible (optional field)

### 2. Update PDF Parser
**Files**: 
- `scripts/parse-pdf-local.mjs` (local build-time parser)
- `app/api/parse-menu/route.ts` (API endpoint for admin uploads)

**Approach**: Add supplier dropdown to admin UI. When uploading PDF, user selects supplier from dropdown, and that supplier name is applied to all products in the upload.

- Local parser: Uses supplier mapping file (can be simplified to single default later)
- API parser: Receives supplier from request body and applies to all items

### 3. Create Supplier Mapping File
**File**: `data/supplier-mapping.json`
```json
{
  "Avestruz": { "default": "El Barranqueño" },
  "Búfalo": { "default": "El Barranqueño" },
  ...
}
```
- Used by local parser for build-time menu generation
- Can add more suppliers as they're added to dropdown

### 4. Integrate Supplier in Parsers
- Load supplier mapping in both parsers
- Lookup supplier by category + name during item creation
- Add `supplier` field to output JSON

### 5. Update UI Components
**File**: `components/menu/ProductCard.tsx`
- Add supplier display below category badge or above price
- Style: subtle gray text with icon
- Spanish label: "Proveedor: {supplierName}"

**Example UI placement**:
```tsx
{/* Supplier info */}
{item.supplier && (
  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
    <span>🏪</span>
    <span>Proveedor: {item.supplier}</span>
  </p>
)}
```

### 6. Admin UI for Supplier Selection
**File**: `app/admin/page.tsx`
- ✅ Added supplier dropdown before PDF upload
- Dropdown options: "El Barranqueño" (can add more later)
- Selected supplier sent to `/api/parse-menu` with PDF URL
- All products in upload get same supplier name

## Constraints
- ✅ Do NOT break existing functionality (supplier field is optional)
- ✅ Spanish for UI text ("Proveedor"), English for code (`supplier`)
- ✅ Maintain static-first architecture (no database required)
- ✅ Keep parsers synchronized (`parse-pdf-local.mjs` ↔ `/api/parse-menu/route.ts`)

## Rollout Plan
1. Add type definition (backward compatible)
2. Create supplier mapping file with known suppliers
3. Update both parsers to use mapping
4. Regenerate menu JSON files: `pnpm parse:local ./input/LISTA2.pdf`
5. Update `ProductCard.tsx` to display supplier
6. Test both regions (Guadalajara, Colima)
7. Deploy to Netlify

## Success Criteria
- Each product card shows supplier name in UI
- No existing functionality breaks
- Data remains static (no runtime DB queries)
- Supplier info updates when wholesale PDF is re-parsed
