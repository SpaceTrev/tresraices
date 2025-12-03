/**
 * CategoryBadge — Visual indicator for product categories
 */

const CATEGORY_MAP = {
  Res: { label: "Res", icon: "🥩", class: "bg-rose-100 text-rose-800" },
  Cerdo: { label: "Cerdo", icon: "🐖", class: "bg-pink-100 text-pink-800" },
  Pollo: { label: "Pollo", icon: "🐔", class: "bg-amber-100 text-amber-800" },
  Pavo: { label: "Pavo", icon: "🦃", class: "bg-amber-100 text-amber-800" },
  Cordero: { label: "Cordero", icon: "🐑", class: "bg-lime-100 text-lime-800" },
  Conejo: { label: "Conejo", icon: "🐇", class: "bg-emerald-100 text-emerald-800" },
  Jabalí: { label: "Jabalí", icon: "🐗", class: "bg-stone-100 text-stone-800" },
  Avestruz: { label: "Avestruz", icon: "🪶", class: "bg-stone-200 text-stone-800" },
  Queso: { label: "Queso", icon: "🧀", class: "bg-yellow-100 text-yellow-900" },
  Búfalo: { label: "Búfalo", icon: "🦬", class: "bg-amber-100 text-amber-900" },
  Cabrito: { label: "Cabrito", icon: "🐐", class: "bg-lime-100 text-lime-800" },
  "Ciervo rojo": { label: "Ciervo rojo", icon: "🦌", class: "bg-orange-100 text-orange-800" },
  Codorniz: { label: "Codorniz", icon: "🐦", class: "bg-slate-100 text-slate-800" },
  Pato: { label: "Pato", icon: "🦆", class: "bg-amber-200 text-amber-900" },
  Ternera: { label: "Ternera", icon: "🐄", class: "bg-red-100 text-red-800" },
} as const;

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export default function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const config = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || {
    label: category,
    icon: "🍖",
    class: "bg-slate-100 text-slate-800",
  };
  
  return (
    <span className={`chip ${config.class} ${className}`}>
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export { CATEGORY_MAP };
