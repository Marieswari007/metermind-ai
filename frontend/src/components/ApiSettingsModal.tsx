import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { 
  X, 
  Server, 
  Key, 
  Check, 
  Copy, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiUrl, updateApiUrl, isBackendOnline, checkHealth, isMockMode, toggleMockMode } = useAuth();
  const toast = useToast();
  const [urlInput, setUrlInput] = useState(apiUrl);
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    updateApiUrl(urlInput);
    toast.success('Updated Backend API URL');
  };

  const handleTestConnection = async () => {
    setChecking(true);
    const ok = await checkHealth();
    setChecking(false);
    if (ok) {
      toast.success('FastAPI backend reached successfully!');
    } else {
      toast.error('Unable to reach backend at ' + apiUrl);
    }
  };

  const token = api.getToken();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-900 border border-slate-700 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Backend Configuration & Status</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mt-5 text-xs">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isBackendOnline 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
              <span className="font-semibold">
                {isBackendOnline ? 'FastAPI Backend Online' : 'FastAPI Backend Offline'}
              </span>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={checking}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-[11px] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              Ping
            </button>
          </div>

          {/* Backend URL Form */}
          <form onSubmit={handleSaveUrl} className="space-y-2">
            <label className="block font-semibold text-slate-300">FastAPI API Base URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-surface-950 font-bold rounded-xl transition"
              >
                Save
              </button>
            </div>
          </form>

          {/* Mode Switch */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Standalone Demo / Mock Mode</p>
              <p className="text-[11px] text-slate-400">
                Simulates all backend responses in-browser without running MongoDB or Python.
              </p>
            </div>
            <button
              onClick={() => toggleMockMode(!isMockMode)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition ${
                isMockMode
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isMockMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* JWT Token View */}
          {token && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Active JWT Bearer Token
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={token}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-[11px] pr-16"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(token);
                    toast.info('Copied JWT token to clipboard');
                  }}
                  className="absolute right-2 top-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Seed demo info */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400">
            <p className="text-slate-300 font-semibold">Backend Seed User Credentials:</p>
            <p>Email: <code className="text-emerald-400">demo@metermind.ai</code></p>
            <p>Password: <code className="text-emerald-400">metermind123</code></p>
            <p>Pricing Formula: <code className="text-cyan-400">(total_requests / 100) * 1.00 USD</code></p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
