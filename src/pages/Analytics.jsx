import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserComplaints,
  fetchAllComplaints,
  fetchMunicipalData,
} from "../services/grievanceService";
import { AuthContext } from "../context/AuthContext";
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
  const { user } = useContext(AuthContext); // Identity extraction
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const statusConfig = [
    { name: "Pending", color: "#3B82F6", icon: "🕒" },
    { name: "In Progress", color: "#F59E0B", icon: "🏗️" },
    { name: "Resolved", color: "#10B981", icon: "✅" },
    { name: "Rejected", color: "#EF4444", icon: "🚫" },
  ];

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        let rawData = [];

        // 🚀 ROLE-BASED ISOLATION: Fetching data specifically for the logged-in user
        if (user.role === "ADMIN") {
          rawData = await fetchAllComplaints();
        } else if (user.role === "OFFICER") {
          const res = await fetchMunicipalData();
          rawData = res.complaints;
        } else {
          // Citizen case
          rawData = await fetchUserComplaints();
        }

        // 🛠 Data Normalization (Handling results array or direct array)
        const validData = Array.isArray(rawData)
          ? rawData
          : rawData?.results || [];
        setTotalCount(validData.length);

        // 📊 Precise Multi-Status Mapping
        const stats = {
          Pending: validData.filter((c) =>
            ["pending", "submitted", "verified"].includes(
              c.status?.toLowerCase(),
            ),
          ).length,
          "In Progress": validData.filter((c) =>
            ["in_progress", "in progress", "assigned"].includes(
              c.status?.toLowerCase(),
            ),
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
        console.error("Critical Analytics Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]); // Re-fetch logic trigger on user change

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-blue-600 text-sm uppercase tracking-[0.3em] animate-pulse">
          Synchronizing Intelligence...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Dynamic Navigation Header */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 px-6 py-3 rounded-2xl transition-all border border-slate-200 bg-white shadow-sm active:scale-95"
        >
          ← Exit Terminal
        </button>
        <div className="bg-blue-50 px-5 py-2 rounded-2xl border border-blue-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            {user?.role} Mode Active
          </p>
        </div>
      </div>

      {/* Modern Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-4">
          <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Identity Verified
          </span>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">
            {user?.role === "ADMIN" ? "City" : "My"}{" "}
            <span className="text-blue-600">Analytics</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg leading-relaxed text-sm">
            Automated visualization of grievance lifecycle. Data is isolated and
            encrypted based on your session credentials.
          </p>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2 opacity-70">
            Filtered Records
          </p>
          <h3 className="text-7xl font-black tracking-tighter relative z-10">
            {totalCount}
          </h3>
          <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">
            Total Intelligence Hits
          </p>
          <span className="absolute -right-6 -bottom-6 text-[10rem] opacity-5 font-black pointer-events-none group-hover:scale-110 transition-transform">
            📊
          </span>
        </div>
      </div>

      {/* Professional Chart Area */}
      <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-xl border border-slate-50 relative mb-10 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">
              Performance Matrix
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Status-wise distribution audit
            </p>
          </div>
          <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {statusConfig.map((s) => (
              <div key={s.name} className="flex items-center gap-2 px-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                ></div>
                <span className="text-[9px] font-black uppercase text-slate-500">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-[400px] md:h-[450px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
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
                dy={15}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "#F8FAFC", radius: 25 }}
                contentStyle={{
                  borderRadius: "25px",
                  border: "none",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  padding: "15px 20px",
                  fontWeight: "900",
                }}
              />
              <Bar
                dataKey="value"
                radius={[20, 20, 20, 20]}
                barSize={70}
                animationDuration={1800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    fillOpacity={0.9}
                  />
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
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:-translate-y-2 group"
          >
            <div className="flex justify-between items-start mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner transform group-hover:rotate-12 transition-transform"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
              {item.name}
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter group-hover:scale-105 transition-transform origin-left">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
