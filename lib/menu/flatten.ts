/**
 * Data transformation utilities for menu items
 */

import type { MenuItem } from "./types";

/**
 * Get unique categories from menu items
 */
export function extractCategories(items: MenuItem[]): string[] {
  const cats = new Set(items.map(item => item.category));
  return Array.from(cats).sort();
}
