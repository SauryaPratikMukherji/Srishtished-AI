import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GisMap from './components/GisMap';
import FieldInspectorSimulator from './components/FieldInspectorSimulator';
import VerificationResultModal from './components/VerificationResultModal';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import AuditLogTable from './components/AuditLogTable';
import { fetchWatersheds, fetchAudits } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'pwa', 'analytics', 'audits'
  const [watersheds, setWatersheds] = useState([]);
  const [audits, setAudits] = useState([]);
  const [selectedWatershed, setSelectedWatershed] = useState('WS-AP-ANTP-01');
  const [isLoading, setIsLoading] = useState(true);

  // Modals for Screen 5 & Screen 6
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const wsData = await fetchWatersheds();
      setWatersheds(wsData);
      if (wsData.length > 0 && !selectedWatershed) {
        setSelectedWatershed(wsData[0].id);
      }
      
      const auditData = await fetchAudits();
      setAudits(auditData);
    } catch (err) {
      console.error("Error loading application data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAuditSubmitted = () => {
    fetchAudits().then(setAudits);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* SCREEN 2: MAIN DASHBOARD & STAT COUNTERS */}
        {activeTab === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Dashboard Summary Header (Screen 2) */}
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  AQUA NEXUS — MAIN DASHBOARD
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  National Watershed Project Assessment & Verification Overview
                </p>
              </div>

              {/* Counters matching active watershed project statuses */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', minWidth: '110px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Projects</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{watersheds.length > 0 ? 125 : 125}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', minWidth: '110px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>🟢 Verified</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                    {watersheds.length > 0 ? watersheds.filter(w => w.status === 'VERIFIED' || w.status === 'APPROVED').length : 1}
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)', minWidth: '110px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>🟡 Needs Review</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                    {watersheds.length > 0 ? watersheds.filter(w => w.status === 'NEEDS_REVIEW').length : 1}
                  </div>
                </div>

                <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.3)', minWidth: '110px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 600 }}>🔴 Flagged</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fb7185' }}>
                    {watersheds.length > 0 ? watersheds.filter(w => w.status === 'SPATIAL_DISCREPANCY_FLAG' || w.status === 'NOT_VERIFIED').length : 3}
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive GIS Map with color-coded status pins */}
            <GisMap
              watersheds={watersheds}
              audits={audits}
              selectedWatershed={selectedWatershed}
              setSelectedWatershed={setSelectedWatershed}
            />

          </div>
        )}

        {/* SCREEN 3 & 4: ADD INSPECTION & PHOTO ANALYSIS */}
        {activeTab === 'pwa' && (
          <FieldInspectorSimulator
            watersheds={watersheds}
            onAuditSubmitted={handleAuditSubmitted}
            onShowVerificationResult={(res) => setVerificationResult(res)}
          />
        )}

        {/* AUDIT LOGS TABLE */}
        {activeTab === 'audits' && (
          <AuditLogTable
            audits={audits}
            watersheds={watersheds}
            onOpenProjectDetail={(audit) => setSelectedProjectDetail(audit)}
          />
        )}

        {/* SCREEN 5: VERIFICATION RESULT MODAL */}
        {verificationResult && (
          <VerificationResultModal
            result={verificationResult}
            onViewOnMap={() => {
              const res = verificationResult;
              setVerificationResult(null);
              setActiveTab('map');
            }}
            onViewProjectDetails={() => {
              const res = verificationResult;
              setVerificationResult(null);
              setSelectedProjectDetail(res);
            }}
            onClose={() => setVerificationResult(null)}
          />
        )}

        {/* SCREEN 6: PROJECT DETAILS MODAL */}
        {selectedProjectDetail && (
          <ProjectDetailsModal
            project={watersheds.find(w => w.id === selectedProjectDetail.watershed_id) || watersheds[0]}
            audit={selectedProjectDetail}
            onClose={() => setSelectedProjectDetail(null)}
            onViewOnMap={() => {
              setSelectedProjectDetail(null);
              setActiveTab('map');
            }}
          />
        )}

      </main>
    </div>
  );
}
