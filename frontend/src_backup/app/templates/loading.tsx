import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      background: 'var(--bg-primary)',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {/* Outer glowing ring */}
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          filter: 'blur(20px)',
          opacity: 0.3,
          animation: 'pulse 2s infinite ease-in-out'
        }} />
        <Loader2 
          size={48} 
          style={{ 
            color: 'var(--accent-primary)', 
            animation: 'spin 1s linear infinite' 
          }} 
        />
      </div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: '0 0 8px 0',
        letterSpacing: '-0.5px'
      }}>
        Loading Templates
      </h3>
      <p style={{
        fontSize: '15px',
        color: 'var(--text-secondary)',
        margin: 0
      }}>
        Preparing your creative workspace...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}
