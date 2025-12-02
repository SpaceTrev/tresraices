/**
 * Filtering and sorting utilities for menu items
 */

import type { MenuItem, UnitType } from "./types";

export type SortOption = "relevance" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

// Common meat cut/type patterns to extract from product names
const MEAT_TYPE_PATTERNS = [
  "arrachera",
  "hamburguesa",
  "chorizo",
  "chistorra",
  "molida",
  "costilla",
  "cowboy",
  "filete",
  "pierna",
  "pechuga",
  "muslo",
  "peinecillo",
  "porterhouse",
  "salchicha",
  "bistec",
  "chuleta",
  "t-bone",
  "t bone",
  "tbone",
  "rib eye",
  "ribeye",
  "new york",
  "sirloin",
  "chamorro",
] as const;

/**
 * Extract meat type from product name (e.g., "hamburguesa grande" -> "hamburguesa")
 */
export function extractMeatType(name: string): string | null {
  const lowerName = name.toLowerCase();
  for (const pattern of MEAT_TYPE_PATTERNS) {
    if (lowerName.includes(pattern)) {
      return pattern;
    }
  }
  return null;
}

/**
 * Get all unique meat types from a list of menu items
 */
export function getAllMeatTypes(items: MenuItem[]): string[] {
  const types = new Set<string>();
  items.forEach(item => {
    const meatType = extractMeatType(item.name);
    if (meatType) types.add(meatType);
  });
  return Array.from(types).sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Apply search filter (case-insensitive substring match on item name)
 */
export function filterBySearch(items: MenuItem[], query: string): MenuItem[] {
  if (!query.trim()) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(lowerQuery));
}

/**
 * Apply category filter (includes any of the selected categories)
 */
export function filterByCategories(items: MenuItem[], categories: string[]): MenuItem[] {
  if (categories.length === 0) return items;
  return items.filter(item => categories.includes(item.category));
}

/**
 * Apply meat type filter (includes any of the selected meat types)
 */
export function filterByMeatTypes(items: MenuItem[], meatTypes: string[]): MenuItem[] {
  if (meatTypes.length === 0) return items;
  return items.filter(item => {
    const itemMeatType = extractMeatType(item.name);
    return itemMeatType && meatTypes.includes(itemMeatType);
  });
}

/**
 * Apply unit filter (item must match one of the selected units and be available in region)
 */
export function filterByUnits(
  items: MenuItem[], 
  selectedUnits: UnitType[], 
  region: "guadalajara" | "colima"
): MenuItem[] {
  if (selectedUnits.length === 0) return []; // No units selected = show nothing
  if (selectedUnits.length === 3) return items; // All units selected = show all
  
  return items.filter(item => {
    if (!item.price[region]) return false;
    
    // Check if item matches selected unit filter
    // Items with packSize display as "paquete" but have base unit of kg/pieza
    const hasPack = item.packSize && item.packSize > 0;
    
    // If "paquete" is selected, show items with packSize
    if (selectedUnits.includes("paquete") && hasPack) return true;
    
    // Otherwise check the base unit (kg or pieza)
    return selectedUnits.includes(item.unit);
  });
}

/**
 * Sort items by selected option
 */
export function sortItems(
  items: MenuItem[], 
  sortBy: SortOption,
  region: "guadalajara" | "colima"
): MenuItem[] {
  const sorted = [...items];
  
  switch (sortBy) {
    case "priceAsc":
      return sorted.sort((a, b) => {
        const aPrice = a.price[region] ?? Infinity;
        const bPrice = b.price[region] ?? Infinity;
        return aPrice - bPrice;
      });
    case "priceDesc":
      return sorted.sort((a, b) => {
        const aPrice = a.price[region] ?? 0;
        const bPrice = b.price[region] ?? 0;
        return bPrice - aPrice;
      });
    case "nameAsc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "nameDesc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "es"));
    case "relevance":
    default:
      // Keep original order (grouped by category)
      return sorted;
  }
}

/**
 * Apply all filters and sorting in one pass
 */
export function applyFilters(
  items: MenuItem[],
  region: "guadalajara" | "colima",
  options: {
    q?: string;
    cats?: string[];
    meatTypes?: string[];
    units?: UnitType[];
    sort?: SortOption;
  }
): MenuItem[] {
  let filtered = items;
  
  if (options.q) {
    filtered = filterBySearch(filtered, options.q);
  }
  
  if (options.cats && options.cats.length > 0) {
    filtered = filterByCategories(filtered, options.cats);
  }
  
  if (options.meatTypes && options.meatTypes.length > 0) {
    filtered = filterByMeatTypes(filtered, options.meatTypes);
  }
  
  if (options.units) {
    filtered = filterByUnits(filtered, options.units, region);
  }
  
  if (options.sort) {
    filtered = sortItems(filtered, options.sort, region);
  }
  
  return filtered;
}
