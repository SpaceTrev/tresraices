/**
 * Cart data types
 */

export type CartItem = {
  id: string; // stable key: slug(category)+":"+slug(name)
  name: string;
  category: string;
  unitPrice: number; // MXN, already region-adjusted
  quantity: number; // integer >= 1
};

export type CartState = {
  items: CartItem[];
};
