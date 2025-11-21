/**
 * Role-Based Access Control (RBAC) utilities
 */

import { getDb } from "@/lib/firebaseAdmin";
import type { User, Permissions } from "./types";

// In-memory cache for permissions (5 min TTL)
const permissionCache = new Map<string, { permissions: Permissions; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Check if a user has a specific permission
 */
export async function checkPermission(
  uid: string,
  permission: keyof Permissions
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(uid);
    return permissions[permission] ?? false;
  } catch (error) {
    console.error("[RBAC] Permission check failed:", error);
    return false;
  }
}

/**
 * Get all permissions for a user (with caching)
 */
export async function getUserPermissions(uid: string): Promise<Permissions> {
  // Check cache first
  const cached = permissionCache.get(uid);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.permissions;
  }

  // Fetch from Firestore
  const db = getDb();
  const userDoc = await db.collection("users").doc(uid).get();

  if (!userDoc.exists) {
    throw new Error(`User ${uid} not found`);
  }

  const user = userDoc.data() as User;

  if (!user.isActive) {
    throw new Error(`User ${uid} is inactive`);
  }

  // Cache the permissions
  permissionCache.set(uid, {
    permissions: user.permissions,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return user.permissions;
}

/**
 * Get user data by UID
 */
export async function getUser(uid: string): Promise<User | null> {
  try {
    const db = getDb();
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data() as User;
  } catch (error) {
    console.error("[RBAC] Get user failed:", error);
    return null;
  }
}

/**
 * Clear permission cache for a user (call after updating permissions)
 */
export function clearPermissionCache(uid: string): void {
  permissionCache.delete(uid);
}

/**
 * Clear all permission caches
 */
export function clearAllPermissionCaches(): void {
  permissionCache.clear();
}

/**
 * Verify Firebase Auth token and check permission
 * For use in API routes
 */
export async function verifyAuthAndPermission(
  authHeader: string | null,
  permission: keyof Permissions
): Promise<{ authorized: boolean; uid?: string; error?: string }> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Missing or invalid authorization header" };
  }

  try {
    const admin = await import("firebase-admin");
    const token = authHeader.substring(7); // Remove "Bearer "
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const hasPermission = await checkPermission(uid, permission);

    if (!hasPermission) {
      return { authorized: false, uid, error: `Missing permission: ${permission}` };
    }

    return { authorized: true, uid };
  } catch (error) {
    console.error("[RBAC] Auth verification failed:", error);
    return {
      authorized: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}
