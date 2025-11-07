"use client";

/**
 * FilterPanel — Category filters, search, and sort controls with URL persistence
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import type { SortOption } from "@/lib/menu/filters";

interface FilterPanelProps {
  categories: string[];
  region: string;
}

export default function FilterPanel({ categories, region }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Read initial state from URL
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("cat")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "relevance"
  );
  
  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategories.length > 0) params.set("cat", selectedCategories.join(","));
    if (sortBy !== "relevance") params.set("sort", sortBy);
    
    const query = params.toString();
    startTransition(() => {
      router.replace(`/menu/${region}${query ? `?${query}` : ""}`, { scroll: false });
    });
  }, [search, selectedCategories, sortBy, region, router]);
  
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };
  
  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSortBy("relevance");
  };
  
  const hasActiveFilters = search || selectedCategories.length > 0 || sortBy !== "relevance";
  
  return (
    <div className="card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-federalBlue hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>
      
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Buscar
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre del producto..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-federalBlue"
        />
      </div>
      
      {/* Sort */}
      <div>
        <label htmlFor="sort" className="block text-sm font-medium mb-2">
          Ordenar por
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-federalBlue"
        >
          <option value="relevance">Relevancia</option>
          <option value="priceAsc">Precio: Menor a Mayor</option>
          <option value="priceDesc">Precio: Mayor a Menor</option>
          <option value="nameAsc">Nombre: A–Z</option>
          <option value="nameDesc">Nombre: Z–A</option>
        </select>
      </div>
      
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium mb-2">Categorías</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4 text-federalBlue rounded focus:ring-2 focus:ring-federalBlue"
                />
                <span className="text-sm">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Future: Unit toggle placeholder */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-400 mb-2">Unidad</h3>
        <p className="text-xs text-slate-400">Próximamente: kilo/pieza</p>
      </div>
    </div>
  );
}
