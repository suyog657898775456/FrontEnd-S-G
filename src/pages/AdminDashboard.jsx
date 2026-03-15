import React, { useEffect, useState } from "react";
import {
  fetchAllComplaints,
  updateComplaintStatus,
  fetchAllFeedbacks,
} from "../services/grievanceService";
import API from "../services/api";
import AlertTicker from "../components/AlertTicker";
import GrievanceMap from "../components/GrievanceMap"; // Import the map component
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// helper component - ONLY DECLARED ONCE
function StatBox({ title, value, icon, color }) {
  const styles = {
    blue: "bg-blue-600 shadow-blue-200",
    amber: "bg-amber-500 shadow-amber-200",
    green: "bg-green-600 shadow-green-200",
    red: "bg-red-600 shadow-red-200",
  };
  return (
    <div
      className={`p-6 rounded-[2rem] shadow-xl text-white ${styles[color]} transform hover:scale-105 transition-all cursor-default relative overflow-hidden group`}
    >
      <span className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-125 transition-transform">
        {icon}
      </span>
      <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">
        {title}
      </p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-4xl font-black">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("analytics"); // ✨ 'analytics' or 'heatmap'

  const [selectedImg, setSelectedImg] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);

  // Resolution States
  const [resolvedFile, setResolvedFile] = useState(null);
  const [resNote, setResNote] = useState("");

  const [activeDept, setActiveDept] = useState("Road");
  const departments = ["Road", "Light", "Water", "Sewage", "Garbage"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [complaintsData, feedbacksData] = await Promise.all([
        fetchAllComplaints(),
        fetchAllFeedbacks(),
      ]);
      setComplaints(complaintsData || []);
      setFeedbacks(feedbacksData || []);
    } catch (error) {
      console.error("Admin data error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveWithPhoto = async (id) => {
    if (!resolvedFile || !resNote)
      return alert("Please provide After Image and Resolution Note!");
    const formData = new FormData();
    formData.append("status", "resolved");
    formData.append("after_image", resolvedFile);
    formData.append("resolution_note", resNote);

    try {
      await API.patch(`grievances/officer/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Complaint Resolved with Proof!");
      loadData();
      setViewDetails(null);
      setResolvedFile(null);
      setResNote("");
    } catch (error) {
      alert("Update failed.");
    }
  };

  // ✨ UPDATED: Robust Department-wise Stats Fetching
  const getActiveDeptStats = () => {
    const statsArr = [
      { name: "Pending", count: 0, color: "#2563eb" },
      { name: "In Progress", count: 0, color: "#f59e0b" },
      { name: "Resolved", count: 0, color: "#10b981" },
      { name: "Rejected", count: 0, color: "#ef4444" },
    ];

    complaints.forEach((c) => {
      const deptMatch =
        c.department?.toString().toLowerCase().trim() ===
        activeDept.toLowerCase().trim();

      if (deptMatch) {
        const s = c.status?.toLowerCase().trim();
        if (s === "pending") statsArr[0].count++;
        else if (s === "in_progress" || s === "in progress")
          statsArr[1].count++;
        else if (s === "resolved") statsArr[2].count++;
        else if (s === "rejected") statsArr[3].count++;
      }
    });
    return statsArr;
  };

  const stats = {
    total: complaints.length,
    awaiting: complaints.filter((c) =>
      ["pending", "in_progress"].includes(c.status?.toLowerCase()),
    ).length,
    resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved")
      .length,
    rejected: complaints.filter((c) => c.status?.toLowerCase() === "rejected")
      .length,
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter =
      filter === "All" || c.status?.toLowerCase() === filter.toLowerCase();
    const displayName = c.citizen_name || c.username || `User #${c.user}`;
    return (
      matchesFilter &&
      (displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toString().includes(searchQuery))
    );
  });

  if (loading)
    return (
      <div className="p-20 text-center font-black text-blue-600 animate-pulse text-xl tracking-widest uppercase">
        Initializing...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <AlertTicker complaints={complaints} />

      <div className="space-y-10 p-6 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">
            SUPER ADMIN DASHBOARD
          </h1>

          {/* ✨ Modern Toggle for Heatmap vs Analytics */}
          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveView("analytics")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "analytics" ? "bg-white shadow-lg text-blue-600" : "text-slate-500"}`}
            >
              📊 Stats View
            </button>
            <button
              onClick={() => setActiveView("heatmap")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "heatmap" ? "bg-white shadow-lg text-blue-600" : "text-slate-500"}`}
            >
              🌍 Heatmap View
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox
            title="Total Reports"
            value={stats.total}
            icon="📊"
            color="blue"
          />
          <StatBox
            title="Active Tasks"
            value={stats.awaiting}
            icon="⏳"
            color="amber"
          />
          <StatBox
            title="Resolved"
            value={stats.resolved}
            icon="✅"
            color="green"
          />
          <StatBox
            title="Rejected"
            value={stats.rejected}
            icon="🚫"
            color="red"
          />
        </div>

        {/* Dynamic Display Area */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-slate-200/40">
          {activeView === "analytics" ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span>📉</span> Department Insights
                  </h2>
                  <p className="text-lg font-bold text-slate-700">
                    Status breakdown for {activeDept}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${activeDept === dept ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-400 hover:border-blue-100"}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ width: "100%", height: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getActiveDeptStats()}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      fontWeight="bold"
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "15px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={60}>
                      {getActiveDeptStats().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="count"
                        position="top"
                        style={{
                          fill: "#64748b",
                          fontWeight: "900",
                          fontSize: "14px",
                        }}
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span>🌍</span> Geo-Spatial Analysis
                  </h2>
                  <p className="text-lg font-bold text-slate-800">
                    Visualizing Complaint Hotspots
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                  Live Monitoring Active
                </div>
              </div>
              <GrievanceMap
                complaints={complaints}
                onMarkerClick={(c) => setViewDetails(c)}
              />
            </div>
          )}
        </div>

        {/* Management Table */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden mt-8">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
              <tr>
                <th className="px-8 py-5">Citizen</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-6 text-center">Priority</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setViewDetails(c)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-all"
                >
                  <td className="px-8 py-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase">
                      {(c.citizen_name || c.username || "U")[0]}
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {c.citizen_name || c.username}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-blue-500 uppercase">
                    {c.department}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                        c.priority === "CRITICAL"
                          ? "bg-red-100 text-red-700 border-red-200 animate-pulse"
                          : c.priority === "HIGH"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : c.priority === "MEDIUM"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {c.priority || "LOW"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${c.status === "resolved" ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}
                    >
                      {c.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right underline text-blue-400 text-xs font-bold">
                    VIEW DETAILS →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Details Popup Modal */}
        {viewDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  #{viewDetails.id} Details
                </h3>
                <button
                  onClick={() => setViewDetails(null)}
                  className="text-3xl hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Description
                    </label>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      "{viewDetails.description}"
                    </p>
                  </div>
                  {viewDetails.status !== "resolved" ? (
                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-inner space-y-4">
                      <h4 className="text-[11px] font-black text-emerald-700 uppercase flex items-center gap-2">
                        <span>📸</span> Submit Proof
                      </h4>
                      <input
                        type="file"
                        onChange={(e) => setResolvedFile(e.target.files[0])}
                        className="text-[10px] block w-full"
                      />
                      <textarea
                        placeholder="Resolution note..."
                        className="w-full p-3 text-xs rounded-xl h-20 outline-none"
                        onChange={(e) => setResNote(e.target.value)}
                      />
                      <button
                        onClick={() => handleResolveWithPhoto(viewDetails.id)}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700"
                      >
                        Verify & Resolve
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <label className="text-[10px] font-black text-blue-700 uppercase block mb-2">
                        Resolution Note
                      </label>
                      <p className="text-xs italic text-blue-900 leading-relaxed">
                        "
                        {viewDetails.resolution_note ||
                          "Successfully completed."}
                        "
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Visual Evidence
                  </label>
                  {viewDetails.status === "resolved" ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded">
                          BEFORE
                        </span>
                        <img
                          src={`http://127.0.0.1:8000${viewDetails.image}`}
                          className="w-full h-32 object-cover rounded-2xl border shadow-md"
                          alt="Before"
                        />
                      </div>
                      <div className="relative group">
                        <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded">
                          AFTER
                        </span>
                        <img
                          src={`http://127.0.0.1:8000${viewDetails.after_image}`}
                          className="w-full h-32 object-cover rounded-2xl border shadow-md"
                          alt="After"
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={`http://127.0.0.1:8000${viewDetails.image}`}
                      className="w-full h-48 object-cover rounded-[2rem] border-4 border-white shadow-xl cursor-zoom-in"
                      alt="Initial Evidence"
                      onClick={() =>
                        setSelectedImg(
                          `http://127.0.0.1:8000${viewDetails.image}`,
                        )
                      }
                    />
                  )}
                  <a
                    href={viewDetails.formatted_address}
                    target="_blank"
                    className="block w-full bg-slate-800 text-white p-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-700 transition-all"
                  >
                    📍 Live GPS Track
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Image Zoom Modal */}
        {selectedImg && (
          <div
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-10 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            <img
              src={selectedImg}
              className="max-w-full max-h-[90vh] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 object-contain border-8 border-white/10"
              alt="Full View"
            />
          </div>
        )}
      </div>
    </div>
  );
}
