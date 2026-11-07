import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  Cpu, 
  CreditCard, 
  Receipt, 
  Settings, 
  LogOut, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openSettings }) => {
  const { user, logout, isBackendOnline, isMockMode, toggleMockMode } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-surface-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => setCurrentTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <Zap className="w-5 h-5 text-surface-950 font-bold fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    MeterMind<span className="text-emerald-400">.ai</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PayPal Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 -mt-0.5 hidden sm:block">Usage-Based AI Billing</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentTab('usage')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentTab === 'usage'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                Usage Tracker & Ingestion
              </button>
              <button
                onClick={() => setCurrentTab('invoices')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentTab === 'invoices'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Receipt className="w-4 h-4 text-cyan-400" />
                Invoices & PayPal
              </button>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Backend Connectivity Status Pill */}
            <div 
              onClick={openSettings}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all bg-slate-900/80 hover:bg-slate-800"
              style={{
                borderColor: isMockMode 
                  ? 'rgba(234, 179, 8, 0.3)' 
                  : isBackendOnline 
                  ? 'rgba(34, 197, 94, 0.3)' 
                  : 'rgba(239, 68, 68, 0.3)'
              }}
              title="Click to view API & connection settings"
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                isMockMode 
                  ? 'bg-amber-400' 
                  : isBackendOnline 
                  ? 'bg-emerald-400' 
                  : 'bg-red-400'
              }`} />
              <span className="text-slate-300">
                {isMockMode ? 'Mock Simulator' : isBackendOnline ? 'FastAPI Connected (:8000)' : 'Backend Offline'}
              </span>
            </div>

            {/* Quick Mock Mode Toggle */}
            <button
              onClick={() => toggleMockMode(!isMockMode)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors ${
                isMockMode
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Toggle between Live FastAPI Backend and Mock Demo Mode"
            >
              {isMockMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
            </button>

            {/* Settings button */}
            <button
              onClick={openSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Connection & API Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-200 hidden sm:block max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 text-sm"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <a
                      href="http://localhost:8000/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                      FastAPI Swagger UI
                    </a>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/50">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`text-xs py-1 px-2 rounded ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('usage')}
            className={`text-xs py-1 px-2 rounded ${
              currentTab === 'usage' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Tracker
          </button>
          <button
            onClick={() => setCurrentTab('invoices')}
            className={`text-xs py-1 px-2 rounded ${
              currentTab === 'invoices' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Invoices & PayPal
          </button>
        </div>
      </div>
    </header>
  );
};
