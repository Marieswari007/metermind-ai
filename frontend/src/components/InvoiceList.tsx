import React from 'react';
import { Invoice } from '../types';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Plus, 
  RefreshCw,
  FileText
} from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
  unbilledUsageCount: number;
  onGenerateInvoice: () => void;
  onPayInvoice: (invoice: Invoice) => void;
  onRefresh: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  isLoading,
  unbilledUsageCount,
  onGenerateInvoice,
  onPayInvoice,
  onRefresh,
}) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            Generated Invoices & Settlements
          </h3>
          <p className="text-xs text-slate-400">
            Atomic invoice transitions with PayPal REST payment processing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh Invoices"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onGenerateInvoice}
            disabled={isLoading || unbilledUsageCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all ${
              unbilledUsageCount > 0
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-surface-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
            title={unbilledUsageCount === 0 ? 'No unbilled requests available to invoice' : 'Generate invoice now'}
          >
            <Plus className="w-4 h-4" />
            Generate New Invoice ({unbilledUsageCount} unbilled)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Invoice ID</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4 text-right">Requests</th>
              <th className="py-3.5 px-4 text-right">Tokens</th>
              <th className="py-3.5 px-4 text-right">Amount (USD)</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Settlement Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="font-medium text-slate-400">No invoices generated yet</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track AI usage first, then click "Generate New Invoice" to settle unbilled requests.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const id = inv.id || inv._id || inv.invoice_id || 'INV-UNKNOWN';
                const isPaid = inv.status === 'paid';

                return (
                  <tr key={id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(inv.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {formatNumber(inv.total_requests)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      {formatNumber(inv.total_tokens)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isPaid ? (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Settled via PayPal
                        </span>
                      ) : (
                        <button
                          onClick={() => onPayInvoice(inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0070BA] hover:bg-[#005ea6] text-white font-semibold text-xs transition shadow-md shadow-blue-500/20"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay with PayPal
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
