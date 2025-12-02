/**
 * Formatting utilities for menu display
 */

import type { UnitType } from "./types";

/**
 * Format price in Mexican pesos with proper currency symbol
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format price in Mexican pesos (alias for consistency)
 */
export function formatPriceMXN(amount: number): string {
  return formatPrice(amount);
}

/**
 * Pretty print unit type with proper formatting
 * If item has packSize, show "paquete" instead of base unit for clarity
 */
export function prettyUnit(unit: UnitType, packSize?: number): string {
  // If item is sold in packs, show "paquete" regardless of base unit
  if (packSize && packSize > 0) {
    return "paquete";
  }
  
  const unitMap: Record<UnitType, string> = {
    kg: "kilo",
    pieza: "pieza"
  };
  return unitMap[unit] || unit;
}

/**
 * Create URL-safe slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
