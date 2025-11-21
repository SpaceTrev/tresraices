/**
 * Authentication and authorization types for RBAC system
 */

import type { Timestamp } from "firebase-admin/firestore";

export type UserRole = "owner" | "manager" | "staff";

export interface Permissions {
  canEditMenu: boolean;
  canEditTheme: boolean;
  canEditContent: boolean;
  canViewAnalytics: boolean;
  canManageOrders: boolean;
  canManagePurchases: boolean;
  canManageInventory: boolean;
  canManageUsers: boolean;
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  permissions: Permissions;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
  isActive: boolean;
}

// Default permission sets by role
export const DEFAULT_PERMISSIONS: Record<UserRole, Permissions> = {
  owner: {
    canEditMenu: true,
    canEditTheme: true,
    canEditContent: true,
    canViewAnalytics: true,
    canManageOrders: true,
    canManagePurchases: true,
    canManageInventory: true,
    canManageUsers: true,
  },
  manager: {
    canEditMenu: true,
    canEditTheme: false,
    canEditContent: true,
    canViewAnalytics: true,
    canManageOrders: true,
    canManagePurchases: true,
    canManageInventory: true,
    canManageUsers: false,
  },
  staff: {
    canEditMenu: false,
    canEditTheme: false,
    canEditContent: false,
    canViewAnalytics: false,
    canManageOrders: true,
    canManagePurchases: false,
    canManageInventory: true,
    canManageUsers: false,
  },
};
