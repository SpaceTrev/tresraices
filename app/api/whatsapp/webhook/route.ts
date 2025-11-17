import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { detectRegionFromPhone } from '@/lib/whatsapp/region-detector';
import { sendWhatsAppMessage } from '@/lib/whatsapp/api';
import { 
  FALLBACK_MESSAGES, 
  FAQ_RESPONSES, 
  getNextAvailableTime, 
  isBusinessHours 
} from '@/lib/whatsapp/messages';
import type { 
  Conversation, 
  WhatsAppWebhookBody, 
  WhatsAppMessage 
} from '@/lib/whatsapp/types';

// GET: Webhook verification (Meta setup)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  console.log('[Webhook Verify] Mode:', mode, 'Token match:', token === process.env.WHATSAPP_VERIFY_TOKEN);
  
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[Webhook Verify] ✅ Success');
    return new NextResponse(challenge, { status: 200 });
  }
  
  console.log('[Webhook Verify] ❌ Failed');
  return NextResponse.json({ error: 'Invalid verification' }, { status: 403 });
}

// POST: Handle incoming messages
export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppWebhookBody = await request.json();
    
    console.log('[Webhook] Received:', JSON.stringify(body, null, 2));
    
    // Extract message data
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    
    if (!messages || messages.length === 0) {
      console.log('[Webhook] No messages in payload');
      return NextResponse.json({ status: 'no_messages' });
    }
    
    const message: WhatsAppMessage = messages[0];
    const from = message.from;
    const messageText = message.text?.body || '';
    const messageId = message.id;
    const buttonReply = message.interactive?.button_reply?.title;
    
    console.log('[Webhook] From:', from, 'Text:', messageText, 'Button:', buttonReply);
    
    // Get or create conversation
    const db = getDb();
    const conversationRef = db.collection('conversations').doc(from);
    const conversationSnap = await conversationRef.get();
    
    let conversation: Conversation;
    
    if (!conversationSnap.exists) {
      console.log('[Webhook] New customer:', from);
      
      // New customer - detect region
      const { region, method } = detectRegionFromPhone(from);
      
      conversation = {
        phoneNumber: from,
        region,
        regionDetectionMethod: method,
        lastMessageAt: Timestamp.now(),
        needsHumanResponse: false,
        createdAt: Timestamp.now(),
        sessionData: {
          messageCount: 1,
          lastMessageText: messageText
        }
      };
      
      await conversationRef.set(conversation);
      
      // Send welcome message
      await sendWhatsAppMessage(from, FALLBACK_MESSAGES.welcome);
      
      console.log('[Webhook] ✅ Welcome sent, region:', region || 'unknown');
      return NextResponse.json({ status: 'welcome_sent' });
    }
    
    conversation = conversationSnap.data() as Conversation;
    
    // Update message count and last message
    await conversationRef.update({
      'sessionData.messageCount': (conversation.sessionData.messageCount || 0) + 1,
      'sessionData.lastMessageText': messageText,
      lastMessageAt: Timestamp.now()
    });
    
    // Handle button replies
    if (buttonReply) {
      console.log('[Webhook] Handling button:', buttonReply);
      await handleButtonReply(from, buttonReply, conversation);
      return NextResponse.json({ status: 'button_handled' });
    }
    
    // Check business hours
    if (!isBusinessHours()) {
      const nextTime = getNextAvailableTime(new Date());
      await sendWhatsAppMessage(from, FALLBACK_MESSAGES.awayMessage(nextTime));
      console.log('[Webhook] ⏰ Away message sent');
      return NextResponse.json({ status: 'away_message' });
    }
    
    // Route message based on keywords
    const lowerText = messageText.toLowerCase();
    
    // FAQ keyword matching
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('peso')) {
      await sendWhatsAppMessage(from, FAQ_RESPONSES.pricing);
      console.log('[Webhook] 💰 Pricing FAQ sent');
      return NextResponse.json({ status: 'faq_pricing' });
    }
    
    if (lowerText.includes('menu') || lowerText.includes('menú') || lowerText.includes('catalogo') || lowerText.includes('catálogo') || lowerText.includes('productos')) {
      await sendWhatsAppMessage(from, FAQ_RESPONSES.menu(conversation.region));
      console.log('[Webhook] 🍖 Menu FAQ sent');
      return NextResponse.json({ status: 'faq_menu' });
    }
    
    if (lowerText.includes('envio') || lowerText.includes('envío') || lowerText.includes('entrega') || lowerText.includes('direccion') || lowerText.includes('dirección') || lowerText.includes('ubicacion') || lowerText.includes('ubicación')) {
      await sendWhatsAppMessage(from, FAQ_RESPONSES.delivery);
      console.log('[Webhook] 🚚 Delivery FAQ sent');
      return NextResponse.json({ status: 'faq_delivery' });
    }
    
    if (lowerText.includes('pedir') || lowerText.includes('orden') || lowerText.includes('comprar') || lowerText.includes('cómo')) {
      await sendWhatsAppMessage(from, FAQ_RESPONSES.howToOrder);
      console.log('[Webhook] 📋 How to Order FAQ sent');
      return NextResponse.json({ status: 'faq_how_to_order' });
    }
    
    // Detect order (from website cart or manual)
    // Website orders typically include "Hola, quiero realizar un pedido" or item lists
    if (
      lowerText.includes('pedido') || 
      lowerText.includes('quiero') && messageText.length > 50 ||
      lowerText.includes('artículos:') ||
      lowerText.includes('articulos:')
    ) {
      // Parse order details if possible
      await sendWhatsAppMessage(from, FALLBACK_MESSAGES.orderReceived('', '0.00'));
      
      // Set flag for human to confirm final price
      await conversationRef.update({ needsHumanResponse: true });
      
      console.log('[Webhook] 📦 Order detected, flagged for human');
      return NextResponse.json({ status: 'order_received' });
    }
    
    // No match - handoff to human
    await conversationRef.update({ needsHumanResponse: true });
    await sendWhatsAppMessage(from, FALLBACK_MESSAGES.humanHandoff);
    
    console.log('[Webhook] 👤 Handoff to human');
    return NextResponse.json({ status: 'handoff_to_human' });
    
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' }, 
      { status: 500 }
    );
  }
}

