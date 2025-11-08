/**
 * Filtering and sorting utilities for menu items
 */

import type { MenuItem, UnitType } from "./types";

export type SortOption = "relevance" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

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
 * Apply unit filter (item must match one of the selected units and be available in region)
 */
export function filterByUnits(
  items: MenuItem[], 
  selectedUnits: UnitType[], 
  region: "guadalajara" | "colima"
): MenuItem[] {
  if (selectedUnits.length === 0) return []; // No units selected = show nothing
  if (selectedUnits.length === 2) return items; // Both units selected = show all
  
  return items.filter(item => 
    selectedUnits.includes(item.unit) && item.price[region] !== undefined
  );
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
  
  if (options.units) {
    filtered = filterByUnits(filtered, options.units, region);
  }
  
  if (options.sort) {
    filtered = sortItems(filtered, options.sort, region);
  }
  
  return filtered;
}
