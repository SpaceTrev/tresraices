import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { MenuItem } from "@/lib/menu/types";
import { extractCategories } from "@/lib/menu/flatten";
import { getAllMeatTypes } from "@/lib/menu/filters";
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

  // Load menu data (now an array of MenuItem objects)
  const dataPath = path.join(
    process.cwd(),
    "data",
    `menu_${region}_list2.json`
  );
  const raw = fs.readFileSync(dataPath, "utf-8");
  const items = JSON.parse(raw) as MenuItem[];

  // Extract categories and meat types from items
  const categories = extractCategories(items);
  const meatTypes = getAllMeatTypes(items);
  const pretty = prettyRegion[region];

  return (
    <>
      <div className="container py-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs region={region} prettyRegion={pretty} />

        {/* Header - Enhanced */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-darkPurple via-federalBlue to-uclaBlue p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute inset-0 bg-[url('/img/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(194,231,217,0.15),transparent)]"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Menú {pretty}
              </h1>
              <p className="text-lg text-cream/90 max-w-2xl">
                Carnes premium y productos especiales para tu mesa. Entrega directa a domicilio.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-mintGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Calidad Premium</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-mintGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Entrega 24h</span>
                </div>
              </div>
            </div>
            <RegionToggle currentRegion={region} />
          </div>
        </header>

        {/* Filters and Products */}
        <MenuLayout
          filterPanel={
            <Suspense
              fallback={
                <div className="card p-5">
                  <p className="text-sm text-slate-500">Cargando filtros...</p>
                </div>
              }
            >
              <FilterPanel categories={categories} meatTypes={meatTypes} region={region} />
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
      </div>
      
      <CartWrapper region={region} />
    </>
  );
}
