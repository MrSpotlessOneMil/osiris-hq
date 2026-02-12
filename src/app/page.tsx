'use client';

import { useState, useEffect } from 'react';

// ============== DATA ==============

const AGENTS = {
  osiris: { name: 'Osiris', emoji: '𓂀', color: '#9333ea', role: 'The Boss' },
  iris: { name: 'Iris', emoji: '🦞', color: '#ec4899', role: 'Marketing' },
  apollo: { name: 'Apollo', emoji: '🏹', color: '#f59e0b', role: 'Sales' },
  atlas: { name: 'Atlas', emoji: '🗺️', color: '#3b82f6', role: 'Product' },
  horus: { name: 'Horus', emoji: '🦅', color: '#22c55e', role: 'Success' },
  thoth: { name: 'Thoth', emoji: '📊', color: '#06b6d4', role: 'Data' },
} as const;

type AgentKey = keyof typeof AGENTS;

const STATIONS = [
  { id: 'sales', name: 'Sales HQ', emoji: '🏢', x: 15, y: 30, color: '#f59e0b' },
  { id: 'marketing', name: 'Content Studio', emoji: '🎬', x: 75, y: 25, color: '#ec4899' },
  { id: 'product', name: 'Dev Lab', emoji: '⚙️', x: 20, y: 70, color: '#3b82f6' },
  { id: 'success', name: 'Happy Place', emoji: '💚', x: 80, y: 65, color: '#22c55e' },
  { id: 'data', name: 'Brain Center', emoji: '🧠', x: 50, y: 80, color: '#06b6d4' },
  { id: 'hq', name: 'Command', emoji: '👑', x: 50, y: 20, color: '#9333ea' },
];

const CHATS = [
  { from: 'apollo', to: 'iris', message: "Got 3 new leads!" },
  { from: 'iris', to: 'apollo', message: "Nice! I'll make content about it" },
  { from: 'horus', to: 'thoth', message: "Clients are happy today" },
  { from: 'thoth', to: 'horus', message: "Stats confirm it 📈" },
  { from: 'atlas', to: 'osiris', message: "New feature shipped!" },
  { from: 'osiris', to: 'atlas', message: "Beautiful work ✨" },
  { from: 'iris', to: 'horus', message: "Can I get a testimonial?" },
  { from: 'horus', to: 'iris', message: "Got 5 ready for you!" },
  { from: 'apollo', to: 'osiris', message: "Demo went great!" },
  { from: 'osiris', to: 'apollo', message: "That's my guy 🏆" },
  { from: 'thoth', to: 'atlas', message: "Found a bug pattern" },
  { from: 'atlas', to: 'thoth', message: "On it! 🔧" },
];

interface AgentState {
  id: AgentKey;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: 'walking' | 'working' | 'chatting' | 'idle';
  direction: 'left' | 'right';
  chatBubble: string | null;
  chatWith: AgentKey | null;
}

// ============== COMPONENTS ==============

function Cloud({ x, delay }: { x: number; delay: number }) {
  return (
    <div 
      className="absolute text-5xl opacity-60 animate-float select-none pointer-events-none"
      style={{ 
        left: `${x}%`, 
        top: '5%',
        animationDelay: `${delay}s`,
        animationDuration: '8s'
      }}
    >
      ☁️
    </div>
  );
}

