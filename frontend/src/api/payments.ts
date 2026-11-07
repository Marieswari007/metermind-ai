import { api } from './client';
import { CapturePaymentResponse, CreateOrderResponse } from '../types';
import { updateMockInvoiceStatus } from './invoices';

export async function createPaymentOrder(invoiceId: string): Promise<CreateOrderResponse> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    const mockOrderId = 'PAYID-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    return {
      order_id: mockOrderId,
      approval_url: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`,
      status: 'CREATED',
    };
  }

  return api.request<CreateOrderResponse>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function capturePayment(orderId: string, invoiceId?: string): Promise<CapturePaymentResponse> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 800));
    if (invoiceId) {
      updateMockInvoiceStatus(invoiceId, 'paid', orderId);
    }
    return {
      status: 'COMPLETED',
      payment_id: 'PAYMENT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      order_id: orderId,
      message: 'Payment captured successfully via PayPal Sandbox.',
      captured_at: new Date().toISOString(),
    };
  }

  return api.request<CapturePaymentResponse>('/payments/capture', {
    method: 'POST',
    body: JSON.stringify({ order_id: orderId, invoice_id: invoiceId }),
    headers: { 'Content-Type': 'application/json' },
  });
}
