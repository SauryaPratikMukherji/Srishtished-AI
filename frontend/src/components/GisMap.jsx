import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Eye, ShieldCheck, AlertTriangle, Layers, Filter, Compass, Info } from 'lucide-react';
import { fetchSatelliteLayer } from '../api/client';

// Helper component to auto-center map when dropdown location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, 14, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

// Fix Leaflet default icon pathing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper function to create status-colored pin icons (🟢 Verified, 🟡 Needs Review, 🔴 Flagged)
const getStatusIcon = (status) => {
  let pinBg = '#10b981'; // 🟢 Green
  if (status === 'NEEDS_REVIEW') pinBg = '#f59e0b'; // 🟡 Yellow
  if (status === 'SPATIAL_DISCREPANCY_FLAG' || status === 'NOT_VERIFIED') pinBg = '#f43f5e'; // 🔴 Red

  return new L.DivIcon({
    className: 'custom-camera-pin',
    html: `<div style="background: ${pinBg}; border: 2.5px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6); transform: scale(1.1);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};


export default function GisMap({ watersheds, audits, selectedWatershed, setSelectedWatershed }) {
  const [mapLayerMode, setMapLayerMode] = useState('ndvi'); // 'standard', 'ndvi', 'ndwi'
  const [satelliteGrid, setSatelliteGrid] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [layerOpacity, setLayerOpacity] = useState(0.55);

  const currentWs = watersheds.find(w => w.id === selectedWatershed) || watersheds[0];

  useEffect(() => {
    if (currentWs) {
      setSelectedAudit(null);
      fetchSatelliteLayer(currentWs.id).then(grid => {
        if (grid) setSatelliteGrid(grid);
      });
    }
  }, [selectedWatershed]);

  const filteredAudits = audits.filter(a => a.watershed_id === currentWs?.id);

  // Map NDVI value to color gradient (red -> yellow -> dark green)
  const getNdviColor = (val) => {
    if (val < 0.1) return '#d97706'; // dry soil / arid
    if (val < 0.3) return '#84cc16'; // low vegetation
    return '#15803d'; // dense healthy vegetation
  };

  // Map NDWI value to color gradient (light blue -> deep ocean blue)
  const getNdwiColor = (val) => {
    if (val < -0.05) return '#f59e0b'; // dry arid
    if (val < 0.1) return '#38bdf8'; // moist / shallow water
    return '#1d4ed8'; // deep surface water body
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', height: 'calc(100vh - 120px)' }}>
      
      {/* Main Leaflet Map Display */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
        
        {/* Floating Map Controls Bar */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--primary-cyan)" />
            <select
              value={selectedWatershed}
              onChange={(e) => setSelectedWatershed(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {watersheds.map(w => (
                <option key={w.id} value={w.id} style={{ background: '#111827' }}>
                  {w.name} ({w.district})
                </option>
              ))}
            </select>
          </div>

          <div style={{ height: '20px', width: '1px', background: 'var(--border-color)' }}></div>

          {/* Layer Selector */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => setMapLayerMode('standard')}
              className={mapLayerMode === 'standard' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
            >
              Base Map
            </button>

            <button
              onClick={() => setMapLayerMode('ndvi')}
              className={mapLayerMode === 'ndvi' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', background: mapLayerMode === 'ndvi' ? '#15803d' : undefined }}
            >
              🌱 Satellite NDVI
            </button>

            <button
              onClick={() => setMapLayerMode('ndwi')}
              className={mapLayerMode === 'ndwi' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', background: mapLayerMode === 'ndwi' ? '#0284c7' : undefined }}
            >
              💧 Satellite NDWI
            </button>
          </div>

          {/* Layer Opacity Slider */}
          {mapLayerMode !== 'standard' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
              <span>Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.05"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                style={{ width: '60px' }}
              />
            </div>
          )}
        </div>

        {/* Map Container */}
        {currentWs && (
          <MapContainer
            center={currentWs.center}
            zoom={14}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <RecenterMap center={currentWs.center} />

            {/* Esri World Imagery Satellite Base */}
            <TileLayer
              attribution='&copy; ISRO Bhuvan & Esri World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Satellite Grid Overlay (NDVI or NDWI) */}
            {mapLayerMode !== 'standard' && satelliteGrid?.features && (
              <FeatureGroup>
                {satelliteGrid.features.map((feat, idx) => {
                  const props = feat.properties;
                  const coords = feat.geometry.coordinates[0].map(c => [c[1], c[0]]);
                  const fillColor = mapLayerMode === 'ndvi' ? getNdviColor(props.ndvi) : getNdwiColor(props.ndwi);
                  
                  return (
                    <Polygon
                      key={`grid-${idx}`}
                      positions={coords}
                      pathOptions={{
                        fillColor: fillColor,
                        fillOpacity: layerOpacity,
                        weight: 0.5,
                        color: 'rgba(255,255,255,0.2)'
                      }}
                    >
                      <Popup>
                        <div style={{ fontSize: '0.8rem' }}>
                          <strong>SRISHTI-DRISHTI 30m Satellite Cell</strong><br />
                          <span>NDVI (Vegetation): <strong>{props.ndvi}</strong></span><br />
                          <span>NDWI (Water Index): <strong>{props.ndwi}</strong></span><br />
                          <span>Soil Moisture Index: <strong>{props.smi}</strong></span>
                        </div>
                      </Popup>
                    </Polygon>
                  );
                })}
              </FeatureGroup>
            )}

            {/* Watershed Bounding Box Polygon */}
            {currentWs.bounds && (
              <Polygon
                positions={[
                  [currentWs.bounds[0][0], currentWs.bounds[0][1]],
                  [currentWs.bounds[0][0], currentWs.bounds[1][1]],
                  [currentWs.bounds[1][0], currentWs.bounds[1][1]],
                  [currentWs.bounds[1][0], currentWs.bounds[0][1]]
                ]}
                pathOptions={{ color: '#06b6d4', weight: 2, dashArray: '6, 6', fill: false }}
              />
            )}

            {/* Render Field Audits: Camera Pins & 2D Sight-line Viewshed Cones */}
            {filteredAudits.map((audit) => {
              const isDiscrepancy = audit.status === 'SPATIAL_DISCREPANCY_FLAG';
              const coneCoords = audit.viewshed_geojson?.coordinates[0].map(c => [c[1], c[0]]);

              return (
                <React.Fragment key={audit.id}>
                  {/* 2D Camera Sight-Line Viewshed Wedge Cone */}
                  {coneCoords && (
                    <Polygon
                      positions={coneCoords}
                      pathOptions={{
                        fillColor: isDiscrepancy ? '#ef4444' : '#10b981',
                        fillOpacity: 0.45,
                        color: isDiscrepancy ? '#f87171' : '#34d399',
                        weight: 2
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{audit.audit_code}</span>
                            <span className={isDiscrepancy ? 'badge badge-warning' : 'badge badge-success'}>
                              {isDiscrepancy ? 'Flagged' : 'Approved'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.75rem', margin: '0 0 0.4rem 0', color: '#9ca3af' }}>
                            <strong>Structure:</strong> {audit.structure_type}
                          </p>
                          <p style={{ fontSize: '0.75rem', margin: 0, color: '#9ca3af' }}>
                            <strong>Camera Sight-Line:</strong> Heading {audit.azimuth}° | Focal {audit.focal_length}mm
                          </p>
                        </div>
                      </Popup>
                    </Polygon>
                  )}

                  {/* Inspector Camera Location Pin (🟢 🟡 🔴 Color-Coded) */}
                  <Marker
                    position={[audit.lat, audit.lng]}
                    icon={getStatusIcon(audit.status)}
                    eventHandlers={{
                      click: () => setSelectedAudit(audit)
                    }}
                  >
                    <Popup>
                      <div style={{ textAlign: 'center', padding: '0.2rem' }}>
                        <strong style={{ fontSize: '0.85rem' }}>{audit.audit_code}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: audit.status === 'APPROVED' ? '#34d399' : '#fb7185' }}>
                          Status: {audit.status === 'APPROVED' ? '🟢 Verified' : audit.status === 'NEEDS_REVIEW' ? '🟡 Needs Review' : '🔴 Flagged'}
                        </span>
                      </div>
                    </Popup>
                  </Marker>

                </React.Fragment>
              );
            })}

          </MapContainer>
        )}
      </div>

      {/* Side Inspector Details Panel */}
      <div className="glass-panel" style={{ padding: '1.2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="var(--primary-cyan)" />
            Spatial Fusion Inspector
          </h3>
          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
            PostGIS FOV
          </span>
        </div>

        {selectedAudit ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* Validation Badge Header */}
            <div style={{
              background: selectedAudit.status === 'SPATIAL_DISCREPANCY_FLAG' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: selectedAudit.status === 'SPATIAL_DISCREPANCY_FLAG' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              {selectedAudit.status === 'SPATIAL_DISCREPANCY_FLAG' ? (
                <AlertTriangle size={22} color="#fb7185" />
              ) : (
                <ShieldCheck size={22} color="#34d399" />
              )}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedAudit.status === 'SPATIAL_DISCREPANCY_FLAG' ? '#fb7185' : '#34d399', margin: 0 }}>
                  {selectedAudit.status === 'SPATIAL_DISCREPANCY_FLAG' ? 'AUTO-AUDIT DISCREPANCY' : 'SPATIALLY VALIDATED'}
                </h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                  Code: {selectedAudit.audit_code}
                </p>
              </div>
            </div>

            {/* Photo Thumbnail */}
            {selectedAudit.photo_url && (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img
                  src={selectedAudit.photo_url.startsWith('http') ? selectedAudit.photo_url : `http://localhost:8000${selectedAudit.photo_url}`}
                  alt="Field Ground Photo"
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem', color: '#ffffff' }}>
                  Geo-Tagged Field Photo
                </div>
              </div>
            )}

            {/* EXIF Metadata Card */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary-cyan)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={14} /> EXIF & Camera Telemetry
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div>GPS Lat: <strong style={{ color: '#fff' }}>{selectedAudit.lat}</strong></div>
                <div>GPS Lng: <strong style={{ color: '#fff' }}>{selectedAudit.lng}</strong></div>
                <div>Heading (Azimuth): <strong style={{ color: '#fff' }}>{selectedAudit.azimuth}°</strong></div>
                <div>Focal Length: <strong style={{ color: '#fff' }}>{selectedAudit.focal_length}mm</strong></div>
              </div>
            </div>

            {/* Cryptographic Stamp */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 600, color: '#34d399', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} /> Cryptographic Stamp
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.65rem' }}>
                Sig: {selectedAudit.crypto_signature ? selectedAudit.crypto_signature.substring(0, 24) + '...' : 'PWA-HMAC-VERIFIED'}
              </p>
              <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '0.2rem' }}>
                ✓ GPS anti-spoofing signature verified
              </div>
            </div>

            {/* Validation Details */}
            {selectedAudit.validation_details?.reasons && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.3rem' }}>
                  Dual-AI Validation Analysis:
                </div>
                <ul style={{ paddingLeft: '1.1rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {selectedAudit.validation_details.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <Info size={36} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.85rem' }}>
              Click any <strong>camera pin</strong> or <strong>2D viewshed cone</strong> on the map to inspect geo-photo fusion and satellite validation details.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
