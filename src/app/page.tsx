'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ============== DATA ==============

const EXECUTIVES = {
  osiris: { name: 'Osiris', role: 'COO', emoji: '𓂀', color: '#a855f7' },
  iris: { name: 'Iris', role: 'CMO', emoji: '🦞', color: '#ec4899' },
  apollo: { name: 'Apollo', role: 'CRO', emoji: '🏹', color: '#f59e0b' },
  atlas: { name: 'Atlas', role: 'CPO', emoji: '🗺️', color: '#3b82f6' },
  horus: { name: 'Horus', role: 'CSO', emoji: '🦅', color: '#22c55e' },
  thoth: { name: 'Thoth', role: 'CDO', emoji: '📊', color: '#06b6d4' },
} as const;

type ExecutiveKey = keyof typeof EXECUTIVES;

interface Mission {
  id: string;
  name: string;
  command: string;
  agent: ExecutiveKey;
  duration: number;
  description: string;
}

interface ActiveMission {
  mission: Mission;
  startTime: Date;
  progress: number;
}

interface LogEntry {
  id: number;
  timestamp: Date;
  type: 'command' | 'system' | 'success' | 'error' | 'info';
  agent?: ExecutiveKey;
  message: string;
}

const MISSIONS: Mission[] = [
  // Apollo
  { id: 'outbound', name: 'Outbound Campaign', command: 'apollo outbound', agent: 'apollo', duration: 30, description: 'Send 50 cold emails to cleaning companies' },
  { id: 'follow-up', name: 'Lead Follow-up', command: 'apollo follow-up', agent: 'apollo', duration: 20, description: 'Nurture warm leads in pipeline' },
  { id: 'book-demo', name: 'Book Demo', command: 'apollo demo', agent: 'apollo', duration: 45, description: 'Schedule sales call with qualified lead' },
  { id: 'close', name: 'Close Deal', command: 'apollo close', agent: 'apollo', duration: 60, description: 'Finalize contract with prospect' },
  
  // Iris
  { id: 'content', name: 'Create Content', command: 'iris content', agent: 'iris', duration: 25, description: 'Write video script or social post' },
  { id: 'schedule', name: 'Schedule Posts', command: 'iris schedule', agent: 'iris', duration: 15, description: 'Queue content for publishing' },
  { id: 'research', name: 'Competitor Intel', command: 'iris recon', agent: 'iris', duration: 35, description: 'Analyze competitor activity' },
  { id: 'campaign', name: 'Launch Campaign', command: 'iris launch', agent: 'iris', duration: 60, description: 'Execute marketing campaign' },
  
  // Horus
  { id: 'checkin', name: 'Client Check-in', command: 'horus checkin', agent: 'horus', duration: 20, description: 'Touch base with existing clients' },
  { id: 'reviews', name: 'Request Reviews', command: 'horus reviews', agent: 'horus', duration: 15, description: 'Ask satisfied customers for testimonials' },
  { id: 'onboard', name: 'Onboard Client', command: 'horus onboard', agent: 'horus', duration: 45, description: 'Set up new customer account' },
  { id: 'save', name: 'Save Account', command: 'horus save', agent: 'horus', duration: 40, description: 'Rescue at-risk customer' },
  
  // Thoth
  { id: 'report', name: 'Generate Report', command: 'thoth report', agent: 'thoth', duration: 15, description: 'Compile daily metrics analysis' },
  { id: 'analyze', name: 'Analyze Funnel', command: 'thoth analyze', agent: 'thoth', duration: 30, description: 'Find conversion bottlenecks' },
  { id: 'forecast', name: 'Revenue Forecast', command: 'thoth forecast', agent: 'thoth', duration: 25, description: 'Project next month revenue' },
  
  // Atlas
  { id: 'bug', name: 'Fix Bug', command: 'atlas fix', agent: 'atlas', duration: 35, description: 'Squash reported issue' },
  { id: 'feature', name: 'Ship Feature', command: 'atlas ship', agent: 'atlas', duration: 60, description: 'Deploy new functionality' },
  { id: 'sync', name: 'Sync with Jack', command: 'atlas sync', agent: 'atlas', duration: 20, description: 'Coordinate with dev lead' },
  
  // Osiris
  { id: 'brief', name: 'Morning Brief', command: 'osiris brief', agent: 'osiris', duration: 15, description: 'Align team for the day' },
  { id: 'strategy', name: 'Strategic Planning', command: 'osiris plan', agent: 'osiris', duration: 45, description: 'Plot world domination' },
  { id: 'boost', name: 'Boost Team', command: 'osiris boost', agent: 'osiris', duration: 30, description: 'Increase all agent efficiency' },
];

