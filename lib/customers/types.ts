/**
 * Customer type definitions
 */

import type { Timestamp } from "firebase-admin/firestore";

export type CustomerType = "individual" | "business";

export interface TaxAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  customerType: CustomerType;
  displayName: string;
  phone: string; // Unique index
  email?: string;
  
  // Business-specific fields
  businessName?: string;
  rfc?: string; // RFC for facturación (Mexican tax ID)
  taxAddress?: TaxAddress;
  
  // Preferences and metrics
  preferredRegion?: "guadalajara" | "colima";
  totalOrders: number; // Denormalized for performance
  totalSpent: number; // Denormalized
  lastOrderDate?: Timestamp;
  
  // Organization
  notes?: string;
  tags?: string[];
  
  // System fields
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
  
  // Future: loyalty program
  loyaltyPoints?: number;
  discountTier?: string;
}
