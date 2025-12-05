Below is a complete, production-ready blueprint:

1️⃣ A clear, step-by-step outline of the manual operational process you and your sales team will follow in WhatsApp Business today
2️⃣ A structured “prompt suite” for GitHub Copilot so it can generate all assets, templates, scripts, and docs needed to implement and maintain this workflow inside your carnicería project repo.

Everything is written in a professional, actionable, and forward-compatible way.

⸻

=========================================

PART 1 — MANUAL OPERATIONS BLUEPRINT

=========================================

This is the exact, practical workflow you and your mother-in-law can run today—no verification, no API—while still looking enterprise-grade.

⸻

I. WhatsApp Business Core Setup (One-Time)

1. Business Profile

Set:
	•	Business name: Tres Raíces Carnicería
	•	Description:
“Cortes premium de res, cerdo y cordero. Servicio a domicilio y pedidos del día. Calidad de rancho, frescura garantizada.”
	•	Hours
	•	Address
	•	Website: (use Netlify placeholder for now)
	•	Email: ventas@tresraicesboutique.com

⸻

II. WhatsApp Catalog Setup (One-Time, Updating Weekly)

Use your AI-generated images.

Recommended Category Structure:
	•	Res – Premium
	•	Res – Estándar
	•	Cordero
	•	Cerdo
	•	Embutidos
	•	Quesos
	•	Cortes Exóticos
	•	Paquetes Semanales

For every item:
	•	Name: Cordero – Chuleta (1 kg)
	•	Description: tenderness, ideal cooking method
	•	Price
	•	Image in consistent Tres Raíces style

⸻

III. Business Messages (Automated)

Greeting Message

Triggers when someone messages you for the first time:

¡Bienvenido a Tres Raíces Carnicería! 🐂🔥
¿Qué corte te gustaría hoy? Tenemos ribeye, arrachera, cordero fresco, cerdo y cortes exóticos.
Si quieres ver el menú completo, escribe: menu.

⸻

Away Message

Triggers off-hours:

Gracias por escribirnos 🙏
Estamos fuera de horario pero mañana temprano te respondemos.
Puedes enviarnos tu pedido y lo apartamos en cuanto estemos activos.

⸻

IV. Quick Replies (Your Internal Tools)

These are your “operational shortcuts.”

Shortcut	Purpose
/menu	Sends full product catalog
/envio	Delivery info
/pago	Payment instructions
/promo	Weekly special
/horario	Hours
/saludo	Standard greeting
/direccion	Pickup location
/status	Order status message


⸻

Examples:

/pago

Aceptamos transferencia, efectivo y Mercado Pago.
Envíanos comprobante para apartar tu pedido.

/envio

Cobertura en Guadalajara.
Entregas el mismo día según disponibilidad del corte.

⸻

V. Label System (Customer Pipeline CRM)

Use labels to track customers:

Lead Pipeline:
	•	🟦 Nuevo Cliente
	•	🟩 Catálogo Enviado
	•	🟨 Cotización Enviada
	•	🟧 Pendiente de Pago
	•	🟪 Pagado — Preparando Pedido
	•	🟫 Listo para Entrega
	•	🟥 Recurrente

This is your manual CRM.

⸻

VI. Order Flow (Daily Use)

Step 1 — Customer asks for a cut

Reply with greeting or quick reply and a catalog link.

⸻

Step 2 — Customer selects cuts

Send an order confirmation:

Pedido tentativo:
	•	Ribeye Prime – 1 kg
	•	Cordero Chuleta – 1 kg
Total aproximado: $____

¿Deseas entrega o recoger?

⸻

Step 3 — Payment instructions

Use /pago

⸻

Step 4 — After payment

Pago recibido 🙌🔥
Estamos preparando tu pedido. Te avisamos cuando esté listo.

Set label → Pagado — Preparando Pedido

⸻

Step 5 — Completion

Tu pedido está listo. Gracias por elegir Tres Raíces Carnicería. ¡Buen provecho! 🔥🥩

Set label → Listo para Entrega

⸻

VII. Weekly Promo Process (Without Templates)

Because you aren’t verified, you cannot send unsolicited messages.

Instead:

Step 1 — Post the promo to Status + Instagram

Step 2 — Say:

“Escríbenos hola para ver la promo de esta semana.”

Anyone who replies opens the 24-hour window.
Then you send promo manually.

⸻

=========================================

PART 2 — COPILOT PROMPT SUITE

=========================================

