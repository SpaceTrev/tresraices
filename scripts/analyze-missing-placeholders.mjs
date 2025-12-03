#!/usr/bin/env node
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./data/menu_guadalajara_list2.json', 'utf-8'));

// Group by image to see what's using generic vs specific images
const byImage = {};
data.forEach(p => {
  const img = p.image.split('/').pop();
  if (!byImage[img]) byImage[img] = [];
  byImage[img].push({ name: p.name, category: p.category });
});

// Find products using generic category images (not specialized)
const genericImages = [
  'avestruz.png', 'buffalo.png', 'cabrito.png', 'cerdo.png', 
  'ciervorojo.png', 'conejo.png', 'cordero.png', 'cordoniz.png',
  'jabali.png', 'pato.png', 'pavo.png', 'pollo.png', 'queso.png',
  'res.png', 'ternura.png'
];

console.log('=== PRODUCTS NEEDING SPECIFIC CUT/TYPE PLACEHOLDERS ===\n');

const recommendations = [];

genericImages.forEach(img => {
  if (byImage[img] && byImage[img].length > 0) {
    const category = byImage[img][0].category;
    const uniqueNames = [...new Set(byImage[img].map(p => p.name))].sort();
    
    console.log(`## ${category} (${img})`);
    console.log(`Total products: ${byImage[img].length}`);
    console.log(`Unique cuts/types:`);
    
    uniqueNames.forEach(name => {
      console.log(`  - ${name}`);
      recommendations.push({
        category,
        cut: name,
        suggestedFilename: `${category.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
      });
    });
    console.log('');
  }
});

// Export recommendations
console.log('\n=== RECOMMENDED NEW PLACEHOLDER FILES ===\n');
console.log('Priority cuts to create (most common):');
recommendations.slice(0, 20).forEach((rec, idx) => {
  console.log(`${idx + 1}. ${rec.suggestedFilename}`);
  console.log(`   Category: ${rec.category} | Cut: ${rec.cut}`);
});

console.log(`\nTotal unique cuts needing placeholders: ${recommendations.length}`);
