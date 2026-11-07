import React, { useState } from 'react';
import { trackUsage } from '../api/usage';
import { useToast } from '../context/ToastContext';
import { UsageTrackPayload } from '../types';
import { 
  Send, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  HelpCircle,
  Copy,
  Layers
} from 'lucide-react';

interface UsageSimulatorProps {
  onUsageLogged: () => void;
}

const AI_MODELS = [
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', defaultInput: 1500, defaultOutput: 400 },
  { id: 'claude-3-5-sonnet', name: 'Anthropic Claude 3.5 Sonnet', defaultInput: 2200, defaultOutput: 650 },
  { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', defaultInput: 4500, defaultOutput: 800 },
  { id: 'llama-3.1-70b', name: 'Meta Llama 3.1 70B', defaultInput: 1800, defaultOutput: 350 },
];

export const UsageSimulator: React.FC<UsageSimulatorProps> = ({ onUsageLogged }) => {
  const toast = useToast();
  const [serviceName, setServiceName] = useState('gpt-4o');
  const [requestCount, setRequestCount] = useState<number>(100);
  const [inputTokens, setInputTokens] = useState<number>(150000);
  const [outputTokens, setOutputTokens] = useState<number>(35000);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(
    () => `idemp-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const generateNewKey = () => {
    setIdempotencyKey(`idemp-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`);
  };

  const handleModelChange = (modelId: string) => {
    setServiceName(modelId);
    const selected = AI_MODELS.find((m) => m.id === modelId);
    if (selected) {
      setInputTokens(selected.defaultInput * requestCount);
      setOutputTokens(selected.defaultOutput * requestCount);
    }
  };

  const handleRequestCountChange = (count: number) => {
    const val = Math.max(1, count);
    setRequestCount(val);
    const selected = AI_MODELS.find((m) => m.id === serviceName);
    if (selected) {
      setInputTokens(selected.defaultInput * val);
      setOutputTokens(selected.defaultOutput * val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastResponse(null);

    const payload: UsageTrackPayload = {
      service_name: serviceName,
      request_count: Number(requestCount),
      input_tokens: Number(inputTokens),
      output_tokens: Number(outputTokens),
      idempotency_key: idempotencyKey,
    };

    try {
      const res = await trackUsage(payload);
      setLastResponse(res);
      toast.success(`Tracked ${requestCount} requests for ${serviceName}!`);
      onUsageLogged();
    } catch (err: any) {
      toast.error(err.message || 'Failed to track usage');
      setLastResponse({ error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateBatchPreset = async (presetName: string, service: string, reqs: number, inTok: number, outTok: number) => {
    setIsSubmitting(true);
    const key = `batch-${presetName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const payload: UsageTrackPayload = {
      service_name: service,
      request_count: reqs,
      input_tokens: inTok,
      output_tokens: outTok,
      idempotency_key: key,
    };

    try {
      const res = await trackUsage(payload);
      setLastResponse(res);
      toast.success(`Batch simulated: +${reqs} requests on ${service}`);
      onUsageLogged();
    } catch (err: any) {
      toast.error(err.message || 'Batch simulation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">AI Usage Tracking Playground</h3>
            <p className="text-xs text-slate-400">Ingest real-time AI token usage via FastAPI <code className="text-emerald-400">POST /usage/track</code></p>
          </div>
        </div>

        {/* Batch presets dropdown / shortcuts */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => simulateBatchPreset('code-gen', 'gpt-4o', 200, 320000, 65000)}
            disabled={isSubmitting}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            +200 GPT-4o
          </button>
          <button
            type="button"
            onClick={() => simulateBatchPreset('rag-index', 'claude-3-5-sonnet', 500, 950000, 180000)}
            disabled={isSubmitting}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            +500 Claude
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              AI Service / Model Name
            </label>
            <select
              value={serviceName}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </option>
              ))}
              <option value="custom-llm-v1">Custom Provider (custom-llm-v1)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Request Count
            </label>
            <input
              type="number"
              min="1"
              value={requestCount}
              onChange={(e) => handleRequestCountChange(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
            />
          </div>
        </div>

        {/* Tokens Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Input Tokens
            </label>
            <input
              type="number"
              min="0"
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Output Tokens
            </label>
            <input
              type="number"
              min="0"
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Computed Total Tokens
            </label>
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono font-bold flex items-center justify-between">
              <span>{(Number(inputTokens) + Number(outputTokens)).toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-normal">Server-enforced</span>
            </div>
          </div>
        </div>

        {/* Idempotency Key with explanation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Idempotency Key (Deduplication Guarantee)
            </label>
            <button
              type="button"
              onClick={generateNewKey}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition pr-20"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(idempotencyKey);
                toast.info('Copied key to clipboard');
              }}
              className="absolute right-2 top-2 px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              Copy
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Re-submitting with an identical key will trigger database deduplication index, ensuring requests are never double-billed.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-surface-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Track & Ingest Usage
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
            title="Sends payload with the exact same idempotency key to test deduplication"
          >
            Test Replay Attack / Double Click
          </button>
        </div>
      </form>

      {/* API Response preview */}
      {lastResponse && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Server Ingestion Response (HTTP 200 OK):
          </p>
          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
