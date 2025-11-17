/**
 * Cart data types
 */

import type { UnitType, PricingMode, ThicknessOption } from "../menu/types";

export type CartItem = {
  id: string; // stable key: slug(category)+":"+ slug(name)+"|"+ unit
  name: string;
  category: string;
  unit: UnitType; // "kg" or "pieza"
  unitPrice: number; // MXN, already region-adjusted
  quantity: number; // integer >= 1
  packSize?: number; // number of units per pack
  approxWeightKg?: number; // approximate weight in kg
  pricingMode?: PricingMode; // how this item is priced
  customThickness?: boolean; // true if customer can specify thickness
  availableThickness?: ThicknessOption[]; // available thickness options
  selectedThickness?: ThicknessOption; // selected thickness (when customThickness is true)
};

export type CartState = {
  items: CartItem[];
};
