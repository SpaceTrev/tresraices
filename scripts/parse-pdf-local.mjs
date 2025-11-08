import fs from 'node:fs'
import pdf from 'pdf-parse'

if (process.argv.length < 3) {
  console.error('Usage: node scripts/parse-pdf-local.mjs <pdf-path>')
  process.exit(1)
}
const pdfPath = process.argv[2]

const REGION_MULTIPLIER = {
  guadalajara: 1.15,
  colima: 1.2,
};

function toFloat(s) {
  let x = s.replace(/\s+/g,'').replace(/\$/g,'');
  if (x.includes(',') && x.includes('.')) x = x.replace(/,/g,'');
  else if (x.includes(',')) x = x.replace(/\.(?=\d{3}(\D|$))/g,'').replace(',', '.');
  else x = x.replace(/,/g,'');
  const v = parseFloat(x);
  return Number.isFinite(v) ? v : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function roundMXN(v) {
  return Math.round(v * 100) / 100;
}

/**
 * Parse text and detect unit column (KILO vs PIEZA) for each item.
 * Returns items with single unit assignment.
 */
function parseText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cats = ["Avestruz","Búfalo","Bufalo","Cabrito","Cerdo","Ciervo rojo","Ciervo Rojo","Codorniz","Conejo","Cordero","Jabalí","Jabali","Pato","Pavo","Pollo","Queso","Res","Ternera"];
  
  // Regex to match product lines: starts with category name (case-insensitive) followed by product name
  const catRe = new RegExp(`^(${cats.map(s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|')})\\s+(.+?)\\s*$`, 'i');
  const priceRe = /\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2}|[0-9]{1,4}(?:[.,][0-9]{2}))/g;
  
  const items = [];
  let currentUnit = "kg"; // default unit when parsing
  let currentCategory = null;
  
  for (const ln of lines) {
    // Skip header/footer noise
    if (/(presentación|diapositiva|precios sujetos|PowerPoint)/i.test(ln)) continue;
    
    // Detect column headers for unit switching
    if (/\bKILO\b/i.test(ln)) {
      currentUnit = "kg";
      continue;
    }
    if (/\bPIEZA\b/i.test(ln)) {
      currentUnit = "pieza";
      continue;
    }
    
    // Try to match category+name pattern
    const m = ln.match(catRe);
    if (m) {
      const category = m[1].replace(/Rojo/i, 'rojo');
      currentCategory = category;
      const name = m[2].replace(/\*+$/,'').trim();
      
      // Look for price on the same line first
      const priceMatch = ln.match(priceRe);
      if (priceMatch) {
        const base_price = toFloat(priceMatch[0]);
        if (base_price != null && base_price > 5) { // sanity check
          items.push({ 
            category, 
            name, 
            base_price,
            unit: currentUnit 
          });
        }
      } else {
        // If no price on this line, store as pending and try to find price in next lines
        items.push({ 
          category, 
          name, 
          base_price: null,
          unit: currentUnit,
          pending: true
        });
      }
    } else if (currentCategory) {
      // Check if this line is a standalone price (to match with pending items)
      const priceMatches = [...ln.matchAll(priceRe)];
      if (priceMatches.length > 0) {
        // Try to assign prices to pending items
        for (let i = items.length - 1; i >= 0 && priceMatches.length > 0; i--) {
          if (items[i].pending && items[i].base_price === null) {
            const price = toFloat(priceMatches.shift()[0]);
            if (price != null && price > 5) {
              items[i].base_price = price;
              delete items[i].pending;
            }
            break;
          }
        }
      }
    }
  }
  
  // Filter out items without valid prices
  return items.filter(item => item.base_price !== null && !item.pending);
}

/**
 * Validate item prices and hide any that fall outside reasonable bounds.
 */
function validateItem(item) {
  const MAX_REASONABLE = 2000;
  const MIN_REASONABLE = 10;

  ["guadalajara", "colima"].forEach((r) => {
    const v = item.price[r];
    if (v !== undefined) {
      if (v < MIN_REASONABLE || v > MAX_REASONABLE) {
        item.price[r] = undefined; // hide/display as unavailable
        item.notes = (item.notes || "") + ` [auto-hidden ${r}=${v}]`;
      }
    }
  });
  
  return item;
}

/**
 * Convert parsed items to MenuItem array with single unit and regional pricing
 */
function buildMenuItems(parsed) {
  return parsed.map(p => {
    const id = `${slugify(p.category)}:${slugify(p.name)}`;
    
    const menuItem = {
      id,
      name: p.name,
      category: p.category,
      unit: p.unit,
      basePrice: p.base_price,
      price: {
        guadalajara: roundMXN(p.base_price * REGION_MULTIPLIER.guadalajara),
        colima: roundMXN(p.base_price * REGION_MULTIPLIER.colima)
      }
    };

    return validateItem(menuItem);
  });
}

const buf = fs.readFileSync(pdfPath);
const data = await pdf(buf);
const parsed = parseText(data.text);
const menuItems = buildMenuItems(parsed);

// Log any items with validation notes
menuItems.forEach(item => {
  if (item.notes) {
    console.warn(`⚠️  ${item.category}::${item.name} — ${item.notes}`);
  }
});

// Write region-specific JSON files (same data, multiple files for compatibility)
fs.writeFileSync('./data/menu_guadalajara_list2.json', JSON.stringify(menuItems, null, 2));
fs.writeFileSync('./data/menu_colima_list2.json', JSON.stringify(menuItems, null, 2));

console.log(`✅ Wrote ${menuItems.length} items to data/menu_{guadalajara|colima}_list2.json`);
