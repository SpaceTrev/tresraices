import { NextRequest } from "next/server";
import pdf from "pdf-parse";
import { getDb } from "../../../lib/firebaseAdmin";
import admin from "firebase-admin";
import type { MenuItem } from "../../../lib/menu/types";
import { validateItem } from "../../../lib/menu/validate";
import { computeRegionPrices } from "../../../lib/menu/pricing";

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Parse text and detect unit column (KILO vs PIEZA) for each item.
 * Returns items with single unit assignment.
 */
function parseText(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cats = ["Avestruz","Búfalo","Bufalo","Cabrito","Cerdo","Ciervo rojo","Ciervo Rojo","Codorniz","Conejo","Cordero","Jabalí","Jabali","Pato","Pavo","Pollo","Queso","Res","Ternera"];
  
  // Regex to match product lines: starts with category name (case-insensitive) followed by product name
  const catRe = new RegExp(`^(${cats.map(s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|')})\\s+(.+?)\\s*$`, 'i');
  const priceRe = /\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2}|[0-9]{1,4}(?:[.,][0-9]{2}))/g;
  
  const items: Array<{ category: string; name: string; base_price: number | null; unit: "kg" | "pieza"; pending?: boolean }> = [];
  let currentUnit: "kg" | "pieza" = "kg"; // default unit when parsing
  let currentCategory: string | null = null;
  
  for (const ln of lines) {
    // Skip header/footer noise
    if (/(presentación|diapositiva|precios sujetos|PowerPoint)/i.test(ln)) continue;
    
    // Detect column headers for unit switching
    if (/\bKILO\b/i.test(ln)) {
      currentUnit = "kg";
      continue;
    }
    if (/\bPIEZA\b/i.test(ln)) {
      currentUnit = "pieza";
      continue;
    }
    
    // Try to match category+name pattern
    const m = ln.match(catRe);
    if (m) {
      const category = m[1].replace(/Rojo/i, 'rojo');
      currentCategory = category;
      const name = m[2].replace(/\*+$/,'').trim();
      
      // Look for price on the same line first
      const priceMatch = ln.match(priceRe);
      if (priceMatch) {
        const base_price = toFloat(priceMatch[0]);
        if (base_price != null && base_price > 5) { // sanity check
          items.push({ 
            category, 
            name, 
            base_price,
            unit: currentUnit 
          });
        }
      } else {
        // If no price on this line, store as pending and try to find price in next lines
        items.push({ 
          category, 
          name, 
          base_price: null,
          unit: currentUnit,
          pending: true
        });
      }
    } else if (currentCategory) {
      // Check if this line is a standalone price (to match with pending items)
      const priceMatches = [...ln.matchAll(priceRe)];
      if (priceMatches.length > 0) {
        // Try to assign prices to pending items
        for (let i = items.length - 1; i >= 0 && priceMatches.length > 0; i--) {
          if (items[i].pending && items[i].base_price === null) {
            const price = toFloat(priceMatches.shift()![0]);
            if (price != null && price > 5) {
              items[i].base_price = price;
              delete items[i].pending;
            }
            break;
          }
        }
      }
    }
  }
  
  // Filter out items without valid prices and return properly typed
  return items.filter((item): item is { category: string; name: string; base_price: number; unit: "kg" | "pieza" } => 
    item.base_price !== null && !item.pending
  );
}

/**
 * Convert parsed items to MenuItem array with single unit and regional pricing
 */
function buildMenuItems(
  parsed: Array<{ category: string; name: string; base_price: number; unit: "kg" | "pieza" }>,
  supplier?: string
): MenuItem[] {
  return parsed.map(p => {
    const id = `${slugify(p.category)}:${slugify(p.name)}`;
    const regionPrices = computeRegionPrices(p.base_price);
    
    const menuItem: MenuItem = {
      id,
      name: p.name,
      category: p.category,
      unit: p.unit,
      basePrice: p.base_price,
      price: regionPrices,
      ...(supplier && { supplier })
    };

    return validateItem(menuItem);
  });
}

export async function POST(req: NextRequest) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || process.env.ADMIN_KEY;
  if (!adminKey || req.headers.get('x-admin-key') !== adminKey) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  const body = await req.json().catch(() => ({}));
  const { storageUrl, supplier } = body;
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

    // Build menu items with single unit and regional pricing
    const menuItems = buildMenuItems(parsed, supplier);

    // Log any validation warnings
    const warnings = menuItems.filter(item => item.notes).map(item => `${item.category}::${item.name} — ${item.notes}`);
    if (warnings.length > 0) {
      console.warn("⚠️  Validation warnings:", warnings);
    }

    // Write to Firestore
    const db = getDb();
    const timestamp = Date.now();
    const payload = {
      items: menuItems,
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
        parsedCount: menuItems.length,
        warnings: warnings.length,
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
