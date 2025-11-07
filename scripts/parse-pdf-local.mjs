import fs from 'node:fs'
import pdf from 'pdf-parse'

if (process.argv.length < 3) {
  console.error('Usage: node scripts/parse-pdf-local.mjs <pdf-path>')
  process.exit(1)
}
const pdfPath = process.argv[2]

function toFloat(s) {
  let x = s.replace(/\s+/g,'').replace(/\$/g,'');
  if (x.includes(',') && x.includes('.')) x = x.replace(/,/g,'');
  else if (x.includes(',')) x = x.replace(/\.(?=\d{3}(\D|$))/g,'').replace(',', '.');
  else x = x.replace(/,/g,'');
  const v = parseFloat(x);
  return Number.isFinite(v) ? v : null;
}

function parseText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cats = ["Avestruz","Búfalo","Bufalo","Cabrito","Cerdo","Ciervo rojo","Ciervo Rojo","Codorniz","Conejo","Cordero","Jabalí","Jabali","Pato","Pavo","Pollo","Queso","Res","Ternera"];
  const catRe = new RegExp(`^(${cats.map(s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|')})\s+(.+?)\s*$`, 'i');
  const priceRe = /\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2}|[0-9]{1,4}(?:[.,][0-9]{2}))/g;
  const items = []; const prices = [];

  for (const ln of lines) {
    const m = ln.match(catRe);
    if (m) items.push({ category: m[1].replace('Rojo','rojo'), name: m[2].replace(/\*+$/,'').trim() });
    for (const pr of ln.matchAll(priceRe)) {
      const v = toFloat(pr[1]); if (v != null) prices.push(v);
    }
  }
  const n = Math.min(items.length, prices.length);
  const out = [];
  for (let i=0;i<n;i++) out.push({ ...items[i], base_price: prices[i] });
  return out;
}

const buf = fs.readFileSync(pdfPath);
const data = await pdf(buf);
const parsed = parseText(data.text);

function group(recs, withPrice) {
  const g = {};
  for (const r of recs) {
    g[r.category] ??= [];
    g[r.category].push({
      item: r.name,
      base_price: r.base_price,
      ...(withPrice==='gdl' ? { price: +(r.base_price*1.15).toFixed(2) } : {}),
      ...(withPrice==='col' ? { price: +(r.base_price*1.20).toFixed(2) } : {}),
    });
  }
  for (const k of Object.keys(g)) g[k].sort((a,b)=>a.item.localeCompare(b.item));
  return g;
}

const groupedBase = group(parsed);
const groupedGdl = group(parsed, 'gdl');
const groupedCol = group(parsed, 'col');

fs.writeFileSync('./data/menu_base_list2.json', JSON.stringify(groupedBase, null, 2));
fs.writeFileSync('./data/menu_guadalajara_list2.json', JSON.stringify(groupedGdl, null, 2));
fs.writeFileSync('./data/menu_colima_list2.json', JSON.stringify(groupedCol, null, 2));
console.log('Wrote data JSON into ./data');
