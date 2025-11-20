# WhatsApp Business API Integration — Phase 1: Essential Automated Responses
# Tres Raíces Carnicería (Guadalajara/Colima)

## Project Context

**Stack:**
- Next.js 15 (App Router) deployed on Netlify
- Firebase Firestore + Auth (configured in `lib/firebaseAdmin.ts`)
- Existing cart → WhatsApp flow in `lib/cart/whatsapp.ts`
- Phone: `523315126548`

**Product Catalog:**
- 203 unique meat products across 15 categories (Avestruz, Búfalo, Cabrito, Cerdo, Ciervo rojo, Codorniz, Conejo, Cordero, Jabalí, Pato, Pavo, Pollo, Queso, Res, Ternera)
- Two regions: Guadalajara (+20% markup), Colima (+30% markup)
- Single supplier: "El Barranqueño"
- Variable weight pricing model: customers see estimates during ordering, receive final price after packing based on actual weight

**Current Flow:**
- Customer browses website menu → adds to cart → clicks WhatsApp button
- Pre-filled message generated with items, quantities, approximate weights, price estimates
- Family manually receives WhatsApp message, processes order, confirms final price, arranges pickup/delivery

**Business Team:**
- Small family operation: 3 people (wife, step-mom, owner)
- Need automated responses to reassure customers during non-business hours
- Manual handoff for complex requests is fine
- Security can be lean initially (TODO: production Firestore rules before scaling)

---

## Goal: Phase 1 Only — Minimal Viable Automation

Generate **production-ready Spanish message content** for immediate WhatsApp Business API deployment:

1. **Essential Message Templates** (for Meta approval) with simple text fallbacks
2. **Static Quick Replies** for common customer questions
3. **Basic Firestore schema** for conversation state + area code region detection
4. **Simple webhook handler** with auto-handoff to human for unmatched queries
5. **Meta Business Manager setup instructions**

**Future Phases (not in this prompt):**
- Phase 2: Dynamic Quick Replies based on conversation state
- Phase 3: Intelligent chatbot with intent detection for 15 product categories
- Phase 4: Rate limiting, duplicate message detection, advanced analytics

---

## 1. Essential Message Templates (Meta-Approved)

Generate production-ready Spanish copy for WhatsApp Business API message templates. Include:
- Template name (for Meta submission)
- Category (UTILITY, MARKETING, or AUTHENTICATION)
- Language: Spanish (es_MX)
- Template body with placeholders in `{{variable_name}}` format
- Simple text fallback version (for use during 1-3 day approval period)

### Required Templates:

#### 1.1 Welcome Message
**Trigger:** First message from new customer  
**Purpose:** Warm greeting, set expectations, explain GDL/Colima regions, mention business hours

**Variables needed:**
- `{{customer_name}}` (optional, use "Hola" if not provided)

**Content requirements:**
- Friendly, professional tone
- Mention both locations (Guadalajara y Colima)
- Note response time ("te respondemos pronto")
- Brief intro to specialty meats
- Invite to ask questions

---

#### 1.2 Order Received Acknowledgment
**Trigger:** Customer sends order (detected by webhook or manual send)  
**Purpose:** Confirm order received, explain weight/price confirmation process

**Variables needed:**
- `{{customer_name}}`
- `{{estimated_total}}`

**Content requirements:**
- Thank customer for order
- Explain: "El precio final depende del peso exacto al empacar"
- Mention estimated response time (e.g., "en las próximas 2 horas")
- Reassure about quality and freshness

---

#### 1.3 Pricing Explanation
**Trigger:** Customer asks about price variations or "¿por qué cambió el precio?"  
**Purpose:** Clearly explain variable weight pricing for meat products

**Variables:** None (static template)

**Content requirements:**
- Short, conversational explanation
- Example: "Hamburguesas vienen en paquete de 6, peso aproximado 900g, pero puede variar a 850g o 950g"
- Emphasize transparency: "Siempre te confirmamos el total antes de pagar"
- Friendly closing

---

