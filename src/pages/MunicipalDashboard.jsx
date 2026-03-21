import React, { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchMunicipalData,
  updateComplaintStatus,
} from "../services/grievanceService";
import API from "../services/api";
import GrievanceMap from "../components/GrievanceMap"; // Added Map Component

const MunicipalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeView, setActiveView] = useState("list"); // 'list' or 'map'

  // ✨ Resolution States
  const [afterImage, setAfterImage] = useState(null);
  const [resNote, setResNote] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMunicipalData();
      setComplaints(data.complaints || []);
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching officer data", err);
    } finally {
      setLoading(false);
    }
  };

  // ✨ FIXED Helper: Handle nested image paths properly
  const getFullImgUrl = (path) => {
    if (!path)
      return "https://via.placeholder.com/800x600?text=No+Image+Available";
    if (path.startsWith("http")) return path;
    // Prefix backend host to relative paths
    return `http://127.0.0.1:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // ✅ Status-wise Filtering Logic (Including Rejected)
  const filteredComplaints = useMemo(() => {
    let filtered = complaints;
    if (statusFilter !== "All") {
      filtered = complaints.filter(
        (c) => c.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    return filtered.sort((a, b) => {
      const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (weight[b.priority] || 0) - (weight[a.priority] || 0);
    });
  }, [complaints, statusFilter]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) =>
      ["pending", "in_progress"].includes(c.status?.toLowerCase()),
    ).length,
    resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved")
      .length,
    rejected: complaints.filter((c) => c.status?.toLowerCase() === "rejected")
      .length,
  };

  const handleResolveWithProof = async (complaintId) => {
    if (!afterImage || !resNote)
      return alert("Required: Upload After Image & write Resolution Note!");

    const formData = new FormData();
    formData.append("status", "resolved");
    formData.append("after_image", afterImage);
    formData.append("resolution_note", resNote);

    try {
      await API.patch(`grievances/officer/${complaintId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Task Completed! Resolution proof submitted.");
      loadData();
      setViewDetails(null);
      setAfterImage(null);
      setResNote("");
    } catch (err) {
      alert("Update failed. Please check backend connection.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      let statusToBackend = newStatus.toLowerCase();
      if (statusToBackend === "in progress") statusToBackend = "in_progress";
      await updateComplaintStatus(id, statusToBackend);
      loadData();
      if (viewDetails?.id === id)
        setViewDetails({ ...viewDetails, status: statusToBackend });
    } catch (err) {
      alert("Status sync failed.");
    }
  };

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : "5.0";

  if (loading)
    return (
      <div className="p-20 text-center text-blue-600 font-black animate-pulse text-xl tracking-widest uppercase">
        SECURE SYNC: {user?.department} TERMINAL...
      </div>
    );

  return (
    <div className="space-y-10 p-6 font-sans bg-[#F8FAFC] min-h-screen relative">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
            {user?.department}{" "}
            <span className="text-blue-600">OFFICER HUB</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">
            Identity: {user?.first_name || user?.username} | Unit: Municipal
            Division
          </p>
        </div>

        {/* ✨ NEW View Map Toggle */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveView("list")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === "list" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}
          >
            📑 Tasks
          </button>
          <button
            onClick={() => setActiveView("map")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === "map" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}
          >
            🌍 View Map
          </button>
        </div>

        <div className="bg-slate-900 text-white px-8 py-4 rounded-3xl text-center shadow-2xl">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">
            Performance Index
          </p>
          <p className="text-3xl font-black text-blue-400">{avgRating} ★</p>
        </div>
      </div>

      {activeView === "map" ? (
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 h-[600px] animate-in fade-in zoom-in-95 duration-500">
          <GrievanceMap
            complaints={complaints}
            onMarkerClick={(c) => {
              setViewDetails(c);
              setActiveView("list");
            }}
          />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Workload"
              value={stats.total}
              color="bg-blue-600"
              icon="📂"
            />
            <StatCard
              title="Active Queue"
              value={stats.pending}
              color="bg-amber-500"
              icon="⏳"
            />
            <StatCard
              title="Completed"
              value={stats.resolved}
              color="bg-emerald-500"
              icon="✅"
            />
            <StatCard
              title="Rejected"
              value={stats.rejected}
              color="bg-red-600"
              icon="🚫"
            />
          </div>

          {/* Filtering & Table Section */}
          <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Operational Task List
              </h2>
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {["All", "Pending", "In_Progress", "Resolved", "Rejected"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${statusFilter === status ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-8 py-6">Complaint ID</th>
                    <th className="px-8 py-6">Details</th>
                    <th className="px-8 py-6 text-center">Priority</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredComplaints.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setViewDetails(c)}
                      className="group hover:bg-blue-50/40 cursor-pointer transition-all"
                    >
                      {/* ✨ Bold ID */}
                      <td className="px-8 py-6 font-mono font-black text-slate-900 text-sm">
                        #{c.id}
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-800 text-sm truncate max-w-[250px]">
                          {c.description}
                        </p>
                        <span className="text-[9px] text-blue-500 font-black uppercase tracking-tighter">
                          📍 Geo-Tagged Incident
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${c.priority === "CRITICAL" ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-slate-50 text-slate-500 border-slate-100"}`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-8 py-6 text-right font-black text-blue-400 group-hover:text-blue-600 text-[10px] uppercase tracking-tighter">
                        Review Case →
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal & Popups */}
      {viewDetails && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[5000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                  Grievance Authority Terminal
                </p>
                {/* ✨ Bold ID in Modal */}
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  CASE REFERENCE: #{viewDetails.id}
                </h3>
              </div>
              <button
                onClick={() => setViewDetails(null)}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-red-500 text-2xl transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase block mb-3">
                    Citizen Description
                  </label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                    "{viewDetails.description}"
                  </p>
                </div>

                {viewDetails.status !== "resolved" ? (
                  <div className="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100 space-y-6 shadow-inner">
                    <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                      📸 Upload Resolution Proof
                    </h4>
                    <input
                      type="file"
                      onChange={(e) => setAfterImage(e.target.files[0])}
                      className="text-[10px] block w-full file:bg-emerald-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-full"
                    />
                    <textarea
                      placeholder="Technical summary of work..."
                      className="w-full p-4 text-sm rounded-2xl outline-none shadow-sm h-28"
                      onChange={(e) => setResNote(e.target.value)}
                    />
                    <button
                      onClick={() => handleResolveWithProof(viewDetails.id)}
                      className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-emerald-700 transition-all"
                    >
                      Submit Work Proof
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                    <label className="text-[11px] font-black text-blue-700 uppercase block mb-3">
                      Official Resolution Report
                    </label>
                    <p className="text-sm italic text-blue-900 leading-relaxed font-medium">
                      "
                      {viewDetails.resolution_note ||
                        "Task closed successfully."}
                      "
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleStatusChange(viewDetails.id, "in_progress")
                      }
                      className="bg-white border-2 border-slate-100 py-3 rounded-xl text-[10px] font-black uppercase hover:border-blue-500"
                    >
                      🏗️ In Progress
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(viewDetails.id, "rejected")
                      }
                      className="bg-white border-2 border-slate-100 py-3 rounded-xl text-[10px] font-black uppercase hover:border-red-500"
                    >
                      🚫 Reject
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                  Before / After Inspection
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase">
                      Reported State
                    </span>
                    <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                      <img
                        src={getFullImgUrl(viewDetails.image)}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() =>
                          setSelectedImg(getFullImgUrl(viewDetails.image))
                        }
                      />
                    </div>
                  </div>

                  {/* ✨ Fixed Resolution Proof Display */}
                  {viewDetails.status === "resolved" && (
                    <div className="relative">
                      <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase">
                        Officer Verification
                      </span>
                      <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-emerald-50">
                        <img
                          src={getFullImgUrl(viewDetails.after_image)}
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={() =>
                            setSelectedImg(
                              getFullImgUrl(viewDetails.after_image),
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <a
                  href={viewDetails.formatted_address}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-slate-900 text-white p-5 rounded-[2rem] text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all"
                >
                  📍 Synchronize GPS Data
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedImg && (
        <div
          className="fixed inset-0 bg-slate-950/95 z-[9999] flex items-center justify-center p-10 cursor-zoom-out"
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
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div
    className={`${color} text-white p-8 rounded-[2.5rem] shadow-2xl transform hover:scale-105 transition-all relative overflow-hidden group`}
  >
    <span className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-150 transition-transform">
      {icon}
    </span>
    <h3 className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em]">
      {title}
    </h3>
    <p className="text-5xl font-black mt-2 tracking-tighter">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  let bg = "bg-amber-50 text-amber-600 border-amber-100";
  if (s === "resolved")
    bg = "bg-emerald-50 text-emerald-600 border-emerald-100";
  if (s === "rejected") bg = "bg-red-50 text-red-600 border-red-100";
  if (s === "in_progress" || s === "in progress")
    bg = "bg-blue-50 text-blue-600 border-blue-100 animate-pulse";
  return (
    <span
      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${bg}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

export default MunicipalDashboard;
