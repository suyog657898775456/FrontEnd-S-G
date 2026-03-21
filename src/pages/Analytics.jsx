import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserComplaints,
  fetchAllComplaints,
} from "../services/grievanceService";
import { AuthContext } from "../context/AuthContext"; // Token/User role check ke liye
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
  const { user } = useContext(AuthContext); // Get user role
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const statusConfig = [
    { name: "Total", color: "#1E293B" },
    { name: "Pending", color: "#3B82F6" },
    { name: "In Progress", color: "#F59E0B" },
    { name: "Resolved", color: "#10B981" },
    { name: "Rejected", color: "#EF4444" },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        // ✨ LOGIC FIX: User role ke hisaab se sahi function call karein
        // Admin hai toh sabka data, Citizen hai toh sirf uska data
        let data;
        if (user?.role === "ADMIN") {
          data = await fetchAllComplaints();
        } else {
          data = await fetchUserComplaints();
        }

        const validData = Array.isArray(data) ? data : [];

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

    if (user) loadStats();
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-blue-600 animate-pulse text-xl uppercase">
        Analyzing Intelligence...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-[#F8FAFC] min-h-screen font-sans">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 w-fit px-6 py-3 rounded-2xl transition-all border border-slate-200 bg-white"
      >
        ← Return
      </button>

      <div className="mb-12">
        <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
          Personal Intelligence
        </span>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
          Your <span className="text-blue-600">Analytics</span>
        </h2>
      </div>

      {/* CHART CONTAINER FIX: added h-[500px] and min-h */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white relative overflow-visible">
        <div className="w-full h-[400px] md:h-[500px] relative z-10">
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
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  fontWeight: "900",
                }}
              />
              <Bar dataKey="value" radius={[20, 20, 20, 20]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#0F172A"
                  fontSize={20}
                  fontWeight="900"
                  offset={20}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-16 pt-12 border-t border-slate-100">
          {chartData.map((item) => (
            <div
              key={item.name}
              className={`p-6 rounded-[2.5rem] border transition-all ${item.name === "Total" ? "bg-slate-900 text-white" : "bg-slate-50/50"}`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">
                {item.name}
              </p>
              <p className="text-4xl font-black">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
