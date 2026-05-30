'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Command, MessageSquare, Zap, LayoutTemplate, Box, Cpu } from 'lucide-react';

export default function VignetteAIPage() {
  const [prompt, setPrompt] = useState('');
  
  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'var(--accent-primary)',
        filter: 'blur(120px)',
        opacity: 0.15,
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'pulse-glow-ai 8s infinite alternate'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: '#8b5cf6',
        filter: 'blur(140px)',
        opacity: 0.12,
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'pulse-glow-ai 12s infinite alternate-reverse'
      }} />
      
      <style>{`
        @keyframes pulse-glow-ai {
          0% { transform: scale(1) translate(0, 0); opacity: 0.1; }
          100% { transform: scale(1.1) translate(20px, -20px); opacity: 0.2; }
        }
        .ai-glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
        }
        :root[data-theme="light"] .ai-glass-panel {
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .ai-feature-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }
        .ai-feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', borderRadius: '100px', 
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
            color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, 
            marginBottom: '24px', boxShadow: 'var(--shadow-sm)' 
          }}>
            <Sparkles size={16} style={{ color: '#8b5cf6' }} /> Introducing Vignette AI
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-2px', margin: '0 0 24px', lineHeight: 1.1 }}>
            Design at the speed of <br/>
            <span style={{ 
              background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6, #ec4899)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'gradient-shift 4s linear infinite'
            }}>thought.</span>
          </h1>
          <style>{`
            @keyframes gradient-shift {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
          <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Generate complete architectures, brainstorm ideas, and organize your infinite canvas instantly using the power of generative AI.
          </p>
        </div>

        {/* AI Prompt Input Section */}
        <div className="ai-glass-panel" style={{ padding: '12px', marginBottom: '80px', boxShadow: '0 32px 64px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: '20px', padding: '8px 8px 8px 24px', border: '1px solid var(--border-color)' }}>
            <Command size={24} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Generate a microservices architecture diagram..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '20px 16px',
                fontSize: '18px',
                color: 'var(--text-primary)',
                outline: 'none',
                minWidth: '0'
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; 
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.4)'; 
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.transform = 'none'; 
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)'; 
            }}
            >
              Generate <ArrowRight size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', padding: '20px 16px 8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {['Brainstorm marketing campaign', 'Create user flow', 'Design database schema', 'Wireframe a landing page'].map(suggestion => (
              <div key={suggestion} onClick={() => setPrompt(suggestion)} style={{
                padding: '10px 20px',
                borderRadius: '100px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { 
                e.currentTarget.style.borderColor = 'var(--accent-primary)'; 
                e.currentTarget.style.color = 'var(--text-primary)'; 
                e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseOut={(e) => { 
                e.currentTarget.style.borderColor = 'var(--border-color)'; 
                e.currentTarget.style.color = 'var(--text-secondary)'; 
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {[
            { icon: LayoutTemplate, title: 'Intelligent Layouts', desc: 'AI automatically organizes your messy canvas into beautiful, structured diagrams and workflows.', color: '#3b82f6' },
            { icon: MessageSquare, title: 'Contextual Chat', desc: 'Chat with your canvas. Ask AI to summarize notes, find connections, or expand on ideas seamlessly.', color: '#10b981' },
            { icon: Box, title: 'Auto-Components', desc: 'Describe what you need, and AI generates fully functional, styled components instantly onto the board.', color: '#f59e0b' },
            { icon: Cpu, title: 'Smart Connections', desc: 'AI predicts and draws relationships between nodes, maintaining an organized and scalable architecture.', color: '#8b5cf6' },
          ].map((feature, i) => (
            <div key={i} className="ai-glass-panel ai-feature-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '16px', 
                background: `${feature.color}15`, color: feature.color, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `inset 0 0 0 1px ${feature.color}33`
              }}>
                <feature.icon size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>{feature.title}</h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
