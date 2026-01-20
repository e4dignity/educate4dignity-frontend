// Mock notifications service (email / sms / whatsapp / push)
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';

export interface SendNotificationInput {
  title: string;
  message: string;
  recipients: string[]; // user ids or emails
  channel: NotificationChannel[];
  metadata?: Record<string, any>;
}

export interface SendNotificationResult {
  id: string;
  sentAt: string;
  status: 'queued' | 'sent';
  channel: NotificationChannel[];
  failures?: { recipient: string; reason: string }[];
}

export async function sendNotification(input: SendNotificationInput): Promise<SendNotificationResult> {
  await new Promise(r => setTimeout(r, 300));
  return {
    id: 'ntf_' + Math.random().toString(36).slice(2),
    sentAt: new Date().toISOString(),
    status: 'sent',
    channel: input.channel
  };
}