#### 1.4 Away Message (Outside Business Hours)
**Trigger:** Message received outside operating hours  
**Purpose:** Set expectation for response time

**Variables needed:**
- `{{next_available_time}}` (e.g., "mañana a las 8:00 AM")

**Content requirements:**
- Polite acknowledgment
- Business hours (specify if different for GDL/Colima)
- When they'll receive response
- Option to browse menu online: `tresraices.com/menu/guadalajara` or `/colima`

---

#### 1.5 Order Ready (Final Price Confirmation)
**Trigger:** Manual send after packing order  
**Purpose:** Notify customer order is ready, provide actual total, pickup/delivery instructions

**Variables needed:**
- `{{customer_name}}`
- `{{actual_total}}`
- `{{pickup_or_delivery}}` (e.g., "para recoger en [dirección]" or "entrega programada para [hora]")

**Content requirements:**
- Congratulatory/excited tone ("¡Tu pedido está listo!")
- Show final total with breakdown if helpful
- Payment instructions (efectivo or transferencia)
- Pickup location or delivery ETA
- Contact for questions

---

#### 1.6 Handoff to Human
**Trigger:** Webhook can't match query to Quick Reply keywords  
**Purpose:** Let customer know a real person will respond soon

**Variables:** None

**Content requirements:**
- Acknowledge question received
- "Un momento, te atiende nuestro equipo"
- Estimated response time
- Thank for patience

---

### Template Fallback Strategy

For each template above, also provide a **simple text version** (no variables, no formatting) that can be sent immediately while waiting for Meta approval (1-3 business days).

**Example:**
- **Template (after approval):** "¡Hola {{customer_name}}! Gracias por tu pedido. Total estimado: {{estimated_total}}. Te confirmamos el precio final después de pesar los productos."
- **Fallback (during approval):** "¡Hola! Gracias por tu pedido. Te confirmamos el precio final después de pesar los productos. Te respondemos pronto."

---

## 2. Static Quick Replies (Phase 1)

Generate WhatsApp Quick Reply button sets for common customer scenarios. Each set has **max 3 buttons** (WhatsApp API limit), **max 20 characters per button**.

### Quick Reply Set 1: Initial Contact
**When to show:** Customer sends first message or generic greeting ("Hola", "Buenos días", etc.)

**Buttons:**
1. 🛒 Ver Menú
2. 📍 Ubicación  
3. 💬 Hablar con Persona

**Button Actions:**
- **Ver Menú** → Send message with links to `tresraices.com/menu/guadalajara` and `tresraices.com/menu/colima` (based on detected region, or both if unknown)
- **Ubicación** → Send location info response (see FAQ section below)
- **Hablar con Persona** → Trigger handoff to human (set `needsHumanResponse: true` in Firestore)

---

### Quick Reply Set 2: General Inquiry
**When to show:** Customer asks question not matching specific keywords

**Buttons:**
1. 📋 ¿Cómo Pedir?
2. 💰 Precios
3. 🚚 Envíos

**Button Actions:**
- **¿Cómo Pedir?** → Send "Como Pedir" FAQ response
- **Precios** → Send pricing explanation FAQ response  
- **Envíos** → Send delivery/pickup info FAQ response

---

### Quick Reply Set 3: Post-Order
**When to show:** After customer receives "Order Received" template

**Buttons:**
1. ✅ Todo Bien
2. ✏️ Modificar
3. ❌ Cancelar

**Button Actions:**
- **Todo Bien** → Send confirmation ("¡Perfecto! Te avisamos cuando esté listo.")
- **Modificar** → Trigger handoff to human with note "Cliente quiere modificar pedido"
- **Cancelar** → Trigger handoff to human with note "Cliente quiere cancelar pedido"

---

## 3. FAQ Responses (Spanish, Production-Ready)

Generate complete Spanish text responses for Static Quick Reply buttons. Keep responses **under 1000 characters** (WhatsApp best practice), friendly and conversational.

### FAQ 1: ¿Cómo Pedir? (How to Order)
**Purpose:** Explain ordering process step-by-step

