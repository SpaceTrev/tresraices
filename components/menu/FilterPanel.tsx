"use client";

/**
 * FilterPanel — Category filters, search, sort controls, and unit filtering with URL persistence
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import type { SortOption } from "@/lib/menu/filters";
import type { UnitType } from "@/lib/menu/types";

interface FilterPanelProps {
  categories: string[];
  meatTypes: string[];
  region: string;
}

export default function FilterPanel({ categories, meatTypes, region }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Accordion state
  const [openSections, setOpenSections] = useState({
    meatTypes: true,
    categories: true,
  });
  
  // Read initial state from URL
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("cat")?.split(",").filter(Boolean) || []
  );
  const [selectedMeatTypes, setSelectedMeatTypes] = useState<string[]>(
    searchParams.get("meat")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "relevance"
  );
  const [selectedUnits, setSelectedUnits] = useState<UnitType[]>(
    (searchParams.get("units")?.split(",").filter(Boolean) as UnitType[]) || ["kg", "pieza"]
  );
  
  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategories.length > 0) params.set("cat", selectedCategories.join(","));
    if (selectedMeatTypes.length > 0) params.set("meat", selectedMeatTypes.join(","));
    if (sortBy !== "relevance") params.set("sort", sortBy);
    if (selectedUnits.length < 2) params.set("units", selectedUnits.join(","));
    
    const query = params.toString();
    startTransition(() => {
      router.replace(`/menu/${region}${query ? `?${query}` : ""}`, { scroll: false });
    });
  }, [search, selectedCategories, selectedMeatTypes, sortBy, selectedUnits, region, router]);
  
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };
  
  const toggleMeatType = (type: string) => {
    setSelectedMeatTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  
  const toggleUnit = (unit: UnitType) => {
    setSelectedUnits(prev =>
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]
    );
  };
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedMeatTypes([]);
    setSortBy("relevance");
    setSelectedUnits(["kg", "pieza"]);
  };
  
  const hasActiveFilters = search || selectedCategories.length > 0 || selectedMeatTypes.length > 0 || sortBy !== "relevance" || selectedUnits.length < 2;
  
  return (
    <div className="space-y-5 lg:sticky lg:top-4">
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
      
      {/* Unit filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">Unidad</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={selectedUnits.includes("kg")}
              onChange={() => toggleUnit("kg")}
              className="w-4 h-4 text-federalBlue border-slate-300 rounded focus:ring-2 focus:ring-federalBlue focus:ring-offset-0"
            />
            <span className="text-sm">Kilo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={selectedUnits.includes("pieza")}
              onChange={() => toggleUnit("pieza")}
              className="w-4 h-4 text-federalBlue border-slate-300 rounded focus:ring-2 focus:ring-federalBlue focus:ring-offset-0"
            />
            <span className="text-sm">Pieza</span>
          </label>
        </div>
      </div>
      
      {/* Meat Types */}
      {meatTypes.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={() => toggleSection('meatTypes')}
            className="w-full flex items-center justify-between text-sm font-medium mb-2 hover:text-federalBlue transition-colors"
          >
            <span>Tipo de Corte</span>
            <svg
              className={`w-4 h-4 transition-transform ${openSections.meatTypes ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSections.meatTypes && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {meatTypes.map((type) => {
                const isSelected = selectedMeatTypes.includes(type);
                return (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMeatType(type)}
                      className="w-4 h-4 text-federalBlue border-slate-300 rounded focus:ring-2 focus:ring-federalBlue focus:ring-offset-0"
                    />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Categories */}
      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-sm font-medium mb-2 hover:text-federalBlue transition-colors"
        >
          <span>Categorías (Animal)</span>
          <svg
            className={`w-4 h-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.categories && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                    className="w-4 h-4 text-federalBlue border-slate-300 rounded focus:ring-2 focus:ring-federalBlue focus:ring-offset-0"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
