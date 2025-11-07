/**
 * RegionToggle — Switch between Guadalajara and Colima regions
 */

import Link from "next/link";

interface RegionToggleProps {
  currentRegion: "guadalajara" | "colima";
}

const regions = [
  { value: "guadalajara", label: "Guadalajara" },
  { value: "colima", label: "Colima" }
] as const;

export default function RegionToggle({ currentRegion }: RegionToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
      {regions.map(({ value, label }) => {
        const isActive = currentRegion === value;
        return (
          <Link
            key={value}
            href={`/menu/${value}`}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? "bg-white text-federalBlue shadow-sm"
                : "text-slate-600 hover:text-slate-900"
              }
            `}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
