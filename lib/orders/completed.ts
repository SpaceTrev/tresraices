/**
 * Extended order types for completed orders system
 * Extends existing order types from lib/orders/types.ts
 */

import type { Timestamp } from "firebase-admin/firestore";
import type { MenuItem } from "@/lib/menu/types";
import type { Region } from "./types";

export type OrderSource = "whatsapp_auto" | "manual" | "website_cart";
export type OrderStatus = "pending" | "confirmed" | "packed" | "delivered" | "cancelled";

export interface OrderItem {
  menuItemId: string;
  menuItemSnapshot: MenuItem; // Freeze prices at order time
  quantity: number;
  unitPrice: number;
  actualWeightKg?: number; // For variable-weight items
  lineTotal: number;
}

export interface CompletedOrder {
  id: string;
  orderNumber: string; // Auto-generated: "ORD-YYYYMMDD-XXX"
  orderDate: Timestamp;
  region: Region;
  source: OrderSource;
  
  // Customer info
  customerRef?: string; // Reference to customers collection
  customerPhone?: string;
  customerName?: string;
  
  // Order details
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  total: number;
  
  // Fulfillment
  status: OrderStatus;
  paymentMethod?: string;
  deliveryAddress?: string;
  notes?: string;
  
  // Invoicing
  invoiceRequired?: boolean;
  
  // System fields
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
  deliveredAt?: Timestamp;
}
