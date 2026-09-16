import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initialHives } from '../data/mockData';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('overview');
  const [hives, setHives] = useState(initialHives);
  const [activeHive, setActiveHive] = useState('H001');
  const [batchIdInput, setBatchIdInput] = useState('KVIC-HC-2026-0417');
  const [isScanned, setIsScanned] = useState(false);
  const [showFullCertModal, setShowFullCertModal] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Shared prototype data
  const [sharedBatches, setSharedBatches] = useState([]);
  const [notification, setNotification] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [ledger, setLedger] = useState(null);

  const [activePopover, setActivePopover] = useState(null);
  const [productionRange, setProductionRange] = useState('30');

  const showNotification = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const fetchBatches = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/batches`);
      const data = await res.json();
      if (data.ok) setSharedBatches(data.batches);
    } catch (err) { /* backend not running in static demo mode */ }
  }, []);

  useEffect(() => {
    fetchBatches();
    const iv = setInterval(fetchBatches, 3000);
    return () => clearInterval(iv);
  }, [fetchBatches]);

  const switchView = useCallback((viewName) => {
    setActiveView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentUser(data.user);
        setActiveView('overview');
      } else {
        setLoginError(data.error);
      }
    } catch (err) {
      setLoginError('Login failed. Is backend running?');
    }
  }, [loginEmail]);

  const handleRegisterHarvest = useCallback(async (e) => {
    e.preventDefault();
    const honeyType = e.target.elements.honeyType.value;
    const extractionMethod = e.target.elements.extractionMethod.value;
    const quantity = parseFloat(e.target.elements.harvestQty.value);
    const harvestDate = e.target.elements.harvestDate.value;

    try {
      const res = await fetch(`${API_BASE}/api/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hiveId: activeHive, honeyType, extractionMethod, quantity, harvestDate })
      });
      const data = await res.json();
      if (data.ok) {
        showNotification(`Batch ${data.batch.id} created!`);
        fetchBatches();
        setActiveView('overview');
      }
    } catch (err) { /* no-op in static demo mode */ }
  }, [activeHive, fetchBatches, showNotification]);

  const handleVerifyBatch = useCallback(async (batchId) => {
    try {
      await fetch(`${API_BASE}/api/batches/${batchId}/verify`, { method: 'POST' });
      showNotification(`Batch ${batchId} verified!`);
      fetchBatches();
    } catch (err) { /* no-op */ }
  }, [fetchBatches, showNotification]);

  const handleQualitySubmit = useCallback(async (e, batchId) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/batches/${batchId}/quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisture: e.target.elements.moisture.value,
          purity: e.target.elements.purity.value,
          hmf: e.target.elements.hmf.value,
          result: e.target.elements.result.value
        })
      });
      showNotification(`Quality metrics submitted for ${batchId}`);
      fetchBatches();
    } catch (err) { /* no-op */ }
  }, [fetchBatches, showNotification]);

  const handleProcessSubmit = useCallback(async (e, batchId) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/batches/${batchId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center: e.target.elements.center.value,
          qtyProcessed: e.target.elements.qtyProcessed.value
        })
      });
      showNotification(`Batch ${batchId} processed!`);
      fetchBatches();
    } catch (err) { /* no-op */ }
  }, [fetchBatches, showNotification]);

  const handlePackageSubmit = useCallback(async (batchId) => {
    try {
      await fetch(`${API_BASE}/api/batches/${batchId}/package`, { method: 'POST' });
      showNotification(`Batch ${batchId} packaged & QR generated!`);
      fetchBatches();
    } catch (err) { /* no-op */ }
  }, [fetchBatches, showNotification]);

  const handleAddHive = useCallback(async (hiveData) => {
    try {
      const res = await fetch(`${API_BASE}/api/iot/hives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hiveData)
      });
      const data = await res.json();
      if (data.ok && data.hive) {
        const h = data.hive;
        setHives(prev => ({
          ...prev,
          [h.hiveId]: {
            loc: h.location,
            cluster: h.cluster || (h.location ? h.location.split(',')[0] : undefined),
            temp: h.telemetry.internalTemp,
            hum: h.telemetry.humidity,
            wt: h.telemetry.weightKg,
            wtDelta: h.telemetry.weightDelta24h || '+0.0 kg',
            act: h.telemetry.acousticFreqHz > 400 ? `Elevated (${h.telemetry.acousticFreqHz}Hz)` : `Normal (${h.telemetry.acousticFreqHz}Hz)`,
            batt: h.telemetry.batteryLevel,
            powerSource: h.powerSource || 'Solar-assisted',
            co2: h.telemetry.co2Ppm,
            extTemp: h.telemetry.ambientTemp,
            weather: h.weather,
            floral: h.floralSource,
            queenStatus: h.queenStatus,
            health: h.colonyHealth,
            healthScore: h.healthScore,
            swarmRisk: h.swarmRisk,
            diseaseRisk: h.diseaseRisk,
            yieldForecastKg: h.yieldForecastKg,
            beekeeper: h.beekeeper,
            gps: h.gps,
            firmware: h.firmwareVersion,
            calibrationDue: h.calibrationDue,
            alertSeverity: h.alertSeverity,
            state: h.colonyHealth === 'EXCELLENT' ? 'ok' : h.colonyHealth === 'WARNING' ? 'warn' : 'low'
          }
        }));
        showNotification(`Hive ${h.hiveId} registered successfully!`);
        return h.hiveId;
      }
    } catch (err) {
      showNotification('Failed to add hive. Is backend running?');
    }
    return null;
  }, [showNotification]);

  // Dynamic data fetched on mount (falls back silently to mock hives if backend absent)
  useEffect(() => {
    fetch(`${API_BASE}/api/iot/hives`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.hives && data.hives.length > 0) {
          const hivesMap = {};
          data.hives.forEach(h => {
            hivesMap[h.hiveId] = {
              loc: h.location,
              cluster: h.cluster || (h.location ? h.location.split(',')[0] : undefined),
              temp: h.telemetry.internalTemp,
              hum: h.telemetry.humidity,
              wt: h.telemetry.weightKg,
              wtDelta: h.telemetry.weightDelta24h || '+0.0 kg',
              act: h.telemetry.acousticFreqHz > 400 ? `Elevated (${h.telemetry.acousticFreqHz}Hz)` : `Normal (${h.telemetry.acousticFreqHz}Hz)`,
              batt: h.telemetry.batteryLevel,
              powerSource: h.powerSource || 'Solar-assisted',
              co2: h.telemetry.co2Ppm,
              extTemp: h.telemetry.ambientTemp,
              weather: h.weather,
              floral: h.floralSource,
              queenStatus: h.queenStatus,
              health: h.colonyHealth,
              healthScore: h.healthScore,
              swarmRisk: h.swarmRisk,
              diseaseRisk: h.diseaseRisk,
              yieldForecastKg: h.yieldForecastKg,
              beekeeper: h.beekeeper,
              gps: h.gps,
              firmware: h.firmwareVersion,
              calibrationDue: h.calibrationDue,
              alertSeverity: h.alertSeverity,
              state: h.colonyHealth === 'EXCELLENT' ? 'ok' : h.colonyHealth === 'WARNING' ? 'warn' : 'low'
            };
          });
          setHives(hivesMap);
          if (!hivesMap[activeHive]) {
            setActiveHive(Object.keys(hivesMap)[0]);
          }
        }
      }).catch(() => { /* keep mock hives */ });

    fetch(`${API_BASE}/api/kvic/dashboard`)
      .then(res => res.json())
      .then(data => { if (data.ok && data.stats) setDashboardStats(data.stats); })
      .catch(() => { /* no-op */ });

    fetch(`${API_BASE}/api/ledger`)
      .then(res => res.json())
      .then(data => { if (data.ok && data.blockchain) setLedger(data.blockchain); })
      .catch(() => { /* no-op */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme attribute to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Live telemetry jitter for the active hive
  useEffect(() => {
    const timer = setInterval(() => {
      setHives(prev => {
        const cur = prev[activeHive];
        if (!cur) return prev;
        const newTemp = cur.temp + (Math.random() - 0.5) * 0.15;
        const newHum = cur.hum + (Math.random() - 0.5) * 0.5;
        const newWt = cur.wt + Math.random() * 0.02;
        return {
          ...prev,
          [activeHive]: {
            ...cur,
            temp: Math.round(newTemp * 10) / 10,
            hum: Math.round(newHum * 10) / 10,
            wt: Math.round(newWt * 10) / 10
          }
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [activeHive]);

  const curHive = hives[activeHive] || Object.values(hives)[0] || initialHives.H001;

  const tempSeriesData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => (curHive.temp || 34.0) + Math.sin(i / 3) * 1.4 + (Math.random() - 0.5) * 0.6);
  }, [curHive.temp]);

  const weightSeriesData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => (curHive.wt || 30.0) - 1.8 + i * (1.8 / 23) + (Math.random() - 0.5) * 0.15);
  }, [curHive.wt]);

  const value = {
    theme, setTheme,
    activeView, setActiveView, switchView,
    hives, setHives, activeHive, setActiveHive, curHive,
    tempSeriesData, weightSeriesData,
    batchIdInput, setBatchIdInput,
    isScanned, setIsScanned,
    showFullCertModal, setShowFullCertModal,
    currentUser, setCurrentUser,
    loginEmail, setLoginEmail,
    loginError, setLoginError,
    showPassword, setShowPassword,
    sharedBatches, setSharedBatches, fetchBatches,
    notification, showNotification,
    dashboardStats, ledger,
    activePopover, setActivePopover,
    productionRange, setProductionRange,
    handleLogin, handleRegisterHarvest, handleVerifyBatch,
    handleQualitySubmit, handleProcessSubmit, handlePackageSubmit, handleAddHive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
