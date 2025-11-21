/**
 * Audit logging utilities
 */

import { getDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "permission_change"
  | "status_change"
  | "restore";

export type ResourceType =
  | "user"
  | "customer"
  | "supplier"
  | "menu_item"
  | "manual_menu_item"
  | "order"
  | "purchase"
  | "inventory"
  | "site_config"
  | "theme_palette";

export interface AuditLogEntry {
  timestamp: Timestamp;
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  changes?: Record<string, unknown>; // Before/after values
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 */
export async function logAudit(params: {
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    const db = getDb();
    const entry: AuditLogEntry = {
      timestamp: Timestamp.now(),
      userId: params.userId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      changes: params.changes,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    };

    await db.collection("audit_log").add(entry);
  } catch (error) {
    console.error("[Audit] Failed to log event:", error);
    // Don't throw - audit logging should never break the main flow
  }
}

/**
 * Get IP address from request headers
 */
export function getClientIp(headers: Headers): string | undefined {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    undefined
  );
}

/**
 * Get user agent from request headers
 */
export function getUserAgent(headers: Headers): string | undefined {
  return headers.get("user-agent") || undefined;
}