async function handleButtonReply(
  from: string, 
  buttonTitle: string, 
  conversation: Conversation
): Promise<void> {
  const db = getDb();
  const conversationRef = db.collection('conversations').doc(from);
  
  console.log('[Button Handler]:', buttonTitle);
  
  switch (buttonTitle) {
    case 'Guadalajara':
      await conversationRef.update({
        region: 'guadalajara',
        regionDetectionMethod: 'manual'
      });
      await sendWhatsAppMessage(from, FAQ_RESPONSES.menu('guadalajara'));
      break;
      
    case 'Colima':
      await conversationRef.update({
        region: 'colima',
        regionDetectionMethod: 'manual'
      });
      await sendWhatsAppMessage(from, FAQ_RESPONSES.menu('colima'));
      break;
      
    case '🛒 Ver Menú':
    case 'Ver Menú':
      await sendWhatsAppMessage(from, FAQ_RESPONSES.menu(conversation.region));
      break;
      
    case '📍 Ubicación':
    case 'Ubicación':
      await sendWhatsAppMessage(from, FAQ_RESPONSES.delivery);
      break;
      
    case '💬 Hablar':
    case 'Hablar':
      await conversationRef.update({ needsHumanResponse: true });
      await sendWhatsAppMessage(from, FALLBACK_MESSAGES.humanHandoff);
      break;
      
    case '📋 ¿Cómo Pedir?':
    case '¿Cómo Pedir?':
      await sendWhatsAppMessage(from, FAQ_RESPONSES.howToOrder);
      break;
      
    case '💰 Precios':
    case 'Precios':
      await sendWhatsAppMessage(from, FAQ_RESPONSES.pricing);
      break;
      
    case '🚚 Envíos':
    case 'Envíos':
      await sendWhatsAppMessage(from, FAQ_RESPONSES.delivery);
      break;
      
    case '✅ Todo Bien':
    case 'Todo Bien':
      await sendWhatsAppMessage(from, FALLBACK_MESSAGES.confirmOrder);
      break;
      
    case '✏️ Modificar':
    case 'Modificar':
    case '❌ Cancelar':
    case 'Cancelar':
      await conversationRef.update({ needsHumanResponse: true });
      await sendWhatsAppMessage(from, FALLBACK_MESSAGES.humanHandoff);
      break;
      
    default:
      console.log('[Button Handler] Unknown button:', buttonTitle);
  }
}
