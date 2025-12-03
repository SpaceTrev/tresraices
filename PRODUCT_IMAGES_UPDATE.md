# Product Images Update Summary

**Date:** December 2, 2025  
**Task:** Assign placeholder product images to all menu items

## Overview

Successfully assigned placeholder images to **605 total products** across all menu files (100% coverage).

## Files Modified

1. `data/menu_guadalajara_list2.json` - 203 products updated
2. `data/menu_colima_list2.json` - 203 products updated  
3. `data/menu_base_list2.json` - 199 products updated

## Image Mapping Logic

### Category-Based Images (Default)

| Category | Image File |
|----------|-----------|
| Res | `res.png` |
| Cerdo | `cerdo.png` |
| Pollo | `pollo.png` |
| Pavo | `pavo.png` |
| Pato | `pato.png` |
| Cordero | `cordero.png` |
| Cabrito | `cabrito.png` |
| Conejo | `conejo.png` |
| Codorniz | `cordoniz.png` |
| Jabalí | `jabali.png` |
| Búfalo | `buffalo.png` |
| Avestruz | `avestruz.png` |
| Ciervo rojo | `ciervorojo.png` |
| Ternera | `ternura.png` |
| Queso | `queso.png` |

### Product-Type Overrides (Priority)

Product names containing specific keywords use specialized images:

| Keyword | Image File | Examples |
|---------|-----------|----------|
| "chorizo" | `chorizo.png` | chorizo argentino, chorizo campestre, chorizo ranchero |
| "chistorra" | `chistorra.png` | chistorra árabe, chistorra merguez, chistorra mixta |
| "hamburguesa" | `hamburger.png` | hamburguesa grande, hamburguesa arabe, hamburguesa merguez |
| "birria" | `birria.png` | birria (codorniz), birria (cordero) |
| "fajita" | `fajitas.png` | fajita de rib eye, fajitas |
| "manteca" | `manteca.png` | manteca (cerdo) |
| "lechón" or "lechon" | `lechon.png` | lechón 3-6.0, lechón 10.100-11.0, etc. |
| "molida" or "molido" | `carnemolida.png` | molida (all categories), molido |
| "canal" (Cabrito) | `cabrito2.png` | Canal (cabrito) |
| "canal" (Cordero) | `cordero.png` | canal (cordero) |

## Sample Changes

### Before (no image field):
```json
{
  "id": "avestruz:arrachera",
  "name": "arrachera",
  "category": "Avestruz",
  "unit": "kg",
  "basePrice": 298,
  "price": {
    "guadalajara": 357.6,
    "colima": 387.4
  }
}
```

### After (with image):
```json
{
  "id": "avestruz:arrachera",
  "name": "arrachera",
  "category": "Avestruz",
  "unit": "kg",
  "basePrice": 298,
  "price": {
    "guadalajara": 357.6,
    "colima": 387.4
  },
  "image": "/product-placeholders/avestruz.png"
}
```

## Implementation Details

- All image paths use the format: `/product-placeholders/{filename}`
- Images are served from the `public/product-placeholders/` directory
- No product names, prices, SKUs, or other metadata were modified
- Product-type overrides take precedence over category-based assignment
- Case-insensitive keyword matching ensures consistent image assignment

## Available Placeholder Images

Located in `/public/product-placeholders/`:

```
avestruz.png
birria.png
buffalo.png
cabrito.png
cabrito2.png
carnemolida.png
cerdo.png
chistorra.png
chorizo.png
ciervorojo.png
conejo.png
cordero.png
cordoniz.png
fajitas.png
hamburger.png
jabali.png
lechon.png
manteca.png
pato.png
pavo.png
pollo.png
queso.png
res.png
ternura.png
```

## Script Created

`scripts/add-product-images.mjs` - Automated script for assigning images based on the mapping logic. Can be re-run if menu items are added or updated.

## Statistics

- **Total products processed:** 605
- **Images assigned:** 605
- **Coverage:** 100%
- **Files modified:** 3 menu JSON files
- **Lines changed:** ~1,211 insertions

### Image Usage Distribution (Guadalajara Menu)

| Image File | Products | Category/Type |
|-----------|----------|---------------|
| cordero.png | 48 | Cordero (lamb) products |
| res.png | 24 | Res (beef) products |
| pato.png | 23 | Pato (duck) products |
| hamburger.png | 12 | All hamburguesas |
| cerdo.png | 12 | Cerdo (pork) products |
| lechon.png | 9 | Lechón (suckling pig) |
| ciervorojo.png | 9 | Ciervo rojo (red deer) |
| queso.png | 8 | Queso (cheese) products |
| ternura.png | 8 | Ternera (veal) products |
| conejo.png | 7 | Conejo (rabbit) products |
| carnemolida.png | 6 | All molida/molido (ground meat) |
| buffalo.png | 6 | Búfalo (buffalo) products |
| jabali.png | 6 | Jabalí (wild boar) products |
| pollo.png | 5 | Pollo (chicken) products |
| cordoniz.png | 4 | Codorniz (quail) products |
| chistorra.png | 4 | All chistorra sausages |
| pavo.png | 3 | Pavo (turkey) products |
| chorizo.png | 3 | All chorizo sausages |
| birria.png | 2 | Birria specialty items |
| avestruz.png | 1 | Avestruz (ostrich) arrachera |
| cabrito2.png | 1 | Cabrito Canal (whole goat) |
| manteca.png | 1 | Manteca (lard) |
| fajitas.png | 1 | Fajitas specialty |

**Total:** 203 unique products in Guadalajara menu

## Next Steps

1. Verify images display correctly in the UI
2. Consider adding real product photography to replace placeholders
3. Update script if new categories or product types are added
4. Maintain consistency when adding new menu items
