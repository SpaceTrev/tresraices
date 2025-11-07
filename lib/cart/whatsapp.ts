/**
 * WhatsApp URL builder for cart checkout
 */

import { formatPrice } from "@/lib/menu/format";
import type { CartItem } from "./types";

interface BuildWhatsAppUrlParams {
  region: string;
  items: CartItem[];
  subtotal: number;
}

export function buildWhatsAppUrl({
  region,
  items,
  subtotal,
}: BuildWhatsAppUrlParams): string {
  const regionName = region === "guadalajara" ? "Guadalajara" : "Colima";
  
  const itemLines = items
    .map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      return `• ${item.name} x${item.quantity} — ${formatPrice(lineTotal)}`;
    })
    .join("\n");
  
  const message = `Hola, quiero realizar un pedido (${regionName}).
Artículos:
${itemLines}

Subtotal: ${formatPrice(subtotal)}
——
Nombre:
Teléfono:
Dirección:
Notas:`;
  
  const encoded = encodeURIComponent(message);
  return `https://wa.me/523315126548?text=${encoded}`;
}
