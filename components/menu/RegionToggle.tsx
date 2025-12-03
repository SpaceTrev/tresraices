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
    <div className="flex w-full sm:w-auto items-center gap-1 p-1 bg-white/20 backdrop-blur-sm rounded-lg">
      {regions.map(({ value, label }) => {
        const isActive = currentRegion === value;
        return (
          <Link
            key={value}
            href={`/menu/${value}`}
            className={`
              flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all text-center
              ${isActive
                ? "bg-white text-federalBlue shadow-md"
                : "text-white/80 hover:text-white hover:bg-white/10"
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
