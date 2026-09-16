// Central mock/static data for the Honey Chain prototype.
// In a real deployment, everything here would come from the backend API.

export const initialHives = {
  H001: {
    loc: 'Satara Cluster, Maharashtra', cluster: 'Satara', temp: 34.2, hum: 61, wt: 31.5, wtDelta: '+0.4 kg',
    act: 'Normal (240Hz)', batt: 82, powerSource: 'Solar-assisted', health: 'HEALTHY', state: 'ok',
    extTemp: 28.4, weather: 'Clear, light breeze', co2: 512,
    gps: { lat: 17.6805, lng: 74.0183 }, beekeeper: 'Ganesh Pawar',
    firmware: 'v2.3.1', calibrationDue: '02 Jan 2027', lastSyncSec: 12,
    healthScore: 92, queenStatus: 'Confirmed Present', swarmRisk: 'Low',
    diseaseRisk: { varroa: 8, foulbrood: 3, nosema: 5 }, yieldForecastKg: 41.2,
    alertSeverity: 'none',
  },
  H002: {
    loc: 'Kolhapur Apiary, Maharashtra', cluster: 'Kolhapur', temp: 37.1, hum: 58, wt: 22.4, wtDelta: '-0.6 kg',
    act: 'Elevated (430Hz)', batt: 64, powerSource: 'Solar-assisted', health: 'WATCH (High Temp)', state: 'warn',
    extTemp: 33.1, weather: 'Hot, still air', co2: 690,
    gps: { lat: 16.7050, lng: 74.2433 }, beekeeper: 'Suresh More',
    firmware: 'v2.3.1', calibrationDue: '18 Nov 2026', lastSyncSec: 45,
    healthScore: 68, queenStatus: 'Uncertain', swarmRisk: 'Medium',
    diseaseRisk: { varroa: 22, foulbrood: 9, nosema: 11 }, yieldForecastKg: 26.5,
    alertSeverity: 'medium',
  },
  H003: {
    loc: 'Muzaffarpur Litchi Belt, Bihar', cluster: 'Muzaffarpur', temp: 33.8, hum: 60, wt: 28.9, wtDelta: '+0.2 kg',
    act: 'Normal (235Hz)', batt: 91, powerSource: 'Solar-assisted', health: 'HEALTHY', state: 'ok',
    extTemp: 27.9, weather: 'Partly cloudy', co2: 480,
    gps: { lat: 26.1225, lng: 85.3906 }, beekeeper: 'Ravi Kumar',
    firmware: 'v2.3.0', calibrationDue: '09 Feb 2027', lastSyncSec: 8,
    healthScore: 89, queenStatus: 'Confirmed Present', swarmRisk: 'Low',
    diseaseRisk: { varroa: 6, foulbrood: 2, nosema: 4 }, yieldForecastKg: 38.7,
    alertSeverity: 'none',
  },
  H004: {
    loc: 'Sundarbans Mangrove, West Bengal', cluster: 'Sundarbans', temp: 34.6, hum: 62, wt: 19.7, wtDelta: '-0.1 kg',
    act: 'Normal (250Hz)', batt: 18, powerSource: 'Solar-assisted', health: 'LOW BATTERY', state: 'low',
    extTemp: 29.7, weather: 'Humid, coastal breeze', co2: 545,
    gps: { lat: 21.9497, lng: 88.9468 }, beekeeper: 'Alok Mondal',
    firmware: 'v2.2.9', calibrationDue: '30 Sep 2026', lastSyncSec: 620,
    healthScore: 74, queenStatus: 'Confirmed Present', swarmRisk: 'Low',
    diseaseRisk: { varroa: 11, foulbrood: 4, nosema: 6 }, yieldForecastKg: 21.3,
    alertSeverity: 'high',
  },
  H005: {
    loc: 'Hoshiarpur Mustard, Punjab', cluster: 'Hoshiarpur', temp: 33.5, hum: 57, wt: 33.1, wtDelta: '+0.5 kg',
    act: 'Normal (245Hz)', batt: 88, powerSource: 'Solar-assisted', health: 'HEALTHY', state: 'ok',
    extTemp: 24.6, weather: 'Cool, clear skies', co2: 470,
    gps: { lat: 31.5322, lng: 75.9119 }, beekeeper: 'Harpreet Singh',
    firmware: 'v2.3.1', calibrationDue: '14 Mar 2027', lastSyncSec: 20,
    healthScore: 95, queenStatus: 'Confirmed Present', swarmRisk: 'Low',
    diseaseRisk: { varroa: 4, foulbrood: 1, nosema: 3 }, yieldForecastKg: 44.0,
    alertSeverity: 'none',
  },
};

