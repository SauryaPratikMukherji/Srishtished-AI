import React from 'react';
import { BarChart3, Clock, DollarSign, Target, ShieldCheck, Zap, AlertTriangle, Layers, Award } from 'lucide-react';

export default function ImpactAnalytics() {
  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner Summary */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>SIH 2026 FEASIBILITY & IMPACT</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#fff' }}>
              Transforming Passive Geo-Photos into Active Spatial Datasets
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Scientific watershed assessment, automated monitoring, and multi-modal satellite fusion framework.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>Under 15 Mins</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inspection Cycle Time</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa' }}>88%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Spatial Accuracy</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fb7185' }}>90% Lower</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Monitoring Cost</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Geo-Photo Utilization & Resource Allocation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
        
        {/* Card 1: Geo-Photo Utilization (Slide 1) */}
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--primary-cyan)" /> Watershed Geo-Photo Utilization
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {/* Visual Donut representation */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'conic-gradient(#3b82f6 0% 92%, #f59e0b 92% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                92% / 8%
              </div>
            </div>

            <div style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <div style={{ marginBottom: '0.35rem' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px', marginRight: '6px' }}></span>
                <strong style={{ color: '#fff' }}>92% Passive Auditing:</strong> Document logs & compliance.
              </div>
              <div>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px', marginRight: '6px' }}></span>
                <strong style={{ color: '#fff' }}>8% Spatial Analytics:</strong> Photos linked to satellite maps.
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '8px', margin: 0 }}>
            <strong>Our Core Innovation:</strong> Fusing field geo-tagged photographs (GPS/EXIF) with 30m multispectral satellite imagery from SRISHTI-DRISHTI to validate construction progress and environmental impact.
          </p>
        </div>

        {/* Card 2: Resource Allocation (Slide 4) */}
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="#34d399" /> Resource Allocation Optimization
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span>Targeted Restoration</span>
                <span style={{ color: '#34d399' }}>50%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: '#34d399', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span>Preventive Infrastructure Repair</span>
                <span style={{ color: '#60a5fa' }}>30%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: '#60a5fa', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span>Automated Compliance Audits</span>
                <span style={{ color: '#f59e0b' }}>20%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Directing funds to verified highly-degraded drought zones while detecting structural wear in check dams early.
          </p>
        </div>

        {/* Card 3: Beneficiary Stakeholders (Slide 4) */}
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#a78bfa" /> Stakeholder Impact
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.78rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '8px' }}>
              <strong style={{ color: '#60a5fa' }}>PLANNERS:</strong> Data-backed site selection for new check dams using drainage, slope, and land-condition evidence.
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '8px' }}>
              <strong style={{ color: '#34d399' }}>DISTRICT ADMINISTRATORS:</strong> Instant verified progress reports with spatial + photographic evidence.
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '8px' }}>
              <strong style={{ color: '#f59e0b' }}>RESEARCHERS:</strong> Ground-truth photo database aligned with satellite observations for AI training.
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Traditional vs SrishtiShed AI Benchmarks */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} color="var(--primary-cyan)" /> Feasibility Benchmarks: Traditional vs. SrishtiShed AI
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> Inspection Cycle Time
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1rem', color: '#fb7185', fontWeight: 700 }}>Traditional: 45 Days</span>
              <span style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 800 }}>AI: &lt; 15 Mins</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={16} /> Assessment Accuracy
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1rem', color: '#fb7185', fontWeight: 700 }}>Variable (Manual)</span>
              <span style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 800 }}>AI: 88% Spatially Validated</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={16} /> Monitoring Cost
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1rem', color: '#fb7185', fontWeight: 700 }}>High Field Overhead</span>
              <span style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 800 }}>AI: 90% Lower Cost</span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Row 3: Risk & Mitigation Matrix */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="#f59e0b" /> Risk Identification & Mitigation Matrix
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.65rem 0.85rem', width: '20%' }}>Risk Factor</th>
                <th style={{ padding: '0.65rem 0.85rem', width: '35%' }}>Description</th>
                <th style={{ padding: '0.65rem 0.85rem', width: '45%' }}>Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#fff' }}>Cloud Cover Obstruction</td>
                <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-muted)' }}>Monsoonal clouds block satellite visual bands.</td>
                <td style={{ padding: '0.75rem 0.85rem', color: '#34d399' }}>Temporal interpolation + integration of cloud-penetrating Sentinel-1 Radar data.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#fff' }}>Field GPS Offsets</td>
                <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-muted)' }}>Mobile GPS drifts by 10-20 meters in remote valleys.</td>
                <td style={{ padding: '0.75rem 0.85rem', color: '#34d399' }}>Apply PostGIS spatial buffer queries (ST_DWithin) matching photos to nearest drainage line.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#fff' }}>Low-Quality Uploads</td>
                <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-muted)' }}>Blurred or poorly angled field photos uploaded by inspectors.</td>
                <td style={{ padding: '0.75rem 0.85rem', color: '#34d399' }}>Implement client-side photo validation in PWA to check metadata and contrast before upload.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#fff' }}>GPS Location Spoofing</td>
                <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-muted)' }}>Field inspectors uploading old photos or using GPS mocking tools.</td>
                <td style={{ padding: '0.75rem 0.85rem', color: '#34d399' }}>Device-bound Cryptographic Signing: PWA captures and signs metadata immediately at location.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
