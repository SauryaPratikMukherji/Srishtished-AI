import React, { useState } from 'react';
import { Layers, ShieldCheck, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('officer@aquanexus.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('ADMIN'); // 'INSPECTOR' or 'ADMIN'

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      username: username || 'officer@aquanexus.gov.in',
      role: role,
      name: role === 'ADMIN' ? 'District Administrator' : 'Field Inspector DEV-884'
    });
  };

  const handleDemoLogin = (selectedRole) => {
    setRole(selectedRole);
    const demoUser = selectedRole === 'ADMIN' ? 'admin@aquanexus.gov.in' : 'inspector@aquanexus.gov.in';
    setUsername(demoUser);
    onLoginSuccess({
      username: demoUser,
      role: selectedRole,
      name: selectedRole === 'ADMIN' ? 'District Nodal Officer' : 'Senior Field Officer DEV-884'
    });
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      
      {/* Glow Backdrop */}
      <div style={{
        position: 'absolute',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 80%)',
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 1rem auto',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(2, 132, 199, 0.5)'
          }}>
            <Layers size={32} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.3rem 0' }}>
            AQUA NEXUS
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Geospatial AI Watershed Assessment & Verification System
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              background: role === 'ADMIN' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent',
              color: role === 'ADMIN' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            District Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('INSPECTOR')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              background: role === 'INSPECTOR' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent',
              color: role === 'INSPECTOR' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Field Inspector
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Email / Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter email or username"
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  color: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  color: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.4rem', fontSize: '0.95rem' }}
          >
            LOGIN <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem' }}>
            <Sparkles size={12} color="var(--primary-cyan)" style={{ display: 'inline', marginRight: '4px' }} />
            Hackathon Demo Quick Login:
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}
            >
              Demo Admin
            </button>
            <button
              onClick={() => handleDemoLogin('INSPECTOR')}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}
            >
              Demo Inspector
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
