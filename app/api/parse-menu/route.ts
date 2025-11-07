import { NextRequest } from "next/server";
import pdf from "pdf-parse";
import { getDb } from "../../../lib/firebaseAdmin";
import admin from "firebase-admin";

function toFloat(s: string): number | null {
  try {
    let x = s.replace(/\s+/g,'').replace(/\$/g,'');
    if (x.includes(',') && x.includes('.')) x = x.replace(/,/g,'');
    else if (x.includes(',')) x = x.replace(/\.(?=\d{3}(\D|$))/g,'').replace(',', '.');
    else x = x.replace(/,/g,'');
    const v = parseFloat(x);
    return Number.isFinite(v) ? v : null;
  } catch { return null; }
}

// Very defensive, simplified parser mirroring the local script
function parseText(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cat = ["Avestruz","Búfalo","Bufalo","Cabrito","Cerdo","Ciervo rojo","Ciervo Rojo","Codorniz","Conejo","Cordero","Jabalí","Jabali","Pato","Pavo","Pollo","Queso","Res","Ternera"];
  const catRe = new RegExp(`^(${cat.map(s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|')})\s+(.+?)\s*$`, 'i');
  const priceRe = /\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2}|[0-9]{1,4}(?:[.,][0-9]{2}))/g;

  const items: {category:string; name:string}[] = [];
  const prices: number[] = [];

  for (const ln of lines) {
    const skip = /(presentación|kilo|pieza|diapositiva|precios sujetos|PowerPoint)/i.test(ln);
    const m = ln.match(catRe);
    if (m) {
      const name = m[2].replace(/\*+$/,'').trim();
      items.push({ category: m[1].replace('Rojo','rojo'), name });
    }
    for (const pr of ln.matchAll(priceRe)) {
      const v = toFloat(pr[1]);
      if (v != null) prices.push(v);
    }
  }

  const n = Math.min(items.length, prices.length);
  const out = [];
  for (let i=0;i<n;i++) out.push({ ...items[i], base_price: prices[i] });
  return out;
}

/**
 * Build grouped menu JSON with pricing for all regions.
 * Returns { base, gdl, col } where each is Record<category, item[]>.
 */
function buildGroupedMenus(parsed: Array<{ category: string; name: string; base_price: number }>) {
  const base: Record<string, any[]> = {};
  const gdl: Record<string, any[]> = {};
  const col: Record<string, any[]> = {};

  for (const r of parsed) {
    base[r.category] ??= [];
    gdl[r.category] ??= [];
    col[r.category] ??= [];

    const baseItem = { item: r.name, base_price: r.base_price };
    const gdlItem = { item: r.name, base_price: r.base_price, price: +(r.base_price * 1.15).toFixed(2) };
    const colItem = { item: r.name, base_price: r.base_price, price: +(r.base_price * 1.20).toFixed(2) };

    base[r.category].push(baseItem);
    gdl[r.category].push(gdlItem);
    col[r.category].push(colItem);
  }

  // Sort each category by item name
  for (const cat of Object.keys(base)) base[cat].sort((a, b) => a.item.localeCompare(b.item));
  for (const cat of Object.keys(gdl)) gdl[cat].sort((a, b) => a.item.localeCompare(b.item));
  for (const cat of Object.keys(col)) col[cat].sort((a, b) => a.item.localeCompare(b.item));

  return { base, gdl, col };
}

export async function POST(req: NextRequest) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || process.env.ADMIN_KEY;
  if (!adminKey || req.headers.get('x-admin-key') !== adminKey) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  const body = await req.json().catch(() => ({}));
  const { storageUrl } = body;
  if (!storageUrl) {
    return new Response(JSON.stringify({ error: "storageUrl required" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  try {
    // Fetch the PDF bytes (Storage URL must be public or signed)
    const pdfRes = await fetch(storageUrl);
    if (!pdfRes.ok) {
      return new Response(JSON.stringify({ error: "failed to fetch pdf" }), { status: 400, headers: { "content-type": "application/json" } });
    }
    const buf = Buffer.from(await pdfRes.arrayBuffer());
    const data = await pdf(buf);
    const parsed = parseText(data.text);

    if (parsed.length === 0) {
      return new Response(JSON.stringify({ error: "no items parsed from pdf" }), { status: 400, headers: { "content-type": "application/json" } });
    }

    // Build grouped menus for all regions
    const { base, gdl, col } = buildGroupedMenus(parsed);
    const categoriesCount = Object.keys(base).length;

    // Write to Firestore
    const db = getDb();
    const timestamp = Date.now();
    const payload = {
      base,
      gdl,
      col,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      sourceUrl: storageUrl,
    };

    // Write to menus/latest
    await db.collection("menus").doc("latest").set(payload);

    // Write to menus_history/{timestamp}
    await db.collection("menus_history").doc(String(timestamp)).set(payload);

    return new Response(
      JSON.stringify({ 
        status: "ok", 
        parsedCount: parsed.length, 
        categoriesCount, 
        wroteLatest: true,
        timestamp 
      }), 
      { headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    console.error("Error parsing menu:", err);
    return new Response(
      JSON.stringify({ error: "internal server error", details: err instanceof Error ? err.message : String(err) }), 
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
