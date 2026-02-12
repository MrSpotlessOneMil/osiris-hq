'use client';

import { useState, useEffect } from 'react';

// AI Executive Team
const executives = {
  osiris: { name: 'Osiris', role: 'COO', emoji: '𓂀', color: '#a855f7', description: 'Coordination & Strategy' },
  iris: { name: 'Iris', role: 'CMO', emoji: '🦞', color: '#ec4899', description: 'Content & Marketing' },
  apollo: { name: 'Apollo', role: 'CRO', emoji: '🏹', color: '#f59e0b', description: 'Sales & Revenue' },
  atlas: { name: 'Atlas', role: 'CPO', emoji: '🗺️', color: '#3b82f6', description: 'Product Development' },
  horus: { name: 'Horus', role: 'CSO', emoji: '🦅', color: '#22c55e', description: 'Customer Success' },
  thoth: { name: 'Thoth', role: 'CDO', emoji: '📊', color: '#06b6d4', description: 'Data & Analytics' },
};

type ExecutiveKey = keyof typeof executives;

// Types
interface Agent {
  id: ExecutiveKey;
  x: number;
  y: number;
  status: 'working' | 'idle' | 'moving';
  currentTask: string;
}

interface Activity {
  id: number;
  agent: ExecutiveKey;
  action: string;
  timestamp: Date;
}

