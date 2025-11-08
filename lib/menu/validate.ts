/**
 * Validation and guardrails for menu items.
 * Prevents absurd or negative prices from being displayed.
 */

import type { MenuItem } from "./types";

const MAX_REASONABLE = 2000; // MXN per kg/pieza cap (adjustable)
const MIN_REASONABLE = 10; // MXN floor

/**
 * Validate menu item prices and hide any that fall outside reasonable bounds.
 * Adds notes to the item for any auto-hidden prices.
 */
export function validateItem(item: MenuItem): MenuItem {
  (["guadalajara", "colima"] as const).forEach((r) => {
    const v = item.price[r];
    if (v !== undefined) {
      if (v < MIN_REASONABLE || v > MAX_REASONABLE) {
        item.price[r] = undefined; // hide/display as unavailable
        item.notes =
          (item.notes || "") + ` [auto-hidden ${item.unit} ${r}=${v}]`;
      }
    }
  });
  return item;
}
