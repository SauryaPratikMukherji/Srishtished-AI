import React from 'react';
import { Map, Camera, BarChart3, ShieldCheck, Activity, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.85rem 1.5rem', marginBottom: '1rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Title & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
          }}>
            <Layers size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                AQUA NEXUS
              </h1>
              <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                SIH 2026 PROTOTYPE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Fusing Ground Truth with Satellite Intelligence
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('map')}
            className={activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            <Map size={16} />
            <span>Main Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('pwa')}
            className={activeTab === 'pwa' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            <Camera size={16} />
            <span>Add Inspection</span>
          </button>

          <button 
            onClick={() => setActiveTab('audits')}
            className={activeTab === 'audits' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            <ShieldCheck size={16} />
            <span>Audit Logs</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            <BarChart3 size={16} />
            <span>Impact & Feasibility</span>
          </button>
        </nav>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="live-indicator"></span>
          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
            <Activity size={12} /> PostGIS Engine Live
          </span>
        </div>

      </div>
    </header>
  );
}
