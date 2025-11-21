/**
 * Purchase record type definitions
 */

import type { Timestamp } from "firebase-admin/firestore";
import type { Supplier } from "@/lib/suppliers/types";

export interface PurchaseItem {
  menuItemId?: string; // Optional link to menu item
  name: string;
  category: string;
  quantityOrdered: number;
  unit: "kg" | "pieza";
  wholesaleCostPerUnit: number;
  lineTotal: number;
}

export interface PurchaseRecord {
  id: string;
  purchaseNumber: string; // Auto-generated: "PUR-YYYYMMDD-XXX"
  purchaseDate: Timestamp;
  
  // Supplier info
  supplierId: string;
  supplierSnapshot: Supplier; // Freeze supplier data at purchase time
  
  // Purchase details
  items: PurchaseItem[];
  subtotal: number;
  tax?: number;
  total: number;
  
  // Payment
  paymentMethod?: string;
  invoiceNumber?: string;
  notes?: string;
  
  // System fields
  createdAt: Timestamp;
  createdBy: string;
}
