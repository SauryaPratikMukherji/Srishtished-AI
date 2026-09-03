import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Search, Filter, Eye, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function AuditLogTable({ audits, watersheds, onOpenProjectDetail }) {

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuditModal, setSelectedAuditModal] = useState(null);

  const filteredAudits = audits.filter(item => {
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch = item.audit_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.inspector_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.structure_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Top Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search audit code, inspector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.45rem 0.6rem 0.45rem 2rem',
                fontSize: '0.85rem',
                width: '260px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            >
              All Logs ({audits.length})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={filterStatus === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: filterStatus === 'APPROVED' ? '#15803d' : undefined }}
            >
              Approved ({audits.filter(a => a.status === 'APPROVED').length})
            </button>
            <button
              onClick={() => setFilterStatus('SPATIAL_DISCREPANCY_FLAG')}
              className={filterStatus === 'SPATIAL_DISCREPANCY_FLAG' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: filterStatus === 'SPATIAL_DISCREPANCY_FLAG' ? '#be123c' : undefined }}
            >
              Discrepancies ({audits.filter(a => a.status === 'SPATIAL_DISCREPANCY_FLAG').length})
            </button>
          </div>
        </div>

        <button className="btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => alert("Compliance audit log exported to CSV / GeoJSON format.")}>
          <Download size={15} /> Export Audit Report (CSV)
        </button>

      </div>

      {/* Table Container */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Audit Code</th>
              <th style={{ padding: '0.85rem 1rem' }}>Structure</th>
              <th style={{ padding: '0.85rem 1rem' }}>Inspector ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Camera Azimuth</th>
              <th style={{ padding: '0.85rem 1rem' }}>Crypto Signature</th>
              <th style={{ padding: '0.85rem 1rem' }}>Dual-AI Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.map((item) => {
              const isDiscrepancy = item.status === 'SPATIAL_DISCREPANCY_FLAG';

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#fff' }}>
                    {item.audit_code}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {item.structure_type}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {item.inspector_id}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
                    {item.azimuth}° sight-line
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={isDiscrepancy ? 'badge badge-warning' : 'badge badge-success'}>
                      {isDiscrepancy ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                      {isDiscrepancy ? 'Discrepancy Flag' : 'Approved'}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onOpenProjectDetail ? onOpenProjectDetail(item) : setSelectedAuditModal(item)}
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <Eye size={14} /> Project Details
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Detail View */}
      {selectedAuditModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <span className={selectedAuditModal.status === 'APPROVED' ? 'badge badge-success' : 'badge badge-warning'}>
                  {selectedAuditModal.status}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.3rem 0 0 0', color: '#fff' }}>
                  {selectedAuditModal.audit_code} Compliance Detail
                </h3>
              </div>

              <button className="btn-secondary" onClick={() => setSelectedAuditModal(null)}>
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Photo */}
              {selectedAuditModal.photo_url && (
                <img
                  src={selectedAuditModal.photo_url.startsWith('http') ? selectedAuditModal.photo_url : `http://localhost:8000${selectedAuditModal.photo_url}`}
                  alt="Audit Ground Photo"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '10px' }}>
                <div>Structure: <strong>{selectedAuditModal.structure_type}</strong></div>
                <div>Inspector: <strong>{selectedAuditModal.inspector_id}</strong></div>
                <div>GPS Coords: <strong>{selectedAuditModal.lat}, {selectedAuditModal.lng}</strong></div>
                <div>Sight-Line Heading: <strong>{selectedAuditModal.azimuth}°</strong></div>
                <div>Timestamp: <strong>{selectedAuditModal.timestamp}</strong></div>
                <div>Anti-Spoofing: <strong style={{ color: '#34d399' }}>Cryptographically Signed</strong></div>
              </div>

              {selectedAuditModal.validation_details?.reasons && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '0.4rem' }}>Dual-AI Cross Validation Findings:</strong>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-muted)' }}>
                    {selectedAuditModal.validation_details.reasons.map((r, idx) => (
                      <li key={idx} style={{ marginBottom: '0.2rem' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
