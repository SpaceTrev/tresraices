/**
 * ProductCard — Display individual menu item with single-unit pricing and cart controls
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice, prettyUnit } from "@/lib/menu/format";
import { useCartStore } from "@/lib/cart/store";
import CategoryBadge from "./CategoryBadge";
import type { MenuItem } from "@/lib/menu/types";

interface ProductCardProps {
  item: MenuItem;
  region: "guadalajara" | "colima";
  prettyRegion: string;
}

export default function ProductCard({
  item,
  region,
  prettyRegion
}: ProductCardProps) {
  const add = useCartStore((state) => state.add);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const items = useCartStore((state) => state.items);
  
  // State for thickness selection
  const [selectedThickness, setSelectedThickness] = useState(
    item.availableThickness?.[1] || item.availableThickness?.[0]
  );
  
  // Get the price for this region
  const price = item.price[region];
  
  // Cart ID includes unit
  const cartId = `${item.id}|${item.unit}`;
  const cartItem = items.find((i) => i.id === cartId);
  
  // Detect badges
  const isNew = /nuevo/i.test(item.name);
  
  // WhatsApp deep link (secondary CTA)
  const whatsappMessage = `Hola, quiero ${item.name} (${prettyUnit(item.unit, item.packSize)}) — ${prettyRegion}`;
  const whatsappUrl = `https://wa.me/523315126548?text=${encodeURIComponent(whatsappMessage)}`;
  
  const handleAdd = () => {
    if (!price) return;
    add({
      id: cartId,
      name: item.name,
      category: item.category,
      unit: item.unit,
      unitPrice: price,
      packSize: item.packSize,
      approxWeightKg: item.approxWeightKg,
      pricingMode: item.pricingMode,
      customThickness: item.customThickness,
      availableThickness: item.availableThickness,
      selectedThickness: item.customThickness ? selectedThickness : undefined,
    });
  };
  
  return (
    <article className="card overflow-hidden hover:ring-2 hover:ring-yellow-600/50 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-2 bg-white">
      {/* Product Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-cream via-yellow-50 to-amber-50 overflow-hidden border-b border-slate-200">
        {/* Product Image */}
        {item.image && (
          <Image
            src={item.image}
            alt={`${item.name} - ${item.category}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority={false}
            unoptimized
          />
        )}
        
        {/* Gradient overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
        
        {/* Animated shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
        
        {/* Badges - overlaid on image */}
        <div className="absolute top-2 left-2 flex items-center gap-2 flex-wrap z-20">
          <CategoryBadge category={item.category} />
          {isNew && (
            <span className="badge bg-gradient-to-r from-amber-200 to-amber-100 text-slate-800 shadow-md animate-pulse">Nuevo</span>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Supplier */}
        {item.supplier && (
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Proveedor: {item.supplier}</span>
          </p>
        )}
        
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 capitalize text-darkPurple group-hover:text-federalBlue transition-colors">
          {item.name}
        </h3>
        
        {/* Pack and thickness info - fixed height container */}
        <div className="mb-3 min-h-[3rem]">
          {(item.packSize || item.approxWeightKg || item.customThickness) && (
            <div className="space-y-2">
              {item.packSize && (
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Paquete:</span> {item.packSize} {item.packSize === 1 ? 'pieza' : 'piezas'}
                </p>
              )}
              {item.approxWeightKg && (
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Peso aprox:</span> {item.approxWeightKg} kg {item.packSize ? `por paquete` : ''}
                </p>
              )}
              {item.customThickness && item.availableThickness && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Grosor:
                  </label>
                  <div className="flex gap-1">
                    {item.availableThickness.map((thickness) => (
                      <button
                        key={thickness}
                        onClick={() => setSelectedThickness(thickness)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          selectedThickness === thickness
                            ? 'bg-federalBlue text-white border-federalBlue'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-federalBlue'
                        }`}
                      >
                        {thickness}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Single unit price display */}
        {price !== undefined ? (
          <div className="mb-3">
            <div className="inline-flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-federalBlue">{formatPrice(price)}</span>
              <span className="text-sm text-slate-600">por {prettyUnit(item.unit, item.packSize)}</span>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-slate-500">No disponible en {prettyRegion}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-federalBlue hover:text-darkPurple transition-colors"
            >
              Consultar precio →
            </a>
          </div>
        )}
        
        {/* Cart controls or Add button */}
        {price !== undefined && (
          <>
            {cartItem ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gradient-to-r from-cream to-yellow-50 rounded-xl p-1 shadow-inner border border-yellow-200">
                  <button
                    onClick={() => decrement(cartId)}
                    className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-sm active:scale-95"
                    aria-label="Reducir cantidad"
                  >
                    <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-xs text-slate-600 font-medium">En carrito</span>
                    <span className="font-bold tabular-nums text-lg text-federalBlue">{cartItem.quantity}</span>
                  </div>
                  <button
                    onClick={() => increment(cartId)}
                    className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-sm active:scale-95"
                    aria-label="Aumentar cantidad"
                  >
                    <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                {/* Secondary WhatsApp link */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-center text-federalBlue hover:text-darkPurple transition-colors block"
                >
                  O pedir solo este artículo →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleAdd}
                  className="btn bg-yellow-600 text-white hover:bg-yellow-700 w-full justify-center transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar
                </button>
                
                {/* Secondary WhatsApp link */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-center text-federalBlue hover:text-darkPurple transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Solo este artículo
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
