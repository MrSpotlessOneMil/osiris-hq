'use client';

import { useState, useEffect } from 'react';

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  status: 'working' | 'idle' | 'thinking';
  currentTask: string;
  position: { x: number; y: number };
}

interface AgentRobotProps {
  agent: AgentStatus;
  onClick: () => void;
  isSelected: boolean;
}

export default function AgentRobot({ agent, onClick, isSelected }: AgentRobotProps) {
  const [bobOffset, setBobOffset] = useState(0);

  // Bobbing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBobOffset(Math.sin(Date.now() / 500) * 3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    working: '#22c55e',
    idle: '#6b7280',
    thinking: '#f59e0b',
  };

  const statusIcons = {
    working: '⚡',
    idle: '💤',
    thinking: '💭',
  };

  return (
    <div
      className="absolute transition-all duration-1000 ease-in-out cursor-pointer group"
      style={{
        left: `${agent.position.x}%`,
        top: `${agent.position.y}%`,
        transform: `translate(-50%, -50%) translateY(${bobOffset}px)`,
      }}
      onClick={onClick}
    >
      {/* Selection ring */}
      {isSelected && (
        <div 
          className="absolute -inset-4 rounded-full animate-pulse"
          style={{ 
            border: `2px solid ${agent.color}`,
            boxShadow: `0 0 20px ${agent.color}`,
          }}
        />
      )}

      {/* Robot body */}
      <div className="relative">
        {/* Status indicator */}
        <div 
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] z-10"
          style={{ backgroundColor: statusColors[agent.status] }}
        >
          {statusIcons[agent.status]}
        </div>

        {/* Main robot circle */}
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110"
          style={{ 
            backgroundColor: '#1a1a2e',
            border: `3px solid ${agent.color}`,
            boxShadow: `0 0 15px ${agent.color}40`,
          }}
        >
          {agent.emoji}
        </div>

        {/* Name tag */}
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span 
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ 
              backgroundColor: `${agent.color}20`,
              color: agent.color,
            }}
          >
            {agent.name}
          </span>
        </div>

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 rounded-lg px-3 py-2 text-xs whitespace-nowrap border border-gray-700">
            <div className="font-bold" style={{ color: agent.color }}>{agent.name} • {agent.role}</div>
            <div className="text-gray-400 mt-1">{agent.currentTask}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
