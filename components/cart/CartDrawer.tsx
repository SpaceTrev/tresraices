/**
 * CartDrawer — Right-side sliding cart panel with checkout
 */

"use client";

import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/menu/format";
import { useCartStore } from "@/lib/cart/store";
import { buildWhatsAppUrl } from "@/lib/cart/whatsapp";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  region: string;
}

export default function CartDrawer({ isOpen, onClose, region }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal());
  
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);
  
  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);
  
  const handleClear = () => {
    if (confirm("¿Vaciar el carrito?")) {
      clear();
    }
  };
  
  const handleCheckout = () => {
    const url = buildWhatsAppUrl({ region, items, subtotal });
    window.open(url, "_blank", "noopener,noreferrer");
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed inset-y-0 right-0 w-full sm:w-[380px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 id="cart-drawer-title" className="text-xl font-bold">
            Carrito
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => {
              const lineTotal = item.unitPrice * item.quantity;
              return (
                <article key={item.id} className="card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold capitalize truncate">{item.name}</h3>
                      <p className="text-xs text-slate-500 capitalize">{item.category}</p>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
                      <button
                        onClick={() => decrement(item.id)}
                        className="p-2 hover:bg-slate-200 rounded-l-lg transition-colors"
                        aria-label="Reducir cantidad"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => increment(item.id)}
                        className="p-2 hover:bg-slate-200 rounded-r-lg transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <span className="font-bold tabular-nums">{formatPrice(lineTotal)}</span>
                  </div>
                </article>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t border-slate-200 p-5 space-y-4 bg-slate-50">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Subtotal</span>
              <span className="font-bold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full justify-center text-base py-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Continuar por WhatsApp
              </button>
              
              <button
                onClick={handleClear}
                className="w-full text-center text-sm text-slate-600 hover:text-red-600 transition-colors py-2"
              >
                Vaciar carrito
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
