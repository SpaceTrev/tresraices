/**
 * WhatsApp URL builder for cart checkout
 */

import { formatPrice, prettyUnit } from "@/lib/menu/format";
import type { CartItem } from "./types";

interface BuildWhatsAppUrlParams {
  region: string;
  items: CartItem[];
  subtotal: number;
  customerName?: string;
  customerAddress?: string;
  customerNotes?: string;
}

export function buildWhatsAppUrl({
  region,
  items,
  subtotal,
  customerName,
  customerAddress,
  customerNotes,
}: BuildWhatsAppUrlParams): string {
  const regionName = region === "guadalajara" ? "Guadalajara" : "Colima";
  
  const itemLines = items
    .map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      
      // Format quantity with unit for kilos, simple count for pieces/packs
      let quantityStr = "";
      if (item.unit === "kg") {
        quantityStr = `x${item.quantity} ${item.quantity === 1 ? "kilo" : "kilos"}`;
        // Add thickness for kilos if selected
        if (item.selectedThickness) {
          quantityStr += ` grosor: ${item.selectedThickness}`;
        }
      } else {
        quantityStr = `x${item.quantity}`;
      }
      
      const line = `• ${item.category} ${item.name} ${quantityStr} — ${formatPrice(lineTotal)}`;
      return line;
    })
    .join("\n");
  
  // Build message with conditional customer info
  let message = `Hola, quiero realizar un pedido (${regionName}).\n\nArtículos:\n${itemLines}\n`;
  
  if (customerName) {
    message += `\nNombre: ${customerName}`;
  }
  
  if (customerAddress) {
    message += `\nDirección: ${customerAddress}`;
  }
  
  if (customerNotes) {
    message += `\nNotas: ${customerNotes}`;
  }
  
  message += `\n\nSubtotal: ${formatPrice(subtotal)}`;
  
  const encoded = encodeURIComponent(message);
  return `https://wa.me/523315126548?text=${encoded}`;
}
