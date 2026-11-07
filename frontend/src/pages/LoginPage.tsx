import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  CreditCard, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon,
  Server
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, loginDemo, isBackendOnline, isMockMode } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@metermind.ai');
  const [password, setPassword] = useState('metermind123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Logged in successfully!');
      } else {
        await register(name, email, password);
        toast.success('Account created and logged in!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemo();
      toast.success('Logged in as Demo Provider!');
    } catch (err: any) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-surface-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Left Side: Brand & Hackathon Info */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-surface-950 via-slate-900 to-emerald-950/40 border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="w-6 h-6 text-surface-950 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  MeterMind<span className="text-emerald-400">.ai</span>
                </span>
                <p className="text-xs text-slate-400">PayPal Hackathon AI Platform</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Usage-Based AI Billing <br />
                <span className="gradient-text">Engineered for Scale.</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track LLM token consumption in real time, aggregate unbilled requests, enforce pure Decimal pricing, and process one-click settlements through the PayPal REST API.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="mt-8 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Zero Float Drift (Python Decimal with ROUND_HALF_UP)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Cpu className="w-4 h-4" />
                </div>
                <span>Idempotent Ingestion & Unique Index Deduplication</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>Direct PayPal REST API v2 Orders & Capture</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>FastAPI • MongoDB • PayPal</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isBackendOnline ? 'Backend Online (:8000)' : isMockMode ? 'Simulator Active' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-surface-900">
          {/* Quick Demo Login Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Instant Demo Access
              </span>
              <span className="text-[10px] text-slate-400">One-click</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Explore pre-seeded with 30 days of AI usage history, past invoices, and active PayPal orders.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Sign in as Demo User (demo@metermind.ai)
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                mode === 'login'
                  ? 'text-white border-emerald-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                mode === 'register'
                  ? 'text-white border-emerald-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@provider.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
            >
              <span>{mode === 'login' ? 'Sign In with JWT' : 'Register New Provider'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
