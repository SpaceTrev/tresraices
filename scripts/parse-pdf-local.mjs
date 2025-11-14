import fs from 'node:fs'
import pdf from 'pdf-parse'

// Load supplier mapping
const supplierMapping = JSON.parse(fs.readFileSync('./data/supplier-mapping.json', 'utf-8'));

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
 * Get supplier for a given category and item name.
 */
function getSupplier(category, name) {
  const categoryMapping = supplierMapping[category];
  if (!categoryMapping) return null;
  
  // Check for specific item override
  const nameLower = name.toLowerCase();
  for (const [key, supplier] of Object.entries(categoryMapping)) {
    if (key !== 'default' && nameLower.includes(key.toLowerCase())) {
      return supplier;
    }
  }
  
  // Return default supplier for category
  return categoryMapping.default || null;
}

/**
 * Determine if an item is sold by kg or pieza based on its name/category.
 */
function determineUnit(category, name) {
  const nameLower = name.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  // Lechones are always sold by piece
  if (nameLower.includes('lechón') || nameLower.includes('lechon')) return 'pieza';
  
  // Cabrito Canal is by piece
  if ((categoryLower.includes('cabrito') || nameLower.includes('cabrito')) && 
      (nameLower.includes('canal') || name.trim() === 'Canal')) return 'pieza';
  
  // Quesos (cheeses) - many are by piece
  if (categoryLower.includes('queso')) {
    if (nameLower.includes('bouquet') || nameLower.includes('ceniza') || nameLower.includes('finas hierbas') || 
        nameLower.includes('natural') || nameLower.includes('panela')) {
      return 'pieza';
    }
  }
  
  // Codorniz (quail) items are by piece
  if (categoryLower.includes('codorniz')) return 'pieza';
  
  // Pato huevo is by piece
  if (nameLower.includes('huevo')) return 'pieza';
  
  // Cordero items that are by piece
  if (nameLower.includes('birria') || nameLower.includes('cabeza')) return 'pieza';
  
  // Default to kg
  return 'kg';
}

/**
 * Parse PDF text. The PDF has a batch structure:
 * 1. Several product lines (Category + Name)
 * 2. "KILO PIEZA" header
 * 3. Prices in the same order as products
 */
function parseText(text) {
  const lines = text.split(/\r?\n/);
  const items = [];
  
  // Category prefixes to detect
  const cats = ["Avestruz","Búfalo","Bufalo","Cabrito","Cerdo","Ciervo rojo","Ciervo Rojo","Ciervorojo","Codorniz","Conejo","Cordero","Jabalí","Jabali","Pato","Pavo","Pollo","Queso","Res","Ternera"];
  const catRe = new RegExp(`^(${cats.map(s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|')})\\s+(.+?)\\s*$`, 'i');
  const priceLineRe = /^\$\s*[0-9]/;
  
  let pendingProducts = [];
  let inPriceSection = false;
  let priceIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let ln = lines[i].trim();
    if (!ln) continue;
    
    // Skip noise
    if (/(presentación|diapositiva|precios sujetos|PowerPoint)/i.test(ln)) continue;
    
    // Detect "KILO PIEZA" header - signals end of products, start of prices
    if (/^KILO\s*PIEZA\s*$/i.test(ln)) {
      inPriceSection = true;
      priceIndex = 0;
      continue;
    }
    
    if (!inPriceSection) {
      // We're in the product definition section
      const m = ln.match(catRe);
      if (m) {
        let category = m[1];
        // Normalize category names
        if (category.match(/ciervo/i)) category = "Ciervo rojo";
        else if (category.match(/búfalo|bufalo/i)) category = "Búfalo";
        else if (category.match(/jabalí|jabali/i)) category = "Jabalí";
        
        let name = m[2].replace(/\*+$/,'').replace(/\s+/g, ' ').trim();
        
        pendingProducts.push({ category, name });
      }
    } else {
      // We're in the price section - extract prices
      if (priceLineRe.test(ln)) {
        const price = toFloat(ln);
        if (price != null && price > 5 && priceIndex < pendingProducts.length) {
          const product = pendingProducts[priceIndex];
          const unit = determineUnit(product.category, product.name);
          
          items.push({
            category: product.category,
            name: product.name,
            base_price: price,
            unit
          });
          
          priceIndex++;
        }
      }
      
      // Check if we've finished this batch (next product line or another KILO PIEZA)
      const m = ln.match(catRe);
      if (m || (priceIndex >= pendingProducts.length && pendingProducts.length > 0)) {
        // Reset for next batch
        pendingProducts = [];
        inPriceSection = false;
        priceIndex = 0;
        
        // If this line is a product, process it
        if (m) {
          let category = m[1];
          if (category.match(/ciervo/i)) category = "Ciervo rojo";
          else if (category.match(/búfalo|bufalo/i)) category = "Búfalo";
          else if (category.match(/jabalí|jabali/i)) category = "Jabalí";
          
          let name = m[2].replace(/\*+$/,'').replace(/\s+/g, ' ').trim();
          pendingProducts.push({ category, name });
        }
      }
    }
  }
  
  return items;
}

/**
 * Validate item prices and hide any that fall outside reasonable bounds.
 */
function validateItem(item) {
  const MAX_REASONABLE = 3000;
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
 * Convert parsed items to MenuItem array with unit and regional pricing
 */
function buildMenuItems(parsed) {
  return parsed.map(p => {
    const id = `${slugify(p.category)}:${slugify(p.name)}`;
    const supplier = getSupplier(p.category, p.name);
    
    const menuItem = {
      id,
      name: p.name,
      category: p.category,
      unit: p.unit,
      basePrice: p.base_price,
      price: {
        guadalajara: roundMXN(p.base_price * REGION_MULTIPLIER.guadalajara),
        colima: roundMXN(p.base_price * REGION_MULTIPLIER.colima)
      },
      ...(supplier && { supplier })
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
