/**
 * Order recalculation types
 */

export type Region = 'guadalajara' | 'colima';

export interface WeightUpdate {
  itemName: string;
  actualWeight: number; // in kg
}

export interface ParsedOrderItem {
  name: string;
  category?: string;
  quantity: number;
  estimatedWeight?: number;
  estimatedPrice: number;
}

export interface ParsedOrder {
  region: Region;
  items: ParsedOrderItem[];
  estimatedSubtotal: number;
}

export interface RecalculatedItem {
  name: string;
  category: string;
  pricePerKg: number;
  actualWeight: number;
  actualCost: number;
}

export interface RecalculatedOrder {
  items: RecalculatedItem[];
  total: number;
}
