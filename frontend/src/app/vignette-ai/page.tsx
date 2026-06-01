'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, LayoutTemplate, Box, Cpu, Clock, Code, FileText } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import Image from 'next/image';
import vignetteLogo from '@/app/workspaces/vignetteLogo.png';
import noRecentChatLight from '@/app/workspaces/noRecentChatLightMode.png';
import noRecentChatDark from '@/app/workspaces/noRecentChatBlackMode.png';

function FeatureCard({ feature }: { feature: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '24px',
        borderRadius: '20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.02)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        transition: 'box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s ease',
        borderColor: isHovered ? `${feature.color}66` : 'var(--border-color)',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${feature.color}20, transparent 80%)`
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', paddingTop: '2px' }}>{feature.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feature.desc}</p>
        </div>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: `${feature.color}15`, color: feature.color, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `inset 0 0 0 1px ${feature.color}33`,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        }}>
          <feature.icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}



export default function VignetteAIPage() {
  const [prompt, setPrompt] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  return (
    <main className="main-content" style={{ background: 'var(--bg-primary)', position: 'relative', overflowY: 'auto', overflowX: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
        }
        :root[data-theme="light"] .ai-glass-panel {
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .marquee-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(calc(-50% - 12px)); }
          100% { transform: translateX(0); }
        }
        .marquee-track-left {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll-left 35s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll-right 35s linear infinite;
        }
        .marquee-track-left:hover, .marquee-track-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div style={{ display: 'flex', gap: '48px', maxWidth: '1500px', width: '100%', margin: '0 auto', padding: '64px 48px', position: 'relative', zIndex: 1, alignItems: 'flex-start' }}>
        
        {/* Main Content Column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header Section */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', borderRadius: '100px', 
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, 
              marginBottom: '24px', boxShadow: 'var(--shadow-sm)' 
            }}>
              <Sparkles size={16} style={{ color: '#8b5cf6' }} /> Introducing Vignette AI
            </div>
            <h1 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1.1 }}>
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
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, margin: 0 }}>
              Generate complete architectures, brainstorm ideas, and organize your infinite canvas instantly using the power of generative AI.
            </p>
          </div>

          {/* AI Prompt Input Section */}
          <div className="ai-glass-panel" style={{ 
            padding: '12px', 
            marginBottom: '64px', 
            boxShadow: isInputFocused ? '0 32px 64px rgba(139, 92, 246, 0.15)' : '0 20px 40px rgba(0,0,0,0.08)',
            transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
            borderColor: isInputFocused ? 'var(--accent-primary)' : 'var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: '20px', padding: '8px 8px 8px 24px', border: '1px solid var(--border-color)' }}>
              <Image 
                src={vignetteLogo} 
                alt="Vignette AI Logo" 
                width={24} 
                height={24} 
                style={{ 
                  borderRadius: '6px', 
                  objectFit: 'cover', 
                  opacity: isInputFocused ? 1 : 0.6,
                  filter: isInputFocused ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' : 'grayscale(100%)',
                  transition: 'all 0.3s ease' 
                }} 
              />
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
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

          {/* Feature Marquee */}
          <div className="marquee-container">
            <div className="marquee-track-left">
              {[
                { icon: LayoutTemplate, title: 'Intelligent Layouts', desc: 'AI automatically organizes your messy canvas into beautiful, structured diagrams and workflows.', color: '#3b82f6' },
                { icon: MessageSquare, title: 'Contextual Chat', desc: 'Chat with your canvas. Ask AI to summarize notes, find connections, or expand on ideas seamlessly.', color: '#10b981' },
                { icon: Box, title: 'Auto-Components', desc: 'Describe what you need, and AI generates fully functional, styled components instantly onto the board.', color: '#f59e0b' },
                { icon: LayoutTemplate, title: 'Intelligent Layouts', desc: 'AI automatically organizes your messy canvas into beautiful, structured diagrams and workflows.', color: '#3b82f6' },
                { icon: MessageSquare, title: 'Contextual Chat', desc: 'Chat with your canvas. Ask AI to summarize notes, find connections, or expand on ideas seamlessly.', color: '#10b981' },
                { icon: Box, title: 'Auto-Components', desc: 'Describe what you need, and AI generates fully functional, styled components instantly onto the board.', color: '#f59e0b' },
              ].map((feature, i) => (
                <div key={i} style={{ width: '320px', minWidth: '320px' }}>
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>
            <div className="marquee-track-right">
              {[
                { icon: Cpu, title: 'Smart Connections', desc: 'AI predicts and draws relationships between nodes, maintaining an organized and scalable architecture.', color: '#8b5cf6' },
                { icon: Code, title: 'Code Export', desc: 'Instantly turn your visual diagrams and architectures into deployable boilerplate and configurations.', color: '#ef4444' },
                { icon: FileText, title: 'Note Extraction', desc: 'Automatically extract scattered stickies and text into structured, exportable markdown documents.', color: '#14b8a6' },
                { icon: Cpu, title: 'Smart Connections', desc: 'AI predicts and draws relationships between nodes, maintaining an organized and scalable architecture.', color: '#8b5cf6' },
                { icon: Code, title: 'Code Export', desc: 'Instantly turn your visual diagrams and architectures into deployable boilerplate and configurations.', color: '#ef4444' },
                { icon: FileText, title: 'Note Extraction', desc: 'Automatically extract scattered stickies and text into structured, exportable markdown documents.', color: '#14b8a6' },
              ].map((feature, i) => (
                <div key={i} style={{ width: '320px', minWidth: '320px' }}>
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Chats Sidebar */}
        <div className="ai-glass-panel" style={{
          width: '480px',
          marginTop: '180px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          top: '40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
            <div style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Clock size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Recent Chats</h2>
          </div>

          <div className="empty-state-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: '32px',
            textAlign: 'center',
            padding: '0',
            position: 'relative',
            marginTop: '0'
          }}>
            <style>{`
              .theme-img-dark { display: block; }
              .theme-img-light { display: none; }
              :root[data-theme="light"] .theme-img-dark { display: none; }
              :root[data-theme="light"] .theme-img-light { display: block; }
              
              .hologram-stage {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                perspective: 1000px;
              }
              
              .hologram-base {
                position: absolute;
                bottom: 0;
                width: 320px;
                height: 80px;
                background: radial-gradient(ellipse at center, var(--accent-primary) 0%, transparent 70%);
                opacity: 0.3;
                border-radius: 50%;
                filter: blur(10px);
                transform: rotateX(70deg);
                animation: base-pulse 4s infinite alternate;
              }
              
              .hologram-ring {
                position: absolute;
                bottom: 10px;
                width: 260px;
                height: 260px;
                border: 2px dashed var(--accent-primary);
                border-radius: 50%;
                opacity: 0.2;
                transform: rotateX(75deg);
                animation: ring-spin 20s linear infinite;
              }
              
              .hologram-ring-2 {
                position: absolute;
                bottom: 10px;
                width: 300px;
                height: 300px;
                border: 1px solid var(--accent-primary);
                border-radius: 50%;
                opacity: 0.1;
                transform: rotateX(75deg);
                animation: ring-spin-reverse 15s linear infinite;
              }

              .hologram-content {
                position: relative;
                z-index: 2;
                width: 100%;
                height: 100%;
                animation: float-hologram 6s ease-in-out infinite;
                filter: drop-shadow(0 30px 40px rgba(0,0,0,0.4));
                border-radius: 24px;
                overflow: hidden;
              }

              :root[data-theme="light"] .hologram-content {
                filter: drop-shadow(0 30px 40px rgba(139, 92, 246, 0.15));
              }

              @keyframes float-hologram {
                0% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-15px) scale(1.02); }
                100% { transform: translateY(0px) scale(1); }
              }
              
              @keyframes base-pulse {
                0% { opacity: 0.1; transform: rotateX(70deg) scale(0.9); }
                100% { opacity: 0.4; transform: rotateX(70deg) scale(1.1); }
              }
              
              @keyframes ring-spin {
                0% { transform: rotateX(75deg) rotate(0deg); }
                100% { transform: rotateX(75deg) rotate(360deg); }
              }
              
              @keyframes ring-spin-reverse {
                0% { transform: rotateX(75deg) rotate(360deg); }
                100% { transform: rotateX(75deg) rotate(0deg); }
              }
            `}</style>

            <div className="hologram-stage">
               <div className="hologram-base" />
               <div className="hologram-ring" />
               <div className="hologram-ring-2" />
               <div className="hologram-content">
                 <Image 
                    src={noRecentChatDark} 
                    alt="No recent activity" 
                    className="theme-img-dark"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} 
                 />
                 <Image 
                    src={noRecentChatLight} 
                    alt="No recent activity" 
                    className="theme-img-light"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} 
                 />
               </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
