import { NextRequest } from "next/server";
import pdf from "pdf-parse";

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

export async function POST(req: NextRequest) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || process.env.ADMIN_KEY;
  if (!adminKey || req.headers.get('x-admin-key') !== adminKey) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }
  const body = await req.json().catch(()=>({}));
  const { storageUrl } = body;
  if (!storageUrl) return new Response(JSON.stringify({ error: "storageUrl required" }), { status: 400 });

  // Fetch the PDF bytes (Storage URL must be public or signed)
  const pdfRes = await fetch(storageUrl);
  if (!pdfRes.ok) return new Response(JSON.stringify({ error: "failed to fetch pdf" }), { status: 400 });
  const buf = Buffer.from(await pdfRes.arrayBuffer());
  const data = await pdf(buf);
  const parsed = parseText(data.text);

  // Build grouped JSON with markups
  const grouped: Record<string, any[]> = {};
  for (const r of parsed) {
    grouped[r.category] ??= [];
    grouped[r.category].push({
      item: r.name,
      base_price: r.base_price,
      price_gdl: +(r.base_price * 1.15).toFixed(2),
      price_col: +(r.base_price * 1.20).toFixed(2),
    });
  }

  return new Response(JSON.stringify({ status: "ok", counts: { parsed: parsed.length, categories: Object.keys(grouped).length }}), { headers: { "content-type": "application/json" } });
}
