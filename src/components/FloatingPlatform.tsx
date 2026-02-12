'use client';

export default function FloatingPlatform() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Main hexagonal platform */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-3xl opacity-30">
          <div 
            className="w-[600px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.1) 40%, transparent 70%)',
            }}
          />
        </div>

        {/* Platform base */}
        <svg viewBox="0 0 600 500" className="w-[600px] h-[500px] relative z-10">
          {/* Platform shadow */}
          <ellipse cx="300" cy="400" rx="250" ry="60" fill="rgba(0,0,0,0.5)" />
          
          {/* Main platform surface */}
          <defs>
            <linearGradient id="platformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a2a3a" />
              <stop offset="50%" stopColor="#1a1a2a" />
              <stop offset="100%" stopColor="#0a0a1a" />
            </linearGradient>
            <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ff8c00" />
            </linearGradient>
          </defs>

          {/* Hexagonal platform */}
          <polygon 
            points="300,50 520,150 520,350 300,450 80,350 80,150" 
            fill="url(#platformGradient)"
            stroke="url(#edgeGlow)"
            strokeWidth="2"
          />

          {/* Grid lines on platform */}
          {[150, 250, 350].map((y) => (
            <line key={y} x1="100" y1={y} x2="500" y2={y} stroke="rgba(255,215,0,0.1)" strokeWidth="1" />
          ))}
          {[150, 225, 300, 375, 450].map((x) => (
            <line key={x} x1={x} y1="100" x2={x} y2="400" stroke="rgba(255,215,0,0.1)" strokeWidth="1" />
          ))}

          {/* Center emblem */}
          <circle cx="300" cy="250" r="40" fill="rgba(255,215,0,0.1)" stroke="#ffd700" strokeWidth="2" />
          <text x="300" y="260" textAnchor="middle" fill="#ffd700" fontSize="30">𓂀</text>

          {/* Workstation indicators */}
          {[
            { x: 300, y: 120, label: 'CMD' },
            { x: 150, y: 200, label: 'CMO' },
            { x: 450, y: 200, label: 'CRO' },
            { x: 150, y: 330, label: 'CPO' },
            { x: 450, y: 330, label: 'CSO' },
            { x: 300, y: 380, label: 'CDO' },
          ].map((station, i) => (
            <g key={i}>
              <rect 
                x={station.x - 25} 
                y={station.y - 15} 
                width="50" 
                height="30" 
                rx="5"
                fill="rgba(0,0,0,0.5)"
                stroke="rgba(255,215,0,0.3)"
                strokeWidth="1"
              />
              <text 
                x={station.x} 
                y={station.y + 5} 
                textAnchor="middle" 
                fill="rgba(255,215,0,0.6)" 
                fontSize="10"
                fontFamily="monospace"
              >
                {station.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
