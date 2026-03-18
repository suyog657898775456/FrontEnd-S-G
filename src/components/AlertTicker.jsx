import React from "react";

export default function AlertTicker({ complaints }) {
  // Sirf Critical ya High priority complaints ko filter karein
  const urgentAlerts = complaints.filter(
    (c) => c.priority === "CRITICAL" || c.priority === "HIGH",
  );

  if (urgentAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[4000] w-[90%] max-w-4xl">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] px-8 py-4 overflow-hidden relative group">
        {/* Decorative Pulse Background */}
        <div className="absolute inset-y-0 left-0 w-2 bg-red-600 animate-pulse"></div>

        <div className="flex items-center gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest whitespace-nowrap">
              High Alert
            </span>
          </div>

          {/* Moving Ticker */}
          <div className="flex-1 overflow-hidden pointer-events-none">
            <div className="flex gap-12 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
              {urgentAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                    #{alert.id}
                  </span>
                  <p className="text-sm font-bold text-white tracking-tight">
                    {alert.citizen_name}:{" "}
                    <span className="text-slate-400 font-medium">
                      {alert.description.substring(0, 50)}...
                    </span>
                  </p>
                  <span className="text-blue-400 font-black text-[10px] uppercase">
                    [
                    {Array.isArray(alert.department)
                      ? alert.department.join(", ")
                      : alert.department}
                    ]
                  </span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {urgentAlerts.map((alert, idx) => (
                <div key={`dup-${idx}`} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                    #{alert.id}
                  </span>
                  <p className="text-sm font-bold text-white tracking-tight">
                    {alert.citizen_name}:{" "}
                    <span className="text-slate-400 font-medium">
                      {alert.description.substring(0, 50)}...
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-tighter italic">
              Live Feed
            </p>
          </div>
        </div>
      </div>

      {/* Marquee Animation CSS - Inset into index.css if needed */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
}
