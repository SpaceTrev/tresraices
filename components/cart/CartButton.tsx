/**
 * CartButton — Floating cart button showing count and total
 */

"use client";

import { formatPrice } from "@/lib/menu/format";
import { useCartStore } from "@/lib/cart/store";

interface CartButtonProps {
  onOpen: () => void;
}

export default function CartButton({ onOpen }: CartButtonProps) {
  const itemsCount = useCartStore((state) => state.itemsCount());
  const subtotal = useCartStore((state) => state.subtotal());
  
  if (itemsCount === 0) return null;
  
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 btn btn-primary shadow-lg hover:shadow-xl transition-all flex items-center gap-3 px-6 py-4 text-base"
      aria-label={`Carrito: ${itemsCount} artículos`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-90">{itemsCount} artículo{itemsCount !== 1 ? "s" : ""}</span>
        <span className="font-bold tabular-nums">{formatPrice(subtotal)}</span>
      </div>
    </button>
  );
}
