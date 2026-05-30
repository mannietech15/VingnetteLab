'use client';

import React from 'react';

// Generates a unique geometric SVG preview for each template based on its pattern type
interface Props {
  pattern: string;
  color: string;
  width?: number;
  height?: number;
}

export default function TemplatePreview({ pattern, color, width = 400, height = 240 }: Props) {
  const bg = '#f8fafc';
  const light = color + '30';
  const mid = color + '60';

  const patterns: Record<string, React.ReactNode> = {
    grid_2x2: (
      <>
        <rect x="20" y="20" width="170" height="95" rx="6" fill={light} stroke={color} strokeWidth="1.5"/>
        <rect x="210" y="20" width="170" height="95" rx="6" fill={mid} stroke={color} strokeWidth="1.5"/>
        <rect x="20" y="130" width="170" height="95" rx="6" fill={mid} stroke={color} strokeWidth="1.5"/>
        <rect x="210" y="130" width="170" height="95" rx="6" fill={light} stroke={color} strokeWidth="1.5"/>
        {[40,60,80].map(y=><line key={y} x1="35" y1={y} x2="170" y2={y} stroke={color} strokeWidth="1" opacity="0.3"/>)}
        {[40,60,80].map(y=><line key={`r${y}`} x1="225" y1={y} x2="360" y2={y} stroke={color} strokeWidth="1" opacity="0.3"/>)}
      </>
    ),
    columns_3: (
      <>
        {[20, 145, 270].map((x, i) => (
          <g key={i}>
            <rect x={x} y="15" width="110" height="28" rx="6" fill={color} opacity="0.8"/>
            {[55, 90, 125, 155].map((cy, j) => (
              <rect key={j} x={x+5} y={cy} width="100" height="24" rx="4" fill={light} stroke={color} strokeWidth="0.5" opacity={j < 3 ? 1 : 0.5}/>
            ))}
          </g>
        ))}
      </>
    ),
    columns_4: (
      <>
        {[15, 110, 205, 300].map((x, i) => (
          <g key={i}>
            <rect x={x} y="15" width="85" height="22" rx="5" fill={color} opacity={0.6 + i*0.1}/>
            {[50, 78, 106, 134, 162].map((cy, j) => (
              <rect key={j} x={x+4} y={cy} width="77" height="20" rx="3" fill={light} stroke={color} strokeWidth="0.5"/>
            ))}
          </g>
        ))}
      </>
    ),
    hierarchy: (
      <>
        <rect x="155" y="15" width="90" height="30" rx="6" fill={color} opacity="0.9"/>
        <line x1="200" y1="45" x2="200" y2="65" stroke={color} strokeWidth="1.5"/>
        <line x1="80" y1="65" x2="320" y2="65" stroke={color} strokeWidth="1.5"/>
        {[80, 200, 320].map((cx,i) => (
          <g key={i}>
            <line x1={cx} y1="65" x2={cx} y2="80" stroke={color} strokeWidth="1.5"/>
            <rect x={cx-40} y="80" width="80" height="26" rx="5" fill={mid}/>
            <line x1={cx} y1="106" x2={cx} y2="120" stroke={color} strokeWidth="1"/>
            {[cx-30, cx+10].map((sx,j)=>(
              <rect key={j} x={sx} y="125" width="35" height="22" rx="4" fill={light} stroke={color} strokeWidth="0.5"/>
            ))}
          </g>
        ))}
      </>
    ),
    timeline_h: (
      <>
        <line x1="20" y1="120" x2="380" y2="120" stroke={color} strokeWidth="2"/>
        {[60, 130, 200, 270, 340].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy="120" r="6" fill={color}/>
            <rect x={cx-28} y={i%2===0?70:135} width="56" height="35" rx="5" fill={i%2===0?mid:light} stroke={color} strokeWidth="0.5"/>
            <line x1={cx-20} y1={i%2===0?85:150} x2={cx+20} y2={i%2===0?85:150} stroke={color} strokeWidth="0.8" opacity="0.4"/>
            <line x1={cx-20} y1={i%2===0?93:158} x2={cx+12} y2={i%2===0?93:158} stroke={color} strokeWidth="0.8" opacity="0.3"/>
          </g>
        ))}
      </>
    ),
    flowchart: (
      <>
        <rect x="155" y="10" width="90" height="28" rx="14" fill={color} opacity="0.8"/>
        <line x1="200" y1="38" x2="200" y2="55" stroke={color} strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <rect x="155" y="55" width="90" height="28" rx="4" fill={mid}/>
        <line x1="200" y1="83" x2="200" y2="100" stroke={color} strokeWidth="1.5"/>
        <polygon points="200,100 230,120 200,140 170,120" fill={light} stroke={color} strokeWidth="1.5"/>
        <line x1="170" y1="120" x2="80" y2="120" stroke={color} strokeWidth="1"/>
        <line x1="230" y1="120" x2="320" y2="120" stroke={color} strokeWidth="1"/>
        <rect x="40" y="107" width="80" height="26" rx="4" fill={mid}/>
        <rect x="280" y="107" width="80" height="26" rx="4" fill={mid}/>
        <line x1="200" y1="140" x2="200" y2="160" stroke={color} strokeWidth="1.5"/>
        <rect x="155" y="160" width="90" height="28" rx="14" fill={color} opacity="0.6"/>
        <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={color}/></marker></defs>
      </>
    ),
    cards_grid: (
      <>
        {[0,1,2,3,4,5].map(i => {
          const x = 20 + (i%3)*130;
          const y = 15 + Math.floor(i/3)*110;
          return (
            <g key={i}>
              <rect x={x} y={y} width="115" height="95" rx="8" fill="white" stroke={color} strokeWidth="1" opacity="0.8"/>
              <rect x={x+8} y={y+8} width="99" height="35" rx="4" fill={light}/>
              <line x1={x+12} y1={y+55} x2={x+100} y2={y+55} stroke={color} strokeWidth="1" opacity="0.3"/>
              <line x1={x+12} y1={y+67} x2={x+80} y2={y+67} stroke={color} strokeWidth="1" opacity="0.2"/>
              <line x1={x+12} y1={y+79} x2={x+60} y2={y+79} stroke={color} strokeWidth="1" opacity="0.15"/>
            </g>
          );
        })}
      </>
    ),
    sticky_notes: (
      <>
        {[
          {x:30,y:20,c:'#fbbf24'},{x:110,y:40,c:'#fb923c'},{x:200,y:15,c:'#a78bfa'},
          {x:290,y:35,c:'#34d399'},{x:60,y:110,c:'#f472b6'},{x:160,y:100,c:'#60a5fa'},
          {x:260,y:120,c:'#fbbf24'},{x:340,y:90,c:'#f472b6'},{x:100,y:180,c:'#34d399'},
          {x:220,y:190,c:'#a78bfa'},{x:320,y:180,c:'#60a5fa'},
        ].map((n,i) => (
          <g key={i} transform={`rotate(${(i*7-15)%20}, ${n.x+30}, ${n.y+25})`}>
            <rect x={n.x} y={n.y} width="60" height="50" rx="2" fill={n.c} opacity="0.7"/>
            <line x1={n.x+8} y1={n.y+15} x2={n.x+52} y2={n.y+15} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
            <line x1={n.x+8} y1={n.y+25} x2={n.x+45} y2={n.y+25} stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
            <line x1={n.x+8} y1={n.y+35} x2={n.x+38} y2={n.y+35} stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
          </g>
        ))}
      </>
    ),
    mindmap: (
      <>
        <rect x="150" y="95" width="100" height="40" rx="20" fill={color} opacity="0.85"/>
        {[
          {x:40,y:40},{x:300,y:30},{x:320,y:160},{x:50,y:170},{x:180,y:10},{x:170,y:200}
        ].map((n,i)=>(
          <g key={i}>
            <line x1="200" y1="115" x2={n.x+30} y2={n.y+13} stroke={color} strokeWidth="1.5" opacity="0.4"/>
            <rect x={n.x} y={n.y} width="60" height="26" rx="13" fill={mid}/>
          </g>
        ))}
      </>
    ),
    radar: (
      <>
        {[1,2,3].map(r=>(
          <polygon key={r} points={Array.from({length:6}).map((_,i)=>{
            const a = (i*60-90)*Math.PI/180;
            const R = r*35;
            return `${200+Math.cos(a)*R},${120+Math.sin(a)*R}`;
          }).join(' ')} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"/>
        ))}
        <polygon points={Array.from({length:6}).map((_,i)=>{
          const a = (i*60-90)*Math.PI/180;
          const R = [80,60,95,45,70,55][i];
          return `${200+Math.cos(a)*R},${120+Math.sin(a)*R}`;
        }).join(' ')} fill={light} stroke={color} strokeWidth="2"/>
        {Array.from({length:6}).map((_,i)=>{
          const a = (i*60-90)*Math.PI/180;
          const R = [80,60,95,45,70,55][i];
          return <circle key={i} cx={200+Math.cos(a)*R} cy={120+Math.sin(a)*R} r="4" fill={color}/>;
        })}
      </>
    ),
    venn: (
      <>
        <circle cx="160" cy="115" r="70" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
        <circle cx="240" cy="115" r="70" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
        <circle cx="200" cy="170" r="70" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
        <text x="130" y="100" fontSize="10" fill={color} fontWeight="600" textAnchor="middle" opacity="0.6">A</text>
        <text x="270" y="100" fontSize="10" fill={color} fontWeight="600" textAnchor="middle" opacity="0.6">B</text>
        <text x="200" y="210" fontSize="10" fill={color} fontWeight="600" textAnchor="middle" opacity="0.6">C</text>
      </>
    ),
    bars: (
      <>
        <line x1="50" y1="200" x2="380" y2="200" stroke={color} strokeWidth="1" opacity="0.3"/>
        <line x1="50" y1="20" x2="50" y2="200" stroke={color} strokeWidth="1" opacity="0.3"/>
        {[70, 120, 170, 220, 270, 320].map((x, i) => {
          const h = [120, 80, 150, 60, 130, 95][i];
          return <rect key={i} x={x} y={200-h} width="35" height={h} rx="4" fill={color} opacity={0.4 + i*0.08}/>;
        })}
      </>
    ),
    kanban: (
      <>
        {[20, 145, 270].map((x, i) => (
          <g key={i}>
            <rect x={x} y="10" width="110" height="220" rx="8" fill={light} opacity="0.5"/>
            <rect x={x} y="10" width="110" height="28" rx="8" fill={color} opacity={0.5 + i*0.15}/>
            {[50, 85, 120, 155].slice(0, 4-i).map((cy, j) => (
              <rect key={j} x={x+8} y={cy} width="94" height="28" rx="5" fill="white" stroke={color} strokeWidth="0.5" opacity="0.9"/>
            ))}
          </g>
        ))}
      </>
    ),
    table: (
      <>
        <rect x="20" y="15" width="360" height="30" rx="6" fill={color} opacity="0.7"/>
        {[0,1,2,3,4,5].map(r=>(
          <g key={r}>
            <rect x="20" y={50+r*32} width="360" height="28" rx="0" fill={r%2===0?light:'transparent'} opacity="0.3"/>
            {[20,110,200,290].map((cx,c)=>(
              <line key={c} x1={cx+10} y1={56+r*32} x2={cx+75} y2={56+r*32} stroke={color} strokeWidth="1" opacity="0.2"/>
            ))}
          </g>
        ))}
        {[110,200,290].map(x=><line key={x} x1={x} y1="15" x2={x} y2="240" stroke={color} strokeWidth="0.5" opacity="0.15"/>)}
      </>
    ),
    circle_segments: (
      <>
        {[0,1,2,3,4].map(i=>{
          const a1 = i*72-90;
          const a2 = (i+1)*72-90;
          const r = 85;
          const x1 = 200+Math.cos(a1*Math.PI/180)*r;
          const y1 = 120+Math.sin(a1*Math.PI/180)*r;
          const x2 = 200+Math.cos(a2*Math.PI/180)*r;
          const y2 = 120+Math.sin(a2*Math.PI/180)*r;
          return <path key={i} d={`M200,120 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={color} opacity={0.2+i*0.12} stroke="white" strokeWidth="2"/>;
        })}
        <circle cx="200" cy="120" r="30" fill="white" stroke={color} strokeWidth="1.5"/>
      </>
    ),
    process_arrows: (
      <>
        {[0,1,2,3,4].map(i=>{
          const x = 15 + i*78;
          return (
            <g key={i}>
              <polygon points={`${x},80 ${x+55},80 ${x+70},120 ${x+55},160 ${x},160 ${i===0?x:x+15},120`} fill={color} opacity={0.3+i*0.12}/>
              <line x1={x+20} y1={115} x2={x+50} y2={115} stroke="white" strokeWidth="1.5" opacity="0.6"/>
              <line x1={x+20} y1={125} x2={x+42} y2={125} stroke="white" strokeWidth="1" opacity="0.4"/>
            </g>
          );
        })}
      </>
    ),
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 400 240`} xmlns="http://www.w3.org/2000/svg" style={{ background: bg, borderRadius: '8px 8px 0 0' }}>
      {/* Subtle dot grid background */}
      <defs>
        <pattern id={`dots-${pattern}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.8" fill={color} opacity="0.08"/>
        </pattern>
      </defs>
      <rect width="400" height="240" fill={`url(#dots-${pattern})`}/>
      {patterns[pattern] || patterns['cards_grid']}
    </svg>
  );
}
