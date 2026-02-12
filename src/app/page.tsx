'use client';

import { useState, useEffect, useCallback } from 'react';

// ============== GAME DATA ==============

const EXECUTIVES = {
  osiris: { name: 'Osiris', role: 'COO', emoji: '𓂀', color: '#a855f7', baseEfficiency: 1.0 },
  iris: { name: 'Iris', role: 'CMO', emoji: '🦞', color: '#ec4899', baseEfficiency: 1.0 },
  apollo: { name: 'Apollo', role: 'CRO', emoji: '🏹', color: '#f59e0b', baseEfficiency: 1.0 },
  atlas: { name: 'Atlas', role: 'CPO', emoji: '🗺️', color: '#3b82f6', baseEfficiency: 1.0 },
  horus: { name: 'Horus', role: 'CSO', emoji: '🦅', color: '#22c55e', baseEfficiency: 1.0 },
  thoth: { name: 'Thoth', role: 'CDO', emoji: '📊', color: '#06b6d4', baseEfficiency: 1.0 },
} as const;

type ExecutiveKey = keyof typeof EXECUTIVES;

interface Task {
  id: string;
  name: string;
  description: string;
  agent: ExecutiveKey;
  duration: number; // seconds
  reward: { gold?: number; xp?: number; leads?: number; reviews?: number };
  cost: { energy: number };
  unlocked: boolean;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  reward: { gold?: number; xp?: number };
  type: 'daily' | 'weekly' | 'milestone';
  completed: boolean;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  agent?: ExecutiveKey;
  cost: number;
  effect: string;
  purchased: boolean;
  requires?: string;
}

interface AgentState {
  id: ExecutiveKey;
  level: number;
  xp: number;
  currentTask: Task | null;
  taskProgress: number;
  efficiency: number;
}

interface GameState {
  gold: number;
  energy: number;
  maxEnergy: number;
  energyRegen: number;
  xp: number;
  level: number;
  leads: number;
  clients: number;
  reviews: number;
  mrr: number;
  totalEarned: number;
  clickPower: number;
  agents: Record<ExecutiveKey, AgentState>;
  quests: Quest[];
  upgrades: Upgrade[];
  log: { message: string; timestamp: Date; type: 'success' | 'info' | 'reward' }[];
}

// ============== INITIAL STATE ==============

