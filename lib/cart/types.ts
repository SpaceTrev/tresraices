/**
 * Cart data types
 */

import type { UnitType } from "../menu/types";

export type CartItem = {
  id: string; // stable key: slug(category)+":"+slug(name)+"|"+unit
  name: string;
  category: string;
  unit: UnitType; // "kg" or "pieza"
  unitPrice: number; // MXN, already region-adjusted
  quantity: number; // integer >= 1
};

export type CartState = {
  items: CartItem[];
};