**Include:**
- Browse menu online at website (link both regions)
- Add items to cart, submit via WhatsApp
- OR send message directly with product names/quantities
- We confirm price after weighing products
- Payment options: efectivo, transferencia (Mercado Pago próximamente)
- Pickup or delivery options

---

### FAQ 2: Precios (Pricing Explanation)
**Purpose:** Explain variable weight pricing in customer-friendly way

**Include:**
- Meat is sold by weight (kg) or piece (pieza)
- Prices shown online are estimates based on approximate weight
- Final price depends on actual weight after packing
- Example: "Paquete de hamburguesas aprox 900g puede pesar 850g o 950g"
- We always confirm total before payment
- Transparency commitment

---

### FAQ 3: Menú Online (Online Menu)
**Purpose:** Direct customer to website menu

**Include:**
- Link to Guadalajara menu: `tresraices.com/menu/guadalajara`
- Link to Colima menu: `tresraices.com/menu/colima`
- Brief note about specialty meats (avestruz, búfalo, ciervo, jabalí, pato, etc.)
- Encourage questions about any product

---

### FAQ 4: Envíos (Delivery & Pickup)
**Purpose:** Explain service areas, delivery options, pickup locations

**Include:**
- Pickup locations (addresses for Guadalajara and Colima)
- Delivery areas (if applicable, specify neighborhoods or "a consultar")
- Lead time for orders (e.g., "pedidos antes de 12pm listos mismo día")
- Minimum order for delivery (if applicable)
- Contact for special requests

---

## 4. Firestore Schema (Minimal for Phase 1)

### Collection: `conversations/{phoneNumber}`

**Purpose:** Track customer conversation state, detected region, handoff status

**Fields:**
```typescript
{
  phoneNumber: string;           // E.164 format: "523315126548"
  region: "guadalajara" | "colima" | null;  // Auto-detected or manually selected
  regionDetectionMethod: "area_code" | "manual" | null;
  lastMessageAt: Timestamp;
  needsHumanResponse: boolean;   // True when bot can't handle request
  createdAt: Timestamp;
  sessionData: {
    lastQuickReply?: string;     // Track which button they clicked
    messageCount?: number;        // Simple engagement metric
  }
}
```

**Indexes needed:**
- `phoneNumber` (primary key)
- `needsHumanResponse` + `lastMessageAt` (for admin dashboard query)

**Security Rules (TODO before production):**
- Admin-only write access (Firebase Auth)
- Phone number-based read restrictions
- Note: "Lean business, sophisticated rules can wait until scaling"

---

## 5. Area Code Region Detection (Strict Mode)

### Logic for Webhook Handler

**Input:** Incoming WhatsApp message with customer phone number

**Detection Rules:**
1. Parse phone number (expect E.164 format: `52` country code + area code + number)
2. Check area code prefix:
   - Starts with `5233` → Set `region: "guadalajara"`
   - Starts with `52312` → Set `region: "colima"`
   - No match → Set `region: null`
3. If `region: null`, send Quick Reply:
   - Message: "¡Hola! ¿Dónde te encuentras?"
   - Buttons: "Guadalajara" | "Colima"
4. Store selection in Firestore `conversations/{phoneNumber}.region`
5. Set `regionDetectionMethod: "area_code"` or `"manual"` accordingly

**Future enhancement (Phase 4):** Allow region switching if customer moves or wants to compare prices

---

## 6. Basic Webhook Handler (Next.js API Route)

### File: `/api/whatsapp/webhook/route.ts`

**Purpose:** Handle incoming WhatsApp messages, route to appropriate response

**Required Environment Variables:**
- `WHATSAPP_API_TOKEN` (Meta system user token)
- `WHATSAPP_VERIFY_TOKEN` (random string for webhook validation)
- `WHATSAPP_PHONE_NUMBER_ID` (from Meta Business Manager)

### Webhook Logic (Simplified for Phase 1):

