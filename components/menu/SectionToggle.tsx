/**
 * SectionToggle — Switch between grid and sectioned views
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SectionToggleProps {
  region: string;
}

export default function SectionToggle({ region }: SectionToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "grid";
  
  const setView = (view: "grid" | "sections") => {
    const params = new URLSearchParams(searchParams);
    if (view === "grid") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    const query = params.toString();
    router.push(`/menu/${region}${query ? `?${query}` : ""}`, { scroll: false });
  };
  
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Vista del menú">
      <button
        onClick={() => setView("sections")}
        className={`filter-chip ${
          currentView === "sections"
            ? "bg-federalBlue text-white border-federalBlue"
            : "hover:border-slate-400"
        }`}
        aria-pressed={currentView === "sections"}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Secciones
      </button>
      
      <button
        onClick={() => setView("grid")}
        className={`filter-chip ${
          currentView === "grid"
            ? "bg-federalBlue text-white border-federalBlue"
            : "hover:border-slate-400"
        }`}
        aria-pressed={currentView === "grid"}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Lista
      </button>
    </div>
  );
}
