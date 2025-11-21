/**
 * Site configuration API
 * Manages site content, theme, font settings with Netlify build hook integration
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuthAndPermission } from "@/lib/auth/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { Timestamp } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";
import type { SiteConfig } from "@/lib/config/types";

// GET: Fetch current site configuration
export async function GET(request: NextRequest) {
  try {
    // Try Firestore first
    const db = getDb();
    const configDoc = await db.collection("site_config").doc("current").get();

    if (configDoc.exists) {
      return NextResponse.json({ config: configDoc.data() });
    }

    // Fallback to local file
    const configPath = path.join(process.cwd(), "data", "site-config.json");
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(raw);
      return NextResponse.json({ config });
    }

    return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
  } catch (error) {
    console.error("[API/Config] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

// POST: Update site configuration (requires canEditContent OR canEditTheme)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, section } = body; // section: 'content' | 'theme' | 'font' | 'all'

    if (!config) {
      return NextResponse.json({ error: "Missing config data" }, { status: 400 });
    }

    // Check permissions based on what's being updated
    let requiredPermission: "canEditContent" | "canEditTheme" = "canEditContent";
    if (section === "theme" || section === "font") {
      requiredPermission = "canEditTheme";
    }

    const authResult = await verifyAuthAndPermission(
      request.headers.get("authorization"),
      requiredPermission
    );

    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const db = getDb();
    const configRef = db.collection("site_config").doc("current");

    // Get existing config
    const existingDoc = await configRef.get();
    const existingConfig = existingDoc.exists ? existingDoc.data() as SiteConfig : null;

    // Merge updates
    const updatedConfig: SiteConfig = {
      ...(existingConfig || {}),
      ...config,
      updatedAt: new Date().toISOString(),
      updatedBy: authResult.uid!,
    };

    // Save to Firestore
    await configRef.set(updatedConfig);

    // Write to local file for static builds
    const configPath = path.join(process.cwd(), "data", "site-config.json");
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));

    // Log audit
    await logAudit({
      userId: authResult.uid!,
      action: "update",
      resourceType: "site_config",
      resourceId: "current",
      changes: { section, updates: config },
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    // Trigger Netlify build hook if configured
    let buildTriggered = false;
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
    
    if (buildHookUrl) {
      try {
        await fetch(buildHookUrl, { method: "POST" });
        buildTriggered = true;
        console.log("[API/Config] Netlify build hook triggered");
      } catch (error) {
        console.error("[API/Config] Failed to trigger build hook:", error);
      }
    }

    return NextResponse.json({
      success: true,
      buildTriggered,
      estimatedDeployTime: buildTriggered ? "2-3 min" : undefined,
      message: buildTriggered
        ? "Configuration saved and deployment triggered"
        : "Configuration saved (deploy manually or add NETLIFY_BUILD_HOOK_URL)",
    });
  } catch (error) {
    console.error("[API/Config] POST error:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
