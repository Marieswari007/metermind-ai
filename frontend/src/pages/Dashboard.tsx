import React from 'react';
import { BillingSummary, Invoice, UsageRecord } from '../types';
import { MetricCard } from '../components/MetricCard';
import { UsageChart } from '../components/UsageChart';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { 
  Zap, 
  Cpu, 
  Receipt, 
  CreditCard, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Coins,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  summary: BillingSummary | null;
  records: UsageRecord[];
  invoices: Invoice[];
  onNavigateTab: (tab: string) => void;
  onGenerateInvoice: () => void;
  onPayInvoice: (invoice: Invoice) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  records,
  invoices,
  onNavigateTab,
  onGenerateInvoice,
  onPayInvoice,
}) => {
  const pendingInvoices = invoices.filter((i) => i.status === 'pending');
  const paidInvoices = invoices.filter((i) => i.status === 'paid');

  const unbilledRequests = summary?.unbilled_usage ?? 0;
  const currentBillAmount = summary?.current_bill ?? 0;
  const totalRequests = summary?.total_requests ?? records.reduce((acc, r) => acc + (r.request_count || 0), 0);
  const totalTokens = summary?.total_tokens ?? records.reduce((acc, r) => acc + (r.total_tokens || r.input_tokens + r.output_tokens || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Live Usage-Based Metering Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Billing Control Center
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Continuously ingest LLM usage logs, aggregate unbilled requests, generate certified invoices, and reconcile payment orders seamlessly with PayPal REST API.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('usage')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
            >
              <Cpu className="w-4 h-4" />
              Ingest & Simulate Usage
            </button>
            <button
              onClick={onGenerateInvoice}
              disabled={unbilledRequests === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                unbilledRequests > 0
                  ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:bg-slate-800'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Generate Invoice ({unbilledRequests} unbilled)
            </button>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Current Accrued Bill"
          value={formatCurrency(currentBillAmount)}
          subtitle="Formula: (Requests / 100) * $1.00"
          icon={Coins}
          iconColor="text-emerald-400"
          glowColor="rgba(34, 197, 94, 0.2)"
          badge={{ text: `${unbilledRequests} Unbilled Requests`, variant: 'emerald' }}
          onClick={() => onNavigateTab('invoices')}
        />

        <MetricCard
          title="Unbilled Requests"
          value={formatNumber(unbilledRequests)}
          subtitle="Ready for next invoice batch"
          icon={Clock}
          iconColor="text-amber-400"
          glowColor="rgba(245, 158, 11, 0.15)"
          badge={{ text: 'Pending Invoicing', variant: 'amber' }}
          onClick={() => onNavigateTab('usage')}
        />

        <MetricCard
          title="Total Lifetime Requests"
          value={formatNumber(totalRequests)}
          subtitle="All ingested AI provider calls"
          icon={Zap}
          iconColor="text-cyan-400"
          glowColor="rgba(6, 182, 212, 0.15)"
          badge={{ text: 'All Services', variant: 'blue' }}
        />

        <MetricCard
          title="Total Tokens Ingested"
          value={formatNumber(totalTokens)}
          subtitle="Input + output token sum"
          icon={Cpu}
          iconColor="text-purple-400"
          glowColor="rgba(168, 85, 247, 0.15)"
          badge={{ text: 'LLM Token Vol.', variant: 'purple' }}
        />
      </div>

      {/* Action alerts: Pending Invoices needing payment */}
      {pendingInvoices.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                You have {pendingInvoices.length} pending invoice{pendingInvoices.length > 1 ? 's' : ''} awaiting PayPal settlement
              </p>
              <p className="text-xs text-slate-400">
                Latest: #{pendingInvoices[0].id || pendingInvoices[0].invoice_id} for {formatCurrency(pendingInvoices[0].amount)}
              </p>
            </div>
          </div>
          <button
            onClick={() => onPayInvoice(pendingInvoices[0])}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition whitespace-nowrap"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Settle with PayPal Now
          </button>
        </div>
      )}

      {/* Chart Section */}
      <UsageChart records={records} />

      {/* Bottom Grid: Quick Insights & Billing Engine Math */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Engine Breakdown */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Receipt className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Billing Engine Architecture</h4>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
              app/billing.py
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <p>
              MeterMind uses standard Python <code className="text-emerald-400 font-mono">decimal.Decimal</code> with <code className="text-emerald-400 font-mono">ROUND_HALF_UP</code> to 2 decimal places to prevent floating point inaccuracies.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300">
              Bill = (total_requests / 100) * 1.00 USD
            </div>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Configurable <code className="text-slate-300">PRICING_CONFIG</code> supporting future tiered token pricing</li>
              <li>Atomic transition of records from <code className="text-slate-300">"unbilled"</code> to <code className="text-slate-300">"billed"</code></li>
              <li>Database-isolated pricing preventing client-side invoice tampering</li>
            </ul>
          </div>
        </div>

        {/* Security & PayPal Settlement */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">PayPal REST API v2 Integration</h4>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
              app/paypal.py
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <p>
              MeterMind handles server-to-server OAuth2 authentication with PayPal sandbox endpoints:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Create Order:</span>
                <span className="text-emerald-400">POST /payments/create-order</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Capture Payment:</span>
                <span className="text-cyan-400">POST /payments/capture</span>
              </div>
            </div>
            <p className="text-slate-400">
              Payments are indexed with a unique constraint on <code className="text-slate-300">paypal_order_id</code>, guaranteeing total idempotency against double captures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
