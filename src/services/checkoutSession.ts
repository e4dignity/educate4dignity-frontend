// Service to create a Stripe Checkout Session
// Uses public donations endpoint: POST /api/donations/checkout-session
// Response is expected to include { url } for redirect-based checkout.
// Adjust the base URL with VITE_API_URL if your backend runs elsewhere.

export interface CreateCheckoutSessionParams {
  amountCents: number;
  currency: string;
  donationType: 'one-time' | 'recurring';
  projectId: string;
  donor: {
    firstName: string;
    lastName: string;
    email: string;
    anonymous?: boolean;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface CheckoutSessionResponse {
  id?: string; // Optional Checkout Session ID
  url?: string; // Direct URL for redirect-based Stripe Checkout (preferred)
  clientSecret?: string; // For embedded/components flow (not used in this app)
  error?: string;
}

import { API_BASE_URL } from '../config';

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  try {
    // Normalize base so we never produce /api/api/... if API_BASE_URL already contains a trailing /api
    const configured = (API_BASE_URL || '').replace(/\/$/, '');
    const root = configured.replace(/\/api$/i, '');
    const url = `${root}/api/donations/checkout-session`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      return { error: `HTTP ${res.status}` };
    }
    return res.json();
  } catch (e: any) {
    return { error: e.message };
  }
}
