import { api } from './client';
import { UsageFilterParams, UsageRecord, UsageTrackPayload } from '../types';
import { MOCK_USAGE_HISTORY } from '../utils/mockData';

let localMockUsage: UsageRecord[] = [...MOCK_USAGE_HISTORY];

export async function trackUsage(payload: UsageTrackPayload): Promise<UsageRecord> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 400));
    const newRecord: UsageRecord = {
      id: 'usg_' + Math.random().toString(36).substring(2, 9),
      service_name: payload.service_name,
      request_count: payload.request_count,
      input_tokens: payload.input_tokens,
      output_tokens: payload.output_tokens,
      total_tokens: payload.input_tokens + payload.output_tokens,
      idempotency_key: payload.idempotency_key || `idemp-${Math.random().toString(36).substring(2, 10)}`,
      status: 'unbilled',
      timestamp: new Date().toISOString(),
    };
    localMockUsage = [newRecord, ...localMockUsage];
    return newRecord;
  }

  return api.request<UsageRecord>('/usage/track', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getUsageHistory(params?: UsageFilterParams): Promise<UsageRecord[]> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    let list = [...localMockUsage];
    if (params?.limit) {
      const skip = params.skip || 0;
      list = list.slice(skip, skip + params.limit);
    }
    return list;
  }

  const query = new URLSearchParams();
  if (params?.start_date) query.append('start_date', params.start_date);
  if (params?.end_date) query.append('end_date', params.end_date);
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.skip) query.append('skip', String(params.skip));

  const qs = query.toString();
  return api.request<UsageRecord[]>(`/usage/history${qs ? `?${qs}` : ''}`);
}

export function resetMockUsage() {
  localMockUsage = [...MOCK_USAGE_HISTORY];
}