const TASKS: Task[] = [
  // Apollo (Sales)
  { id: 'outbound-email', name: 'Send Outbound Emails', description: 'Blast 50 cold emails', agent: 'apollo', duration: 30, reward: { leads: 2, xp: 10 }, cost: { energy: 10 }, unlocked: true },
  { id: 'follow-up', name: 'Follow Up Leads', description: 'Nurture warm leads', agent: 'apollo', duration: 45, reward: { leads: 1, gold: 100, xp: 15 }, cost: { energy: 15 }, unlocked: true },
  { id: 'book-demo', name: 'Book Demo Call', description: 'Schedule a sales call', agent: 'apollo', duration: 60, reward: { gold: 250, xp: 25 }, cost: { energy: 20 }, unlocked: true },
  { id: 'close-deal', name: 'Close Deal', description: 'Sign a new client!', agent: 'apollo', duration: 120, reward: { gold: 2000, xp: 100 }, cost: { energy: 40 }, unlocked: false },
  
  // Iris (Marketing)
  { id: 'write-script', name: 'Write Video Script', description: 'Draft content for filming', agent: 'iris', duration: 25, reward: { xp: 15 }, cost: { energy: 10 }, unlocked: true },
  { id: 'schedule-post', name: 'Schedule Content', description: 'Queue up social posts', agent: 'iris', duration: 20, reward: { xp: 10, leads: 1 }, cost: { energy: 8 }, unlocked: true },
  { id: 'competitor-research', name: 'Spy on Competitors', description: 'Analyze what others are doing', agent: 'iris', duration: 40, reward: { xp: 20 }, cost: { energy: 12 }, unlocked: true },
  { id: 'viral-campaign', name: 'Launch Campaign', description: 'Big marketing push', agent: 'iris', duration: 90, reward: { leads: 5, xp: 50 }, cost: { energy: 30 }, unlocked: false },
  
  // Horus (Customer Success)
  { id: 'check-in', name: 'Client Check-in', description: 'Touch base with clients', agent: 'horus', duration: 20, reward: { xp: 10, reviews: 1 }, cost: { energy: 8 }, unlocked: true },
  { id: 'request-review', name: 'Request Reviews', description: 'Ask happy customers for reviews', agent: 'horus', duration: 15, reward: { reviews: 2, xp: 10 }, cost: { energy: 5 }, unlocked: true },
  { id: 'onboard-client', name: 'Onboard New Client', description: 'Set up a new customer', agent: 'horus', duration: 60, reward: { gold: 500, xp: 30 }, cost: { energy: 25 }, unlocked: true },
  { id: 'save-churn', name: 'Save Churning Client', description: 'Rescue an at-risk account', agent: 'horus', duration: 45, reward: { gold: 1000, xp: 40 }, cost: { energy: 20 }, unlocked: false },
  
  // Thoth (Data)
  { id: 'daily-report', name: 'Generate Report', description: 'Compile daily metrics', agent: 'thoth', duration: 15, reward: { xp: 10 }, cost: { energy: 5 }, unlocked: true },
  { id: 'analyze-funnel', name: 'Analyze Funnel', description: 'Find conversion leaks', agent: 'thoth', duration: 30, reward: { xp: 20, gold: 100 }, cost: { energy: 10 }, unlocked: true },
  { id: 'forecast', name: 'Revenue Forecast', description: 'Predict next month', agent: 'thoth', duration: 40, reward: { xp: 25 }, cost: { energy: 15 }, unlocked: true },
  
  // Atlas (Product)
  { id: 'fix-bug', name: 'Fix Bug', description: 'Squash a reported issue', agent: 'atlas', duration: 35, reward: { xp: 15 }, cost: { energy: 12 }, unlocked: true },
  { id: 'ship-feature', name: 'Ship Feature', description: 'Deploy new functionality', agent: 'atlas', duration: 60, reward: { xp: 40, gold: 200 }, cost: { energy: 25 }, unlocked: true },
  { id: 'sync-jack', name: 'Sync with Jack', description: 'Coordinate with dev lead', agent: 'atlas', duration: 20, reward: { xp: 10 }, cost: { energy: 8 }, unlocked: true },
  
  // Osiris (Coordination)
  { id: 'morning-brief', name: 'Morning Brief', description: 'Align the team for the day', agent: 'osiris', duration: 15, reward: { xp: 15 }, cost: { energy: 5 }, unlocked: true },
  { id: 'strategic-planning', name: 'Strategic Planning', description: 'Plot world domination', agent: 'osiris', duration: 45, reward: { xp: 30, gold: 150 }, cost: { energy: 15 }, unlocked: true },
  { id: 'team-boost', name: 'Boost Team', description: '+50% efficiency for 2 min', agent: 'osiris', duration: 30, reward: { xp: 20 }, cost: { energy: 20 }, unlocked: true },
];

