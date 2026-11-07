import { api } from './client';
import { Invoice } from '../types';
import { MOCK_INVOICES } from '../utils/mockData';

let localMockInvoices: Invoice[] = [...MOCK_INVOICES];

export async function generateInvoice(): Promise<Invoice> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    const newInvoice: Invoice = {
      id: 'inv_' + Date.now().toString(36),
      user_id: 'usr_demo_8839210',
      amount: 23.50,
      total_requests: 2350,
      total_tokens: 4205100,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    localMockInvoices = [newInvoice, ...localMockInvoices];
    return newInvoice;
  }

  return api.request<Invoice>('/invoices/generate', {
    method: 'POST',
  });
}

export async function getInvoices(): Promise<Invoice[]> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return [...localMockInvoices];
  }
  return api.request<Invoice[]>('/invoices');
}

export function updateMockInvoiceStatus(invoiceId: string, status: 'pending' | 'paid', paypalOrderId?: string) {
  localMockInvoices = localMockInvoices.map((inv) =>
    (inv.id === invoiceId || inv._id === invoiceId || inv.invoice_id === invoiceId)
      ? { ...inv, status, paid_at: status === 'paid' ? new Date().toISOString() : undefined, paypal_order_id: paypalOrderId }
      : inv
  );
}
