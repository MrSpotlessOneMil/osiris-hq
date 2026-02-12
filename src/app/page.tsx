'use client';

import { useState } from 'react';

// Metric Card Component
function MetricCard({ 
  label, 
  value, 
  change, 
  changeType = 'neutral',
  icon 
}: { 
  label: string; 
  value: string; 
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) {
  const changeColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-zinc-400'
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-purple-500/10">
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-medium ${changeColors[changeType]}`}>
            {changeType === 'up' && '↑'}{changeType === 'down' && '↓'} {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

// Client Card Component
function ClientCard({ 
  name, 
  status, 
  mrr, 
  callsToday, 
  bookingsToday 
}: { 
  name: string; 
  status: 'online' | 'warning' | 'offline';
  mrr: string;
  callsToday: number;
  bookingsToday: number;
}) {
  const statusLabels = {
    online: 'Healthy',
    warning: 'Attention',
    offline: 'Issue'
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex items-center gap-2">
          <div className={`status-dot ${status}`}></div>
          <span className="text-sm text-zinc-400">{statusLabels[status]}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xl font-bold text-purple-400">{mrr}</p>
          <p className="text-xs text-zinc-500">MRR</p>
        </div>
        <div>
          <p className="text-xl font-bold">{callsToday}</p>
          <p className="text-xs text-zinc-500">Calls Today</p>
        </div>
        <div>
          <p className="text-xl font-bold">{bookingsToday}</p>
          <p className="text-xs text-zinc-500">Bookings</p>
        </div>
      </div>
    </div>
  );
}

// AI Response Component
function AIResponse({ response, isLoading }: { response: string | null; isLoading: boolean }) {
  if (!response && !isLoading) return null;
  
  return (
    <div className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <span className="text-sm text-zinc-400 ml-2">Osiris is thinking...</span>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="text-purple-400 text-lg">𓂀</div>
          <p className="text-zinc-200 leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate AI response - will connect to real API
    setTimeout(() => {
      setAiResponse(`Based on your data: WinBros is performing well with 12 calls today and 8 bookings (67% conversion). Cedar Rapids had 3 calls with 2 bookings. Total MRR is $1,750 and trending up 15% from last month. Your next priority should be closing the 2 pending leads from yesterday's calls.`);
      setIsLoading(false);
    }, 1500);
    
    setQuery('');
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0f]/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">𓂀</div>
              <div>
                <h1 className="text-xl font-bold gradient-text">OSIRIS</h1>
                <p className="text-xs text-zinc-500">Command Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="status-dot online"></div>
                <span className="text-sm text-zinc-400">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Search Bar */}
        <section className="mb-10 animate-fadeIn">
          <form onSubmit={handleSearch} className="search-container p-4 glow-purple-sm">
            <div className="flex items-center gap-4">
              <div className="text-purple-400 text-xl">⌘</div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Osiris anything... (e.g., 'How did WinBros perform this week?')"
                className="search-input flex-1 py-2"
              />
              <button type="submit" className="btn-primary px-6 py-2 text-sm">
                Ask
              </button>
            </div>
          </form>
          <AIResponse response={aiResponse} isLoading={isLoading} />
        </section>

        {/* Key Metrics Grid */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-purple-400">◈</span> Key Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Monthly Recurring Revenue"
              value="$1,750"
              change="+15%"
              changeType="up"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <MetricCard
              label="Calls Today"
              value="15"
              change="+3"
              changeType="up"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            />
            <MetricCard
              label="Bookings Today"
              value="10"
              change="67%"
              changeType="neutral"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <MetricCard
              label="Active Clients"
              value="2"
              change="target: 50"
              changeType="neutral"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
          </div>
        </section>

        {/* Secondary Metrics */}
        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Conversion Rate"
              value="67%"
              change="+5%"
              changeType="up"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            />
            <MetricCard
              label="Avg Revenue/Client"
              value="$875"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            <MetricCard
              label="Jobs This Week"
              value="47"
              change="+12"
              changeType="up"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
            />
            <MetricCard
              label="Revenue This Month"
              value="$8,420"
              change="+22%"
              changeType="up"
              icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
          </div>
        </section>

        {/* Client Health */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-purple-400">◈</span> Client Health
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ClientCard
              name="WinBros Cleaning"
              status="online"
              mrr="$1,500"
              callsToday={12}
              bookingsToday={8}
            />
            <ClientCard
              name="Cedar Rapids Cleaning"
              status="online"
              mrr="$250"
              callsToday={3}
              bookingsToday={2}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <span className="text-purple-400">◈</span> Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="card px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
              📞 View Call Logs
            </button>
            <button className="card px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
              📅 Upcoming Bookings
            </button>
            <button className="card px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
              💰 Revenue Breakdown
            </button>
            <button className="card px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
              ⚙️ Client Settings
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <p>Osiris AI © 2026</p>
            <p>Last sync: Just now</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