1. **Verify Meta signature** (prevent unauthorized requests)
2. **Parse incoming message JSON** (extract phone number, message text, message type)
3. **Firestore lookup:**
   - Query `conversations/{phoneNumber}`
   - If not exists → Create new doc + run area code detection
   - If exists → Load conversation state
4. **Route message:**
   - If first message from customer → Send Welcome Template
   - If matches Quick Reply keyword (e.g., "¿Cómo Pedir?") → Send FAQ response
   - If detected as order (contains "pedido", product names, or came from website cart) → Send Order Received Template
   - Else → Set `needsHumanResponse: true` + Send Handoff Template
5. **Update Firestore:**
   - Increment `sessionData.messageCount`
   - Update `lastMessageAt`
   - Save any state changes
6. **Return WhatsApp-formatted response** (message text + optional Quick Reply buttons)

**Error Handling:**
- Log errors to console (phase 1 simplicity)
- Return generic "Lo sentimos, hubo un error. Te respondemos pronto." message
- Set `needsHumanResponse: true` for manual followup

**Deferred to Phase 2+:**
- Intent detection (product categories, custom requests)
- Duplicate message prevention
- Rate limiting per phone number
- Message history logging (separate collection)

---

## 7. Meta Business Manager Setup Instructions

### Step-by-Step Guide for Initial Configuration:

#### 7.1 Facebook Business Manager
1. Go to `business.facebook.com`
2. Create Business Account (if not exists)
3. **Business Verification:**
   - Upload business documents (RFC, comprobante de domicilio)
   - Wait 1-3 business days for approval
   - **Note:** Verification required for WhatsApp Business API access

#### 7.2 WhatsApp Business Account
1. In Business Manager → WhatsApp → "Get Started"
2. Create WhatsApp Business Account
3. **Phone Number Registration:**
   - Add `523315126548`
   - Choose "Use my own phone number" (not Meta-hosted)
   - Verify via SMS code
   - **Important:** This number will ONLY work with API (cannot use regular WhatsApp app simultaneously)

#### 7.3 Meta Developer App
1. Go to `developers.facebook.com`
2. Create new app → "Business" type
3. Add "WhatsApp" product
4. **Get Phone Number ID:**
   - WhatsApp → API Setup → Copy "Phone Number ID"
   - Save as `WHATSAPP_PHONE_NUMBER_ID` environment variable
5. **Generate System User Token:**
   - Business Settings → System Users → Add
   - Assign "WhatsApp" permissions
   - Generate token → Save as `WHATSAPP_API_TOKEN`
   - **Security:** Never commit to Git, use Netlify environment variables

#### 7.4 Webhook Configuration
1. In Meta Developer App → WhatsApp → Configuration
2. **Webhook URL:** `https://tresraices.com/api/whatsapp/webhook`
   - **Note:** Must be HTTPS, publicly accessible
   - Netlify automatically provides SSL
3. **Verify Token:**
   - Generate random string (e.g., `uuidgen` on Mac)
   - Save as `WHATSAPP_VERIFY_TOKEN` environment variable
   - Enter same value in Meta webhook config
4. **Subscribe to webhook fields:**
   - `messages` (incoming customer messages)
   - `message_status` (optional, for delivery/read receipts in Phase 2)
5. Click "Verify and Save"

#### 7.5 Message Template Submission
1. WhatsApp → Message Templates → Create Template
2. For each template from Section 1:
   - Enter template name (e.g., `welcome_message_v1`)
   - Select category (UTILITY for transactional, MARKETING for promotional)
   - Select language: Spanish (es_MX)
   - Enter body text with `{{variable_name}}` placeholders
   - Add header/footer if desired (optional for Phase 1)
   - Submit for review
3. **Approval Timeline:** 1-3 business days
4. **Fallback Strategy:** Use simple text messages (Section 1.6) until approved

#### 7.6 Testing
1. Send test message to `523315126548` from personal WhatsApp
2. Check webhook receives event (view Netlify function logs)
3. Verify Firestore `conversations` collection created
4. Confirm response received in WhatsApp
5. Test Quick Reply buttons

