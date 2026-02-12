'use client';

import { useState, useEffect } from 'react';

export default function KPIBar() {
  const [kpis, setKpis] = useState({
    mrr: 1750,
    leads: 12,
    calls: 4,
    content: 8,
  });

  // Simulate changing KPIs
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => ({
        ...prev,
        leads: prev.leads + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'MRR', value: `$${kpis.mrr.toLocaleString()}`, target: '$100,000', progress: (kpis.mrr / 100000) * 100, color: '#22c55e' },
    { label: 'Leads', value: kpis.leads.toString(), target: '100/week', progress: (kpis.leads / 100) * 100, color: '#f59e0b' },
    { label: 'Calls Booked', value: kpis.calls.toString(), target: '10/week', progress: (kpis.calls / 10) * 100, color: '#3b82f6' },
    { label: 'Content', value: kpis.content.toString(), target: '14/week', progress: (kpis.content / 14) * 100, color: '#ec4899' },
  ];

  return (
    <div className="absolute top-16 left-4 right-4 z-20">
      <div className="flex justify-center gap-4 flex-wrap">
        {metrics.map((metric) => (
          <div 
            key={metric.label}
            className="bg-black/60 backdrop-blur-sm rounded-lg border border-gray-700 px-4 py-3 min-w-[150px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{metric.label}</span>
              <span className="text-xs text-gray-600">{metric.target}</span>
            </div>
            <div className="text-xl font-bold text-white mb-2">{metric.value}</div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(metric.progress, 100)}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
