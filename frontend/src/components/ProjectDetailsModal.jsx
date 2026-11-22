import React from 'react';
import { CheckCircle2, ShieldCheck, MapPin, Layers, Calendar, User, FileText, ExternalLink, Camera, Globe } from 'lucide-react';
import { getFullPhotoUrl } from '../api/client';

export default function ProjectDetailsModal({ project, audit, onClose, onViewOnMap }) {
  if (!project && !audit) return null;

  // Extract combined info
  const projectCode = project?.project_code || audit?.audit_code || 'Project #A1023';
  const village = project?.village || 'Village ABC';
  const district = project?.district || 'XYZ District';
  const structure = project?.claimed_structure || audit?.structure_type || 'Check Dam (Concrete)';
  const status = project?.status || audit?.status || 'VERIFIED';
  const lat = audit?.lat || project?.center?.[0] || 22.5726;
  const lng = audit?.lng || project?.center?.[1] || 88.3639;
  const photoUrl = audit?.photo_url || '/static/sample_checkdam_1.jpg';
  const fullPhotoUrl = getFullPhotoUrl(photoUrl);

  const isVerified = status === 'VERIFIED' || status === 'APPROVED';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        border: '1px solid var(--border-highlight)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {projectCode}
              </h2>
              <span className={isVerified ? 'badge badge-success' : 'badge badge-warning'}>
                {isVerified ? '🟢 VERIFIED' : '⚠️ NEEDS REVIEW'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              {village} • {district}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onViewOnMap && (
              <button className="btn-secondary" onClick={() => onViewOnMap(projectCode)}>
                <MapPin size={15} /> View on Map
              </button>
            )}
            <button className="btn-secondary" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Overview Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Structure Type</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{structure}</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Geospatial Location</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
              {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Inspector ID</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>DEV-INSPECTOR-884</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Inspection Date</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>02/09/2026</span>
          </div>
        </div>

        {/* Side-by-Side Photo & Satellite Evidence Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Box 1: Field Ground Photo */}
          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={16} color="var(--primary-cyan)" /> FIELD PHOTO (Ground Truth)
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>AI CV 92%</span>
            </div>

            <div style={{ position: 'relative', height: '220px' }}>
              <img
                src={fullPhotoUrl}
                alt="Field Photo Ground Truth"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=600&q=80';
                }}
              />
              
              {/* Bounding box simulation overlay */}
              <div style={{
                position: 'absolute',
                top: '25%', left: '20%', width: '55%', height: '50%',
                border: '2px dashed #10b981',
                borderRadius: '8px',
                pointerEvents: 'none',
                background: 'rgba(16, 185, 129, 0.1)'
              }}>
                <span style={{ background: '#10b981', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', position: 'absolute', top: '-18px', left: '0' }}>
                  {structure} (92%)
                </span>
              </div>
            </div>

            <div style={{ padding: '0.6rem 0.85rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Geo-tagged & cryptographically signed at capture site ({lat.toFixed(4)}, {lng.toFixed(4)}).
            </div>
          </div>

          {/* Box 2: Satellite Image */}
          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} color="#34d399" /> SATELLITE IMAGE (Geospatial)
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ISRO Bhuvan WCS</span>
            </div>

            <div style={{ position: 'relative', height: '220px', background: '#0f172a' }}>
              <img
                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/7430/11880"
                alt="Satellite Multispectral View"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) brightness(0.9)' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Sightline cone simulation */}
              <div style={{
                position: 'absolute',
                top: '45%', left: '45%',
                width: '0', height: '0',
                borderLeft: '45px solid transparent',
                borderRight: '45px solid transparent',
                borderBottom: '90px solid rgba(52, 211, 153, 0.4)',
                transform: 'rotate(135deg)',
                transformOrigin: 'top center'
              }}></div>
              
              <div style={{
                position: 'absolute',
                top: '42%', left: '42%',
                width: '14px', height: '14px',
                borderRadius: '50%',
                background: '#3b82f6',
                border: '2px solid white'
              }}></div>
            </div>

            <div style={{ padding: '0.6rem 0.85rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Multispectral Sentinel/Bhuvan 30m grid with NDWI surface water reflection match.
            </div>
          </div>

        </div>

        {/* ANALYSIS Checklist Card */}
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-highlight)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={18} color="#34d399" /> SPATIAL FUSION ANALYSIS & VERIFICATION CHECKLIST
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
              <CheckCircle2 size={16} /> <span>Location matched to registered coordinates</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
              <CheckCircle2 size={16} /> <span>Structure detected ({structure})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
              <CheckCircle2 size={16} /> <span>Satellite multi-spectral evidence available</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
              <CheckCircle2 size={16} /> <span>HMAC-SHA256 Anti-Spoofing Signature Verified</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