---

## 8. Admin Dashboard Integration (Basic)

### Additions to `/app/admin/page.tsx`

**Purpose:** View active conversations, take over from bot when needed

**Firebase Auth Gate:** 
- Any authenticated user can access (wife, step-mom, owner)
- No role granularity needed for Phase 1 (all family members have same permissions)

**UI Components to Add:**

#### 8.1 Active Conversations List
- Real-time Firestore listener: `onSnapshot(collection(db, "conversations").where("needsHumanResponse", "==", true).orderBy("lastMessageAt", "desc"))`
- Display cards showing:
  - Phone number (format for privacy: `+52 33 ****1234`)
  - Region badge (🏙️ GDL or 🌴 Colima)
  - Last message timestamp (relative: "hace 5 min")
  - Status indicator: 🤖 Bot | 👤 Human | ⏳ Waiting
- Click to expand → Show last 5 messages (from future `messageHistory` collection in Phase 2)

#### 8.2 "Take Over Conversation" Button
- Sets `conversations/{phoneNumber}.needsHumanResponse = false`
- Sends message to customer: "Un momento, te atiende [family member name]"
- **Future enhancement:** Track which family member took over

#### 8.3 Pending Orders Queue
- Query for conversations where last message contained order-like content
- Show "Send Receipt" quick action → Manually trigger "Order Ready" template
- **Note:** Full order tracking with `orders` collection deferred to Phase 2

---

## 9. Output Requirements

### For Customer-Facing Content:
- ✅ **Mexican Spanish only** (not Spain Spanish)
- ✅ Use informal "tú" (not formal "usted") — friendlier for family business
- ✅ Conversational, warm, professional tone
- ✅ Mobile-optimized (short paragraphs, emoji for visual breaks)
- ✅ Clear, avoids jargon
- ✅ Emphasizes quality, freshness, specialty meats
- ✅ Transparent about pricing/weight variability

### For Technical Specs:
- ✅ English (developer-facing)
- ✅ Code examples in TypeScript where applicable
- ✅ Firestore schema in proper type definitions
- ✅ Webhook logic as pseudo-code (not full implementation — that's a separate coding task)

### Format:
- Well-organized Markdown
- Clear section headings
- Production-ready copy (can be used immediately)
- Include Meta template submission format (name, category, variables)

---

## 10. What This Prompt Should NOT Include (Deferred to Future Phases)

❌ Product catalog descriptions (203 products) — No descriptions/images exist yet  
❌ Dynamic Quick Replies based on conversation state — Phase 4  
❌ Intelligent chatbot with category-specific responses (15 categories) — Phase 3  
❌ Intent detection beyond basic keyword matching — Phase 2  
❌ Rate limiting or duplicate message prevention — Phase 4  
❌ Order tracking system (`orders` collection, status updates) — Phase 2  
❌ Message history logging — Phase 2  
❌ Advanced analytics or conversation insights — Phase 4  
❌ Multi-language support — Only Spanish needed  
❌ Mercado Pago integration — "Próximamente" per existing site  
❌ Sophisticated Firebase Security Rules — TODO before production scaling

---

## Success Criteria

After implementing this Phase 1 prompt output, the business should have:

✅ Automated responses that make customers feel attended (not messaging a dead line)  
✅ Clear explanations of variable weight pricing to reduce confusion  
✅ Ability to browse menu online while waiting for human response  
✅ Automatic handoff to family members for complex requests  
✅ Area code-based region detection (no need to ask "GDL o Colima?" every time)  
✅ Simple admin view to see who needs human attention  
✅ Foundation for future chatbot expansion (schemas, webhook, Firestore setup)  

**Timeline Estimate:**
- Meta Business verification: 1-3 days
- Message template approval: 1-3 days
- Webhook development: 4-8 hours (using generated specs)
- Firestore setup: 1-2 hours
- Admin dashboard additions: 2-4 hours
- Testing: 1-2 hours

**Total: ~1-2 weeks from start to production deployment**
