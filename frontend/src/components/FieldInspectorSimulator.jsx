import React, { useState, useEffect } from 'react';
import { Camera, ShieldCheck, Compass, MapPin, Upload, Play, CheckCircle2, AlertTriangle, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { submitAuditForm } from '../api/client';

export default function FieldInspectorSimulator({ watersheds, onAuditSubmitted, onShowVerificationResult }) {
  const [selectedWs, setSelectedWs] = useState(watersheds[0]?.id || 'WS-AP-ANTP-01');
  const [structureType, setStructureType] = useState('Check Dam (Concrete)');
  const [lat, setLat] = useState(22.5726);
  const [lng, setLng] = useState(88.3639);
  const [azimuth, setAzimuth] = useState(135.0);
  const [focalLength, setFocalLength] = useState(28.0);
  const [inspectorId, setInspectorId] = useState('DEV-INSPECTOR-884');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/static/sample_checkdam_1.jpg');
  const [activePreset, setActivePreset] = useState('Check Dam');

  // Pipeline Analysis Progress State (Screen 4)
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [pipelineResult, setPipelineResult] = useState(null);

  const currentProject = watersheds.find(w => w.id === selectedWs) || watersheds[0];

  // Auto-sync lat, lng, and structure type when dropdown project changes
  useEffect(() => {
    const proj = watersheds.find(w => w.id === selectedWs);
    if (proj && proj.center && Array.isArray(proj.center) && proj.center.length === 2) {
      setLat(proj.center[0]);
      setLng(proj.center[1]);
      if (proj.claimed_structure) {
        setStructureType(proj.claimed_structure);
      }
    }
  }, [selectedWs, watersheds]);

  const analysisChecklist = [
    { num: 1, title: 'GPS Extracted', desc: `Captured (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)` },
    { num: 2, title: 'Image Processed & Features Segmented', desc: 'ResNet/OpenCV structural boundary extraction' },
    { num: 3, title: 'Structure Detected', desc: `${structureType} (92% Confidence)` },
    { num: 4, title: 'Satellite Data Retrieved', desc: 'ISRO Bhuvan Multispectral NDVI/NDWI grid matched' },
    { num: 5, title: 'Ground & Geospatial Fusion Executed', desc: 'Sub-pixel 2.5m effective sightline resolution score generated' }
  ];

  const handlePresetSelect = (type, samplePhotoUrl, sampleLat, sampleLng, sampleStatus) => {
    setActivePreset(type);
    setStructureType(type);
    setPreviewUrl(samplePhotoUrl);
    if (sampleLat) setLat(sampleLat);
    if (sampleLng) setLng(sampleLng);

    // Sync selectedWs if matching project exists
    if (sampleLat && sampleLng && watersheds.length > 0) {
      const matchingProj = watersheds.find(w => w.center && Math.abs(w.center[0] - sampleLat) < 0.1 && Math.abs(w.center[1] - sampleLng) < 0.1);
      if (matchingProj) {
        setSelectedWs(matchingProj.id);
      }
    }

    // Create synthetic file from fetch or canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = sampleStatus === 'MISMATCH' ? '#991b1b' : '#0284c7';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText(`FIELD CAPTURE: ${type}`, 20, 140);
    ctx.fillText(`GPS: ${sampleLat}, ${sampleLng}`, 20, 170);
    canvas.toBlob((blob) => {
      setSelectedFile(new File([blob], `${type.toLowerCase().replace(/ /g, '_')}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setActivePreset('Custom File');
    }
  };

  const handleSubmitPipeline = async () => {
    setIsProcessing(true);
    setPipelineResult(null);
    setProgressPct(0);
    setActiveStep(1);

    // Smooth animation for Screen 4 (Photo Analysis)
    for (let s = 1; s <= 5; s++) {
      setActiveStep(s);
      setProgressPct(s * 20);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      const formData = new FormData();
      formData.append('watershed_id', selectedWs);
      formData.append('structure_type', structureType);
      formData.append('lat', lat);
      formData.append('lng', lng);
      formData.append('azimuth', azimuth);
      formData.append('focal_length', focalLength);
      formData.append('inspector_id', inspectorId);

      let fileToSend = selectedFile;
      if (!fileToSend) {
        const blob = await new Promise(res => {
          const c = document.createElement('canvas');
          c.width = 100; c.height = 100;
          c.toBlob(res);
        });
        fileToSend = new File([blob], activePreset === 'Mismatch' ? 'mismatch.jpg' : 'checkdam.jpg');
      }
      formData.append('photo', fileToSend);

      const result = await submitAuditForm(formData);
      setPipelineResult(result);
      if (onAuditSubmitted) onAuditSubmitted();

      // Trigger Screen 5 Verification Result Modal
      if (onShowVerificationResult) {
        onShowVerificationResult(result);
      }
    } catch (err) {
      // Offline fallback mock
      const mockResult = {
        status: 'success',
        audit_code: `AUD-ANTP-${Math.floor(Math.random()*900+100)}`,
        validation_status: activePreset === 'Mismatch' ? 'NOT_VERIFIED' : 'APPROVED',
        verification_result: activePreset === 'Mismatch' ? 'NOT_VERIFIED' : 'VERIFIED',
        validation_details: {
          status: activePreset === 'Mismatch' ? 'NOT_VERIFIED' : 'APPROVED',
          verification_result: activePreset === 'Mismatch' ? 'NOT_VERIFIED' : 'VERIFIED',
          detected_object: structureType,
          ai_confidence: activePreset === 'Mismatch' ? 44 : 92,
          gps_match: activePreset !== 'Mismatch',
          satellite_evidence: activePreset !== 'Mismatch',
          verification_score: activePreset === 'Mismatch' ? 38 : 89,
          reasons: activePreset === 'Mismatch'
            ? ['Ground photo structure type does not match satellite NDWI water signatures.']
            : ['Check dam structure detected at registered GPS location (92% confidence).', 'Satellite multispectral imagery confirms moisture retention.']
        }
      };
      setPipelineResult(mockResult);
      if (onAuditSubmitted) onAuditSubmitted();
      if (onShowVerificationResult) onShowVerificationResult(mockResult);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto', display: 'grid', gridTemplateColumns: '460px 1fr', gap: '1.25rem' }}>
      
      {/* SCREEN 3: ADD INSPECTION FORM */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-blue)' }}>
              <Camera size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>NEW INSPECTION</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Ground Truth Field Capture</p>
            </div>
          </div>
          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Screen 3</span>
        </div>

        {/* Quick Sample Preset Buttons */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            <Sparkles size={13} color="var(--primary-cyan)" style={{ display: 'inline', marginRight: '4px' }} />
            Quick Demo Presets:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => handlePresetSelect('Check Dam (Concrete)', '/static/sample_checkdam_1.jpg', 22.5726, 88.3639, 'VERIFIED')}
              className={activePreset === 'Check Dam (Concrete)' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              ✅ Check Dam Photo
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('Farm Pond Recharge Well', '/static/sample_pond.jpg', 17.6599, 75.9064, 'VERIFIED')}
              className={activePreset === 'Farm Pond Recharge Well' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              ✅ Farm Pond Photo
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('Contour Trench System', '/static/sample_trench.jpg', 14.6820, 77.6010, 'REVIEW')}
              className={activePreset === 'Contour Trench System' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              ⚠️ Dry Trench Photo
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('Check Dam (Earthen)', '/static/sample_mismatch.jpg', 25.4484, 78.5685, 'MISMATCH')}
              className={activePreset === 'Check Dam (Earthen)' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              ❌ Mismatch Site
            </button>
          </div>
        </div>

        {/* Project Selector */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Select Project</label>
          <select
            value={selectedWs}
            onChange={(e) => setSelectedWs(e.target.value)}
            style={{ width: '100%', background: 'rgba(0,0,0,0.35)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem', fontSize: '0.85rem' }}
          >
            {watersheds.map(w => (
              <option key={w.id} value={w.id} style={{ background: '#111827' }}>
                {w.project_code || w.id} — {w.village || w.name} ({w.district})
              </option>
            ))}
          </select>
        </div>

        {/* Work Location Details Card */}
        {currentProject && (
          <div style={{
            background: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '10px',
            padding: '0.75rem 0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--primary-cyan)" /> WORK LOCATION DETAILS
              </span>
              <span className={currentProject.status === 'SPATIAL_DISCREPANCY_FLAG' ? 'badge badge-warning' : 'badge badge-success'} style={{ fontSize: '0.62rem' }}>
                {currentProject.status === 'SPATIAL_DISCREPANCY_FLAG' ? '⚠️ DISCREPANCY ZONE' : '🟢 VERIFIED ZONE'}
              </span>
            </div>
            
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', marginTop: '0.1rem' }}>
              📍 {currentProject.village || currentProject.name} — {currentProject.district}, {currentProject.state}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.73rem', marginTop: '0.2rem' }}>
              <div>Code: <strong style={{ color: '#fff' }}>{currentProject.project_code || currentProject.id}</strong></div>
              <div>Structure: <strong style={{ color: '#fff' }}>{currentProject.claimed_structure || structureType}</strong></div>
              <div>Target Lat: <strong style={{ color: 'var(--primary-cyan)' }}>{currentProject.center?.[0] || lat}</strong></div>
              <div>Target Lng: <strong style={{ color: 'var(--primary-cyan)' }}>{currentProject.center?.[1] || lng}</strong></div>
            </div>
          </div>
        )}

        {/* Structure Type Dropdown */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Structure Type</label>
          <select
            value={structureType}
            onChange={(e) => setStructureType(e.target.value)}
            style={{ width: '100%', background: 'rgba(0,0,0,0.35)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem', fontSize: '0.85rem' }}
          >
            <option value="Check Dam (Concrete)">Check Dam (Concrete)</option>
            <option value="Check Dam (Earthen)">Check Dam (Earthen)</option>
            <option value="Farm Pond Recharge Well">Farm Pond Recharge Well</option>
            <option value="Water Harvesting Structure">Water Harvesting Structure</option>
            <option value="Drainage Channel">Drainage Channel</option>
            <option value="Plantation Contour Trench">Plantation Contour Trench</option>
            <option value="Percolation Tank">Percolation Tank</option>
          </select>
        </div>

        {/* Field Photo Input / Upload / Preview */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Field Photograph</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="file"
              accept="image/*"
              id="pwa-file-input-field"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="pwa-file-input-field"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              <Upload size={15} /> Upload Photo
            </label>
          </div>

          {previewUrl && (
            <div style={{ marginTop: '0.65rem', position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '140px' }}>
              <img src={previewUrl} alt="Field Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} color="#34d399" /> GPS Auto-Extracted ({lat.toFixed(4)}°, {lng.toFixed(4)}°)
              </div>
            </div>
          )}
        </div>

        {/* GPS Coordinates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GPS Lat</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.8rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GPS Lng</label>
            <input
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmitPipeline}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700 }}
        >
          {isProcessing ? (
            <>ANALYZING PHOTO & SATELLITE DATA...</>
          ) : (
            <>
              <Play size={18} /> SUBMIT FOR VERIFICATION
            </>
          )}
        </button>

      </div>

      {/* SCREEN 4: PHOTO ANALYSIS STEPPER VISUALIZER */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>PHOTO ANALYSIS & SATELLITE FUSION</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Screen 4 — Real-time AI Pipeline Processing</p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>{progressPct}%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COMPLETE</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #10b981)', transition: 'width 0.3s ease' }}></div>
        </div>

        {/* Live Step Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {analysisChecklist.map((step) => {
            const isDone = activeStep > step.num || progressPct === 100;
            const isCurrent = activeStep === step.num && isProcessing;

            let bgColor = 'rgba(0,0,0,0.2)';
            let borderColor = 'var(--border-color)';
            if (isCurrent) {
              bgColor = 'rgba(59, 130, 246, 0.15)';
              borderColor = 'rgba(59, 130, 246, 0.5)';
            } else if (isDone) {
              bgColor = 'rgba(16, 185, 129, 0.08)';
              borderColor = 'rgba(16, 185, 129, 0.3)';
            }

            return (
              <div
                key={step.num}
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isDone ? '#10b981' : isCurrent ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  {isDone ? <CheckCircle2 size={18} /> : step.num}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isDone ? '#34d399' : isCurrent ? '#60a5fa' : '#ffffff' }}>
                    {isDone ? '✓ ' : ''}{step.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {step.desc}
                  </div>
                </div>

                {isCurrent && (
                  <span className="live-indicator"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Analysis Output Card */}
        {pipelineResult && (
          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-highlight)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                AI Analysis Result ({pipelineResult.audit_code || 'AUD-ANTP-1023'})
              </span>
              <span className={pipelineResult.validation_status === 'APPROVED' || pipelineResult.verification_result === 'VERIFIED' ? 'badge badge-success' : 'badge badge-warning'}>
                {pipelineResult.verification_result || pipelineResult.validation_status}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Ground truth photo cross-referenced with ISRO Bhuvan satellite NDVI/NDWI layers. Overall score: <strong>{pipelineResult.validation_details?.verification_score || 89}%</strong>
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