Use this in your /docs, /scripts, or /operations folder in your repo to let Copilot auto-generate the documentation, templates, JSON files, message scripts, and workflows.

⸻

————————————————

Prompt 1: Generate WhatsApp Business Setup Docs

————————————————

Prompt for Copilot:

Create a new documentation file:
docs/whatsapp/setup.md

Include a complete WhatsApp Business setup guide for Tres Raíces Carnicería, covering:
– Business profile setup
– Catalog structure with category names
– Standard product format (name, description, price, photo style)
– Greeting message
– Away message
– Quick replies list and their content
– Label-based CRM pipeline
– Recommended weekly maintenance tasks

Make it clean, structured, and easy for a non-technical team member to follow.

⸻

————————————————

Prompt 2: Generate Quick-Replies JSON File

————————————————

Prompt for Copilot:

Create a JSON file called whatsapp/quick-replies.json containing all quick replies for Tres Raíces Carnicería.

Keys should be the shortcut names (”/menu”, “/pago”, etc.) and the values should be the Spanish text.

The responses must be warm, concise, professional, and aligned with premium butcher shop brand tone.

⸻

————————————————

Prompt 3: Generate the Order Flow Message Templates

————————————————

Prompt for Copilot:

Create a Markdown file:
whatsapp/order-flow.md

Include templated message scripts for:
– New customer greeting
– Catalog sending
– Order confirmation
– Payment instructions
– Payment received + preparing order
– Order ready for pickup/delivery
– Re-engagement message (within 24h window)

Use variables like {{customer_name}}, {{items}}, {{total}}, {{payment_method}} for future automation.
Keep tone warm and premium.

⸻

————————————————

Prompt 4: Generate Label Definitions & Usage Guide

————————————————

Prompt for Copilot:

Create a file:
whatsapp/labels.md

Define each WhatsApp label, what it means, when to apply it, and how it moves a customer through the sales pipeline.

Include a visual flow chart showing the stages:
Nuevo Cliente → Catálogo Enviado → Cotización Enviada → Pendiente de Pago → Pagado — Preparando → Listo para Entrega → Recurrente.

⸻

————————————————

Prompt 5: Generate Promotional Workflow

————————————————

Prompt for Copilot:

Create a file:
whatsapp/promotions.md

Document the process for running weekly promotions without WhatsApp verification:
– Creating promo image
– Posting to WhatsApp Status
– Posting to Instagram
– Trigger phrase to open 24h window
– Manual promo reply templates
– How to track promo leads via labels

Include Spanish versions of all messages and steps.

⸻

————————————————

Prompt 6: Create Sales Team SOP (Standard Operating Procedure)

————————————————

Prompt for Copilot:

Create a file:
operations/sales-team-sop.md

Describe a step-by-step process your mother-in-law and future sales staff will follow when interacting with customers via WhatsApp:
– Initial response
– Sending catalog
– Confirming order
– Requesting payment
– Updating WhatsApp labels
– Communicating preparation and readiness
– Closing each sale
– How to handle frequent questions

Use simple language and include scripts.

⸻

————————————————

Prompt 7: Generate Future API Upgrade Plan

————————————————

Prompt for Copilot:

Create a file:
whatsapp/future-upgrade-plan.md

Outline how Tres Raíces Carnicería can evolve from the current manual WhatsApp Business setup into full automation once the business is legally registered and WhatsApp verification is obtained.

Include:
– API integration
– Automated order confirmations
– Delivery updates
– Customer segmentation
– Multi-agent routing
– Connecting WhatsApp to POS
– Marketing automation
– Template messages

Present as a staged roadmap: “Phase 1 → Phase 2 → Phase 3”.

⸻

=========================================

PART 3 — OPTIONAL: Copilot Multi-File Generator Prompt

=========================================

If you want Copilot to generate every file in one shot:

“Copilot, create a whatsapp/ directory and generate all operational documentation files for the Tres Raíces Carnicería WhatsApp Business system. Include:
– setup.md
– quick-replies.json
– order-flow.md
– labels.md
– promotions.md
– future-upgrade-plan.md
Additionally, create operations/sales-team-sop.md.

Populate each file with the structured content described in our master plan.
Use warm but professional Spanish language for all customer-facing messages.
Ensure every asset is reusable and future-proof.”

⸻

If you want, I can also create:
	•	A zipped starter folder with all these files already written
	•	A Copilot “meta-prompt” that you can pin to your repo so any future edits follow your brand
	•	A more advanced version that integrates with Notion or GitHub Pages

Just tell me how far you want to take it.