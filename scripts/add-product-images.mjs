#!/usr/bin/env node
/**
 * Script to add placeholder product images to all menu items
 * Based on category and product name patterns
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping from category to image filename
const categoryImageMap = {
  'Res': 'res.png',
  'Cerdo': 'cerdo.png',
  'Pollo': 'pollo.png',
  'Pavo': 'pavo.png',
  'Pato': 'pato.png',
  'Cordero': 'cordero.png',
  'Cabrito': 'cabrito.png',
  'Conejo': 'conejo.png',
  'Codorniz': 'cordoniz.png',
  'Jabalí': 'jabali.png',
  'Búfalo': 'buffalo.png',
  'Avestruz': 'avestruz.png',
  'Ciervo rojo': 'ciervorojo.png',
  'Ternera': 'ternura.png',
  'Queso': 'queso.png',
  'Quesos': 'queso.png',
};

/**
 * Get the appropriate image for a product based on name and category
 */
function getProductImage(productName, category) {
  const name = productName.toLowerCase();
  
  // Product-type overrides (case-insensitive matching)
  if (name.includes('chorizo')) {
    return 'chorizo.png';
  }
  if (name.includes('chistorra')) {
    return 'chistorra.png';
  }
  if (name.includes('hamburguesa')) {
    return 'hamburger.png';
  }
  if (name.includes('birria')) {
    return 'birria.png';
  }
  if (name.includes('fajita')) {
    return 'fajitas.png';
  }
  if (name.includes('manteca')) {
    return 'manteca.png';
  }
  if (name.includes('lechón') || name.includes('lechon')) {
    return 'lechon.png';
  }
  
  // Special case: molida (ground meat) - use species-specific
  if (name.includes('molida') || name.includes('molido')) {
    // For now, use generic ground meat image
    return 'carnemolida.png';
  }
  
  // Special case: Canal (whole animal)
  if (name.includes('canal')) {
    if (category === 'Cabrito') {
      return 'cabrito2.png';
    }
    if (category === 'Cordero') {
      return 'cordero.png';
    }
  }
  
  // Default to category-based image
  return categoryImageMap[category] || null;
}

/**
 * Process a menu file and add image fields
 */
function processMenuFile(filePath) {
  console.log(`Processing ${path.basename(filePath)}...`);
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let updatedCount = 0;
  let totalCount = 0;
  
  // Check if data is an array (region menus) or object (base menu)
  if (Array.isArray(data)) {
    // Region menu format: array of products
    const updatedData = data.map(item => {
      totalCount++;
      const image = getProductImage(item.name, item.category);
      
      if (image) {
        updatedCount++;
        return {
          ...item,
          image: `/product-placeholders/${image}`
        };
      }
      
      console.warn(`  ⚠️  No image found for: ${item.name} (${item.category})`);
      return item;
    });
    
    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2) + '\n', 'utf-8');
  } else {
    // Base menu format: object grouped by category
    const updatedData = {};
    
    for (const [category, items] of Object.entries(data)) {
      updatedData[category] = items.map(item => {
        totalCount++;
        const image = getProductImage(item.item, category);
        
        if (image) {
          updatedCount++;
          return {
            ...item,
            image: `/product-placeholders/${image}`
          };
        }
        
        console.warn(`  ⚠️  No image found for: ${item.item} (${category})`);
        return item;
      });
    }
    
    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2) + '\n', 'utf-8');
  }
  
  console.log(`  ✅ Updated ${updatedCount} of ${totalCount} products\n`);
  return { total: totalCount, updated: updatedCount };
}

// Main execution
const dataDir = path.join(__dirname, '../data');
const menuFiles = [
  'menu_guadalajara_list2.json',
  'menu_colima_list2.json',
  'menu_base_list2.json'
];

console.log('=== Adding Product Images ===\n');

let totalProducts = 0;
let totalUpdated = 0;

for (const filename of menuFiles) {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    const stats = processMenuFile(filePath);
    totalProducts += stats.total;
    totalUpdated += stats.updated;
  } else {
    console.warn(`⚠️  File not found: ${filename}`);
  }
}

console.log('=== Summary ===');
console.log(`Total products: ${totalProducts}`);
console.log(`Images assigned: ${totalUpdated}`);
console.log(`Missing images: ${totalProducts - totalUpdated}`);
