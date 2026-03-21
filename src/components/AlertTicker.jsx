import React from "react";

export default function AlertTicker({ complaints }) {
  const urgentAlerts = complaints.filter(
    (c) => c.priority === "CRITICAL" || c.priority === "HIGH",
  );

  if (urgentAlerts.length === 0) return null;

  return (
    <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-[2rem] px-6 py-4 overflow-hidden relative group">
        {/* Animated Glow Effect */}
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse"></div>

        <div className="flex items-center gap-6">
          {/* Status Label */}
          <div className="flex items-center gap-3 shrink-0 bg-red-950/30 px-4 py-2 rounded-2xl border border-red-900/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] whitespace-nowrap">
              Priority Alert
            </span>
          </div>

          {/* Scrolling Container */}
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-16 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
              {urgentAlerts.concat(urgentAlerts).map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 group/item cursor-default"
                >
                  <span className="text-[10px] font-mono font-black text-blue-400 bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/20">
                    #{alert.id}
                  </span>
                  <p className="text-sm font-bold text-slate-200">
                    {alert.citizen_name}
                    <span className="text-slate-500 mx-2 font-normal">|</span>
                    <span className="text-slate-400 font-medium italic">
                      "{alert.description.substring(0, 60)}..."
                    </span>
                  </p>
                  <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    {Array.isArray(alert.department)
                      ? alert.department[0]
                      : alert.department}
                  </div>
                </div>
              ))}
            </div>

            {/* Fade effect on sides for smooth transition */}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
          </div>

          <div className="shrink-0 hidden md:block">
            <div className="flex items-center gap-2 text-slate-600 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <span className="text-[8px] font-black uppercase tracking-tighter">
                Live Monitor
              </span>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
}
