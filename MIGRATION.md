# Migration Guide: Per-Unit Pricing System

## Overview

The pricing system has been updated to support per-unit pricing (kg vs pieza). This document explains how to migrate existing data and regenerate menu files.

## Changes Made

1. **New Data Structure**: Menu JSON files now use a flat array of `MenuItem` objects instead of grouped categories
2. **Per-Unit Pricing**: Each item can have multiple units (kg, pieza) with different prices
3. **Unit Overrides**: `data/overrides.units.json` defines which units are available per item
4. **Price Validation**: Automatic guardrails prevent absurd prices from being displayed
5. **UI Updates**: Product cards show unit chips, filter panel includes unit filtering

## Regenerating Menu Data

### From PDF (Recommended)

If you have the distributor PDF (LISTA 2):

```bash
# Create input directory if needed
mkdir -p input

# Copy your PDF to input/LISTA2.pdf
cp /path/to/your/LISTA2.pdf input/

# Run the parser
pnpm parse:local input/LISTA2.pdf
```

This will generate:
- `data/menu_guadalajara_list2.json`
- `data/menu_colima_list2.json`

### Manual Migration (If No PDF Available)

If you don't have the PDF but want to convert existing data:

1. Check the old format in `data/menu_guadalajara_list2.json.backup` (if you backed it up)
2. Create a conversion script or manually structure items as:

```json
[
  {
    "id": "category-slug:item-slug",
    "name": "Item Name",
    "category": "Category",
    "units": [
      {
        "unit": "kg",
        "basePrice": 100.0,
        "regionPrice": {
          "guadalajara": 115.0,
          "colima": 120.0
        }
      }
    ]
  }
]
```

## Updating Unit Overrides

Edit `data/overrides.units.json` to specify which units each item supports:

```json
{
  "Cerdo::Manteca": { "units": ["kg"] },
  "Res::Arrachera marinada": { "units": ["kg", "pieza"] }
}
```

Keys must match: `"Category::Item Name"` (case-sensitive)

## Testing

After regenerating data:

```bash
# Build and verify
pnpm build

# Run dev server
pnpm dev
```

Visit http://localhost:5173/menu/guadalajara to see the updated menu.

## Rollback

If you need to rollback:

1. Restore old JSON files from backup
2. Revert git changes:
   ```bash
   git checkout HEAD~1 -- data/menu_guadalajara_list2.json data/menu_colima_list2.json
   ```

## Support

- Check validation warnings in build logs for auto-hidden prices
- Adjust price guardrails in `lib/menu/validate.ts` if needed (current: 10-2000 MXN)
