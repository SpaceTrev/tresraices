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
      {/* Main Filter Card */}
      <div className="card overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-federalBlue to-uclaBlue p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-lg font-bold">Filtros</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Content */}
        <div className="p-5 space-y-6">
          {/* Search - Enhanced */}
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-slate-700 mb-2">
              Buscar Producto
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Arrachera, ribeye, pechuga..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-federalBlue focus:border-transparent transition-all"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Sort - Enhanced */}
          <div>
            <label htmlFor="sort" className="block text-sm font-semibold text-slate-700 mb-2">
              Ordenar por
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-federalBlue focus:border-transparent appearance-none bg-white transition-all cursor-pointer"
              >
                <option value="relevance">🎯 Relevancia</option>
                <option value="priceAsc">💰 Precio: Menor a Mayor</option>
                <option value="priceDesc">💎 Precio: Mayor a Menor</option>
                <option value="nameAsc">🔤 Nombre: A–Z</option>
                <option value="nameDesc">🔡 Nombre: Z–A</option>
              </select>
              <svg className="w-5 h-5 text-slate-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Unit filter - Enhanced with toggle buttons */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Unidad de Venta</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleUnit("kg")}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  selectedUnits.includes("kg")
                    ? "bg-federalBlue text-white border-federalBlue shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-federalBlue"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">⚖️</span>
                  <span>Kilo</span>
                </div>
              </button>
              <button
                onClick={() => toggleUnit("pieza")}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  selectedUnits.includes("pieza")
                    ? "bg-federalBlue text-white border-federalBlue shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-federalBlue"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">🥩</span>
                  <span>Pieza</span>
                </div>
              </button>
            </div>
          </div>
      
      {/* Meat Types */}
      {meatTypes.length > 0 && (
        <div className="border-t-2 border-slate-100 pt-5">
          <button
            onClick={() => toggleSection('meatTypes')}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 mb-3 hover:text-federalBlue transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>🔪</span>
              <span>Tipo de Corte</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${openSections.meatTypes ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSections.meatTypes && (
            <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
              {meatTypes.map((type) => {
                const isSelected = selectedMeatTypes.includes(type);
                return (
                  <label
                    key={type}
                    className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-federalBlue/10 text-federalBlue font-medium'
                        : 'hover:bg-slate-50'
                    }`}
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
      <div className="border-t-2 border-slate-100 pt-5">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 mb-3 hover:text-federalBlue transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>🏷️</span>
            <span>Categorías</span>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${openSections.categories ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.categories && (
          <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-federalBlue/10 text-federalBlue font-medium'
                      : 'hover:bg-slate-50'
                  }`}
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
    </div>
  );
}
