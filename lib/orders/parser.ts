/**
 * Order message parser
 */

import type { ParsedOrder, WeightUpdate, Region } from './types';

/**
 * Parse weight updates from distributor format
 * Example input:
 * "Cerdo costilla baby back 1.180 kg
 *  Res arrachera 250: 1.04 kg
 *  Res hamburguesa arrachera .500kg"
 */
export function parseWeightUpdates(text: string): WeightUpdate[] {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const updates: WeightUpdate[] = [];
  
  let currentItem: string | null = null;
  
  for (const line of lines) {
    // Check if this line has a weight (with or without item name)
    const weightMatch = line.match(/(\d+\.?\d*)\s*kg/i);
    
    if (weightMatch) {
      const weight = parseFloat(weightMatch[1]);
      
      // Check if item name is on the same line
      const sameLine = line.match(/(.+?)\s*[:.-]?\s*(\d+\.?\d*)\s*kg/i);
      
      if (sameLine && sameLine[1].trim().length > 2) {
        // Item name and weight on same line
        const itemName = sameLine[1].trim()
          .replace(/^(Cerdo|Res|Búfalo|Bufalo|Cordero|Pato|Pollo|Pavo|Avestruz|Ciervo rojo|Jabalí|Jabali|Conejo|Codorniz|Cabrito|Ternera|Queso)\s+/i, '')
          .replace(/["':]/g, '')
          .toLowerCase()
          .trim();
        
        if (itemName.length > 2 && !isNaN(weight) && weight > 0) {
          updates.push({ itemName, actualWeight: weight });
          currentItem = null;
        }
      } else if (currentItem) {
        // Weight on separate line, use previous item name
        if (!isNaN(weight) && weight > 0) {
          updates.push({ itemName: currentItem, actualWeight: weight });
          currentItem = null;
        }
      }
    } else if (!line.match(/^\d+\.?\d*$/)) {
      // This line might be an item name (no weight, not just a number)
      const itemName = line
        .replace(/^(Cerdo|Res|Búfalo|Bufalo|Cordero|Pato|Pollo|Pavo|Avestruz|Ciervo rojo|Jabalí|Jabali|Conejo|Codorniz|Cabrito|Ternera|Queso)\s+/i, '')
        .replace(/["':]/g, '')
        .toLowerCase()
        .trim();
      
      if (itemName.length > 2) {
        currentItem = itemName;
      }
    }
  }
  
  return updates;
}

/**
 * Parse original WhatsApp order message
 * Example format:
 * "Hola, quiero realizar un pedido (Colima).
 * 
 * Artículos:
 * • costilla baby back (kilo) x1 — $165.60
 * • arrachera 250 grs (kilo) x1 — $298.54
 * 
 * Subtotal: $1,139.10"
 */
export function parseOrderMessage(message: string): ParsedOrder | null {
  // Detect region
  const regionMatch = message.match(/pedido\s*\((\w+)\)/i);
  const region: Region = regionMatch && regionMatch[1].toLowerCase() === 'guadalajara' 
    ? 'guadalajara' 
    : 'colima';
  
  // Extract subtotal
  const subtotalMatch = message.match(/Subtotal:\s*\$?\s*([\d,]+\.?\d*)/i);
  const estimatedSubtotal = subtotalMatch 
    ? parseFloat(subtotalMatch[1].replace(/,/g, ''))
    : 0;
  
  // Extract items - match lines like "• costilla baby back (kilo) x1 — $165.60"
  const itemRegex = /[•·]\s*(.+?)\s*\((?:kilo|pieza)\)\s*x(\d+)\s*[—-]\s*\$?([\d,]+\.?\d*)/gi;
  const items: ParsedOrder['items'] = [];
  
  let match;
  while ((match = itemRegex.exec(message)) !== null) {
    const name = match[1].trim().toLowerCase();
    const quantity = parseInt(match[2]);
    const estimatedPrice = parseFloat(match[3].replace(/,/g, ''));
    
    items.push({
      name,
      quantity,
      estimatedPrice,
    });
  }
  
  if (items.length === 0) {
    return null;
  }
  
  return {
    region,
    items,
    estimatedSubtotal,
  };
}
