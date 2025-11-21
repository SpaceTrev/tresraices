/**
 * User management API
 * Handles CRUD operations for admin users with RBAC
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuthAndPermission, clearPermissionCache } from "@/lib/auth/rbac";
import { DEFAULT_PERMISSIONS } from "@/lib/auth/types";
import { logAudit, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";
import type { User, UserRole } from "@/lib/auth/types";

// GET: List all users (requires canManageUsers)
export async function GET(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canManageUsers"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const db = getDb();
    const usersSnapshot = await db.collection("users").get();

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data() as User;
      // Don't expose sensitive fields
      return {
        uid: data.uid,
        email: data.email,
        role: data.role,
        displayName: data.displayName,
        permissions: data.permissions,
        isActive: data.isActive,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[API/Users] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: Create new user (requires canManageUsers)
export async function POST(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canManageUsers"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password, displayName, role } = body;

    // Validation
    if (!email || !password || !displayName || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, displayName, role" },
        { status: 400 }
      );
    }

    if (!["owner", "manager", "staff"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be owner, manager, or staff" },
        { status: 400 }
      );
    }

    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    // Create Firestore user document
    const db = getDb();
    const userData: User = {
      uid: userRecord.uid,
      email,
      role: role as UserRole,
      displayName,
      permissions: DEFAULT_PERMISSIONS[role as UserRole],
      createdAt: Timestamp.now(),
      createdBy: authResult.uid!,
      isActive: true,
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    // Log audit
    await logAudit({
      userId: authResult.uid!,
      action: "create",
      resourceType: "user",
      resourceId: userRecord.uid,
      changes: { email, role, displayName },
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email,
        role,
        displayName,
        permissions: userData.permissions,
      },
    });
  } catch (error: any) {
    console.error("[API/Users] POST error:", error);
    
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PATCH: Update user (requires canManageUsers)
export async function PATCH(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canManageUsers"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { uid, displayName, role, isActive, permissions } = body;

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const db = getDb();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Partial<User> = {
      updatedAt: Timestamp.now(),
    };

    if (displayName !== undefined) updates.displayName = displayName;
    if (isActive !== undefined) updates.isActive = isActive;

    // If role is changing, update permissions to match
    if (role && ["owner", "manager", "staff"].includes(role)) {
      updates.role = role as UserRole;
      updates.permissions = DEFAULT_PERMISSIONS[role as UserRole];
    } else if (permissions) {
      // Allow custom permissions
      updates.permissions = permissions;
    }

    await userRef.update(updates);

    // Clear permission cache
    clearPermissionCache(uid);

    // Update Firebase Auth display name if changed
    if (displayName) {
      await admin.auth().updateUser(uid, { displayName });
    }

    // Log audit
    await logAudit({
      userId: authResult.uid!,
      action: "update",
      resourceType: "user",
      resourceId: uid,
      changes: updates,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error("[API/Users] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Deactivate user (soft delete, requires canManageUsers)
export async function DELETE(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canManageUsers"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    // Prevent self-deletion
    if (uid === authResult.uid) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.collection("users").doc(uid).update({
      isActive: false,
      updatedAt: Timestamp.now(),
    });

    // Clear permission cache
    clearPermissionCache(uid);

    // Disable Firebase Auth user
    await admin.auth().updateUser(uid, { disabled: true });

    // Log audit
    await logAudit({
      userId: authResult.uid!,
      action: "delete",
      resourceType: "user",
      resourceId: uid,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/Users] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
