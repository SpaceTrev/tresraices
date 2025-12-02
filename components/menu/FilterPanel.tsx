"use client";

/**
 * FilterPanel — Condensed multi-select filters with pill badges (Option B)
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
  
  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedMeatTypes([]);
    setSortBy("relevance");
    setSelectedUnits(["kg", "pieza"]);
  };
  
  const hasActiveFilters = search || selectedCategories.length > 0 || selectedMeatTypes.length > 0 || sortBy !== "relevance" || selectedUnits.length < 2;
  
  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      {/* Main Filter Card */}
      <div className="card overflow-hidden">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-federalBlue to-uclaBlue px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="font-semibold">Filtros</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
        
        {/* Filter Content */}
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-xs font-medium text-slate-600 mb-1.5">
              Buscar
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Arrachera, ribeye..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-federalBlue focus:border-transparent"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-xs font-medium text-slate-600 mb-1.5">
              Ordenar
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-federalBlue focus:border-transparent bg-white cursor-pointer"
            >
              <option value="relevance">Relevancia</option>
              <option value="priceAsc">Precio: Menor a Mayor</option>
              <option value="priceDesc">Precio: Mayor a Menor</option>
              <option value="nameAsc">Nombre: A–Z</option>
              <option value="nameDesc">Nombre: Z–A</option>
            </select>
          </div>
          
          {/* Unit Toggle */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Unidad
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleUnit("kg")}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  selectedUnits.includes("kg")
                    ? "bg-federalBlue text-white border-federalBlue"
                    : "bg-white text-slate-700 border-slate-300 hover:border-federalBlue"
                }`}
              >
                ⚖️ Kilo
              </button>
              <button
                onClick={() => toggleUnit("pieza")}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  selectedUnits.includes("pieza")
                    ? "bg-federalBlue text-white border-federalBlue"
                    : "bg-white text-slate-700 border-slate-300 hover:border-federalBlue"
                }`}
              >
                🥩 Pieza
              </button>
            </div>
          </div>
          
          {/* Categories - Pill Buttons */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Categorías
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      isSelected
                        ? "bg-federalBlue text-white border-federalBlue shadow-sm"
                        : "bg-white text-slate-700 border-slate-300 hover:border-federalBlue hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Meat Types - Pill Buttons */}
          {meatTypes.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Tipo de Corte
              </label>
              <div className="flex flex-wrap gap-2">
                {meatTypes.map((type) => {
                  const isSelected = selectedMeatTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleMeatType(type)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all capitalize ${
                        isSelected
                          ? "bg-mintGreen text-white border-mintGreen shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:border-mintGreen hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 || selectedMeatTypes.length > 0) && (
        <div className="card p-3 bg-slate-50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {selectedCategories.length + selectedMeatTypes.length} filtro(s) activo(s)
            </span>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedMeatTypes([]);
              }}
              className="text-federalBlue hover:text-darkPurple transition-colors font-medium"
            >
              Limpiar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
