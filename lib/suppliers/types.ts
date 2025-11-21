/**
 * Supplier type definitions
 */

import type { Timestamp } from "firebase-admin/firestore";

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  defaultMarkup: number; // Multiplier (e.g., 1.20 for 20% markup)
  isActive: boolean;
  notes?: string;
  createdAt: Timestamp;
  createdBy?: string;
  updatedAt?: Timestamp;
}
