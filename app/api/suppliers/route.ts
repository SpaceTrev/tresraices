/**
 * Supplier Management API
 * Manages supplier CRUD operations
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuthAndPermission } from "@/lib/auth/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { Timestamp } from "firebase-admin/firestore";
import type { Supplier } from "@/lib/suppliers/types";

// GET: List all suppliers
export async function GET(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query = db.collection("suppliers").orderBy("name");

    if (activeOnly) {
      query = query.where("isActive", "==", true) as any;
    }

    const snapshot = await query.get();
    const suppliers = snapshot.docs.map((doc) => doc.data() as Supplier);

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("[API/Suppliers] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST: Create a new supplier
export async function POST(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, contactName, email, phone, defaultMarkup, notes } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Supplier name is required" }, { status: 400 });
    }

    if (typeof defaultMarkup !== "number" || defaultMarkup < 0) {
      return NextResponse.json(
        { error: "Valid default markup percentage is required" },
        { status: 400 }
      );
    }

    if (defaultMarkup < 10) {
      return NextResponse.json(
        {
          error: "Default markup must be at least 10% to ensure profitability",
          suggestion: "Consider a markup between 20-30% for healthy margins",
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const supplierId = `supplier_${Date.now()}`;
    const now = Timestamp.now();

    const supplier: Supplier = {
      id: supplierId,
      name: name.trim(),
      contactName: contactName?.trim(),
      contactEmail: email?.trim(),
      contactPhone: phone?.trim(),
      defaultMarkup,
      notes: notes?.trim(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("suppliers").doc(supplierId).set(supplier);

    // Audit log
    await logAudit({
      userId: authResult.uid!,
      action: "create",
      resourceType: "supplier",
      resourceId: supplierId,
      changes: { created: supplier },
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    console.error("[API/Suppliers] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing supplier
export async function PATCH(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, contactName, email, phone, defaultMarkup, notes, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
    }

    const db = getDb();
    const supplierRef = db.collection("suppliers").doc(id);
    const supplierDoc = await supplierRef.get();

    if (!supplierDoc.exists) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    const currentSupplier = supplierDoc.data() as Supplier;
    const updates: Partial<Supplier> = {
      updatedAt: Timestamp.now(),
    };

    // Update fields if provided
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Invalid supplier name" }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (contactName !== undefined) {
      updates.contactName = contactName?.trim();
    }

    if (email !== undefined) {
      updates.contactEmail = email?.trim();
    }

    if (phone !== undefined) {
      updates.contactPhone = phone?.trim();
    }

    if (defaultMarkup !== undefined) {
      if (typeof defaultMarkup !== "number" || defaultMarkup < 0) {
        return NextResponse.json(
          { error: "Valid default markup percentage is required" },
          { status: 400 }
        );
      }

      if (defaultMarkup < 10) {
        return NextResponse.json(
          {
            error: "Default markup must be at least 10% to ensure profitability",
            suggestion: "Consider a markup between 20-30% for healthy margins",
          },
          { status: 400 }
        );
      }

      updates.defaultMarkup = defaultMarkup;
    }

    if (notes !== undefined) {
      updates.notes = notes?.trim() || null;
    }

    if (typeof isActive === "boolean") {
      updates.isActive = isActive;
    }

    await supplierRef.update(updates);

    const updatedSupplier = { ...currentSupplier, ...updates };

    // Audit log
    await logAudit({
      userId: authResult.uid!,
      action: "update",
      resourceType: "supplier",
      resourceId: id,
      changes: { before: currentSupplier, after: updatedSupplier },
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ supplier: updatedSupplier });
  } catch (error) {
    console.error("[API/Suppliers] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}

// DELETE: Soft-delete a supplier
export async function DELETE(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
    }

    const db = getDb();
    const supplierRef = db.collection("suppliers").doc(id);
    const supplierDoc = await supplierRef.get();

    if (!supplierDoc.exists) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    const currentSupplier = supplierDoc.data() as Supplier;

    // Soft delete by marking as inactive
    await supplierRef.update({
      isActive: false,
      updatedAt: Timestamp.now(),
    });

    // Audit log
    await logAudit({
      userId: authResult.uid!,
      action: "delete",
      resourceType: "supplier",
      resourceId: id,
      changes: { before: currentSupplier, after: { ...currentSupplier, isActive: false } },
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ message: "Supplier deactivated successfully" });
  } catch (error) {
    console.error("[API/Suppliers] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
