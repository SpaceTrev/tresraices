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
      let line = `• ${item.category} ${item.name} (${prettyUnit(item.unit, item.packSize)}) x${item.quantity} — ${formatPrice(lineTotal)}`;
      
      // Add thickness if selected
      if (item.selectedThickness) {
        line += `\n  Grosor: ${item.selectedThickness}`;
      }
      
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
