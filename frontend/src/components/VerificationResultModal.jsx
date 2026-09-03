import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MapPin, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

export default function VerificationResultModal({ result, onViewOnMap, onViewProjectDetails, onClose }) {
  if (!result) return null;

  const status = result.validation_status || result.verification_result || 'VERIFIED';
  
  let statusBadge = {
    icon: <CheckCircle2 size={36} color="#34d399" />,
    label: '🟢 VERIFIED',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    textColor: '#34d399',
    description: 'Check dam detected. Location matches project location. Structure appears completed. Satellite imagery supports the observation.'
  };

  if (status === 'NEEDS_REVIEW') {
    statusBadge = {
      icon: <AlertTriangle size={36} color="#f59e0b" />,
      label: '⚠️ NEEDS REVIEW',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
      textColor: '#f59e0b',
      description: 'Structure detected, but location differs slightly from registered location or satellite signal requires inspection.'
    };
  } else if (status === 'NOT_VERIFIED' || status === 'SPATIAL_DISCREPANCY_FLAG') {
    statusBadge = {
      icon: <XCircle size={36} color="#fb7185" />,
      label: '❌ NOT VERIFIED',
      bg: 'rgba(244, 63, 94, 0.15)',
      border: 'rgba(244, 63, 94, 0.4)',
      textColor: '#fb7185',
      description: 'Expected watershed structure not detected or satellite evidence contradicts field photograph.'
    };
  }

  const details = result.validation_details || {};
  const structure = details.detected_object || result.structure_type || 'Check Dam';
  const confidence = details.ai_confidence || 92;
  const gpsMatch = details.gps_match !== false;
  const satelliteEvidence = details.satellite_evidence !== false;
  const overallScore = details.verification_score || 89;

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
        maxWidth: '520px',
        width: '100%',
        padding: '2rem',
        border: `1px solid ${statusBadge.border}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.8rem', borderRadius: '50%', background: statusBadge.bg, marginBottom: '0.75rem' }}>
            {statusBadge.icon}
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: statusBadge.textColor, margin: 0, letterSpacing: '0.02em' }}>
            VERIFICATION RESULT
          </h2>
          
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: statusBadge.textColor,
            marginTop: '0.35rem',
            display: 'inline-block',
            padding: '0.2rem 0.8rem',
            borderRadius: '20px',
            background: statusBadge.bg
          }}>
            {statusBadge.label}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.6rem 0 0 0', lineHeight: '1.4' }}>
            {statusBadge.description}
          </p>
        </div>

        {/* Breakdown Metric Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Structure Type</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{structure}</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>AI Confidence</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{confidence}%</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>GPS Location Match</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: gpsMatch ? '#34d399' : '#fb7185' }}>
              {gpsMatch ? '✓ YES' : '❌ NO'}
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Satellite Evidence</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: satelliteEvidence ? '#34d399' : '#fb7185' }}>
              {satelliteEvidence ? '✓ YES' : '❌ NO'}
            </span>
          </div>

        </div>

        {/* Overall Score Meter */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Overall Verification Score</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Multi-Modal Ground + Satellite Fusion Index</div>
          </div>
          
          <div style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            color: overallScore >= 75 ? '#34d399' : overallScore >= 50 ? '#f59e0b' : '#fb7185'
          }}>
            {overallScore}%
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onViewOnMap}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.65rem' }}
          >
            <MapPin size={16} /> VIEW ON MAP
          </button>
          
          <button
            onClick={onViewProjectDetails}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.65rem' }}
          >
            <Eye size={16} /> PROJECT DETAILS
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Close & return to inspection dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
