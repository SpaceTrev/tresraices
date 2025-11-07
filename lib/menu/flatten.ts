/**
 * Data transformation utilities for menu items
 */

import { slugify } from "./format";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  base_price: number;
}

export interface GroupedMenu {
  [category: string]: Array<{
    item: string;
    price: number;
    base_price: number;
  }>;
}

/**
 * Flatten grouped JSON menu structure into a flat array of items
 */
export function flattenMenu(grouped: GroupedMenu): MenuItem[] {
  const items: MenuItem[] = [];
  
  for (const [category, products] of Object.entries(grouped)) {
    for (const product of products) {
      const id = `${slugify(category)}:${slugify(product.item)}`;
      items.push({
        id,
        name: product.item,
        category,
        price: product.price,
        base_price: product.base_price
      });
    }
  }
  
  return items;
}

/**
 * Get unique categories from grouped menu
 */
export function extractCategories(grouped: GroupedMenu): string[] {
  return Object.keys(grouped).sort();
}
