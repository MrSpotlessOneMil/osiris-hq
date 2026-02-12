'use client';

import { useState, useEffect } from 'react';
import SpaceBackground from '@/components/SpaceBackground';
import FloatingPlatform from '@/components/FloatingPlatform';
import AgentRobot from '@/components/AgentRobot';
import StatusPanel from '@/components/StatusPanel';
import KPIBar from '@/components/KPIBar';

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

const initialAgents: AgentStatus[] = [
  { id: 'osiris', name: 'Osiris', role: 'COO', emoji: '𓂀', color: '#FFD700', status: 'working', currentTask: 'Coordinating team operations', position: { x: 50, y: 30 } },
  { id: 'iris', name: 'Iris', role: 'CMO', emoji: '🌸', color: '#FF69B4', status: 'working', currentTask: 'Writing video scripts', position: { x: 20, y: 50 } },
  { id: 'apollo', name: 'Apollo', role: 'CRO', emoji: '☀️', color: '#FFA500', status: 'idle', currentTask: 'Building lead list', position: { x: 80, y: 50 } },
  { id: 'atlas', name: 'Atlas', role: 'CPO', emoji: '🏛️', color: '#4169E1', status: 'thinking', currentTask: 'Planning roadmap', position: { x: 30, y: 70 } },
  { id: 'horus', name: 'Horus', role: 'CSO', emoji: '👁️', color: '#32CD32', status: 'working', currentTask: 'Client check-ins', position: { x: 70, y: 70 } },
  { id: 'thoth', name: 'Thoth', role: 'CDO', emoji: '📊', color: '#9370DB', status: 'idle', currentTask: 'Updating metrics', position: { x: 50, y: 85 } },
];

export default function Home() {
  const [agents, setAgents] = useState<AgentStatus[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<AgentStatus | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    '🚀 System initialized',
    '𓂀 Osiris coordinating morning tasks',
    '🌸 Iris drafting 3 new scripts',
  ]);

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.7 ? 
          (['working', 'idle', 'thinking'] as const)[Math.floor(Math.random() * 3)] : 
          agent.status,
        position: {
          x: agent.position.x + (Math.random() - 0.5) * 2,
          y: agent.position.y + (Math.random() - 0.5) * 2,
        }
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <SpaceBackground />
      
      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          OSIRIS HQ
        </h1>
        <p className="text-center text-gray-400 text-sm">AI Executive Command Center</p>
      </div>

      {/* KPI Bar */}
      <KPIBar />

      {/* Main Platform */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[800px] h-[600px]">
          <FloatingPlatform />
          
          {/* Agents */}
          {agents.map(agent => (
            <AgentRobot
              key={agent.id}
              agent={agent}
              onClick={() => setSelectedAgent(agent)}
              isSelected={selectedAgent?.id === agent.id}
            />
          ))}
        </div>
      </div>

      {/* Status Panel */}
      <StatusPanel 
        agent={selectedAgent} 
        notifications={notifications}
        onClose={() => setSelectedAgent(null)}
      />

      {/* Notifications Feed */}
      <div className="absolute bottom-4 left-4 w-80 z-20">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg border border-gray-700 p-3">
          <h3 className="text-xs font-bold text-gray-400 mb-2">ACTIVITY FEED</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {notifications.slice(-5).reverse().map((note, i) => (
              <p key={i} className="text-xs text-gray-300">{note}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
