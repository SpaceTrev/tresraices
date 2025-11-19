#!/usr/bin/env node

/**
 * Apply category overrides to menu JSON files
 * 
 * Usage: node scripts/apply-category-overrides.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Load category overrides
const categoryOverridesPath = join(rootDir, "data", "overrides.category.json");
const categoryData = JSON.parse(readFileSync(categoryOverridesPath, "utf-8"));
const overrides = categoryData.overrides;

// Menu files to process
const menuFiles = [
  "menu_guadalajara_list2.json",
  "menu_colima_list2.json"
];

let totalApplied = 0;

for (const filename of menuFiles) {
  const filePath = join(rootDir, "data", filename);
  console.log(`\nProcessing ${filename}...`);
  
  const menu = JSON.parse(readFileSync(filePath, "utf-8"));
  let applied = 0;
  
  for (const item of menu) {
    const override = overrides[item.id];
    if (override) {
      // Apply category override
      if (override.category !== undefined) {
        console.log(`  ${item.id}: "${item.category}" → "${override.category}"`);
        item.category = override.category;
      }
      applied++;
    }
  }
  
  // Write updated menu back to file
  writeFileSync(filePath, JSON.stringify(menu, null, 2) + "\n", "utf-8");
  console.log(`✓ Applied ${applied} category overrides to ${menu.length} items`);
  totalApplied += applied;
}

console.log(`\n✅ Done! Applied ${totalApplied} total category overrides across ${menuFiles.length} files.`);