// Agent Avatar Component
function AgentAvatar({ agent }: { agent: Agent }) {
  const exec = executives[agent.id];
  
  return (
    <div
      className="absolute transition-all duration-1000 ease-in-out z-20 cursor-pointer group"
      style={{
        left: `${agent.x}%`,
        top: `${agent.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={`relative ${agent.status === 'moving' ? 'animate-bounce' : ''}`}>
        {/* Glow effect when working */}
        {agent.status === 'working' && (
          <div 
            className="absolute inset-0 rounded-full blur-md animate-pulse"
            style={{ backgroundColor: exec.color, opacity: 0.4, transform: 'scale(1.5)' }}
          />
        )}
        
        {/* Avatar */}
        <div 
          className="relative w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2"
          style={{ 
            backgroundColor: `${exec.color}20`,
            borderColor: exec.color,
            boxShadow: agent.status === 'working' ? `0 0 20px ${exec.color}` : 'none'
          }}
        >
          {exec.emoji}
        </div>
        
        {/* Status indicator */}
        <div 
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${
            agent.status === 'working' ? 'bg-green-400 animate-pulse' : 
            agent.status === 'moving' ? 'bg-yellow-400' : 'bg-zinc-500'
          }`}
        />
        
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 whitespace-nowrap">
            <p className="font-bold text-sm" style={{ color: exec.color }}>{exec.name}</p>
            <p className="text-xs text-zinc-400">{exec.role} • {exec.description}</p>
            <p className="text-xs text-zinc-500 mt-1">{agent.currentTask}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Station Component
function Station({ 
  exec,
  x, 
  y, 
  metrics
}: { 
  exec: typeof executives[ExecutiveKey];
  x: number;
  y: number;
  metrics: { label: string; value: string }[];
}) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Station platform */}
      <div 
        className="relative p-4 rounded-xl border backdrop-blur-sm min-w-[140px]"
        style={{ 
          backgroundColor: `${exec.color}10`,
          borderColor: `${exec.color}40`,
          boxShadow: `0 0 30px ${exec.color}20`
        }}
      >
        <div className="text-center mb-3">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{exec.role}</p>
          <p className="font-bold" style={{ color: exec.color }}>{exec.name}</p>
        </div>
        
        <div className="space-y-2">
          {metrics.map((m, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">{m.label}</span>
              <span className="font-mono font-bold text-white">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Resource Counter
function ResourceCounter({ icon, label, value, color, subtext }: { 
  icon: string; 
  label: string; 
  value: string; 
  color: string;
  subtext?: string;
}) {
  return (
    <div className={`flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm px-4 py-3 rounded-xl border ${color}`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="font-bold text-white text-lg">{value}</p>
        {subtext && <p className="text-xs text-zinc-500">{subtext}</p>}
      </div>
    </div>
  );
}

// Activity Feed
function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 h-full">
      <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Team Activity
      </h3>
      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {activities.map((activity) => {
          const exec = executives[activity.agent];
          return (
            <div key={activity.id} className="flex items-start gap-2 text-sm animate-fadeIn py-2 border-b border-zinc-800/50 last:border-0">
              <span>{exec.emoji}</span>
              <div>
                <span className="font-medium" style={{ color: exec.color }}>{exec.name}</span>
                <span className="text-zinc-400"> {activity.action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Client Card
function ClientCard({ name, mrr, health, agentAssigned }: { 
  name: string; 
  mrr: string; 
  health: 'excellent' | 'good' | 'attention';
  agentAssigned: ExecutiveKey;
}) {
  const exec = executives[agentAssigned];
  const healthColors = {
    excellent: 'bg-green-400',
    good: 'bg-blue-400',
    attention: 'bg-yellow-400'
  };

  return (
    <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800 hover:border-purple-500/50 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{name}</span>
        <div className={`w-2 h-2 rounded-full ${healthColors[health]}`} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-green-400 font-bold">{mrr}</span>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <span>{exec.emoji}</span>
          <span>{exec.name}</span>
        </div>
      </div>
    </div>
  );
}

// Command Bar
function CommandBar() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [respondingAgent, setRespondingAgent] = useState<ExecutiveKey | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Determine which agent should respond
    const q = query.toLowerCase();
    let agent: ExecutiveKey = 'osiris';
    if (q.includes('content') || q.includes('social') || q.includes('marketing')) agent = 'iris';
    else if (q.includes('sales') || q.includes('lead') || q.includes('outbound') || q.includes('revenue')) agent = 'apollo';
    else if (q.includes('product') || q.includes('feature') || q.includes('build')) agent = 'atlas';
    else if (q.includes('customer') || q.includes('review') || q.includes('retention')) agent = 'horus';
    else if (q.includes('data') || q.includes('metric') || q.includes('analytics')) agent = 'thoth';
    
    setRespondingAgent(agent);
    
    setTimeout(() => {
      const responses: Record<ExecutiveKey, string> = {
        osiris: "All systems nominal. WinBros conversion at 67%, Cedar Rapids ramping up. Apollo has 15 leads in pipeline, Iris scheduled 3 posts for tomorrow. Recommend we focus on closing the Des Moines prospect this week.",
        iris: "Content performance: Last Reel hit 2.3K views. Scripts ready for tomorrow's filming session. Competitor Housecall Pro just posted about their AI — I'm drafting a response video positioning us as founder-built, not corporate.",
        apollo: "Pipeline status: 15 warm leads, 3 qualified, 2 demo calls scheduled this week. Top prospect: Des Moines Cleaning Co ($3K MRR potential). Outbound campaign sent 47 emails today, 12% open rate.",
        atlas: "Product roadmap: Multi-tenant dashboard 60% complete. Jack pushed pricing engine update yesterday. Priority bug: Cedar Rapids timezone offset on calendar sync. ETA fix: tomorrow.",
        horus: "Customer health: WinBros green across all metrics. Cedar Rapids had 1 missed callback — followed up, resolved. Review request sent to 5 completed jobs, expecting 3 new 5-stars this week.",
        thoth: "Key metrics: $1,750 MRR (+15% MoM), 67% call-to-booking conversion, $425 avg job value. Anomaly detected: WinBros call volume up 23% — likely seasonal. Forecast: $2,100 MRR by month end."
      };
      
      setResponse(responses[agent]);
      setIsLoading(false);
    }, 1500);
    
    setQuery('');
  };

  const exec = respondingAgent ? executives[respondingAgent] : executives.osiris;

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-purple-500/30 p-4 shadow-2xl">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <span className="text-2xl">𓂀</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask your team anything... (try 'sales pipeline' or 'content performance')"
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-500"
        />
        <button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Ask
        </button>
      </form>
      
      {(isLoading || response) && (
        <div className="mt-4 pt-4 border-t border-zinc-700/50">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{exec.emoji}</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: exec.color, animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: exec.color, animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: exec.color, animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-zinc-400">{exec.name} is analyzing...</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <span className="text-xl">{exec.emoji}</span>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: exec.color }}>{exec.name} ({exec.role})</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{response}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'osiris', x: 50, y: 20, status: 'working', currentTask: 'Coordinating team operations' },
    { id: 'iris', x: 20, y: 40, status: 'working', currentTask: 'Scheduling content posts' },
    { id: 'apollo', x: 80, y: 40, status: 'working', currentTask: 'Following up on leads' },
    { id: 'atlas', x: 20, y: 70, status: 'idle', currentTask: 'Reviewing PRD updates' },
    { id: 'horus', x: 80, y: 70, status: 'working', currentTask: 'Sending review requests' },
    { id: 'thoth', x: 50, y: 85, status: 'working', currentTask: 'Generating daily report' },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, agent: 'apollo', action: 'qualified a new lead from Cedar Rapids', timestamp: new Date() },
    { id: 2, agent: 'horus', action: 'received 5-star review for WinBros', timestamp: new Date() },
    { id: 3, agent: 'iris', action: 'scheduled tomorrow\'s content post', timestamp: new Date() },
    { id: 4, agent: 'thoth', action: 'detected 23% call volume increase', timestamp: new Date() },
    { id: 5, agent: 'osiris', action: 'updated morning brief for Dominic', timestamp: new Date() },
    { id: 6, agent: 'atlas', action: 'synced with Jack on pricing engine', timestamp: new Date() },
  ]);

  // Animate agents
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (Math.random() > 0.7) {
          const statuses: Agent['status'][] = ['working', 'working', 'working', 'idle', 'moving'];
          const tasks: Record<ExecutiveKey, string[]> = {
            osiris: ['Coordinating team operations', 'Preparing briefing', 'Reviewing metrics', 'Strategic planning'],
            iris: ['Scheduling content posts', 'Writing video script', 'Analyzing engagement', 'Monitoring competitors'],
            apollo: ['Following up on leads', 'Sending outbound emails', 'Scheduling demo call', 'Updating pipeline'],
            atlas: ['Reviewing PRD updates', 'Testing new feature', 'Bug triage', 'Syncing with Jack'],
            horus: ['Sending review requests', 'Customer check-in', 'Resolving support ticket', 'Onboarding new client'],
            thoth: ['Generating daily report', 'Analyzing conversion data', 'Forecasting MRR', 'Detecting anomalies'],
          };
          
          return {
            ...agent,
            x: agent.x + (Math.random() - 0.5) * 8,
            y: agent.y + (Math.random() - 0.5) * 8,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            currentTask: tasks[agent.id][Math.floor(Math.random() * tasks[agent.id].length)]
          };
        }
        return agent;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Add new activities
  useEffect(() => {
    const newActivities: { agent: ExecutiveKey; action: string }[] = [
      { agent: 'apollo', action: 'sent follow-up to warm lead' },
      { agent: 'horus', action: 'completed customer check-in call' },
      { agent: 'iris', action: 'drafted new video hook' },
      { agent: 'thoth', action: 'updated conversion metrics' },
      { agent: 'osiris', action: 'synced priorities with team' },
      { agent: 'atlas', action: 'pushed code update to staging' },
      { agent: 'apollo', action: 'booked demo call for Thursday' },
      { agent: 'horus', action: 'sent review request to 3 customers' },
    ];

    const interval = setInterval(() => {
      const activity = newActivities[Math.floor(Math.random() * newActivities.length)];
      setActivities(prev => [{
        id: Date.now(),
        ...activity,
        timestamp: new Date()
      }, ...prev.slice(0, 7)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a12] overflow-hidden">
      {/* Animated background */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(168,85,247,0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(59,130,246,0.1) 0%, transparent 40%),
            linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px'
        }}
      />

      {/* Header */}
      <header className="relative z-50 p-4 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">𓂀</div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                OSIRIS HQ
              </h1>
              <p className="text-xs text-zinc-500">AI Executive Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ResourceCounter icon="💰" label="MRR" value="$1,750" color="border-green-500/30" subtext="target: $100K" />
            <ResourceCounter icon="🏢" label="Clients" value="2" color="border-blue-500/30" subtext="target: 50" />
            <ResourceCounter icon="🤖" label="AI Team" value="6" color="border-purple-500/30" subtext="all active" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Operations Floor */}
          <div className="col-span-8">
            <div 
              className="relative rounded-2xl border border-zinc-800 overflow-hidden"
              style={{ 
                height: '520px',
                background: 'linear-gradient(135deg, rgba(15,15,25,0.9) 0%, rgba(10,10,18,0.95) 100%)',
                boxShadow: '0 0 80px rgba(168,85,247,0.05), inset 0 0 80px rgba(0,0,0,0.5)'
              }}
            >
              {/* Grid floor */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(168,85,247,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Stations */}
              <Station 
                exec={executives.osiris}
                x={50} y={15}
                metrics={[
                  { label: 'Tasks Today', value: '24' },
                  { label: 'Team Sync', value: '100%' }
                ]}
              />
              <Station 
                exec={executives.iris}
                x={18} y={38}
                metrics={[
                  { label: 'Posts Scheduled', value: '3' },
                  { label: 'Engagement', value: '+15%' }
                ]}
              />
              <Station 
                exec={executives.apollo}
                x={82} y={38}
                metrics={[
                  { label: 'Pipeline', value: '15 leads' },
                  { label: 'Demos Booked', value: '2' }
                ]}
              />
              <Station 
                exec={executives.atlas}
                x={18} y={72}
                metrics={[
                  { label: 'Sprint Progress', value: '60%' },
                  { label: 'Bugs Open', value: '3' }
                ]}
              />
              <Station 
                exec={executives.horus}
                x={82} y={72}
                metrics={[
                  { label: 'Health Score', value: '94%' },
                  { label: 'Reviews Pending', value: '5' }
                ]}
              />
              <Station 
                exec={executives.thoth}
                x={50} y={88}
                metrics={[
                  { label: 'Conversion', value: '67%' },
                  { label: 'Forecast', value: '+$350' }
                ]}
              />

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(168,85,247,0)" />
                    <stop offset="50%" stopColor="rgba(168,85,247,0.3)" />
                    <stop offset="100%" stopColor="rgba(168,85,247,0)" />
                  </linearGradient>
                </defs>
                {/* Osiris to all */}
                <line x1="50%" y1="20%" x2="20%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="50%" y1="20%" x2="80%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="50%" y1="20%" x2="50%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="5,5" />
                {/* Cross connections */}
                <line x1="20%" y1="40%" x2="20%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="80%" y1="40%" x2="80%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="20%" y1="70%" x2="50%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" />
                <line x1="80%" y1="70%" x2="50%" y2="85%" stroke="url(#lineGradient)" strokeWidth="1" />
              </svg>

              {/* Agents */}
              {agents.map(agent => (
                <AgentAvatar key={agent.id} agent={agent} />
              ))}

              {/* Status bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-xs border-t border-zinc-800/50">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    All agents operational
                  </span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-zinc-400">
                    {agents.filter(a => a.status === 'working').length}/6 working
                  </span>
                </div>
                <span className="text-zinc-500">CVO: Dominic Lutz</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-4 space-y-4">
            {/* Client Empire */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                🏢 Client Empire
              </h3>
              <div className="space-y-2">
                <ClientCard name="WinBros Cleaning" mrr="$1,500/mo" health="excellent" agentAssigned="horus" />
                <ClientCard name="Cedar Rapids Cleaning" mrr="$250/mo" health="good" agentAssigned="horus" />
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-3 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                  <p className="text-zinc-400 text-sm font-medium">+ Expand Empire</p>
                  <p className="text-xs text-zinc-600">48 more to $100K MRR</p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed activities={activities} />
          </div>
        </div>

        {/* Command Bar */}
        <div className="mt-6">
          <CommandBar />
        </div>
      </main>
    </div>
  );
}
