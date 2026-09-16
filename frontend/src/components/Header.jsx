import React from 'react';
import {
  Cpu, ShieldCheck, Search, Layers, Award, TrendingUp, Sparkles,
  Activity, Users, Sun, Moon, CheckCircle, BarChart3, Settings, FileText,
  Droplets, Bell, IndianRupee, User, FlaskConical, History, AlertTriangle, BookOpen,
  Inbox, Package, Archive, Truck, Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { activeView, switchView, currentUser, setCurrentUser, theme, setTheme } = useApp();

  return (
    <header className="app-header">
      <div className="headbar">
        {/* Left: Brand */}
        <div className="brand" onClick={() => switchView('overview')}>
          <div className="brand-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="var(--amber-500)" />
              <polygon points="20,8 29,13 29,27 20,32 11,27 11,13" fill="var(--bg-dark)" />
              <path d="M20 13 L20 27 M14 17 L26 17 M14 23 L26 23" stroke="var(--amber-400)" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="name">Honey Chain</div>
            <div className="tag">KVIC HONEY MISSION • BLOCKCHAIN &amp; AI IOT</div>
          </div>
        </div>

        {/* Center: Nav */}
        <nav className="nav-tabs" id="tabs">
          {/* PUBLIC MODE */}
          {!currentUser && (
            <>
              <button className={`tab-button ${activeView === 'overview' ? 'active' : ''}`} onClick={() => switchView('overview')}><Award size={15} /> Overview</button>
              <button className={`tab-button ${activeView === 'monitor' ? 'active' : ''}`} onClick={() => switchView('monitor')}><Cpu size={15} /> Hive Monitor</button>
              <button className={`tab-button ${activeView === 'ai' ? 'active' : ''}`} onClick={() => switchView('ai')}><Sparkles size={15} /> AI Insights</button>
              <button className={`tab-button ${activeView === 'chain' ? 'active' : ''}`} onClick={() => switchView('chain')}><Layers size={15} /> Blockchain Trace</button>
              <button className={`tab-button ${activeView === 'qr' ? 'active' : ''}`} onClick={() => switchView('qr')}><Search size={15} /> Consumer Scan</button>
              <button className={`tab-button ${activeView === 'scale' ? 'active' : ''}`} onClick={() => switchView('scale')}><TrendingUp size={15} /> Scale-Up Plan</button>
            </>
          )}

          {/* ADMIN — only these 9 pages */}
          {currentUser && currentUser.role === 'ADMIN' && (
            <>
              <button className={`tab-button ${activeView === 'overview' ? 'active' : ''}`} onClick={() => switchView('overview')}><Award size={15} /> Dashboard</button>
              <button className={`tab-button ${activeView === 'users' ? 'active' : ''}`} onClick={() => switchView('users')}><Users size={15} /> Users</button>
              <button className={`tab-button ${activeView === 'monitor' ? 'active' : ''}`} onClick={() => switchView('monitor')}><Cpu size={15} /> All Hives</button>
              <button className={`tab-button ${activeView === 'chain' ? 'active' : ''}`} onClick={() => switchView('chain')}><Layers size={15} /> All Batches</button>
              <button className={`tab-button ${activeView === 'ai' ? 'active' : ''}`} onClick={() => switchView('ai')}><Sparkles size={15} /> AI & Alerts</button>
              <button className={`tab-button ${activeView === 'qr' ? 'active' : ''}`} onClick={() => switchView('qr')}><Search size={15} /> Scan Analytics</button>
              <button className={`tab-button ${activeView === 'scale' ? 'active' : ''}`} onClick={() => switchView('scale')}><TrendingUp size={15} /> Scale-Up</button>
              <button className={`tab-button ${activeView === 'settings' ? 'active' : ''}`} onClick={() => switchView('settings')}><Settings size={15} /> Settings</button>
              <button className={`tab-button ${activeView === 'reports' ? 'active' : ''}`} onClick={() => switchView('reports')}><FileText size={15} /> Reports</button>
            </>
          )}

          {/* BEEKEEPER */}
          {currentUser && currentUser.role === 'BEEKEEPER' && (
            <>
              <button className={`tab-button ${activeView === 'monitor' ? 'active' : ''}`} onClick={() => switchView('monitor')}><Cpu size={15} /> My Hives</button>
              <button className={`tab-button ${activeView === 'ai' ? 'active' : ''}`} onClick={() => switchView('ai')}><Sparkles size={15} /> AI Insights</button>
              <button className={`tab-button ${activeView === 'harvest' ? 'active' : ''}`} onClick={() => switchView('harvest')}><Droplets size={15} /> Harvest</button>
              <button className={`tab-button ${activeView === 'my-batches' ? 'active' : ''}`} onClick={() => switchView('my-batches')}><Layers size={15} /> My Batches</button>
              <button className={`tab-button ${activeView === 'bk-alerts' ? 'active' : ''}`} onClick={() => switchView('bk-alerts')}><Bell size={15} /> Alerts</button>
              <button className={`tab-button ${activeView === 'earnings' ? 'active' : ''}`} onClick={() => switchView('earnings')}><IndianRupee size={15} /> Earnings</button>
              <button className={`tab-button ${activeView === 'bk-profile' ? 'active' : ''}`} onClick={() => switchView('bk-profile')}><User size={15} /> Profile</button>
            </>
          )}

          {/* QUALITY OFFICER */}
          {currentUser && currentUser.role === 'QUALITY_OFFICER' && (
            <>
              <button className={`tab-button ${activeView === 'overview' ? 'active' : ''}`} onClick={() => switchView('overview')}><Award size={15} /> Overview</button>
              <button className={`tab-button ${activeView === 'quality' ? 'active' : ''}`} onClick={() => switchView('quality')}><ShieldCheck size={15} /> Pending Queue</button>
              <button className={`tab-button ${activeView === 'quality-test' ? 'active' : ''}`} onClick={() => switchView('quality-test')}><FlaskConical size={15} /> Lab Test</button>
              <button className={`tab-button ${activeView === 'quality-history' ? 'active' : ''}`} onClick={() => switchView('quality-history')}><History size={15} /> History</button>
              <button className={`tab-button ${activeView === 'quality-rejected' ? 'active' : ''}`} onClick={() => switchView('quality-rejected')}><AlertTriangle size={15} /> Rejected</button>
              <button className={`tab-button ${activeView === 'quality-standards' ? 'active' : ''}`} onClick={() => switchView('quality-standards')}><BookOpen size={15} /> Standards</button>
              <button className={`tab-button ${activeView === 'quality-reports' ? 'active' : ''}`} onClick={() => switchView('quality-reports')}><BarChart3 size={15} /> Reports</button>
              <button className={`tab-button ${activeView === 'hives' ? 'active' : ''}`} onClick={() => switchView('hives')}><Cpu size={15} /> Hives</button>
              <button className={`tab-button ${activeView === 'chain' ? 'active' : ''}`} onClick={() => switchView('chain')}><Layers size={15} /> Blockchain</button>
            </>
          )}

          {/* PROCESSOR */}
          {currentUser && currentUser.role === 'PROCESSOR' && (
            <>
              <button className={`tab-button ${activeView === 'overview' ? 'active' : ''}`} onClick={() => switchView('overview')}><Award size={15} /> Overview</button>
              <button className={`tab-button ${activeView === 'proc-incoming' ? 'active' : ''}`} onClick={() => switchView('proc-incoming')}><Inbox size={15} /> Incoming</button>
              <button className={`tab-button ${activeView === 'processing-log' ? 'active' : ''}`} onClick={() => switchView('processing-log')}><Settings size={15} /> Processing</button>
              <button className={`tab-button ${activeView === 'packaging' ? 'active' : ''}`} onClick={() => switchView('packaging')}><Package size={15} /> Packaging</button>
              <button className={`tab-button ${activeView === 'inventory' ? 'active' : ''}`} onClick={() => switchView('inventory')}><Archive size={15} /> Inventory</button>
              <button className={`tab-button ${activeView === 'dispatch' ? 'active' : ''}`} onClick={() => switchView('dispatch')}><Truck size={15} /> Dispatch</button>
              <button className={`tab-button ${activeView === 'facility' ? 'active' : ''}`} onClick={() => switchView('facility')}><Building2 size={15} /> Facility</button>
              <button className={`tab-button ${activeView === 'chain' ? 'active' : ''}`} onClick={() => switchView('chain')}><Layers size={15} /> Blockchain</button>
            </>
          )}
        </nav>

        {/* Right: Login/profile + live pill + theme toggle */}
        <div className="header-right">
          {!currentUser && (
            <button
              onClick={() => switchView('login')}
              style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
              Login
            </button>
          )}
          {currentUser && (
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>👤 {currentUser.name} ({currentUser.role})</span>
              <button
                onClick={() => { setCurrentUser(null); switchView('overview'); }}
                style={{ background: 'none', border: 'none', color: 'var(--amber-500)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Logout
              </button>
            </div>
          )}
          <div className="header-live-pill">
            <span className="beacon-dot"></span>
            <span>LIVE</span>
          </div>
          <button
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
