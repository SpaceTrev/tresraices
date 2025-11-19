/**
 * Order recalculation logic
 */

import type { MenuItem } from '@/lib/menu/types';
import type { Region, WeightUpdate, RecalculatedOrder } from './types';

/**
 * Fuzzy match item name to menu item
 */
function findMenuItem(
  itemName: string,
  menuItems: MenuItem[]
): MenuItem | null {
  const normalized = itemName.toLowerCase().trim();
  
  // First try exact match on name
  let match = menuItems.find(item => item.name.toLowerCase() === normalized);
  if (match) return match;
  
  // Try partial match (item name contains search term or vice versa)
  match = menuItems.find(item => {
    const menuName = item.name.toLowerCase();
    return menuName.includes(normalized) || normalized.includes(menuName);
  });
  
  return match || null;
}

/**
 * Recalculate order based on actual weights
 */
export function recalculateOrder(
  menuItems: MenuItem[],
  region: Region,
  updates: WeightUpdate[]
): RecalculatedOrder {
  const items = updates.map(({ itemName, actualWeight }) => {
    const menuItem = findMenuItem(itemName, menuItems);
    
    if (!menuItem) {
      throw new Error(`Item not found in menu: "${itemName}"`);
    }
    
    const pricePerKg = menuItem.price[region];
    if (!pricePerKg) {
      throw new Error(`No price found for "${itemName}" in region ${region}`);
    }
    
    const actualCost = pricePerKg * actualWeight;
    
    return {
      name: menuItem.name,
      category: menuItem.category,
      pricePerKg,
      actualWeight,
      actualCost,
    };
  });
  
  const total = items.reduce((sum, item) => sum + item.actualCost, 0);
  
  return { items, total };
}

/**
 * Format recalculation result as WhatsApp message
 */
export function formatRecalculationMessage(result: RecalculatedOrder): string {
  const itemLines = result.items
    .map(item => {
      const cost = item.actualCost.toFixed(2);
      const pricePerKg = item.pricePerKg.toFixed(2);
      return `•  ${item.category} ${item.name} - ${item.actualWeight.toFixed(3)} kg × $${pricePerKg}/kg = $${cost}`;
    })
    .join('\n');
  
  return `¡Gracias por tu pedido! Aquí están los totales finales:

${itemLines}

Total: $${result.total.toFixed(2)}`;
}
