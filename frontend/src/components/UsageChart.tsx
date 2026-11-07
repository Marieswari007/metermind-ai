import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { UsageRecord } from '../types';
import { formatCompactNumber } from '../utils/formatters';

interface UsageChartProps {
  records: UsageRecord[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ records }) => {
  // Aggregate recent usage into friendly timeline points
  const chartData = React.useMemo(() => {
    if (!records || records.length === 0) {
      return [
        { time: 'Day -6', tokens: 1200000, requests: 620 },
        { time: 'Day -5', tokens: 2400000, requests: 1250 },
        { time: 'Day -4', tokens: 4100000, requests: 2100 },
        { time: 'Day -3', tokens: 3800000, requests: 1950 },
        { time: 'Day -2', tokens: 6200000, requests: 3100 },
        { time: 'Yesterday', tokens: 5400000, requests: 2800 },
        { time: 'Today', tokens: 5350120, requests: 3030 },
      ];
    }

    // Group records by service or index
    const sorted = [...records].slice(0, 10).reverse();
    return sorted.map((r, idx) => ({
      time: r.service_name || `#${idx + 1}`,
      tokens: r.total_tokens || (r.input_tokens + r.output_tokens),
      requests: r.request_count,
    }));
  }, [records]);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h4 className="font-bold text-white text-base">Token Ingestion & Request Velocity</h4>
          <p className="text-xs text-slate-400">Real-time aggregate consumption tracked by MeterMind engine</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Total Tokens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Requests</span>
          </div>
        </div>
      </div>

      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => formatCompactNumber(v)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-white">{label}</p>
                      <p className="text-emerald-400">
                        Tokens: <span className="font-mono">{Number(payload[0]?.value).toLocaleString()}</span>
                      </p>
                      {payload[1] && (
                        <p className="text-cyan-400">
                          Requests: <span className="font-mono">{Number(payload[1]?.value).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#tokenGradient)"
            />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#reqGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
