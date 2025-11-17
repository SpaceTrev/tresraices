#!/usr/bin/env node

/**
 * Apply thickness options to menu JSON files
 * 
 * Usage: node scripts/apply-thickness-overrides.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Load thickness overrides
const thicknessOverridesPath = join(rootDir, "data", "overrides.thickness.json");
const thicknessData = JSON.parse(readFileSync(thicknessOverridesPath, "utf-8"));
const overrides = thicknessData.overrides;

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
      // Apply thickness options
      if (override.customThickness !== undefined) {
        item.customThickness = override.customThickness;
      }
      if (override.availableThickness !== undefined) {
        item.availableThickness = override.availableThickness;
      }
      applied++;
    }
  }
  
  // Write updated menu back to file
  writeFileSync(filePath, JSON.stringify(menu, null, 2) + "\n", "utf-8");
  console.log(`✓ Applied ${applied} thickness overrides to ${menu.length} items`);
  totalApplied += applied;
}

console.log(`\n✅ Done! Applied ${totalApplied} total thickness overrides across ${menuFiles.length} files.`);
