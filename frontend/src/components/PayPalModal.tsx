import React, { useState, useEffect } from 'react';
import { Invoice } from '../types';
import { createPaymentOrder, capturePayment } from '../api/payments';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  CreditCard,
  Lock,
  ArrowRight
} from 'lucide-react';

interface PayPalModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string) => void;
}

export const PayPalModal: React.FC<PayPalModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const toast = useToast();
  const [step, setStep] = useState<'create' | 'review' | 'success'>('create');
  const [orderId, setOrderId] = useState<string>('');
  const [approvalUrl, setApprovalUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const invoiceId = invoice?.id || invoice?._id || invoice?.invoice_id || '';

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && invoice) {
      setStep('create');
      setOrderId('');
      setApprovalUrl('');
      setPaymentResult(null);
      handleCreateOrder();
    }
  }, [isOpen, invoice]);

  if (!isOpen || !invoice) return null;

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const res = await createPaymentOrder(invoiceId);
      setOrderId(res.order_id);
      setApprovalUrl(res.approval_url || '');
      setStep('review');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create PayPal order');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await capturePayment(orderId, invoiceId);
      setPaymentResult(res);
      setStep('success');

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0070BA', '#009cde', '#22c55e', '#ffc439']
        });
      } catch {
        // ignore if confetti throws
      }

      toast.success('PayPal payment captured successfully!');
      onPaymentSuccess(invoiceId);
    } catch (err: any) {
      toast.error(err.message || 'Payment capture failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header with PayPal branding */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-5 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070BA] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-extrabold text-white text-lg italic tracking-tighter">P</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                PayPal Checkout
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                  Sandbox v2
                </span>
              </h3>
              <p className="text-xs text-slate-300">MeterMind AI Usage-Based Settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'create' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
              <p className="font-semibold text-white">Initializing PayPal REST Order...</p>
              <p className="text-xs text-slate-400 mt-1">Generating order token and locking invoice rate</p>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-5">
              {/* Invoice Summary Card */}
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Invoice Reference</span>
                  <span className="font-mono text-xs text-slate-200">{invoiceId}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Requests</span>
                    <span className="font-mono text-white font-medium">{formatNumber(invoice.total_requests)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Tokens</span>
                    <span className="font-mono text-white font-medium">{formatNumber(invoice.total_tokens)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-semibold text-white">Amount Due</span>
                  <span className="font-mono text-2xl font-extrabold text-emerald-400">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
              </div>

              {/* Order ID Banner */}
              <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-400">PayPal Order ID:</span>
                <span className="font-mono text-blue-300 font-semibold">{orderId}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {approvalUrl && (
                  <a
                    href={approvalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f4bb30] text-slate-950 font-bold text-sm shadow-lg transition"
                  >
                    <span>Proceed to PayPal Sandbox</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Capture & Complete Payment (POST /payments/capture)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Idempotent capture prevents double billing. Verified via PayPal REST v2.</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Payment Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">Invoice #{invoiceId} has been settled via PayPal.</p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{paymentResult?.status || 'COMPLETED'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PayPal Order ID:</span>
                  <span className="font-mono text-slate-200">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Captured At:</span>
                  <span className="text-slate-200">{formatDate(paymentResult?.captured_at || new Date().toISOString())}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-semibold">
                  <span className="text-white">Amount Paid:</span>
                  <span className="text-emerald-400 font-mono text-sm">{formatCurrency(invoice.amount)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
              >
                Close Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
