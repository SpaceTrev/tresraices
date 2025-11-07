"use client";

/**
 * Client-side menu display with filtering and sorting
 */

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { MenuItem } from "@/lib/menu/flatten";
import type { SortOption } from "@/lib/menu/filters";
import { applyFilters } from "@/lib/menu/filters";
import ProductCard from "./ProductCard";
import SectionedList from "./SectionedList";
import SectionToggle from "./SectionToggle";

interface MenuGridProps {
  items: MenuItem[];
  categories: string[];
  region: "guadalajara" | "colima";
  prettyRegion: string;
}

export default function MenuGrid({ items, categories, region, prettyRegion }: MenuGridProps) {
  const searchParams = useSearchParams();
  
  // Read filter state from URL
  const q = searchParams.get("q") || "";
  const cats = searchParams.get("cat")?.split(",").filter(Boolean) || [];
  const sort = (searchParams.get("sort") as SortOption) || "relevance";
  const view = searchParams.get("view") || "grid";
  
  // Apply filters and sorting
  const filteredItems = useMemo(() => {
    return applyFilters(items, { q, cats, sort });
  }, [items, q, cats, sort]);
  
  // Determine if we should show sections
  const showSections = view === "sections" || cats.length > 1;
  
  return (
    <div className="space-y-6">
      {/* Results summary & view toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-slate-600">
          {filteredItems.length} {filteredItems.length === 1 ? "producto" : "productos"}
        </p>
        <SectionToggle region={region} />
      </div>
      
      {/* Product display */}
      {filteredItems.length > 0 ? (
        showSections ? (
          <SectionedList items={filteredItems} region={region} prettyRegion={prettyRegion} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                basePrice={item.base_price}
                category={item.category}
                region={region}
                prettyRegion={prettyRegion}
              />
            ))}
          </div>
        )
      ) : (
        <div className="card p-12 text-center">
          <p className="text-lg text-slate-600 mb-4">
            No se encontraron productos
          </p>
          <button
            onClick={() => {
              window.location.href = `/menu/${region}`;
            }}
            className="text-federalBlue hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
