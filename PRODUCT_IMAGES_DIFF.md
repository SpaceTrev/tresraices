# DIFF SUMMARY: Product Images Assignment

## Changes Overview

**Files Modified:** 3  
**Total Products Updated:** 605  
**Coverage:** 100%

---

## Example Changes (Guadalajara Menu)

### 1. Category-based assignment (Avestruz)
```diff
  {
    "id": "avestruz:arrachera",
    "name": "arrachera",
    "category": "Avestruz",
    "unit": "kg",
    "basePrice": 298,
    "price": {
      "guadalajara": 357.6,
      "colima": 387.4
-   }
+   },
+   "image": "/product-placeholders/avestruz.png"
  }
```

### 2. Product-type override: Hamburguesa
```diff
  {
    "id": "bufalo:hamburguesa",
    "name": "hamburguesa",
    "category": "Búfalo",
    "unit": "kg",
    "basePrice": 135,
    "price": {
      "guadalajara": 162,
      "colima": 175.5
    },
    "packSize": 6,
    "approxWeightKg": 0.9,
-   "pricingMode": "per_kg"
+   "pricingMode": "per_kg",
+   "image": "/product-placeholders/hamburger.png"
  }
```

### 3. Product-type override: Chorizo
```diff
  {
    "id": "res:chorizo-argentino",
    "name": "chorizo argentino",
    "category": "Res",
    "unit": "kg",
    "basePrice": 124.6,
    "price": {
      "guadalajara": 149.52,
      "colima": 161.98
    },
    "packSize": 4,
    "approxWeightKg": 0.6,
-   "pricingMode": "per_kg"
+   "pricingMode": "per_kg",
+   "image": "/product-placeholders/chorizo.png"
  }
```

### 4. Product-type override: Molida (ground meat)
```diff
  {
    "id": "cerdo:molida",
    "name": "molida",
    "category": "Cerdo",
    "unit": "kg",
    "basePrice": 108,
    "price": {
      "guadalajara": 129.6,
      "colima": 140.4
-   }
+   },
+   "image": "/product-placeholders/carnemolida.png"
  }
```

### 5. Product-type override: Birria
```diff
  {
    "id": "codorniz:birria-pieza",
    "name": "birria",
    "category": "Codorniz",
    "unit": "pieza",
    "basePrice": 103,
    "price": {
      "guadalajara": 123.6,
      "colima": 133.9
-   }
+   },
+   "image": "/product-placeholders/birria.png"
  }
```

### 6. Product-type override: Lechón
```diff
  {
    "id": "cerdo:lechon-3-6-0-pieza",
    "name": "lechón 3-6.0",
    "category": "Cerdo",
    "unit": "pieza",
    "basePrice": 1500,
    "price": {
      "guadalajara": 1800,
      "colima": 1950
-   }
+   },
+   "image": "/product-placeholders/lechon.png"
  }
```

### 7. Special case: Canal (Cabrito)
```diff
  {
    "id": "cabrito:canal-pieza",
    "name": "Canal",
    "category": "Cabrito",
    "unit": "pieza",
    "basePrice": 1440,
    "price": {
      "guadalajara": 1728,
      "colima": 1872
-   }
+   },
+   "image": "/product-placeholders/cabrito2.png"
  }
```

### 8. Product-type override: Chistorra
```diff
  {
    "id": "cordero:chistorra-arabe",
    "name": "chistorra árabe",
    "category": "Cordero",
    "unit": "kg",
    "basePrice": 175.6,
    "price": {
      "guadalajara": 210.72,
      "colima": 228.28
    },
    "packSize": 1,
    "approxWeightKg": 0.3,
-   "pricingMode": "per_kg"
+   "pricingMode": "per_kg",
+   "image": "/product-placeholders/chistorra.png"
  }
```

### 9. Product-type override: Manteca
```diff
  {
    "id": "cerdo:manteca",
    "name": "manteca",
    "category": "Cerdo",
    "unit": "kg",
    "basePrice": 65.28,
    "price": {
      "guadalajara": 78.34,
      "colima": 84.86
-   }
+   },
+   "image": "/product-placeholders/manteca.png"
  }
```

---

## Base Menu Format Changes

The base menu file uses a different structure (grouped by category):

```diff
  "Cerdo": [
    {
      "item": "manteca",
-     "base_price": 65.28
+     "base_price": 65.28,
+     "image": "/product-placeholders/manteca.png"
    },
    {
      "item": "molida",
-     "base_price": 108
+     "base_price": 108,
+     "image": "/product-placeholders/carnemolida.png"
    }
  ]
```

---

## Git Statistics

```
 data/menu_base_list2.json        | 599 ++++++++++++++++++++++++++--------------
 data/menu_colima_list2.json      | 609 +++++++++++++++++++++++++++--------------
 data/menu_guadalajara_list2.json | 609 +++++++++++++++++++++++++++--------------
 3 files changed, 1211 insertions(+), 606 deletions(-)
```

---

## Key Changes

✅ **Added `image` field to all 605 products**  
✅ **No changes to product names, prices, or metadata**  
✅ **Product-type overrides working correctly**  
✅ **Category-based defaults working correctly**  
✅ **All three menu files updated successfully**  

## Image Path Format

All images use consistent path format:
```
/product-placeholders/{filename}
```

## Verification

All special cases verified:
- ✅ Hamburguesas (all species) → `hamburger.png`
- ✅ Chorizos → `chorizo.png`
- ✅ Chistorras → `chistorra.png`
- ✅ Molidas (all species) → `carnemolida.png`
- ✅ Birrias → `birria.png`
- ✅ Lechones → `lechon.png`
- ✅ Manteca → `manteca.png`
- ✅ Canal (Cabrito) → `cabrito2.png`
- ✅ Canal (Cordero) → `cordero.png`
- ✅ All other products → category-based image
