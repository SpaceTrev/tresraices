import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

type Region = "guadalajara" | "colima";

const prettyRegion: Record<Region,string> = {
  guadalajara: "Guadalajara",
  colima: "Colima"
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [
    { region: 'guadalajara' },
    { region: 'colima' }
  ];
}

export default async function MenuPage({ params }: { params: Promise<{ region: Region }> }) {
  const { region } = await params;
  if (!['guadalajara','colima'].includes(region)) return notFound();

  const dataPath = path.join(process.cwd(), "data", region === "guadalajara" ? "menu_guadalajara_list2.json" : "menu_colima_list2.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const groups = JSON.parse(raw) as Record<string, { item: string; price: number; base_price: number }[]>;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menú {prettyRegion[region]}</h1>
        <a className="btn btn-primary" href="https://wa.me/523315126548" target="_blank">Ordenar por WhatsApp</a>
      </header>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category} className="card p-5">
            <h2 className="text-xl font-semibold mb-3">{category}</h2>
            <ul className="divide-y">
              {items.map((it) => (
                <li key={it.item} className="py-2 flex items-center justify-between gap-4">
                  <span>{it.item}</span>
                  <span className="font-medium tabular-nums">${(it.price ?? 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
