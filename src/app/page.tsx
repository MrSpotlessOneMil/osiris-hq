'use client';

import { useState, useEffect } from 'react';

// Types
interface Robot {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  task: 'idle' | 'calling' | 'booking' | 'processing' | 'walking';
  color: string;
}

interface Activity {
  id: number;
  type: 'call' | 'booking' | 'payment' | 'review';
  message: string;
  timestamp: Date;
}

// Robot Worker Component
function RobotWorker({ robot }: { robot: Robot }) {
  const taskEmojis = {
    idle: '🤖',
    calling: '📞',
    booking: '📋',
    processing: '💳',
    walking: '🤖'
  };

  return (
    <div
      className="absolute transition-all duration-1000 ease-in-out z-20"
      style={{
        left: `${robot.x}%`,
        top: `${robot.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={`relative ${robot.task === 'walking' ? 'animate-bounce' : ''}`}>
        <span className="text-2xl filter drop-shadow-lg">{taskEmojis[robot.task]}</span>
        {robot.task !== 'idle' && robot.task !== 'walking' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
        )}
      </div>
    </div>
  );
}

// Building/Station Component
function Station({ 
  name, 
  icon, 
  x, 
  y, 
  activeCount,
  totalToday,
  color
}: { 
  name: string;
  icon: string;
  x: number;
  y: number;
  activeCount: number;
  totalToday: number;
  color: string;
}) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Building shadow */}
      <div className="absolute inset-0 bg-black/30 rounded-xl blur-md transform translate-y-2" />
      
      {/* Building */}
      <div 
        className={`relative bg-gradient-to-br ${color} p-4 rounded-xl border-2 border-white/20 shadow-2xl min-w-[120px]`}
        style={{ 
          boxShadow: `0 0 30px ${color.includes('purple') ? 'rgba(168,85,247,0.3)' : color.includes('blue') ? 'rgba(59,130,246,0.3)' : color.includes('green') ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}` 
        }}
      >
        <div className="text-center">
          <span className="text-3xl">{icon}</span>
          <p className="text-xs font-bold text-white mt-1 drop-shadow">{name}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-lg font-bold text-white">{totalToday}</span>
            <span className="text-xs text-white/70">today</span>
          </div>
          {activeCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {activeCount} active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Resource Counter (Game-style)
function ResourceCounter({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg border ${color}`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// Activity Feed
function ActivityFeed({ activities }: { activities: Activity[] }) {
  const typeIcons = {
    call: '📞',
    booking: '✅',
    payment: '💰',
    review: '⭐'
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-4 max-h-[200px] overflow-y-auto">
      <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Live Activity
      </h3>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-2 text-sm animate-fadeIn">
            <span>{typeIcons[activity.type]}</span>
            <p className="text-zinc-300">{activity.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Client Card (Tycoon style)
function ClientTile({ name, status, revenue }: { name: string; status: 'active' | 'idle'; revenue: string }) {
  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700/50 hover:border-purple-500/50 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-zinc-500'}`} />
          <span className="font-medium text-sm">{name}</span>
        </div>
        <span className="text-green-400 font-bold text-sm">{revenue}</span>
      </div>
    </div>
  );
}

// LLM Command Bar
function CommandBar({ onSubmit }: { onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setResponse("WinBros is crushing it — 12 calls, 8 bookings (67% conversion). Cedar Rapids had 3 calls, 2 bookings. All robots operational. Revenue trending +22% this month. Recommend focusing outbound on leads from Des Moines area.");
      setIsLoading(false);
    }, 1500);
    
    onSubmit(query);
    setQuery('');
  };

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-purple-500/30 p-4 shadow-2xl">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <span className="text-purple-400 text-xl">𓂀</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Command your empire... (e.g., 'Show me WinBros performance')"
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-500"
        />
        <button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Execute
        </button>
      </form>
      {(isLoading || response) && (
        <div className="mt-3 pt-3 border-t border-zinc-700/50">
          {isLoading ? (
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">Osiris is analyzing...</span>
            </div>
          ) : (
            <p className="text-sm text-zinc-300 leading-relaxed">{response}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [robots, setRobots] = useState<Robot[]>([
    { id: 1, x: 25, y: 35, targetX: 25, targetY: 35, task: 'calling', color: '#a855f7' },
    { id: 2, x: 50, y: 35, targetX: 50, targetY: 35, task: 'booking', color: '#3b82f6' },
    { id: 3, x: 75, y: 35, targetX: 75, targetY: 35, task: 'processing', color: '#22c55e' },
    { id: 4, x: 35, y: 55, targetX: 35, targetY: 55, task: 'idle', color: '#eab308' },
    { id: 5, x: 65, y: 55, targetX: 65, targetY: 55, task: 'calling', color: '#a855f7' },
    { id: 6, x: 50, y: 70, targetX: 50, targetY: 70, task: 'idle', color: '#3b82f6' },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, type: 'call', message: 'Incoming call from (515) 555-0123', timestamp: new Date() },
    { id: 2, type: 'booking', message: 'New booking: Deep clean for Smith residence', timestamp: new Date() },
    { id: 3, type: 'payment', message: '$285 payment received from Johnson', timestamp: new Date() },
    { id: 4, type: 'call', message: 'Call completed - quote sent', timestamp: new Date() },
    { id: 5, type: 'review', message: '5-star review from Martinez family', timestamp: new Date() },
  ]);

  // Animate robots randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setRobots(prev => prev.map(robot => {
        if (Math.random() > 0.7) {
          const tasks: Robot['task'][] = ['idle', 'calling', 'booking', 'processing', 'walking'];
          const stations = [
            { x: 25, y: 35 }, // Call Center
            { x: 50, y: 35 }, // Booking Desk  
            { x: 75, y: 35 }, // Payments
            { x: 35, y: 55 },
            { x: 65, y: 55 },
            { x: 50, y: 70 },
          ];
          const newStation = stations[Math.floor(Math.random() * stations.length)];
          return {
            ...robot,
            x: newStation.x + (Math.random() - 0.5) * 10,
            y: newStation.y + (Math.random() - 0.5) * 10,
            task: tasks[Math.floor(Math.random() * tasks.length)]
          };
        }
        return robot;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add new activities periodically
  useEffect(() => {
    const messages = [
      { type: 'call' as const, message: 'New call from Cedar Rapids area' },
      { type: 'booking' as const, message: 'Recurring clean scheduled for next Tuesday' },
      { type: 'payment' as const, message: '$175 invoice auto-collected' },
      { type: 'call' as const, message: 'Quote request - 3BR house' },
      { type: 'review' as const, message: 'New 5-star review received!' },
      { type: 'booking' as const, message: 'Move-out clean booked for Friday' },
    ];

    const interval = setInterval(() => {
      const newActivity = messages[Math.floor(Math.random() * messages.length)];
      setActivities(prev => [{
        id: Date.now(),
        ...newActivity,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f24] to-[#0a0a1a] overflow-hidden">
      {/* Animated grid background */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Top HUD */}
      <header className="relative z-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-4xl filter drop-shadow-lg">𓂀</div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                OSIRIS HQ
              </h1>
              <p className="text-xs text-zinc-500">Operations Command Center</p>
            </div>
          </div>

          {/* Resource Counters */}
          <div className="flex items-center gap-3">
            <ResourceCounter icon="💰" label="MRR" value="$1,750" color="border-yellow-500/30" />
            <ResourceCounter icon="👥" label="Clients" value="2" color="border-blue-500/30" />
            <ResourceCounter icon="🤖" label="AI Agents" value="6" color="border-purple-500/30" />
            <ResourceCounter icon="⚡" label="Uptime" value="99.9%" color="border-green-500/30" />
          </div>
        </div>
      </header>

      {/* Main Game View */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Operations Floor (Main Area) */}
          <div className="col-span-8">
            <div 
              className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-2xl border border-zinc-700/50 overflow-hidden"
              style={{ 
                height: '500px',
                boxShadow: '0 0 60px rgba(168,85,247,0.1), inset 0 0 60px rgba(0,0,0,0.5)'
              }}
            >
              {/* Floor grid pattern */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, rgba(168,85,247,0.05) 25%, transparent 25%),
                    linear-gradient(-45deg, rgba(168,85,247,0.05) 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, rgba(168,85,247,0.05) 75%),
                    linear-gradient(-45deg, transparent 75%, rgba(168,85,247,0.05) 75%)
                  `,
                  backgroundSize: '40px 40px',
                  backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
                }}
              />

              {/* Stations */}
              <Station 
                name="Call Center" 
                icon="📞" 
                x={25} 
                y={30} 
                activeCount={2}
                totalToday={15}
                color="from-purple-600 to-purple-800"
              />
              <Station 
                name="Booking Desk" 
                icon="📋" 
                x={50} 
                y={30} 
                activeCount={1}
                totalToday={10}
                color="from-blue-600 to-blue-800"
              />
              <Station 
                name="Payments" 
                icon="💳" 
                x={75} 
                y={30} 
                activeCount={1}
                totalToday={8}
                color="from-green-600 to-green-800"
              />
              <Station 
                name="Reviews" 
                icon="⭐" 
                x={35} 
                y={65} 
                activeCount={0}
                totalToday={3}
                color="from-yellow-600 to-yellow-800"
              />
              <Station 
                name="Scheduling" 
                icon="📅" 
                x={65} 
                y={65} 
                activeCount={1}
                totalToday={12}
                color="from-cyan-600 to-cyan-800"
              />

              {/* Robots */}
              {robots.map(robot => (
                <RobotWorker key={robot.id} robot={robot} />
              ))}

              {/* Connection lines (decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="25%" y1="35%" x2="50%" y2="35%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="50%" y1="35%" x2="75%" y2="35%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="35%" y1="65%" x2="65%" y2="65%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="50%" y1="35%" x2="50%" y2="65%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

              {/* Status bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    All systems operational
                  </span>
                </div>
                <span className="text-zinc-500">Last sync: Just now</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-4 space-y-4">
            {/* Clients */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-4">
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                🏢 Client Empire
              </h3>
              <div className="space-y-2">
                <ClientTile name="WinBros Cleaning" status="active" revenue="$1,500/mo" />
                <ClientTile name="Cedar Rapids Cleaning" status="active" revenue="$250/mo" />
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-3 text-center">
                  <p className="text-zinc-500 text-sm">+ Expand Empire</p>
                  <p className="text-xs text-zinc-600">48 slots remaining</p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed activities={activities} />

            {/* Today's Stats */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-4">
              <h3 className="text-sm font-bold text-zinc-300 mb-3">📊 Today&apos;s Conquest</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">15</p>
                  <p className="text-xs text-zinc-500">Calls</p>
                </div>
                <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">10</p>
                  <p className="text-xs text-zinc-500">Bookings</p>
                </div>
                <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">$847</p>
                  <p className="text-xs text-zinc-500">Revenue</p>
                </div>
                <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">67%</p>
                  <p className="text-xs text-zinc-500">Conversion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <div className="mt-6">
          <CommandBar onSubmit={(q) => console.log('Query:', q)} />
        </div>
      </main>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
