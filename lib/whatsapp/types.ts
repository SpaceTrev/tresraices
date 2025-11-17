import { Timestamp } from 'firebase-admin/firestore';

export type Region = 'guadalajara' | 'colima';
export type RegionDetectionMethod = 'area_code' | 'manual';

export interface Conversation {
  phoneNumber: string;           // E.164 format: "523312345678"
  region: Region | null;
  regionDetectionMethod: RegionDetectionMethod | null;
  lastMessageAt: Timestamp;
  needsHumanResponse: boolean;   // Flag for admin dashboard
  createdAt: Timestamp;
  sessionData: {
    lastQuickReply?: string;     // Track button clicked
    messageCount: number;         // Engagement metric
    lastMessageText?: string;     // For context
  };
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'interactive' | 'button';
  text?: {
    body: string;
  };
  interactive?: {
    type: string;
    button_reply?: {
      id: string;
      title: string;
    };
  };
}

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WhatsAppMessage[];
      };
      field: string;
    }>;
  }>;
}
