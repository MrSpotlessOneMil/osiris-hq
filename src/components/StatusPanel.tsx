'use client';

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

interface StatusPanelProps {
  agent: AgentStatus | null;
  notifications: string[];
  onClose: () => void;
}

export default function StatusPanel({ agent, notifications, onClose }: StatusPanelProps) {
  if (!agent) return null;

  const stats = {
    osiris: { tasksCompleted: 47, efficiency: 94 },
    iris: { tasksCompleted: 23, contentCreated: 12 },
    apollo: { tasksCompleted: 31, leadsGenerated: 156 },
    atlas: { tasksCompleted: 18, featuresShipped: 4 },
    horus: { tasksCompleted: 29, clientsSatisfied: 8 },
    thoth: { tasksCompleted: 15, reportsGenerated: 7 },
  };

  const agentStats = stats[agent.id as keyof typeof stats] || { tasksCompleted: 0 };

  return (
    <div className="absolute top-20 right-4 w-80 z-30">
      <div 
        className="bg-black/80 backdrop-blur-md rounded-xl border overflow-hidden"
        style={{ borderColor: agent.color }}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: `${agent.color}20` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ 
                backgroundColor: '#1a1a2e',
                border: `2px solid ${agent.color}`,
              }}
            >
              {agent.emoji}
            </div>
            <div>
              <h2 className="font-bold text-white">{agent.name}</h2>
              <p className="text-sm" style={{ color: agent.color }}>{agent.role}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${
              agent.status === 'working' ? 'bg-green-500' :
              agent.status === 'thinking' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span className="text-sm text-gray-300 capitalize">{agent.status}</span>
          </div>
          <p className="text-sm text-gray-400">{agent.currentTask}</p>
        </div>

        {/* Stats */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {Object.entries(agentStats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold" style={{ color: agent.color }}>{value}</div>
              <div className="text-xs text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-800">
          <h3 className="text-xs font-bold text-gray-500 mb-2">QUICK ACTIONS</h3>
          <div className="flex gap-2">
            <button 
              className="flex-1 px-3 py-2 rounded text-xs font-medium transition-colors"
              style={{ 
                backgroundColor: `${agent.color}20`,
                color: agent.color,
              }}
            >
              Assign Task
            </button>
            <button 
              className="flex-1 px-3 py-2 rounded text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
