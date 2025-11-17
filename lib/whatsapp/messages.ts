import { Region } from './types';

// Fallback messages (plain text) - used before Meta template approval
export const FALLBACK_MESSAGES = {
  welcome: `¡Hola! Bienvenido a Tres Raíces Carnicería 🥩

Somos especialistas en carnes premium y exóticas.

📍 Guadalajara y Colima
🕒 Lun-Sáb 9:00-18:00

¿En qué te podemos ayudar?`,

  orderReceived: (customerName: string, estimatedTotal: string) => 
    `¡Gracias por tu pedido${customerName ? `, ${customerName}` : ''}! 🙏

Total estimado: $${estimatedTotal} MXN

El precio final depende del peso exacto al empacar. Te confirmamos el total en las próximas 2 horas.

Garantizamos frescura del día ✅`,

  awayMessage: (nextTime: string) => 
    `Gracias por escribirnos 🙏

Estamos fuera de horario (Lun-Sáb 9-18h).

Te responderemos ${nextTime} 📅

Explora nuestro menú:
🌐 tresraices.com/menu/guadalajara
🌐 tresraices.com/menu/colima`,

  humanHandoff: `Recibimos tu mensaje 📩

Un momento, te atiende nuestro equipo en breve (aprox 15 min).

¡Gracias por tu paciencia! 🙏`,

  confirmOrder: `¡Perfecto! Te avisamos cuando esté listo 📦`,
};

// FAQ responses
export const FAQ_RESPONSES = {
  howToOrder: `📋 **¿Cómo hacer tu pedido?**

Opción 1 - Desde nuestro sitio:
1. Explora el menú: tresraices.com/menu/guadalajara o /colima
2. Agrega productos al carrito 🛒
3. Click en "Pedir por WhatsApp"
4. ¡Listo! Te confirmamos el total después de empacar

Opción 2 - Mensaje directo:
Mándanos un mensaje con:
• Productos que quieres
• Cantidades (ej. 2kg arrachera, 1 paquete chorizo)

💵 **Pago:**
• Efectivo al recoger/recibir
• Transferencia bancaria
• Mercado Pago (próximamente)

🚚 **Entrega:**
Recoge en tienda o pregunta por entrega a domicilio

¿Necesitas ayuda? ¡Pregúntanos! 😊`,

  pricing: `💰 **Explicación de Precios**

Vendemos nuestras carnes de 2 formas:

**Por peso (kg)** 📏
El precio final depende del peso exacto después de empacar.

Ejemplo:
- Ves: "Arrachera $350/kg aprox"
- Pides: 1kg
- Peso real: 980g
- Pagas: $343 (350 × 0.98)

**Por pieza** 🥩
Precio fijo (quesos, piezas enteras, productos preparados)

**Paquetes especiales:**
- Hamburguesas: 6 pzas, aprox 900g (puede variar 850-950g)
- Chorizo: 4 pzas, aprox 600g

✅ **Siempre confirmamos el total antes de que pagues**

Así garantizamos que pagas exactamente lo que recibes 🤝

¿Dudas sobre algún producto? Pregúntanos 😊`,

  menu: (region: Region | null) => {
    const links = region === 'guadalajara' 
      ? 'tresraices.com/menu/guadalajara'
      : region === 'colima'
      ? 'tresraices.com/menu/colima'
      : `tresraices.com/menu/guadalajara\n🌐 tresraices.com/menu/colima`;

    return `🌐 **Nuestro Menú Online**

${region ? `**Tu región: ${region === 'guadalajara' ? 'Guadalajara (+15%)' : 'Colima (+20%)'}**\n🌐 ${links}` : `**Guadalajara (+15%):**\n🌐 tresraices.com/menu/guadalajara\n\n**Colima (+20%):**\n🌐 ${links}`}

🥩 **15 Categorías de Carnes Premium:**

Exóticas:
• Avestruz • Búfalo • Ciervo • Jabalí

Aves:
• Pato • Codorniz • Pavo • Pollo

Tradicionales:
• Res • Cerdo • Cordero • Cabrito • Ternera • Conejo

Lácteos:
• Quesos artesanales

📦 Todos los productos de nuestro proveedor de confianza: **El Barranqueño**

¿Buscas algo específico? ¡Pregúntanos! Podemos recomendar el mejor corte para tacos, asado, guisos, etc. 😊`;
  },

  delivery: `📍 **Entrega y Recogida**

**GUADALAJARA** 🏙️
📍 Recoge en tienda
🚚 Entrega a domicilio: Zonas seleccionadas (consultar)

**COLIMA** 🌴
📍 Recoge en tienda
🚚 Entrega a domicilio: A consultar

⏰ **Tiempos de entrega:**
• Pedidos antes de 12:00 PM → Listos mismo día
• Pedidos después de 12:00 PM → Siguiente día hábil

🕒 **Horarios:**
Lun-Sáb: 9:00 - 18:00
Dom: Cerrado

¿Quieres entrega urgente o tienes una dirección específica? Escríbenos y buscamos la mejor solución 😊`,
};

export function getNextAvailableTime(now: Date): string {
  const day = now.getDay();
  const hour = now.getHours();
  
  // If Sunday or after 18:00 on Saturday
  if (day === 0 || (day === 6 && hour >= 18)) {
    return 'lunes a las 9:00 AM';
  }
  
  // If before 9:00 AM on weekday
  if (hour < 9) {
    return 'hoy a las 9:00 AM';
  }
  
  // If after 18:00 on weekday
  return 'mañana a las 9:00 AM';
}

export function isBusinessHours(date: Date = new Date()): boolean {
  const day = date.getDay();
  const hour = date.getHours();
  
  // Monday-Saturday, 9 AM - 6 PM
  return day >= 1 && day <= 6 && hour >= 9 && hour < 18;
}
