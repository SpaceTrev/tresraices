/**
 * Inventory tracking type definitions
 */

import type { Timestamp } from "firebase-admin/firestore";
import type { MenuItem } from "@/lib/menu/types";

export interface InventoryItem {
  menuItemId: string; // Reference to menu item
  menuItemSnapshot: MenuItem; // Cached for quick display
  
  // Stock levels
  currentStockKg?: number; // For kg-based items
  currentStockPieces?: number; // For pieza-based items
  unit: "kg" | "pieza";
  
  // Reorder settings
  reorderThreshold: number; // Minimum stock before alert
  reorderQuantity: number; // Suggested reorder amount
  
  // Supplier
  supplierId: string;
  
  // Tracking
  lastRestockedAt?: Timestamp;
  lastRestockedBy?: string;
  lastSoldAt?: Timestamp;
  
  // Configuration
  isTracked: boolean; // Enable/disable inventory tracking for this item
  enableAutoReorder?: boolean; // Future: automated reorder alerts
  autoReorderSupplierContact?: string; // Future: WhatsApp/email for auto-alerts
  
  // Notes
  notes?: string;
}
