/**
 * Manual menu items API
 * CRUD operations for manually added menu items (separate from PDF imports)
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuthAndPermission } from "@/lib/auth/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { checkProfitMargin } from "@/lib/menu/manual";
import { Timestamp } from "firebase-admin/firestore";
import type { ManualMenuItem } from "@/lib/menu/manual";

// GET: List all manual menu items
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
    const region = searchParams.get("region");
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query = db.collection("manual_menu_items").orderBy("category").orderBy("name");

    if (activeOnly) {
      query = query.where("isActive", "==", true) as any;
    }

    const snapshot = await query.get();
    let items = snapshot.docs.map((doc) => doc.data() as ManualMenuItem);

    // Filter by region if specified
    if (region === "guadalajara" || region === "colima") {
      items = items.filter((item) => item.region === region || item.region === "both");
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[API/Menu/Manual] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST: Create new manual menu item
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
    const {
      name,
      category,
      price,
      basePrice,
      supplier,
      description,
      unit,
      packInfo,
      thickness,
      region,
      forceOverride,
    } = body;

    if (!name || !category || !price) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, price" },
        { status: 400 }
      );
    }

    // Check profit margin
    const marginWarning = checkProfitMargin(price, basePrice, 10);
    if (marginWarning && !forceOverride) {
      return NextResponse.json(
        {
          error: "Profit margin warning",
          warning: marginWarning,
          requiresForceOverride: true,
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `${category.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const itemRef = db.collection("manual_menu_items").doc(id);

    // Check if exists
    const doc = await itemRef.get();
    if (doc.exists) {
      return NextResponse.json(
        { error: "Item with this name and category already exists" },
        { status: 400 }
      );
    }

    const item: ManualMenuItem = {
      id,
      name,
      category,
      price,
      basePrice,
      supplier,
      description,
      unit,
      packInfo,
      thickness,
      region: region || "both",
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: authResult.uid!,
    };

    await itemRef.set(item);

    await logAudit({
      userId: authResult.uid!,
      action: "create",
      resourceType: "manual_menu_item",
      resourceId: id,
      changes: { ...item, marginWarning: marginWarning || undefined } as Record<string, unknown>,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true, item, marginWarning });
  } catch (error) {
    console.error("[API/Menu/Manual] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}

// PATCH: Update manual menu item
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
    const { id, forceOverride, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing item id" }, { status: 400 });
    }

    const db = getDb();
    const itemRef = db.collection("manual_menu_items").doc(id);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const existingItem = doc.data() as ManualMenuItem;

    // Check profit margin if price or basePrice changed
    let marginWarning = null;
    if (updates.price !== undefined || updates.basePrice !== undefined) {
      const newPrice = updates.price ?? existingItem.price;
      const newBasePrice = updates.basePrice ?? existingItem.basePrice;
      marginWarning = checkProfitMargin(newPrice, newBasePrice, 10);

      if (marginWarning && !forceOverride) {
        return NextResponse.json(
          {
            error: "Profit margin warning",
            warning: marginWarning,
            requiresForceOverride: true,
          },
          { status: 400 }
        );
      }
    }

    const allowedUpdates = [
      "name",
      "category",
      "price",
      "basePrice",
      "supplier",
      "description",
      "unit",
      "packInfo",
      "thickness",
      "region",
      "isActive",
    ];

    const validUpdates: any = {
      updatedAt: Timestamp.now(),
      updatedBy: authResult.uid,
    };

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        validUpdates[key] = updates[key];
      }
    }

    await itemRef.update(validUpdates);

    await logAudit({
      userId: authResult.uid!,
      action: "update",
      resourceType: "manual_menu_item",
      resourceId: id,
      changes: { ...validUpdates, marginWarning: marginWarning || undefined },
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true, updates: validUpdates, marginWarning });
  } catch (error) {
    console.error("[API/Menu/Manual] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE: Deactivate manual menu item (soft delete)
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
      return NextResponse.json({ error: "Missing item id" }, { status: 400 });
    }

    const db = getDb();
    await db.collection("manual_menu_items").doc(id).update({
      isActive: false,
      updatedAt: Timestamp.now(),
      updatedBy: authResult.uid,
    });

    await logAudit({
      userId: authResult.uid!,
      action: "delete",
      resourceType: "manual_menu_item",
      resourceId: id,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/Menu/Manual] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate menu item" },
      { status: 500 }
    );
  }
}
