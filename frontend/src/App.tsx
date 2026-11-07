import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { UsagePage } from './pages/UsagePage';
import { InvoicesPage } from './pages/InvoicesPage';
import { PayPalModal } from './components/PayPalModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { getBillingSummary } from './api/billing';
import { getUsageHistory } from './api/usage';
import { getInvoices, generateInvoice as apiGenerateInvoice } from './api/invoices';
import type { BillingSummary, Invoice, UsageRecord } from './types';
import { Loader2 } from 'lucide-react';

export function App() {
  const { isAuthenticated, isLoading: authLoading, isMockMode } = useAuth();
  const toast = useToast();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Modals state
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paypalModalOpen, setPaypalModalOpen] = useState<boolean>(false);

  // Fetch all core application data
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const [sumRes, usageRes, invRes] = await Promise.allSettled([
        getBillingSummary(),
        getUsageHistory({ limit: 50 }),
        getInvoices(),
      ]);

      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      }
      if (usageRes.status === 'fulfilled') {
        setUsageRecords(usageRes.value || []);
      }
      if (invRes.status === 'fulfilled') {
        setInvoices(invRes.value || []);
      }
    } catch (err: any) {
      console.error('Data load error:', err);
    } finally {
      setDataLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData, isMockMode]);

  // Handle Invoice Generation
  const handleGenerateInvoice = async () => {
    setDataLoading(true);
    try {
      const newInv = await apiGenerateInvoice();
      toast.success(`Invoice #${newInv.id || newInv.invoice_id || 'NEW'} created successfully!`);
      await fetchData();
      setCurrentTab('invoices');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate invoice. Ensure you have unbilled usage.');
    } finally {
      setDataLoading(false);
    }
  };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaypalModalOpen(true);
  };

  const handlePaymentSuccess = async (_invoiceId: string) => {
    await fetchData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-sm">Connecting to MeterMind engine...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const unbilledCount = summary?.unbilled_usage ?? 0;
  const unbilledAmount = summary?.current_bill ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSettings={() => setSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            summary={summary}
            records={usageRecords}
            invoices={invoices}
            onNavigateTab={setCurrentTab}
            onGenerateInvoice={handleGenerateInvoice}
            onPayInvoice={handlePayInvoice}
          />
        )}

        {currentTab === 'usage' && (
          <UsagePage
            records={usageRecords}
            isLoading={dataLoading}
            onRefresh={fetchData}
          />
        )}

        {currentTab === 'invoices' && (
          <InvoicesPage
            invoices={invoices}
            isLoading={dataLoading}
            unbilledCount={unbilledCount}
            unbilledAmount={unbilledAmount}
            onGenerateInvoice={handleGenerateInvoice}
            onPayInvoice={handlePayInvoice}
            onRefresh={fetchData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-surface-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">MeterMind AI</span>
            <span>—</span>
            <span>Developed for PayPal Hackathon</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI REST</span>
            <span>•</span>
            <span>MongoDB PyMongo</span>
            <span>•</span>
            <span>PayPal REST API v2</span>
            <span>•</span>
            <span>Decimal ROUND_HALF_UP</span>
          </div>
        </div>
      </footer>

      {/* PayPal Payment Dialog Modal */}
      <PayPalModal
        invoice={selectedInvoice}
        isOpen={paypalModalOpen}
        onClose={() => setPaypalModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* API & Backend Settings Modal */}
      <ApiSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