const INITIAL_QUESTS: Quest[] = [
  { id: 'daily-leads', name: 'Lead Hunter', description: 'Generate 5 leads today', target: 5, current: 0, reward: { gold: 500, xp: 50 }, type: 'daily', completed: false },
  { id: 'daily-reviews', name: 'Review Collector', description: 'Get 3 reviews today', target: 3, current: 0, reward: { gold: 300, xp: 30 }, type: 'daily', completed: false },
  { id: 'weekly-client', name: 'Empire Expansion', description: 'Sign 1 new client this week', target: 1, current: 0, reward: { gold: 2000, xp: 200 }, type: 'weekly', completed: false },
  { id: 'milestone-mrr', name: 'First $5K MRR', description: 'Reach $5,000 monthly recurring', target: 5000, current: 1750, reward: { gold: 5000, xp: 500 }, type: 'milestone', completed: false },
  { id: 'milestone-clients', name: '10 Client Club', description: 'Sign 10 total clients', target: 10, current: 2, reward: { gold: 10000, xp: 1000 }, type: 'milestone', completed: false },
];

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'click-power-1', name: 'Better Clicking', description: '+1 gold per click', cost: 100, effect: 'clickPower', purchased: false },
  { id: 'click-power-2', name: 'Power Clicking', description: '+5 gold per click', cost: 500, effect: 'clickPower', purchased: false, requires: 'click-power-1' },
  { id: 'energy-max-1', name: 'Energy Tank I', description: '+25 max energy', cost: 300, effect: 'maxEnergy', purchased: false },
  { id: 'energy-max-2', name: 'Energy Tank II', description: '+50 max energy', cost: 800, effect: 'maxEnergy', purchased: false, requires: 'energy-max-1' },
  { id: 'energy-regen-1', name: 'Energy Regen I', description: '+1 energy/sec', cost: 400, effect: 'energyRegen', purchased: false },
  { id: 'apollo-boost', name: 'Apollo Training', description: '+25% Apollo efficiency', cost: 1000, effect: 'agentBoost', agent: 'apollo', purchased: false },
  { id: 'iris-boost', name: 'Iris Training', description: '+25% Iris efficiency', cost: 1000, effect: 'agentBoost', agent: 'iris', purchased: false },
  { id: 'horus-boost', name: 'Horus Training', description: '+25% Horus efficiency', cost: 1000, effect: 'agentBoost', agent: 'horus', purchased: false },
  { id: 'unlock-close-deal', name: 'Sales Mastery', description: 'Unlock "Close Deal" task', cost: 2000, effect: 'unlockTask', purchased: false },
  { id: 'unlock-viral', name: 'Viral Marketing', description: 'Unlock "Launch Campaign" task', cost: 1500, effect: 'unlockTask', purchased: false },
  { id: 'auto-outbound', name: 'Auto Outbound', description: 'Apollo sends emails automatically', cost: 5000, effect: 'autoTask', agent: 'apollo', purchased: false },
];

const getInitialState = (): GameState => ({
  gold: 500,
  energy: 100,
  maxEnergy: 100,
  energyRegen: 1,
  xp: 0,
  level: 1,
  leads: 3,
  clients: 2,
  reviews: 12,
  mrr: 1750,
  totalEarned: 0,
  clickPower: 1,
  agents: {
    osiris: { id: 'osiris', level: 1, xp: 0, currentTask: null, taskProgress: 0, efficiency: 1.0 },
    iris: { id: 'iris', level: 1, xp: 0, currentTask: null, taskProgress: 0, efficiency: 1.0 },
    apollo: { id: 'apollo', level: 1, xp: 0, currentTask: null, taskProgress: 0, efficiency: 1.0 },
    atlas: { id: 'atlas', level: 1, xp: 0, currentTask: null, taskProgress: 0, efficiency: 1.0 },
    horus: { id: 'horus', level: 1, xp: 0, currentTask: null, taskProgress: 0, efficiency: 1.0 },
    thoth: { id: 'thoth', level: 1, xp: 0, currentTask: null, taskProgress: 0, efficiency: 1.0 },
  },
  quests: INITIAL_QUESTS,
  upgrades: INITIAL_UPGRADES,
  log: [{ message: 'Welcome, CVO. Your empire awaits.', timestamp: new Date(), type: 'info' as const }],
});

// ============== COMPONENTS ==============

