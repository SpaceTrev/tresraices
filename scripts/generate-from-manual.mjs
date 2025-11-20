import fs from 'node:fs'

const manualData = JSON.parse(fs.readFileSync('./data/manual_prices_november.json', 'utf8'));

const REGION_MULTIPLIER = {
  guadalajara: 1.20,
  colima: 1.30,
};

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

const menuItems = [];

for (const item of manualData.items) {
  // Add KILO version if it exists
  if (item.kilo !== null) {
    menuItems.push({
      id: `${slugify(item.category)}:${slugify(item.name)}`,
      name: item.name,
      category: item.category,
      unit: 'kg',
      basePrice: item.kilo,
      price: {
        guadalajara: roundMXN(item.kilo * REGION_MULTIPLIER.guadalajara),
        colima: roundMXN(item.kilo * REGION_MULTIPLIER.colima)
      }
    });
  }
  
  // Add PIEZA version if it exists
  if (item.pieza !== null) {
    menuItems.push({
      id: `${slugify(item.category)}:${slugify(item.name)}-pieza`,
      name: item.name,
      category: item.category,
      unit: 'pieza',
      basePrice: item.pieza,
      price: {
        guadalajara: roundMXN(item.pieza * REGION_MULTIPLIER.guadalajara),
        colima: roundMXN(item.pieza * REGION_MULTIPLIER.colima)
      }
    });
  }
}

// Write region-specific JSON files
fs.writeFileSync('./data/menu_guadalajara_list2.json', JSON.stringify(menuItems, null, 2));
fs.writeFileSync('./data/menu_colima_list2.json', JSON.stringify(menuItems, null, 2));

console.log(`✅ Generated ${menuItems.length} items from manual data`);
console.log(`   - Items with kilo pricing: ${menuItems.filter(i => i.unit === 'kg').length}`);
console.log(`   - Items with pieza pricing: ${menuItems.filter(i => i.unit === 'pieza').length}`);
