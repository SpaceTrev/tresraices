import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { GroupedMenu } from "@/lib/menu/flatten";
import { flattenMenu, extractCategories } from "@/lib/menu/flatten";
import MenuLayout from "@/components/menu/MenuLayout";
import FilterPanel from "@/components/menu/FilterPanel";
import MenuGrid from "@/components/menu/MenuGrid";
import RegionToggle from "@/components/menu/RegionToggle";
import Breadcrumbs from "@/components/menu/Breadcrumbs";
import CartWrapper from "./CartWrapper";

type Region = "guadalajara" | "colima";

const prettyRegion: Record<Region, string> = {
  guadalajara: "Guadalajara",
  colima: "Colima"
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ region: "guadalajara" }, { region: "colima" }];
}

export default async function MenuPage({
  params
}: {
  params: Promise<{ region: Region }>;
}) {
  const { region } = await params;
  if (!["guadalajara", "colima"].includes(region)) return notFound();

  // Load menu data
  const dataPath = path.join(
    process.cwd(),
    "data",
    `menu_${region}_list2.json`
  );
  const raw = fs.readFileSync(dataPath, "utf-8");
  const grouped = JSON.parse(raw) as GroupedMenu;

  // Transform data
  const items = flattenMenu(grouped);
  const categories = extractCategories(grouped);
  const pretty = prettyRegion[region];

  return (
    <div className="container py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs region={region} prettyRegion={pretty} />

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Menú {pretty}</h1>
            <p className="text-slate-600">
              Carnes premium y productos especiales para tu mesa.
            </p>
          </div>
          <RegionToggle currentRegion={region} />
        </div>
      </header>

      {/* Main layout */}
      <MenuLayout
        filterPanel={
          <Suspense
            fallback={
              <div className="card p-5">
                <p className="text-sm text-slate-500">Cargando filtros...</p>
              </div>
            }
          >
            <FilterPanel categories={categories} region={region} />
          </Suspense>
        }
      >
        <Suspense
          fallback={
            <div className="card p-12 text-center">
              <p className="text-slate-500">Cargando productos...</p>
            </div>
          }
        >
          <MenuGrid
            items={items}
            categories={categories}
            region={region}
            prettyRegion={pretty}
          />
        </Suspense>
      </MenuLayout>
      
      {/* Cart UI */}
      <CartWrapper region={region} />
    </div>
  );
}