export const flowSteps = [
  { n: '01', t: 'IoT Hive Pack', d: 'LoRaWAN node samples temp, humidity, scale weight & acoustic buzzing spectrum every 3 min.', view: 'monitor' },
  { n: '02', t: 'AI Edge Engine', d: 'AI analyzes hive conditions for colony-stress and anomaly risk, while forecasting honey yield.', view: 'ai' },
  { n: '03', t: 'Blockchain Hash', d: 'Harvest GPS, lab purity & cold extraction events are immutably sealed on-ledger.', view: 'chain' },
  { n: '04', t: 'QR Serialization', d: 'Each glass jar receives a cryptographically linked dynamic QR code seal.', view: 'qr' },
  { n: '05', t: 'Consumer Verify', d: 'Shoppers scan to view NMR 99.4% purity, apiary coordinates & beekeeper story.', view: 'qr' }
];

export const chainStages = [
  { s: 'HARVEST', t: 'Apiary Collection', rows: ['Beekeeper: Ganesh Pawar', 'Hive H001, Satara Cluster', '14 Apr 2026, 07:40 IST'], hash: '0x8f2c19a0e14d5cb79' },
  { s: 'LAB TEST', t: 'NMR & Purity Gate', rows: ['NMR Score: 98.6%', 'Moisture: 17.2%', 'C4 Sugar: NEGATIVE (0%)'], hash: '0x3ba7e0291df445ea1' },
  { s: 'PROCESSING', t: 'Cold Extraction', rows: ['Satara Cold Unit (Unheated)', 'Sediment Micro-mesh Filtered', '16 Apr 2026'], hash: '0x9e14d5c8821034bc2' },
  { s: 'PACKAGING', t: 'Glass Bottling', rows: ['Batch KVIC-HC-2026-0417', 'Jars Sealed: 240 units', '18 Apr 2026'], hash: '0x71fbc889a0b12cf34' },
  { s: 'LOGISTICS', t: 'KVIC Depot Link', rows: ['Regional Hub Dispatch', 'Cold-chain tracked', '20 Apr 2026'], hash: '0xd402a91e55b8921a4' },
  { s: 'RETAIL', t: 'Khadi Bhandar Store', rows: ['Certified Store Shelf', 'QR Live for Authentication', '22 Apr 2026'], hash: '0xe94a1b6c0032f918e' }
];

export const clusters = ['Satara', 'Kolhapur', 'Muzaffarpur', 'Sundarbans', 'Nashik', 'Pune', 'Hoshiarpur', 'Ratnagiri', 'Nagpur', 'Nanded'];
export const hexPath = 'M26 1 L49 14 L49 40 L26 53 L3 40 L3 14 Z';

export const recentAlerts = [
  { id: 'H024', msg: 'Humidity above normal', val: '72%', time: '8 min ago', level: 'WARNING' },
  { id: 'H031', msg: 'Weight trend unusually low', val: '-0.8 kg', time: '21 min ago', level: 'WARNING' },
  { id: 'H011', msg: 'Hive conditions stabilized', val: '34.1 °C', time: '14 min ago', level: 'RESOLVED' },
  { id: 'H018', msg: 'Abnormal activity pattern detected', val: 'Activity index 41%', time: '32 min ago', level: 'WARNING' }
];

