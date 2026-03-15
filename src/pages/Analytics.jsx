import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Base Configuration including the new "Total" category
  const defaultStatusConfig = [
    { name: "Total", color: "#1E293B", value: 0 }, // Dark Slate (New)
    { name: "Pending", color: "#3B82F6", value: 0 }, // Blue
    { name: "In Progress", color: "#F59E0B", value: 0 }, // Amber
    { name: "Resolved", color: "#10B981", value: 0 }, // Green
    { name: "Rejected", color: "#EF4444", value: 0 }, // Red
  ];

  // 2. Receive data from dashboard
  const incomingData = location.state?.chartData || [];

  // 3. Calculate Total and Merge Data
  const totalCount = incomingData.reduce((acc, curr) => acc + curr.value, 0);

  const finalChartData = defaultStatusConfig.map((config) => {
    if (config.name === "Total") {
      return { ...config, value: totalCount };
    }
    const foundData = incomingData.find(
      (item) => item.name.toLowerCase() === config.name.toLowerCase(),
    );
    return {
      ...config,
      value: foundData ? foundData.value : 0,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 w-fit px-6 py-3 rounded-2xl transition-all border border-slate-200 hover:border-blue-200 bg-white shadow-sm active:scale-95"
      >
        ← Return to Dashboard
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
            System Intelligence
          </span>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Data <span className="text-blue-600">Analytics</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Automated statistical breakdown of city grievances and resolution
            efficiency.
          </p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm hidden md:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Active Database
          </p>
          <p className="text-sm font-bold text-slate-700">
            Amravati Division v2.4
          </p>
        </div>
      </div>

      {/* Main Analytics Card */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl"></div>

        {/* Bar Chart Container */}
        <div className="w-full relative z-10 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={finalChartData}
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
              <YAxis
                hide
                domain={[0, (dataMax) => (dataMax < 5 ? 8 : dataMax + 5)]}
              />

              <Tooltip
                cursor={{ fill: "#F1F5F9", radius: 20 }}
                contentStyle={{
                  borderRadius: "24px",
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  padding: "20px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  fontSize: "11px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                }}
              />

              <Bar
                dataKey="value"
                radius={[20, 20, 20, 20]}
                barSize={70}
                animationDuration={2000}
              >
                {finalChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:saturate-150 transition-all duration-500 cursor-pointer"
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

        {/* Dynamic Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-16 pt-12 border-t border-slate-100">
          {finalChartData.map((item) => (
            <div
              key={item.name}
              className={`group relative p-6 rounded-[2.5rem] border transition-all duration-500 ${
                item.name === "Total"
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-slate-50/50 border-white hover:bg-white hover:shadow-2xl hover:shadow-slate-200"
              }`}
            >
              <div
                className={`absolute top-6 right-6 w-2 h-2 rounded-full ${item.name === "Total" ? "bg-blue-400" : ""}`}
                style={
                  item.name !== "Total" ? { backgroundColor: item.color } : {}
                }
              />
              <p
                className={`text-[9px] font-black uppercase tracking-[0.2em] ${item.name === "Total" ? "text-slate-400" : "text-slate-400"}`}
              >
                {item.name}
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-4xl font-black mt-2 ${item.name === "Total" ? "text-white" : "text-slate-800"}`}
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
          Proprietary Analytics Engine
        </p>
      </div>
    </div>
  );
};

export default Analytics;