const COMMANDS = {
  help: 'Show available commands',
  status: 'Show system status',
  agents: 'List all agents and their status',
  missions: 'List available missions',
  clear: 'Clear terminal',
  ...Object.fromEntries(MISSIONS.map(m => [m.command, m.description])),
};

// ============== COMPONENTS ==============

function Terminal({ 
  logs, 
  onCommand,
  inputRef 
}: { 
  logs: LogEntry[];
  onCommand: (cmd: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onCommand(input.trim());
    setHistory(prev => [input.trim(), ...prev].slice(0, 50));
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Autocomplete
      const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'command': return 'text-purple-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'system': return 'text-cyan-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div 
      className="bg-black/90 rounded-lg border border-zinc-800 font-mono text-sm h-full flex flex-col cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-zinc-500 text-xs">osiris-hq — bash</span>
      </div>
      
      {/* Terminal content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-zinc-600 shrink-0">
              [{log.timestamp.toLocaleTimeString('en-US', { hour12: false })}]
            </span>
            {log.agent && (
              <span style={{ color: EXECUTIVES[log.agent].color }}>
                [{EXECUTIVES[log.agent].name}]
              </span>
            )}
            <span className={getLogColor(log.type)}>{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">cvo@osiris-hq</span>
          <span className="text-zinc-500">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-zinc-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}

function AgentPanel({ 
  agents, 
  activeMissions 
}: { 
  agents: Record<ExecutiveKey, { status: 'idle' | 'working' }>;
  activeMissions: ActiveMission[];
}) {
  return (
    <div className="bg-zinc-900/80 rounded-lg border border-zinc-800 p-4">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">AI Executive Team</h3>
      <div className="space-y-3">
        {(Object.keys(EXECUTIVES) as ExecutiveKey[]).map(key => {
          const exec = EXECUTIVES[key];
          const agent = agents[key];
          const mission = activeMissions.find(m => m.mission.agent === key);
          
          return (
            <div key={key} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg border"
                style={{ 
                  borderColor: exec.color + '50',
                  backgroundColor: exec.color + '10'
                }}
              >
                {exec.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: exec.color }}>{exec.name}</span>
                  <span className={`text-xs ${agent.status === 'working' ? 'text-green-400' : 'text-zinc-500'}`}>
                    {agent.status === 'working' ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
                {mission ? (
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>{mission.mission.name}</span>
                      <span>{Math.ceil((mission.mission.duration * (1 - mission.progress)))}s</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000"
                        style={{ width: `${mission.progress * 100}%`, backgroundColor: exec.color }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 truncate">Awaiting orders...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricsPanel({ metrics }: { metrics: Record<string, number | string> }) {
  return (
    <div className="bg-zinc-900/80 rounded-lg border border-zinc-800 p-4">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">System Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/40 rounded-lg p-3">
          <p className="text-xs text-zinc-500">MRR</p>
          <p className="text-xl font-bold text-green-400">${metrics.mrr?.toLocaleString()}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-3">
          <p className="text-xs text-zinc-500">Clients</p>
          <p className="text-xl font-bold text-purple-400">{metrics.clients}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-3">
          <p className="text-xs text-zinc-500">Pipeline</p>
          <p className="text-xl font-bold text-orange-400">{metrics.leads}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-3">
          <p className="text-xs text-zinc-500">Conversion</p>
          <p className="text-xl font-bold text-cyan-400">{metrics.conversion}%</p>
        </div>
      </div>
    </div>
  );
}

function MissionQueue({ missions, onSelect }: { missions: Mission[]; onSelect: (m: Mission) => void }) {
  const [filter, setFilter] = useState<ExecutiveKey | 'all'>('all');
  
  const filtered = filter === 'all' ? missions : missions.filter(m => m.agent === filter);
  
  return (
    <div className="bg-zinc-900/80 rounded-lg border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mission Queue</h3>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as ExecutiveKey | 'all')}
          className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
        >
          <option value="all">All Agents</option>
          {(Object.keys(EXECUTIVES) as ExecutiveKey[]).map(key => (
            <option key={key} value={key}>{EXECUTIVES[key].name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filtered.map(mission => {
          const exec = EXECUTIVES[mission.agent];
          return (
            <button
              key={mission.id}
              onClick={() => onSelect(mission)}
              className="w-full text-left p-3 rounded-lg border border-zinc-800 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
                  {mission.name}
                </span>
                <span className="text-xs" style={{ color: exec.color }}>{exec.emoji} {exec.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                  {mission.command}
                </code>
                <span className="text-xs text-zinc-500">{mission.duration}s</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============== MAIN ==============

export default function CommandCenter() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, timestamp: new Date(), type: 'system', message: '=== OSIRIS HQ COMMAND CENTER ===' },
    { id: 1, timestamp: new Date(), type: 'system', message: 'AI Executive Team initialized and standing by.' },
    { id: 2, timestamp: new Date(), type: 'info', message: 'Type "help" to see available commands, or "missions" to see available operations.' },
    { id: 3, timestamp: new Date(), type: 'info', message: 'Click any mission card to auto-fill the command.' },
  ]);
  
  const [agents, setAgents] = useState<Record<ExecutiveKey, { status: 'idle' | 'working' }>>({
    osiris: { status: 'idle' },
    iris: { status: 'idle' },
    apollo: { status: 'idle' },
    atlas: { status: 'idle' },
    horus: { status: 'idle' },
    thoth: { status: 'idle' },
  });
  
  const [activeMissions, setActiveMissions] = useState<ActiveMission[]>([]);
  
  const [metrics, setMetrics] = useState({
    mrr: 1750,
    clients: 2,
    leads: 15,
    conversion: 67,
  });

  const addLog = useCallback((type: LogEntry['type'], message: string, agent?: ExecutiveKey) => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      type,
      agent,
      message
    }]);
  }, []);

  // Mission progress
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMissions(prev => {
        const updated: ActiveMission[] = [];
        const completed: ActiveMission[] = [];
        
        prev.forEach(am => {
          const newProgress = am.progress + (1 / am.mission.duration);
          if (newProgress >= 1) {
            completed.push(am);
          } else {
            updated.push({ ...am, progress: newProgress });
          }
        });
        
        // Handle completed missions
        completed.forEach(am => {
          setAgents(prev => ({
            ...prev,
            [am.mission.agent]: { status: 'idle' }
          }));
          
          addLog('success', `Mission "${am.mission.name}" completed successfully.`, am.mission.agent);
          
          // Update metrics based on mission
          if (am.mission.id === 'outbound') {
            setMetrics(prev => ({ ...prev, leads: prev.leads + 3 }));
            addLog('info', '+3 leads added to pipeline');
          } else if (am.mission.id === 'close') {
            setMetrics(prev => ({ ...prev, clients: prev.clients + 1, mrr: prev.mrr + 500 }));
            addLog('success', '🎉 NEW CLIENT ACQUIRED! +$500 MRR');
          } else if (am.mission.id === 'reviews') {
            addLog('info', '2 new 5-star reviews requested');
          }
        });
        
        return updated;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [addLog]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.toLowerCase().trim();
    addLog('command', `$ ${cmd}`);
    
    // Parse command
    if (trimmed === 'help') {
      addLog('system', '=== AVAILABLE COMMANDS ===');
      Object.entries(COMMANDS).forEach(([cmd, desc]) => {
        addLog('info', `  ${cmd.padEnd(20)} - ${desc}`);
      });
      return;
    }
    
    if (trimmed === 'clear') {
      setLogs([]);
      return;
    }
    
    if (trimmed === 'status') {
      addLog('system', '=== SYSTEM STATUS ===');
      addLog('info', `MRR: $${metrics.mrr.toLocaleString()} | Clients: ${metrics.clients} | Pipeline: ${metrics.leads} leads`);
      const working = Object.values(agents).filter(a => a.status === 'working').length;
      addLog('info', `Agents: ${working}/6 active`);
      return;
    }
    
    if (trimmed === 'agents') {
      addLog('system', '=== AI EXECUTIVE TEAM ===');
      (Object.keys(EXECUTIVES) as ExecutiveKey[]).forEach(key => {
        const exec = EXECUTIVES[key];
        const agent = agents[key];
        const mission = activeMissions.find(m => m.mission.agent === key);
        addLog('info', `  ${exec.emoji} ${exec.name.padEnd(10)} [${exec.role}] - ${
          mission ? `WORKING: ${mission.mission.name} (${Math.round(mission.progress * 100)}%)` : 'STANDBY'
        }`);
      });
      return;
    }
    
    if (trimmed === 'missions') {
      addLog('system', '=== AVAILABLE MISSIONS ===');
      MISSIONS.forEach(m => {
        const exec = EXECUTIVES[m.agent];
        addLog('info', `  ${m.command.padEnd(18)} [${exec.name}] ${m.name}`);
      });
      return;
    }
    
    // Check for mission commands
    const mission = MISSIONS.find(m => m.command === trimmed);
    if (mission) {
      const agent = agents[mission.agent];
      const exec = EXECUTIVES[mission.agent];
      
      if (agent.status === 'working') {
        addLog('error', `${exec.name} is currently busy. Wait for current mission to complete.`);
        return;
      }
      
      // Start mission
      setAgents(prev => ({
        ...prev,
        [mission.agent]: { status: 'working' }
      }));
      
      setActiveMissions(prev => [...prev, {
        mission,
        startTime: new Date(),
        progress: 0
      }]);
      
      addLog('system', `Deploying ${exec.name} on mission: ${mission.name}`, mission.agent);
      addLog('info', mission.description, mission.agent);
      addLog('info', `ETA: ${mission.duration} seconds`, mission.agent);
      return;
    }
    
    // Unknown command
    addLog('error', `Command not recognized: "${cmd}". Type "help" for available commands.`);
  }, [addLog, agents, activeMissions, metrics]);

  const handleMissionSelect = useCallback((mission: Mission) => {
    if (inputRef.current) {
      inputRef.current.value = mission.command;
      inputRef.current.focus();
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">𓂀</span>
            <div>
              <h1 className="text-lg font-bold text-purple-400">OSIRIS HQ</h1>
              <p className="text-xs text-zinc-500">Command Center v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-zinc-400">All Systems Online</span>
            </div>
            <div className="text-zinc-500">|</div>
            <div className="text-zinc-400">
              CVO: <span className="text-purple-400">Dominic Lutz</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          {/* Terminal */}
          <div className="col-span-7">
            <Terminal 
              logs={logs} 
              onCommand={executeCommand}
              inputRef={inputRef}
            />
          </div>
          
          {/* Right Panel */}
          <div className="col-span-5 space-y-4 overflow-y-auto">
            <MetricsPanel metrics={metrics} />
            <AgentPanel agents={agents} activeMissions={activeMissions} />
            <MissionQueue missions={MISSIONS} onSelect={handleMissionSelect} />
          </div>
        </div>
      </main>
    </div>
  );
}