export const latestBatch = {
  id: 'HC-MH-2026-00124',
  honeyType: 'Wildflower Honey',
  hiveId: 'H001',
  quantity: 8.4,
  harvestDate: '12 Aug 2026',
  qualityStatus: 'Verified',
  blockchainStatus: 'Recorded'
};

// ---- New mock datasets for previously-placeholder pages ----

export const mockUsers = [
  { id: 'U001', name: 'System Admin', email: 'admin@honeychain.demo', role: 'ADMIN', cluster: 'All Clusters', status: 'Active', joined: '02 Jan 2026' },
  { id: 'U002', name: 'Ganesh Pawar', email: 'beekeeper@honeychain.demo', role: 'BEEKEEPER', cluster: 'Satara', status: 'Active', joined: '12 Jan 2026' },
  { id: 'U003', name: 'Ramesh Shinde', email: 'ramesh.shinde@honeychain.demo', role: 'BEEKEEPER', cluster: 'Pune / Solapur', status: 'Active', joined: '18 Jan 2026' },
  { id: 'U004', name: 'Suresh More', email: 'suresh.more@honeychain.demo', role: 'BEEKEEPER', cluster: 'Kolhapur', status: 'Invited', joined: '02 Feb 2026' },
  { id: 'U005', name: 'Dr. Anita Kulkarni', email: 'officer@honeychain.demo', role: 'QUALITY_OFFICER', cluster: 'Satara Lab', status: 'Active', joined: '05 Jan 2026' },
  { id: 'U006', name: 'Vikram Deshmukh', email: 'processor@honeychain.demo', role: 'PROCESSOR', cluster: 'Satara Processing Unit', status: 'Active', joined: '08 Jan 2026' },
];

export const mockActivityLog = [
  { id: 'A001', type: 'BATCH', actor: 'Ganesh Pawar', message: 'Registered new harvest batch HC-MH-2026-00124', time: '12 minutes ago', level: 'INFO' },
  { id: 'A002', type: 'HIVE', actor: 'System', message: 'Hive H002 temperature exceeded 37°C threshold', time: '38 minutes ago', level: 'WARNING' },
  { id: 'A003', type: 'QUALITY', actor: 'Dr. Anita Kulkarni', message: 'Approved NMR purity test for batch KVIC-HC-2026-0417', time: '1 hour ago', level: 'SUCCESS' },
  { id: 'A004', type: 'USER', actor: 'System Admin', message: 'Invited Suresh More as Beekeeper (Kolhapur)', time: '3 hours ago', level: 'INFO' },
  { id: 'A005', type: 'BATCH', actor: 'Vikram Deshmukh', message: 'Marked batch KVIC-HC-2026-0417 as packaged, QR generated', time: '5 hours ago', level: 'SUCCESS' },
  { id: 'A006', type: 'HIVE', actor: 'System', message: 'Hive H004 battery dropped below 20%', time: '1 day ago', level: 'WARNING' },
  { id: 'A007', type: 'USER', actor: 'System Admin', message: 'System Admin signed in', time: '1 day ago', level: 'INFO' },
];

export const mockQualityHistory = [
  { batchId: 'KVIC-HC-2026-0417', hiveId: 'H001', moisture: 17.2, purity: 98.6, hmf: 14, result: 'PASS', testedBy: 'Dr. Anita Kulkarni', date: '15 Apr 2026' },
  { batchId: 'KVIC-HC-2026-0398', hiveId: 'H003', moisture: 18.1, purity: 97.9, hmf: 19, result: 'PASS', testedBy: 'Dr. Anita Kulkarni', date: '02 Apr 2026' },
  { batchId: 'KVIC-HC-2026-0371', hiveId: 'H002', moisture: 21.4, purity: 92.3, hmf: 48, result: 'FAIL', testedBy: 'Dr. Anita Kulkarni', date: '21 Mar 2026' },
  { batchId: 'KVIC-HC-2026-0350', hiveId: 'H005', moisture: 16.8, purity: 99.1, hmf: 11, result: 'PASS', testedBy: 'Dr. Anita Kulkarni', date: '08 Mar 2026' },
];
