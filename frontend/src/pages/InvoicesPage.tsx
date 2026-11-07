import React from 'react';
import { InvoiceList } from '../components/InvoiceList';
import { Invoice } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Receipt, CheckCircle2, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface InvoicesPageProps {
  invoices: Invoice[];
  isLoading: boolean;
  unbilledCount: number;
  unbilledAmount: number | string;
  onGenerateInvoice: () => void;
  onPayInvoice: (invoice: Invoice) => void;
  onRefresh: () => void;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({
  invoices,
  isLoading,
  unbilledCount,
  unbilledAmount,
  onGenerateInvoice,
  onPayInvoice,
  onRefresh,
}) => {
  const pendingInvoices = invoices.filter((i) => i.status === 'pending');
  const paidInvoices = invoices.filter((i) => i.status === 'paid');

  const totalPaidAmount = paidInvoices.reduce((acc, i) => acc + (typeof i.amount === 'string' ? parseFloat(i.amount) : i.amount), 0);
  const totalPendingAmount = pendingInvoices.reduce((acc, i) => acc + (typeof i.amount === 'string' ? parseFloat(i.amount) : i.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Invoices & PayPal Settlements</h2>
        <p className="text-sm text-slate-400 mt-1">
          Generate invoices from unbilled AI usage and process live payments via PayPal REST API.
        </p>
      </div>

      {/* Mini summary badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Unbilled Accrual</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {formatCurrency(unbilledAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{unbilledCount} unbilled requests ready</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span>Pending Invoices</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {formatCurrency(totalPendingAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{pendingInvoices.length} invoice(s) awaiting payment</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Total Settled via PayPal</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(totalPaidAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{paidInvoices.length} settled invoice(s)</p>
        </div>
      </div>

      {/* Invoice list */}
      <InvoiceList
        invoices={invoices}
        isLoading={isLoading}
        unbilledUsageCount={unbilledCount}
        onGenerateInvoice={onGenerateInvoice}
        onPayInvoice={onPayInvoice}
        onRefresh={onRefresh}
      />
    </div>
  );
};
