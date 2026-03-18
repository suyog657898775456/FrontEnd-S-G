import React, { useEffect, useState } from "react";
import {
  fetchAllComplaints,
  updateComplaintStatus,
  fetchAllFeedbacks,
} from "../services/grievanceService";
import API from "../services/api";
import AlertTicker from "../components/AlertTicker";
import GrievanceMap from "../components/GrievanceMap";
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

// helper component
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
  const [activeView, setActiveView] = useState("analytics");

  const [selectedImg, setSelectedImg] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);

  // States for Admin Actions
  const [resolvedFile, setResolvedFile] = useState(null);
  const [resNote, setResNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const [activeDept, setActiveDept] = useState("Road");
  const departments = ["Road", "Light", "Water", "Sewage", "Garbage"];

  const getFullImgUrl = (path) => {
    if (!path)
      return "https://via.placeholder.com/800x600?text=No+Image+Available";
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000${path}`;
  };

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

  const handleUpdateStatus = async (id, newStatus) => {
    if (newStatus === "rejected" && !rejectReason)
      return alert("Please provide a reason for rejection.");
    try {
      const payload = {
        status: newStatus,
        resolution_note:
          newStatus === "rejected" ? rejectReason : "Updated by Admin",
      };
      await API.patch(`grievances/officer/${id}/`, payload);
      alert(`System: Complaint marked as ${newStatus.replace("_", " ")}`);
      loadData();
      setViewDetails(null);
      setRejectReason("");
    } catch (error) {
      alert("Update failed.");
    }
  };

  const handleResolveWithPhoto = async (id) => {
    if (!resolvedFile || !resNote)
      return alert("Upload After Image & add Note!");
    const formData = new FormData();
    formData.append("status", "resolved");
    formData.append("after_image", resolvedFile);
    formData.append("resolution_note", resNote);

    try {
      await API.patch(`grievances/officer/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("System: Grievance Resolved with Proof!");
      loadData();
      setViewDetails(null);
      setResolvedFile(null);
      setResNote("");
    } catch (error) {
      alert("Resolution upload failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("PERMANENT DELETE: Are you sure?")) return;
    try {
      await API.delete(`grievances/officer/${id}/`);
      alert("Complaint removed from database.");
      loadData();
      setViewDetails(null);
    } catch (error) {
      alert("Delete failed.");
    }
  };

  const getActiveDeptStats = () => {
    const statsArr = [
      { name: "Pending", count: 0, color: "#2563eb" },
      { name: "In Progress", count: 0, color: "#f59e0b" },
      { name: "Resolved", count: 0, color: "#10b981" },
      { name: "Rejected", count: 0, color: "#ef4444" },
    ];
    complaints.forEach((c) => {
      const depts = Array.isArray(c.department) ? c.department : [c.department];
      if (depts.some((d) => d?.toLowerCase() === activeDept.toLowerCase())) {
        const s = c.status?.toLowerCase();
        if (s === "pending") statsArr[0].count++;
        else if (s === "in_progress" || s === "in progress")
          statsArr[1].count++;
        else if (s === "resolved") statsArr[2].count++;
        else if (s === "rejected") statsArr[3].count++;
      }
    });
    return statsArr;
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus =
      filter === "All" || c.status?.toLowerCase() === filter.toLowerCase();
    const searchableDepts = Array.isArray(c.department)
      ? c.department.join(" ")
      : c.department || "";
    const matchesSearch =
      (c.citizen_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.id.toString().includes(searchQuery) ||
      searchableDepts.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading)
    return (
      <div className="p-20 text-center font-black text-blue-600 animate-pulse text-xl uppercase">
        Initializing Secure Terminal...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <AlertTicker complaints={complaints} />

      <div className="space-y-8 p-6 relative max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">
            SUPER ADMIN <span className="text-blue-600">DASHBOARD</span>
          </h1>
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveView("analytics")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === "analytics" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}
            >
              📊 Stats
            </button>
            <button
              onClick={() => setActiveView("heatmap")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === "heatmap" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}
            >
              🌍 Heatmap
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox
            title="Total Records"
            value={complaints.length}
            icon="📊"
            color="blue"
          />
          <StatBox
            title="Needs Action"
            value={
              complaints.filter((c) =>
                ["pending", "in_progress"].includes(c.status?.toLowerCase()),
              ).length
            }
            icon="⏳"
            color="amber"
          />
          <StatBox
            title="Closed Cases"
            value={
              complaints.filter((c) => c.status?.toLowerCase() === "resolved")
                .length
            }
            icon="✅"
            color="green"
          />
          <StatBox
            title="Rejected"
            value={
              complaints.filter((c) => c.status?.toLowerCase() === "rejected")
                .length
            }
            icon="🚫"
            color="red"
          />
        </div>

        {/* ✨ Modern Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="relative flex-1">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">
              🔍
            </span>
            <input
              type="text"
              placeholder="Filter by Name, ID, or Department..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 ring-blue-100 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-8 py-4 bg-slate-50 rounded-2xl border-none text-[10px] font-black uppercase outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status Types</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-slate-200/40 min-h-[500px]">
          {activeView === "analytics" ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span>📈</span> Statistical Insights
                  </h2>
                  <p className="text-lg font-bold text-slate-700">
                    {activeDept} Division Data
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${activeDept === dept ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-400 hover:border-blue-100"}`}
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
                      contentStyle={{ borderRadius: "15px", border: "none" }}
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
              <GrievanceMap
                complaints={complaints}
                onMarkerClick={(c) => setViewDetails(c)}
              />
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b">
              <tr>
                <th className="px-8 py-6">Reporting Citizen</th>
                <th className="px-8 py-6">Sectors</th>
                <th className="px-8 py-6 text-center">Severity</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setViewDetails(c)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-all group"
                >
                  <td className="px-8 py-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {(c.citizen_name || "U")[0]}
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {c.citizen_name}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1 flex-wrap">
                      {(Array.isArray(c.department)
                        ? c.department
                        : [c.department]
                      ).map((d, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${c.priority === "CRITICAL" ? "bg-red-100 text-red-700 border-red-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${c.status === "resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}
                    >
                      {c.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-blue-400 text-[10px] uppercase tracking-tighter group-hover:text-blue-600">
                    Analyze & Manage →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✨ Professional Management Modal */}
        {viewDetails && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[5000] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col my-auto">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    Case Intelligence Center
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Ticket Reference: #{viewDetails.id}
                  </p>
                </div>
                <button
                  onClick={() => setViewDetails(null)}
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-red-500 transition-all text-2xl font-light"
                >
                  ×
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Left Side: Logic & Actions */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                      Issue Description
                    </label>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      "{viewDetails.description}"
                    </p>
                  </div>

                  {/* Operational Controls */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2">
                      <span>⚡</span> Rapid Operations
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          handleUpdateStatus(viewDetails.id, "in_progress")
                        }
                        className="bg-amber-100 text-amber-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase border border-amber-200 hover:bg-amber-200 transition-all shadow-sm"
                      >
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => handleDelete(viewDetails.id)}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-100 transition-all shadow-sm"
                      >
                        Terminate Record
                      </button>
                    </div>
                  </div>

                  {/* Resolution Input Area */}
                  {viewDetails.status !== "resolved" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-4">
                        <h4 className="text-[11px] font-black text-emerald-700 uppercase">
                          Resolve Case
                        </h4>
                        <input
                          type="file"
                          className="text-[9px] block w-full text-slate-400"
                          onChange={(e) => setResolvedFile(e.target.files[0])}
                        />
                        <textarea
                          placeholder="Resolution final note..."
                          className="w-full p-4 text-xs rounded-2xl h-20 outline-none border border-emerald-100 shadow-sm"
                          onChange={(e) => setResNote(e.target.value)}
                        />
                        <button
                          onClick={() => handleResolveWithPhoto(viewDetails.id)}
                          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                        >
                          Submit Resolution
                        </button>
                      </div>
                      <div className="p-6 bg-red-50 rounded-[2.5rem] border border-red-100 space-y-4">
                        <h4 className="text-[11px] font-black text-red-700 uppercase">
                          Reject Request
                        </h4>
                        <textarea
                          placeholder="Reason for rejection..."
                          className="w-full p-4 text-xs rounded-2xl h-20 outline-none border border-red-100 shadow-sm"
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <button
                          onClick={() =>
                            handleUpdateStatus(viewDetails.id, "rejected")
                          }
                          className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-lg shadow-red-100 transition-all"
                        >
                          Deny Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Department Multi-Task Proof View */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
                      Inter-Departmental Proofs
                    </h4>
                    {viewDetails.department_tasks?.length > 0 ? (
                      viewDetails.department_tasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[11px] font-black uppercase text-slate-800">
                              {task.department} Division
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${task.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                            >
                              {task.status}
                            </span>
                          </div>
                          {task.status === "resolved" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  Before
                                </p>
                                <img
                                  src={getFullImgUrl(task.before_image)}
                                  className="h-28 w-full object-cover rounded-2xl cursor-pointer hover:opacity-80 border-2 border-slate-50"
                                  onClick={() =>
                                    setSelectedImg(
                                      getFullImgUrl(task.before_image),
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  After
                                </p>
                                <img
                                  src={getFullImgUrl(task.after_image)}
                                  className="h-28 w-full object-cover rounded-2xl cursor-pointer hover:opacity-80 border-2 border-slate-50"
                                  onClick={() =>
                                    setSelectedImg(
                                      getFullImgUrl(task.after_image),
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">
                        No departmental sub-tasks generated for this case.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Primary Evidence & Geo */}
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                      Primary Citizen Evidence
                    </label>
                    <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-100 relative group">
                      <img
                        src={getFullImgUrl(viewDetails.image)}
                        className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-700"
                        alt="Incident"
                        onClick={() =>
                          setSelectedImg(getFullImgUrl(viewDetails.image))
                        }
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/800x600?text=Data+Image+Corrupt";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none text-white font-black text-xs uppercase tracking-widest">
                        Click to Expand
                      </div>
                    </div>
                  </div>
                  <a
                    href={viewDetails.formatted_address}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-slate-900 text-white p-5 rounded-[2rem] text-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    📍 Synchronize Location Data
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Zoom Modal */}
        {selectedImg && (
          <div
            className="fixed inset-0 bg-slate-950/95 z-[9999] flex items-center justify-center p-10 cursor-zoom-out animate-in fade-in duration-300"
            onClick={() => setSelectedImg(null)}
          >
            <img
              src={selectedImg}
              className="max-w-full max-h-[90vh] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500 object-contain border-8 border-white/5"
              alt="High Res Proof"
            />
          </div>
        )}
      </div>
    </div>
  );
}
