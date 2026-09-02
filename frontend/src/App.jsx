import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GisMap from './components/GisMap';
import FieldInspectorSimulator from './components/FieldInspectorSimulator';
import ImpactAnalytics from './components/ImpactAnalytics';
import AuditLogTable from './components/AuditLogTable';
import { fetchWatersheds, fetchAudits } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'pwa', 'analytics', 'audits'
  const [watersheds, setWatersheds] = useState([]);
  const [audits, setAudits] = useState([]);
  const [selectedWatershed, setSelectedWatershed] = useState('WS-AP-ANTP-01');
  const [isLoading, setIsLoading] = useState(true);

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
    // Refresh audits list when new audit submitted from PWA simulator
    fetchAudits().then(setAudits);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {activeTab === 'map' && (
          <GisMap
            watersheds={watersheds}
            audits={audits}
            selectedWatershed={selectedWatershed}
            setSelectedWatershed={setSelectedWatershed}
          />
        )}

        {activeTab === 'pwa' && (
          <FieldInspectorSimulator
            watersheds={watersheds}
            onAuditSubmitted={handleAuditSubmitted}
          />
        )}

        {activeTab === 'analytics' && (
          <ImpactAnalytics />
        )}

        {activeTab === 'audits' && (
          <AuditLogTable
            audits={audits}
            watersheds={watersheds}
          />
        )}
      </main>
    </div>
  );
}
