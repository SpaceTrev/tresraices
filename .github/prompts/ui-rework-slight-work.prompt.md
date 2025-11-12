---
mode: agent
---
### 🧠 Copilot Prompt: WhatsApp Checkout UX Improvements

Apply the following UX improvements to the WhatsApp checkout flow:

1. **Conditional customer info in message:**
   - If the customer has entered a name, include: `🧍 Nombre: [name]`
   - If the customer has entered an address, include: `📍 Dirección: [address]`
   - If either is missing, omit that line entirely from the final WhatsApp message
   - Always include a list of items like `- 2 x Ribeye`, with quantities

2. **Clear cart after order:**
   - After the user successfully submits the order (e.g., clicks "Enviar pedido" and the message is sent), automatically clear the shopping cart

3. **Mobile UI refinement:**
   - On small screens (mobile), remove rounded borders from all form elements (`input`, `textarea`, `select`)
   - Use a CSS media query or Tailwind class to enforce `border-radius: 0`

Keep the code modular and consistent with the existing project style.