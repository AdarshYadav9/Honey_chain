import React, { useEffect } from 'react';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';

import Header from './components/Header';
import LoginPage from './components/LoginPage';
import CertificateModal from './components/CertificateModal';

import Overview from './pages/Overview';
import HiveMonitor from './pages/HiveMonitor';
import AIInsights from './pages/AIInsights';
import BlockchainTrace from './pages/BlockchainTrace';
import ConsumerScan from './pages/ConsumerScan';
import ScaleUp from './pages/ScaleUp';

import PendingVerification from './pages/quality/PendingVerification';
import QualityTestForm from './pages/quality/QualityTestForm';
import QualityHistory from './pages/quality/QualityHistory';
import RejectedBatches from './pages/quality/RejectedBatches';
import QualityStandards from './pages/quality/QualityStandards';
import QualityReports from './pages/quality/QualityReports';
import HivesView from './pages/quality/HivesView';

import Processing from './pages/processor/Processing';
import IncomingBatches from './pages/processor/IncomingBatches';
import ProcessingLog from './pages/processor/ProcessingLog';
import Packaging from './pages/processor/Packaging';
import Inventory from './pages/processor/Inventory';
import DistributionHandoff from './pages/processor/DistributionHandoff';
import FacilityInfo from './pages/processor/FacilityInfo';
import ProcessorBatches from './pages/processor/ProcessorBatches';

import MyBatches from './pages/beekeeper/MyBatches';
import HarvestSubmission from './pages/beekeeper/HarvestSubmission';
import BeekeeperAlerts from './pages/beekeeper/BeekeeperAlerts';
import BeekeeperEarnings from './pages/beekeeper/BeekeeperEarnings';
import BeekeeperProfile from './pages/beekeeper/BeekeeperProfile';

import UsersManagement from './pages/admin/UsersManagement';
import ActivityLog from './pages/admin/ActivityLog';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';

const VIEWS = {
  overview: Overview,
  monitor: HiveMonitor,
  ai: AIInsights,
  chain: BlockchainTrace,
  qr: ConsumerScan,
  scale: ScaleUp,
  quality: PendingVerification,
  'quality-test': QualityTestForm,
  'quality-history': QualityHistory,
  'quality-rejected': RejectedBatches,
  'quality-standards': QualityStandards,
  'quality-reports': QualityReports,
  hives: HivesView,
  processing: Processing,
  'proc-incoming': IncomingBatches,
  'processing-log': ProcessingLog,
  packaging: Packaging,
  inventory: Inventory,
  dispatch: DistributionHandoff,
  facility: FacilityInfo,
  'proc-batches': ProcessorBatches,
  'my-batches': MyBatches,
  harvest: HarvestSubmission,
  'bk-alerts': BeekeeperAlerts,
  earnings: BeekeeperEarnings,
  'bk-profile': BeekeeperProfile,
  users: UsersManagement,
  activity: ActivityLog,
  settings: AdminSettings,
  reports: AdminReports,
};

function NotificationBanner() {
  const { notification } = useApp();
  if (!notification) return null;
  return (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--amber-500)', color: 'var(--bg-dark)', padding: '12px 24px', borderRadius: '8px', zIndex: 9999, fontWeight: 'bold' }}>
      🔔 {notification}
    </div>
  );
}

function AppShell() {
  const { activeView, setActiveView, setBatchIdInput } = useApp();

  // Handle URL hash routing for QR code scans: #verify/BATCH_ID
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#verify/')) {
      const batchId = hash.replace('#verify/', '');
      if (batchId) {
        setBatchIdInput(batchId);
        setActiveView('qr');
      }
    }
  }, [setActiveView, setBatchIdInput]);

  if (activeView === 'login') {
    return <LoginPage />;
  }

  const ActivePage = VIEWS[activeView] || Overview;

  return (
    <div className="app-container">
      <div className="comb-overlay"></div>
      <Header />
      <main className="wrap">
        <NotificationBanner />
        <ActivePage />
      </main>
      <CertificateModal />
      <footer className="app-footer">
        <div className="wrap">
          Honey Chain • Blockchain Honey Traceability &amp; Smart Beekeeping Platform for KVIC Honey Mission
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
