import React from 'react';
import { UsageSimulator } from '../components/UsageSimulator';
import { UsageHistoryTable } from '../components/UsageHistoryTable';
import { UsageRecord } from '../types';

interface UsagePageProps {
  records: UsageRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const UsagePage: React.FC<UsagePageProps> = ({
  records,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-white">AI Usage Tracking & Ingestion</h2>
        <p className="text-sm text-slate-400 mt-1">
          Test token ingestion payloads, verify idempotency deduplication, and inspect unbilled queues.
        </p>
      </div>

      {/* Simulator Form */}
      <UsageSimulator onUsageLogged={onRefresh} />

      {/* Usage Logs Table */}
      <UsageHistoryTable
        records={records}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />
    </div>
  );
};
