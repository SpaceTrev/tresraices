/**
 * Menu item type definitions with single-unit pricing support.
 */

export type UnitType = "kg" | "pieza";

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
  notes?: string; // parser hints or validation flags
};
