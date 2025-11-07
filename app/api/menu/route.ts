import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getDb } from "../../../lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  
  if (!region || !["guadalajara", "colima"].includes(region)) {
    return new Response(
      JSON.stringify({ error: "region must be guadalajara|colima" }), 
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  try {
    // Try Firestore first
    const db = getDb();
    const doc = await db.collection("menus").doc("latest").get();
    
    if (doc.exists) {
      const data = doc.data();
      if (data) {
        // Return the region-specific menu data
        const regionKey = region === "guadalajara" ? "gdl" : "col";
        const menuData = data[regionKey];
        
        if (menuData) {
          return new Response(
            JSON.stringify(menuData), 
            { headers: { "content-type": "application/json; charset=utf-8" } }
          );
        }
      }
    }
  } catch (err) {
    // Firestore unavailable or error - fall through to local JSON fallback
    console.warn("Firestore unavailable, using local JSON fallback:", err);
  }

  // Fallback to local JSON
  const filename = region === "guadalajara" 
    ? "menu_guadalajara_list2.json" 
    : "menu_colima_list2.json";
  const p = path.join(process.cwd(), "data", filename);
  
  try {
    const raw = fs.readFileSync(p, "utf-8");
    return new Response(raw, { headers: { "content-type": "application/json; charset=utf-8" } });
  } catch (err) {
    console.error("Failed to read local JSON:", err);
    return new Response(
      JSON.stringify({ error: "menu data unavailable" }), 
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
