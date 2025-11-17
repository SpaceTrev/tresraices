// WhatsApp Cloud API helper functions

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_API_TOKEN;

  // If no API credentials, log and return success (development mode)
  if (!phoneNumberId || !token) {
    console.log('[WhatsApp Dev Mode] Would send to', to, ':', message);
    return { success: true };
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            body: message
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[WhatsApp API Error]:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('[WhatsApp Send Error]:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  // TODO: Implement signature verification when we have app secret
  // For now, just check if signature exists in production
  if (process.env.NODE_ENV === 'production' && !signature) {
    return false;
  }
  return true;
}
