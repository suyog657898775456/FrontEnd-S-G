import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllComplaints } from "../services/grievanceService"; // Direct fetch service
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // Base Configuration
  const statusConfig = [
    { name: "Total", color: "#1E293B" },
    { name: "Pending", color: "#3B82F6" },
    { name: "In Progress", color: "#F59E0B" },
    { name: "Resolved", color: "#10B981" },
    { name: "Rejected", color: "#EF4444" },
  ];

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        // ✨ Fetching all complaints from backend
        const data = await fetchAllComplaints();
        const validData = Array.isArray(data) ? data : [];

        // Logic: Calculate stats for this user only
        const stats = {
          Total: validData.length,
          Pending: validData.filter(
            (c) => c.status?.toLowerCase() === "pending",
          ).length,
          "In Progress": validData.filter((c) =>
            ["in_progress", "in progress"].includes(c.status?.toLowerCase()),
          ).length,
          Resolved: validData.filter(
            (c) => c.status?.toLowerCase() === "resolved",
          ).length,
          Rejected: validData.filter(
            (c) => c.status?.toLowerCase() === "rejected",
          ).length,
        };

        const finalData = statusConfig.map((config) => ({
          ...config,
          value: stats[config.name] || 0,
        }));

        setChartData(finalData);
      } catch (error) {
        console.error("Analytics Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center font-black text-blue-600 animate-pulse text-xl tracking-widest uppercase">
        Analyzing Your Records...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-[#F8FAFC] min-h-screen font-sans">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 w-fit px-6 py-3 rounded-2xl transition-all border border-slate-200 hover:border-blue-200 bg-white shadow-sm active:scale-95"
      >
        ← Return to Dashboard
      </button>

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
            Personal Intelligence
          </span>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Your <span className="text-blue-600">Analytics</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Verified statistical breakdown of your personal grievance history.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl"></div>

        <div className="w-full relative z-10 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 50, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="10 10"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: "900" }}
                dy={20}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "#F1F5F9", radius: 20 }}
                contentStyle={{
                  borderRadius: "24px",
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  padding: "20px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                }}
              />
              <Bar
                dataKey="value"
                radius={[20, 20, 20, 20]}
                barSize={70}
                animationDuration={2000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#0F172A"
                  fontSize={22}
                  fontWeight="900"
                  offset={20}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-16 pt-12 border-t border-slate-100">
          {chartData.map((item) => (
            <div
              key={item.name}
              className={`group relative p-6 rounded-[2.5rem] border transition-all duration-500 ${item.name === "Total" ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50/50 border-white hover:bg-white hover:shadow-2xl"}`}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                {item.name}
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-4xl font-black ${item.name === "Total" ? "text-white" : "text-slate-800"}`}
                >
                  {item.value}
                </p>
                <span className="text-[10px] font-bold opacity-40 uppercase">
                  Units
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2">
        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">
          User-Specific Intelligence Data
        </p>
      </div>
    </div>
  );
};

export default Analytics;
