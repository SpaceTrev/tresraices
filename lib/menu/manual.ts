/**
 * Manual Menu Item types
 * For items manually added (not from PDF parsing)
 */

export interface ManualMenuItem {
  id: string; // Auto-generated slug
  name: string;
  category: string;
  price: number; // Final retail price
  basePrice?: number; // Optional wholesale cost for profit margin tracking
  supplier?: string; // Optional supplier reference
  description?: string;
  unit?: "kilo" | "pieza" | "paquete";
  packInfo?: string; // e.g., "500g", "4 piezas"
  thickness?: string; // e.g., "2cm"
  region?: "guadalajara" | "colima" | "both"; // Region-specific or both
  isActive: boolean;
  createdAt: any; // Firestore Timestamp
  createdBy: string; // User UID
  updatedAt?: any;
  updatedBy?: string;
}

export interface ProfitMarginWarning {
  itemId: string;
  itemName: string;
  basePrice: number;
  sellingPrice: number;
  margin: number; // Negative if selling below cost
  message: string;
}

/**
 * Calculate profit margin percentage
 */
export function calculateMargin(sellingPrice: number, basePrice: number): number {
  if (!basePrice || basePrice === 0) return 0;
  return ((sellingPrice - basePrice) / basePrice) * 100;
}

/**
 * Check if price is below cost
 */
export function isProfitable(sellingPrice: number, basePrice?: number): boolean {
  if (!basePrice) return true; // No base price = assume profitable
  return sellingPrice >= basePrice;
}

/**
 * Generate warning if margin is too low
 */
export function checkProfitMargin(
  sellingPrice: number,
  basePrice?: number,
  minMarginPercent: number = 10
): ProfitMarginWarning | null {
  if (!basePrice) return null;

  const margin = calculateMargin(sellingPrice, basePrice);

  if (margin < 0) {
    return {
      itemId: "",
      itemName: "",
      basePrice,
      sellingPrice,
      margin,
      message: `LOSS: Selling below cost by ${Math.abs(margin).toFixed(1)}%`,
    };
  }

  if (margin < minMarginPercent) {
    return {
      itemId: "",
      itemName: "",
      basePrice,
      sellingPrice,
      margin,
      message: `LOW MARGIN: Only ${margin.toFixed(1)}% profit (recommend ${minMarginPercent}%+)`,
    };
  }

  return null;
}
