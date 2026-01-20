// Mock payments service (Stripe placeholder)
export interface PaymentIntentRequest {
  amount: number; // in smallest currency unit (e.g. cents)
  currency: string;
  donorEmail?: string;
  projectId?: string;
  recurring?: boolean;
  method?: 'card' | 'bank' | 'mobile_money';
}

export interface PaymentResult {
  id: string;
  status: 'succeeded' | 'pending' | 'failed';
  amount: number;
  currency: string;
  createdAt: string;
  provider: 'stripe';
  raw?: any;
}

export async function processDonation(req: PaymentIntentRequest): Promise<PaymentResult> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 600));
  // Simple validation
  if (req.amount <= 0) throw new Error('Invalid amount');
  return {
    id: 'pm_' + Math.random().toString(36).slice(2),
    status: 'succeeded',
    amount: req.amount,
    currency: req.currency,
    createdAt: new Date().toISOString(),
    provider: 'stripe'
  };
}
