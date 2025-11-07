/**
 * Filtering and sorting utilities for menu items
 */

import type { MenuItem } from "./flatten";

export type SortOption = "relevance" | "priceAsc" | "priceDesc" | "az" | "za";

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
 * Sort items by selected option
 */
export function sortItems(items: MenuItem[], sortBy: SortOption): MenuItem[] {
  const sorted = [...items];
  
  switch (sortBy) {
    case "priceAsc":
      return sorted.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return sorted.sort((a, b) => b.price - a.price);
    case "az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "za":
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
  options: {
    q?: string;
    cats?: string[];
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
  
  if (options.sort) {
    filtered = sortItems(filtered, options.sort);
  }
  
  return filtered;
}
