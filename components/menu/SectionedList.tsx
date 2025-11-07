/**
 * SectionedList — Grouped category sections with headers
 */

import type { MenuItem } from "@/lib/menu/flatten";
import CategoryBadge from "./CategoryBadge";
import ProductCard from "./ProductCard";

interface SectionedListProps {
  items: MenuItem[];
  region: string;
  prettyRegion: string;
}

export default function SectionedList({ items, region, prettyRegion }: SectionedListProps) {
  // Group items by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  const categories = Object.keys(grouped).sort();
  
  return (
    <div className="space-y-10">
      {categories.map((category) => {
        const categoryItems = grouped[category];
        return (
          <section key={category} className="space-y-4">
            <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <CategoryBadge category={category} className="text-base px-4 py-2" />
              <span className="text-sm text-slate-500">
                {categoryItems.length} producto{categoryItems.length !== 1 ? "s" : ""}
              </span>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map((item) => (
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
          </section>
        );
      })}
    </div>
  );
}
