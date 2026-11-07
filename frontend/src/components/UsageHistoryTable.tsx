import React, { useState } from 'react';
import { UsageRecord } from '../types';
import { formatDate, formatNumber, truncateKey } from '../utils/formatters';
import { Filter, RefreshCw, CheckCircle, Clock, Copy, Hash } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface UsageHistoryTableProps {
  records: UsageRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const UsageHistoryTable: React.FC<UsageHistoryTableProps> = ({
  records,
  isLoading,
  onRefresh,
}) => {
  const toast = useToast();
  const [filterModel, setFilterModel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const matchesModel = filterModel === 'all' || r.service_name.toLowerCase().includes(filterModel.toLowerCase());
      const matchesSearch = 
        r.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.idempotency_key && r.idempotency_key.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.invoice_id && r.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesModel && matchesSearch;
    });
  }, [records, filterModel, searchTerm]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info(`Copied ${label} to clipboard`);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-base">Historical Usage Ingestion Feed</h4>
          <p className="text-xs text-slate-400">Sorted newest first with idempotency tracking</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search key or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Models</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
            <option value="llama">Llama</option>
          </select>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh historical feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">AI Model</th>
              <th className="py-3 px-4 text-right">Requests</th>
              <th className="py-3 px-4 text-right">Input Tokens</th>
              <th className="py-3 px-4 text-right">Output Tokens</th>
              <th className="py-3 px-4 text-right">Total Tokens</th>
              <th className="py-3 px-4">Idempotency Key</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  {isLoading ? 'Loading usage logs...' : 'No usage records found. Simulate some requests above!'}
                </td>
              </tr>
            ) : (
              filteredRecords.map((r, i) => {
                const totalTokens = r.total_tokens || (r.input_tokens + r.output_tokens);
                const isBilled = r.status === 'billed' || !!r.invoice_id;

                return (
                  <tr key={r.id || r._id || i} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(r.timestamp || r.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {r.service_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-200">
                      {formatNumber(r.request_count)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {formatNumber(r.input_tokens)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {formatNumber(r.output_tokens)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      {formatNumber(totalTokens)}
                    </td>
                    <td className="py-3 px-4">
                      {r.idempotency_key ? (
                        <div 
                          onClick={() => copyToClipboard(r.idempotency_key!, 'idempotency key')}
                          className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 group"
                        >
                          <Hash className="w-3 h-3 text-cyan-400" />
                          <span className="font-mono text-[11px]">{truncateKey(r.idempotency_key, 14)}</span>
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isBilled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          <CheckCircle className="w-3 h-3 text-slate-400" />
                          Billed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Clock className="w-3 h-3 animate-spin" />
                          Unbilled
                        </span>
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
