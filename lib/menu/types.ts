/**
 * Menu item type definitions with single-unit pricing support.
 */

export type UnitType = "kg" | "pieza" | "paquete";

export type PricingMode = "per_kg" | "per_pack" | "per_piece";

export type ThicknessOption = "1/2\"" | "3/4\"" | "1\"";

export type MenuItem = {
  id: string; // slug(category)+":"+slug(name)
  name: string;
  category: string;
  unit: UnitType; // exactly one unit per item
  basePrice: number; // wholesale LISTA 2 price
  price: {
    // computed with region markup
    guadalajara?: number;
    colima?: number;
  };
  supplier?: string; // supplier/provider name (e.g., "El Barranqueño")
  notes?: string; // parser hints or validation flags
  packSize?: number; // number of units per pack (e.g., 6 for a 6-pack)
  approxWeightKg?: number; // approximate weight in kg for variable-weight items
  pricingMode?: PricingMode; // how this item is priced
  customThickness?: boolean; // true if customer can specify thickness for this cut
  availableThickness?: ThicknessOption[]; // available thickness options
};
