# Pack Quantity & Approximate Weight Feature

## Overview
This feature adds pack size and approximate weight information to menu items, helping customers understand what they're ordering and providing transparent pricing for variable-weight products.

## Data Model

### Extended Types

**MenuItem** (`lib/menu/types.ts`):
- `packSize?: number` - Number of units per pack (e.g., 6 for a 6-pack of hamburgers)
- `approxWeightKg?: number` - Approximate weight in kg for variable-weight items
- `pricingMode?: PricingMode` - How this item is priced (`per_kg`, `per_pack`, or `per_piece`)

**CartItem** (`lib/cart/types.ts`):
- Same optional fields as MenuItem for cart persistence

## UI Updates

### Product Cards
- Display pack size when available
- Show approximate weight in kg
- Calculate and display approximate total price based on weight
- Include disclaimer: *"Precio final puede variar según el peso real"*

### WhatsApp Messages
- Include pack size in order details
- Show approximate weight per unit
- Calculate approximate total price
- Add disclaimer for orders with variable-weight items

## Data Management

### Pack Data Override File
Location: `data/overrides.pack-info.json`

Example:
```json
{
  "overrides": {
    "avestruz:hamburguesa-grande": {
      "packSize": 6,
      "approxWeightKg": 0.9,
      "pricingMode": "per_kg"
    }
  }
}
```

### Apply Pack Data
Run the script to merge pack data into menu JSON files:

```bash
pnpm apply:pack
```

This script:
- Only adds pack data where it doesn't already exist
- Processes `menu_guadalajara_list2.json` and `menu_colima_list2.json`
- Preserves existing data

### Update Pack Data
To update existing pack information:
1. Edit `data/overrides.pack-info.json`
2. Manually remove the fields from the menu JSON files (or delete and regenerate)
3. Run `pnpm apply:pack`

## Example Display

**Product Card:**
```
Hamburguesa Grande (kg)
$313.54 por kilo

Paquete: 6 piezas
Peso aprox: 0.9 kg (≈ $282.19)
* Precio final puede variar según el peso real
```

**WhatsApp Message:**
```
• Hamburguesa grande (kilo) x2 — $627.08
  Paquete: 6 piezas
  Peso aprox: 0.9 kg/unidad (≈ $564.38 total)

Subtotal: $627.08
* Precio final puede variar según el peso real
```

## Implementation Files

- `lib/menu/types.ts` - Type definitions
- `lib/cart/types.ts` - Cart type definitions
- `components/menu/ProductCard.tsx` - UI display
- `lib/cart/whatsapp.ts` - WhatsApp message formatting
- `data/overrides.pack-info.json` - Pack data overrides
- `scripts/apply-pack-overrides.mjs` - Data merging script

## Notes

- All pack-related fields are optional for backward compatibility
- The pricing disclaimer only appears when `approxWeightKg` is present
- Pack data is stored directly in menu JSON files for static generation
- Cart store automatically handles the new optional fields