function Tree({ x, y, size }: { x: number; y: number; size: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-2xl', md: 'text-3xl', lg: 'text-4xl' };
  return (
    <div 
      className={`absolute ${sizes[size]} select-none pointer-events-none`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
    >
      🌳
    </div>
  );
}

function Flower({ x, y }: { x: number; y: number }) {
  const flowers = ['🌸', '🌼', '🌺', '💐', '🌻'];
  const flower = flowers[Math.floor((x + y) % flowers.length)];
  return (
    <div 
      className="absolute text-lg select-none pointer-events-none opacity-80"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {flower}
    </div>
  );
}

function Station({ station }: { station: typeof STATIONS[0] }) {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
    >
      {/* Building shadow */}
      <div className="absolute inset-0 bg-black/20 rounded-2xl blur-sm transform translate-y-2 scale-95" />
      
      {/* Building */}
      <div 
        className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-4 min-w-[100px]"
        style={{ borderColor: station.color }}
      >
        <div className="text-center">
          <span className="text-4xl block mb-1">{station.emoji}</span>
          <p className="text-xs font-bold text-zinc-700">{station.name}</p>
        </div>
        
        {/* Roof decoration */}
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 rounded-t-full"
          style={{ backgroundColor: station.color }}
        />
      </div>
    </div>
  );
}

function Agent({ agent }: { agent: AgentState }) {
  const data = AGENTS[agent.id];
  
  return (
    <div
      className="absolute z-20 transition-all ease-linear"
      style={{
        left: `${agent.x}%`,
        top: `${agent.y}%`,
        transform: 'translate(-50%, -50%)',
        transitionDuration: agent.state === 'walking' ? '2s' : '0s'
      }}
    >
      {/* Chat bubble */}
      {agent.chatBubble && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 animate-fadeIn">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-lg border-2 border-zinc-200 whitespace-nowrap max-w-[150px]">
            <p className="text-xs text-zinc-700 truncate">{agent.chatBubble}</p>
          </div>
          <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-zinc-200 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
        </div>
      )}
      
      {/* Agent body */}
      <div 
        className={`relative transition-transform ${agent.state === 'walking' ? 'animate-bounce' : ''}`}
        style={{ transform: agent.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
      >
        {/* Shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/20 rounded-full blur-sm" />
        
        {/* Character */}
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 bg-white"
          style={{ borderColor: data.color }}
        >
          {data.emoji}
        </div>
        
        {/* Working indicator */}
        {agent.state === 'working' && (
          <div className="absolute -top-1 -right-1">
            <span className="text-lg animate-pulse">⚡</span>
          </div>
        )}
        
        {/* Name tag */}
        <div 
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-white text-xs font-bold whitespace-nowrap"
          style={{ backgroundColor: data.color }}
        >
          {data.name}
        </div>
      </div>
    </div>
  );
}

function Sun() {
  return (
    <div className="absolute top-4 right-8 text-6xl animate-pulse select-none">
      ☀️
    </div>
  );
}

function Bird({ delay }: { delay: number }) {
  return (
    <div 
      className="absolute text-2xl animate-fly select-none pointer-events-none"
      style={{ 
        animationDelay: `${delay}s`,
        top: `${10 + Math.random() * 15}%`
      }}
    >
      🐦
    </div>
  );
}

// ============== MAIN ==============

export default function EmpireView() {
  const [agents, setAgents] = useState<AgentState[]>([
    { id: 'osiris', x: 50, y: 40, targetX: 50, targetY: 40, state: 'idle', direction: 'right', chatBubble: null, chatWith: null },
    { id: 'iris', x: 70, y: 35, targetX: 70, targetY: 35, state: 'working', direction: 'left', chatBubble: null, chatWith: null },
    { id: 'apollo', x: 20, y: 40, targetX: 20, targetY: 40, state: 'working', direction: 'right', chatBubble: null, chatWith: null },
    { id: 'atlas', x: 25, y: 60, targetX: 25, targetY: 60, state: 'working', direction: 'right', chatBubble: null, chatWith: null },
    { id: 'horus', x: 75, y: 55, targetX: 75, targetY: 55, state: 'working', direction: 'left', chatBubble: null, chatWith: null },
    { id: 'thoth', x: 55, y: 70, targetX: 55, targetY: 70, state: 'working', direction: 'left', chatBubble: null, chatWith: null },
  ]);

  // Agent movement and behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const roll = Math.random();
        
        // 30% chance to start walking to a new spot
        if (roll < 0.3 && agent.state !== 'chatting') {
          const newX = 15 + Math.random() * 70;
          const newY = 25 + Math.random() * 55;
          return {
            ...agent,
            x: newX,
            y: newY,
            state: 'walking' as const,
            direction: newX > agent.x ? 'right' as const : 'left' as const,
            chatBubble: null
          };
        }
        
        // 20% chance to start working
        if (roll < 0.5 && agent.state === 'walking') {
          return { ...agent, state: 'working' as const };
        }
        
        // 10% chance to go idle
        if (roll < 0.6 && agent.state === 'working') {
          return { ...agent, state: 'idle' as const };
        }
        
        return agent;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Chat system
  useEffect(() => {
    const interval = setInterval(() => {
      const chat = CHATS[Math.floor(Math.random() * CHATS.length)];
      
      setAgents(prev => prev.map(agent => {
        if (agent.id === chat.from) {
          return {
            ...agent,
            state: 'chatting' as const,
            chatBubble: chat.message,
            chatWith: chat.to as AgentKey
          };
        }
        return agent;
      }));

      // Clear chat after 3 seconds
      setTimeout(() => {
        setAgents(prev => prev.map(agent => ({
          ...agent,
          chatBubble: agent.chatBubble === chat.message ? null : agent.chatBubble,
          state: agent.chatBubble === chat.message ? 'idle' as const : agent.state,
          chatWith: agent.chatWith === chat.to ? null : agent.chatWith
        })));
      }, 3000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #90EE90 100%)'
        }}
      />
      
      {/* Grass texture overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 50% 90%, rgba(34, 197, 94, 0.4) 0%, transparent 40%)
          `
        }}
      />

      {/* Sun */}
      <Sun />

      {/* Clouds */}
      <Cloud x={10} delay={0} />
      <Cloud x={40} delay={2} />
      <Cloud x={70} delay={4} />
      <Cloud x={85} delay={1} />

      {/* Birds */}
      <Bird delay={0} />
      <Bird delay={3} />

      {/* Trees */}
      <Tree x={5} y={45} size="lg" />
      <Tree x={95} y={50} size="lg" />
      <Tree x={8} y={85} size="md" />
      <Tree x={92} y={80} size="md" />
      <Tree x={3} y={65} size="sm" />
      <Tree x={97} y={35} size="sm" />

      {/* Flowers scattered around */}
      <Flower x={12} y={55} />
      <Flower x={88} y={45} />
      <Flower x={25} y={85} />
      <Flower x={75} y={90} />
      <Flower x={45} y={95} />
      <Flower x={60} y={88} />
      <Flower x={35} y={50} />
      <Flower x={65} y={45} />

      {/* Stations */}
      {STATIONS.map(station => (
        <Station key={station.id} station={station} />
      ))}

      {/* Agents */}
      {agents.map(agent => (
        <Agent key={agent.id} agent={agent} />
      ))}

      {/* Title card */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl border-4 border-purple-400">
        <div className="flex items-center gap-3">
          <span className="text-3xl">𓂀</span>
          <div>
            <h1 className="text-xl font-black text-purple-600">OSIRIS AI</h1>
            <p className="text-xs text-zinc-500">The Team at Work</p>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border-2 border-zinc-200">
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-lg font-bold text-green-500">$1,750</p>
            <p className="text-xs text-zinc-500">MRR</p>
          </div>
          <div className="w-px h-8 bg-zinc-300" />
          <div className="text-center">
            <p className="text-lg font-bold text-purple-500">2</p>
            <p className="text-xs text-zinc-500">Clients</p>
          </div>
          <div className="w-px h-8 bg-zinc-300" />
          <div className="text-center">
            <p className="text-lg font-bold text-orange-500">6</p>
            <p className="text-xs text-zinc-500">Agents</p>
          </div>
        </div>
      </div>

      {/* Made with love */}
      <div className="absolute bottom-4 right-4 text-xs text-white/60">
        watching your empire grow 🌱
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes fly {
          0% { left: -5%; }
          100% { left: 105%; }
        }
        .animate-fly {
          animation: fly 20s linear infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
