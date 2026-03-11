import React from "react";

const AlertTicker = ({ complaints }) => {
  // CRITICAL aur NEW complaints ko alerts ke liye filter karein
  const alerts = complaints
    .filter(
      (c) => c.priority === "CRITICAL" || c.status?.toLowerCase() === "pending",
    )
    .slice(0, 5);

  return (
    <div className="bg-slate-900 overflow-hidden py-3 border-b border-slate-700 relative z-[6000]">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="flex items-center mx-12">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping mr-3"></span>
              <p className="text-white text-[11px] font-black uppercase tracking-widest">
                🚨 ALERT #{alert.id}: {alert.priority} issue in{" "}
                {alert.department} Dept.
                <span className="text-blue-400 ml-2">
                  Location: {alert.department} Division
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center mx-12">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-3"></span>
            <p className="text-white text-[11px] font-black uppercase tracking-widest">
              Amravati Division: All Systems Operational. No critical alerts. 🛡️
            </p>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </div>
  );
};

export default AlertTicker;
