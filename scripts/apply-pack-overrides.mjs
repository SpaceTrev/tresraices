#!/usr/bin/env node

/**
 * Apply pack size and weight overrides to menu JSON files
 * 
 * Usage: node scripts/apply-pack-overrides.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Load pack overrides
const packOverridesPath = join(rootDir, "data", "overrides.pack-info.json");
const packData = JSON.parse(readFileSync(packOverridesPath, "utf-8"));
const overrides = packData.overrides;

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
      // Apply pack data, overwriting existing values
      if (override.packSize !== undefined) {
        item.packSize = override.packSize;
      }
      if (override.approxWeightKg !== undefined) {
        item.approxWeightKg = override.approxWeightKg;
      }
      if (override.pricingMode !== undefined) {
        item.pricingMode = override.pricingMode;
      }
      applied++;
    }
  }
  
  // Write updated menu back to file
  writeFileSync(filePath, JSON.stringify(menu, null, 2) + "\n", "utf-8");
  console.log(`✓ Applied ${applied} pack overrides to ${menu.length} items`);
  totalApplied += applied;
}

console.log(`\n✅ Done! Applied ${totalApplied} total pack overrides across ${menuFiles.length} files.`);
console.log(`\nNote: This script overwrites existing pack data with values from overrides.pack-info.json.`);