function ResourceBar({ game }: { game: GameState }) {
  const xpForNextLevel = game.level * 100;
  const xpProgress = (game.xp / xpForNextLevel) * 100;
  
  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">𓂀</span>
          <div>
            <h1 className="text-xl font-black text-purple-400">OSIRIS HQ</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Level {game.level}</span>
              <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all" style={{ width: `${xpProgress}%` }} />
              </div>
              <span className="text-xs text-zinc-500">{game.xp}/{xpForNextLevel} XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-xs text-zinc-500">Gold</p>
              <p className="font-bold text-yellow-400">{game.gold.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-xs text-zinc-500">Energy</p>
              <div className="flex items-center gap-1">
                <p className="font-bold text-blue-400">{Math.floor(game.energy)}</p>
                <span className="text-xs text-zinc-500">/ {game.maxEnergy}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <div>
              <p className="text-xs text-zinc-500">MRR</p>
              <p className="font-bold text-green-400">${game.mrr.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <p className="text-xs text-zinc-500">Leads</p>
              <p className="font-bold text-orange-400">{game.leads}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <div>
              <p className="text-xs text-zinc-500">Clients</p>
              <p className="font-bold text-purple-400">{game.clients}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ 
  agent, 
  exec, 
  tasks,
  onAssignTask,
  energy
}: { 
  agent: AgentState;
  exec: typeof EXECUTIVES[ExecutiveKey];
  tasks: Task[];
  onAssignTask: (task: Task) => void;
  energy: number;
}) {
  const availableTasks = tasks.filter(t => t.agent === agent.id && t.unlocked);
  
  return (
    <div 
      className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-4 hover:border-purple-500/30 transition-all"
      style={{ borderColor: agent.currentTask ? exec.color + '50' : undefined }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
          style={{ borderColor: exec.color, backgroundColor: exec.color + '20' }}
        >
          {exec.emoji}
        </div>
        <div>
          <p className="font-bold" style={{ color: exec.color }}>{exec.name}</p>
          <p className="text-xs text-zinc-500">{exec.role} • Lvl {agent.level}</p>
        </div>
        <div className="ml-auto">
          {agent.currentTask ? (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Working</span>
          ) : (
            <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-1 rounded-full">Idle</span>
          )}
        </div>
      </div>
      
      {agent.currentTask ? (
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{agent.currentTask.name}</span>
            <span className="text-xs text-zinc-500">{Math.ceil((agent.currentTask.duration * (1 - agent.taskProgress)) / agent.efficiency)}s</span>
          </div>
          <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-200"
              style={{ width: `${agent.taskProgress * 100}%`, backgroundColor: exec.color }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {availableTasks.slice(0, 3).map(task => (
            <button
              key={task.id}
              onClick={() => onAssignTask(task)}
              disabled={energy < task.cost.energy}
              className={`w-full text-left p-2 rounded-lg border transition-all ${
                energy >= task.cost.energy 
                  ? 'border-zinc-700 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer' 
                  : 'border-zinc-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{task.name}</span>
                <span className="text-xs text-blue-400">⚡{task.cost.energy}</span>
              </div>
              <div className="flex gap-2 mt-1">
                {task.reward.gold && <span className="text-xs text-yellow-400">+{task.reward.gold}💰</span>}
                {task.reward.leads && <span className="text-xs text-orange-400">+{task.reward.leads}🎯</span>}
                {task.reward.xp && <span className="text-xs text-purple-400">+{task.reward.xp}⭐</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestPanel({ quests, onClaim }: { quests: Quest[]; onClaim: (quest: Quest) => void }) {
  return (
    <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-4">
      <h3 className="font-bold text-zinc-300 mb-3 flex items-center gap-2">
        🏆 Quests
      </h3>
      <div className="space-y-2">
        {quests.filter(q => !q.completed).slice(0, 4).map(quest => {
          const progress = (quest.current / quest.target) * 100;
          const isComplete = quest.current >= quest.target;
          
          return (
            <div key={quest.id} className={`p-3 rounded-lg border ${isComplete ? 'border-green-500/50 bg-green-500/10' : 'border-zinc-700'}`}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-sm font-medium">{quest.name}</p>
                  <p className="text-xs text-zinc-500">{quest.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  quest.type === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                  quest.type === 'weekly' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{quest.type}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <span className="text-xs text-zinc-400">{quest.current}/{quest.target}</span>
              </div>
              {isComplete && (
                <button 
                  onClick={() => onClaim(quest)}
                  className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white text-sm py-1.5 rounded-lg font-medium transition-colors"
                >
                  Claim Reward! +{quest.reward.gold}💰 +{quest.reward.xp}⭐
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpgradeShop({ upgrades, gold, onBuy }: { upgrades: Upgrade[]; gold: number; onBuy: (upgrade: Upgrade) => void }) {
  const available = upgrades.filter(u => !u.purchased && (!u.requires || upgrades.find(up => up.id === u.requires)?.purchased));
  
  return (
    <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-4">
      <h3 className="font-bold text-zinc-300 mb-3 flex items-center gap-2">
        🔧 Upgrades
      </h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {available.slice(0, 5).map(upgrade => (
          <button
            key={upgrade.id}
            onClick={() => onBuy(upgrade)}
            disabled={gold < upgrade.cost}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              gold >= upgrade.cost
                ? 'border-zinc-700 hover:border-yellow-500/50 hover:bg-yellow-500/5 cursor-pointer'
                : 'border-zinc-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{upgrade.name}</p>
                <p className="text-xs text-zinc-500">{upgrade.description}</p>
              </div>
              <span className="text-sm text-yellow-400 font-bold">{upgrade.cost}💰</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityLog({ log }: { log: GameState['log'] }) {
  return (
    <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-4">
      <h3 className="font-bold text-zinc-300 mb-3 flex items-center gap-2">
        📜 Activity Log
      </h3>
      <div className="space-y-1 max-h-[200px] overflow-y-auto">
        {log.slice(0, 10).map((entry, i) => (
          <p key={i} className={`text-xs ${
            entry.type === 'success' ? 'text-green-400' :
            entry.type === 'reward' ? 'text-yellow-400' :
            'text-zinc-400'
          }`}>
            {entry.message}
          </p>
        ))}
      </div>
    </div>
  );
}

function ClickerArea({ onClick, clickPower }: { onClick: () => void; clickPower: number }) {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClicks(prev => [...prev, { id: Date.now(), x, y }]);
    onClick();
    
    setTimeout(() => {
      setClicks(prev => prev.slice(1));
    }, 1000);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="relative bg-gradient-to-br from-purple-900/20 to-zinc-900/40 rounded-2xl border border-purple-500/30 p-8 cursor-pointer hover:border-purple-500/50 transition-all active:scale-[0.98] select-none overflow-hidden"
    >
      <div className="text-center">
        <div className="text-6xl mb-4 hover:scale-110 transition-transform">𓂀</div>
        <p className="text-zinc-400 text-sm">Click to earn gold</p>
        <p className="text-yellow-400 font-bold">+{clickPower} 💰 per click</p>
      </div>
      
      {/* Floating numbers */}
      {clicks.map(click => (
        <div
          key={click.id}
          className="absolute text-yellow-400 font-bold text-lg pointer-events-none animate-float-up"
          style={{ left: click.x, top: click.y }}
        >
          +{clickPower}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============== MAIN GAME ==============

export default function Game() {
  const [game, setGame] = useState<GameState>(getInitialState);
  const [tasks] = useState<Task[]>(TASKS);
  
  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => ({
        ...prev,
        energy: Math.min(prev.energy + prev.energyRegen * 0.1, prev.maxEnergy)
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Task progression
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => {
        const newAgents = { ...prev.agents };
        let newGold = prev.gold;
        let newXp = prev.xp;
        let newLeads = prev.leads;
        let newReviews = prev.reviews;
        const newLog = [...prev.log];
        let newQuests = [...prev.quests];
        
        Object.keys(newAgents).forEach(key => {
          const agentKey = key as ExecutiveKey;
          const agent = newAgents[agentKey];
          
          if (agent.currentTask) {
            const progressIncrement = (1 / agent.currentTask.duration) * agent.efficiency;
            agent.taskProgress += progressIncrement;
            
            if (agent.taskProgress >= 1) {
              // Task complete!
              const task = agent.currentTask;
              if (task.reward.gold) newGold += task.reward.gold;
              if (task.reward.xp) newXp += task.reward.xp;
              if (task.reward.leads) newLeads += task.reward.leads;
              if (task.reward.reviews) newReviews += task.reward.reviews;
              
              newLog.unshift({
                message: `${EXECUTIVES[agentKey].name} completed "${task.name}"!`,
                timestamp: new Date(),
                type: 'success' as const
              });
              
              // Update quest progress
              if (task.reward.leads) {
                newQuests = newQuests.map(q => 
                  q.id === 'daily-leads' ? { ...q, current: q.current + (task.reward.leads || 0) } : q
                );
              }
              if (task.reward.reviews) {
                newQuests = newQuests.map(q => 
                  q.id === 'daily-reviews' ? { ...q, current: q.current + (task.reward.reviews || 0) } : q
                );
              }
              
              agent.currentTask = null;
              agent.taskProgress = 0;
            }
          }
        });
        
        // Level up check
        let newLevel = prev.level;
        const xpNeeded = prev.level * 100;
        if (newXp >= xpNeeded) {
          newXp -= xpNeeded;
          newLevel += 1;
          newLog.unshift({
            message: `🎉 LEVEL UP! You are now level ${newLevel}!`,
            timestamp: new Date(),
            type: 'reward' as const
          });
        }
        
        return {
          ...prev,
          agents: newAgents,
          gold: newGold,
          xp: newXp,
          level: newLevel,
          leads: newLeads,
          reviews: newReviews,
          quests: newQuests,
          log: newLog.slice(0, 50)
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const handleClick = useCallback(() => {
    setGame(prev => ({
      ...prev,
      gold: prev.gold + prev.clickPower,
      totalEarned: prev.totalEarned + prev.clickPower
    }));
  }, []);
  
  const handleAssignTask = useCallback((task: Task) => {
    setGame(prev => {
      if (prev.energy < task.cost.energy) return prev;
      
      const newAgents = { ...prev.agents };
      newAgents[task.agent] = {
        ...newAgents[task.agent],
        currentTask: task,
        taskProgress: 0
      };
      
      return {
        ...prev,
        agents: newAgents,
        energy: prev.energy - task.cost.energy,
        log: [{
          message: `${EXECUTIVES[task.agent].name} started "${task.name}"`,
          timestamp: new Date(),
          type: 'info' as const
        }, ...prev.log].slice(0, 50)
      };
    });
  }, []);
  
  const handleClaimQuest = useCallback((quest: Quest) => {
    setGame(prev => ({
      ...prev,
      gold: prev.gold + (quest.reward.gold || 0),
      xp: prev.xp + (quest.reward.xp || 0),
      quests: prev.quests.map(q => q.id === quest.id ? { ...q, completed: true } : q),
      log: [{
        message: `🏆 Quest complete: "${quest.name}"! +${quest.reward.gold}💰 +${quest.reward.xp}⭐`,
        timestamp: new Date(),
        type: 'reward' as const
      }, ...prev.log].slice(0, 50)
    }));
  }, []);
  
  const handleBuyUpgrade = useCallback((upgrade: Upgrade) => {
    setGame(prev => {
      if (prev.gold < upgrade.cost) return prev;
      
      let newState = {
        ...prev,
        gold: prev.gold - upgrade.cost,
        upgrades: prev.upgrades.map(u => u.id === upgrade.id ? { ...u, purchased: true } : u),
        log: [{
          message: `🔧 Purchased "${upgrade.name}"!`,
          timestamp: new Date(),
          type: 'reward' as const
        }, ...prev.log].slice(0, 50)
      };
      
      // Apply upgrade effects
      if (upgrade.effect === 'clickPower') {
        newState.clickPower = prev.clickPower + (upgrade.id.includes('2') ? 5 : 1);
      } else if (upgrade.effect === 'maxEnergy') {
        newState.maxEnergy = prev.maxEnergy + (upgrade.id.includes('2') ? 50 : 25);
      } else if (upgrade.effect === 'energyRegen') {
        newState.energyRegen = prev.energyRegen + 1;
      } else if (upgrade.effect === 'agentBoost' && upgrade.agent) {
        newState.agents = {
          ...prev.agents,
          [upgrade.agent]: {
            ...prev.agents[upgrade.agent],
            efficiency: prev.agents[upgrade.agent].efficiency * 1.25
          }
        };
      }
      
      return newState;
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <ResourceBar game={game} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Agents */}
          <div className="col-span-8">
            <h2 className="text-lg font-bold text-zinc-300 mb-3">🤖 AI Executive Team</h2>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EXECUTIVES) as ExecutiveKey[]).map(key => (
                <AgentCard
                  key={key}
                  agent={game.agents[key]}
                  exec={EXECUTIVES[key]}
                  tasks={tasks}
                  onAssignTask={handleAssignTask}
                  energy={game.energy}
                />
              ))}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-span-4 space-y-4">
            <ClickerArea onClick={handleClick} clickPower={game.clickPower} />
            <QuestPanel quests={game.quests} onClaim={handleClaimQuest} />
            <UpgradeShop upgrades={game.upgrades} gold={game.gold} onBuy={handleBuyUpgrade} />
            <ActivityLog log={game.log} />
          </div>
        </div>
      </main>
    </div>
  );
}
