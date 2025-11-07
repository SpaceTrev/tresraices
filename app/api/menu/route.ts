import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  if (!region || !["guadalajara","colima"].includes(region)) {
    return new Response(JSON.stringify({ error: "region must be guadalajara|colima" }), { status: 400 });
  }

  // Fallback to local JSON
  const p = path.join(process.cwd(), "data", region === "guadalajara" ? "menu_guadalajara_list2.json" : "menu_colima_list2.json");
  const raw = fs.readFileSync(p, "utf-8");
  return new Response(raw, { headers: { "content-type": "application/json; charset=utf-8" } });
}
