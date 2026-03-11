import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchMunicipalData,
  updateComplaintStatus,
} from "../services/grievanceService";
import API from "../services/api"; // Added for PATCH request

const MunicipalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [viewDetails, setViewDetails] = useState(null); // Detail Popup state

  // ✨ Resolution States
  const [afterImage, setAfterImage] = useState(null);
  const [resNote, setResNote] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMunicipalData(); // Calls GET /api/grievances/citizen/
      const allComplaints = data.complaints || [];
      const officerFeedbacks = data.feedbacks || [];

      const sortedComplaints = [...allComplaints].sort((a, b) => {
        const statusOrder = {
          pending: 1,
          in_progress: 2,
          resolved: 3,
          rejected: 4,
        };
        const statusA = a.status?.toLowerCase() || "pending";
        const statusB = b.status?.toLowerCase() || "pending";
        if (statusOrder[statusA] !== statusOrder[statusB]) {
          return statusOrder[statusA] - statusOrder[statusB];
        }
        const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      });

      setComplaints(sortedComplaints);
      setFeedbacks(officerFeedbacks);

      setStats({
        total: sortedComplaints.length,
        pending: sortedComplaints.filter((c) =>
          ["pending", "in_progress"].includes(c.status?.toLowerCase()),
        ).length,
        resolved: sortedComplaints.filter(
          (c) => c.status?.toLowerCase() === "resolved",
        ).length,
        rejected: sortedComplaints.filter(
          (c) => c.status?.toLowerCase() === "rejected",
        ).length,
      });
    } catch (err) {
      console.error("Error fetching officer data", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 6️⃣ Officer Update Proof Logic
  const handleResolveWithProof = async (id) => {
    if (!afterImage || !resNote)
      return alert("Please upload After Image and write a Resolution Note!");

    const formData = new FormData();
    formData.append("status", "resolved");
    formData.append("after_image", afterImage); // From your API spec
    formData.append("resolution_note", resNote); // From your API spec

    try {
      // PATCH /api/grievances/officer/{id}/
      await API.patch(`grievances/officer/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Success! Complaint resolved with proof.");
      loadData();
      setViewDetails(null);
      setAfterImage(null);
      setResNote("");
    } catch (err) {
      alert("Resolution failed. Please try again.");
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
      alert("Update failed.");
    }
  };

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : "N/A";

  if (loading)
    return (
      <div className="p-20 text-center text-blue-600 font-black animate-pulse text-xl">
        SYNCING {user?.department} RECORDS...
      </div>
    );

  return (
    <div className="space-y-10 p-6 font-sans bg-[#F8FAFC] min-h-screen relative">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
            {user?.department || "MUNICIPAL"} COMMAND CENTER
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            Officer: {user?.first_name || user?.username} | Active Session
          </p>
        </div>
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl text-center shadow-lg shadow-emerald-200 transform hover:scale-105 transition-all">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
            Service Rating
          </p>
          <p className="text-3xl font-black">
            {avgRating} <span className="text-sm opacity-60">/ 5</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Assigned"
          value={stats.total}
          color="bg-blue-600"
          icon="📂"
        />
        <StatCard
          title="Active"
          value={stats.pending}
          color="bg-amber-500"
          icon="⏳"
        />
        <StatCard
          title="Resolved"
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

      {/* Modern Table Section */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span>📝</span> Live Task Management
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
              <tr>
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Citizen & Area</th>
                <th className="px-8 py-6 text-center">Priority</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {complaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setViewDetails(c)}
                  className="group hover:bg-blue-50/40 cursor-pointer transition-all"
                >
                  <td className="px-8 py-6 font-mono font-bold text-gray-300 text-xs">
                    #{c.id}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800 text-sm">
                      {c.citizen_name || c.username}
                    </p>
                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">
                      📍 View Map Location
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
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black text-blue-400 group-hover:text-blue-600 uppercase tracking-widest underline decoration-2">
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✨ Detail Popup Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                  Task ID: #{viewDetails.id}
                </p>
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  {viewDetails.citizen_name || viewDetails.username}
                </h3>
              </div>
              <button
                onClick={() => setViewDetails(null)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-3xl transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[75vh] overflow-y-auto font-sans">
              <div className="space-y-8">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                    Citizen Complaint
                  </label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                    "{viewDetails.description}"
                  </p>
                </div>

                {/* ✨ Resolution Submission Logic */}
                {viewDetails.status !== "resolved" ? (
                  <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-5 shadow-inner">
                    <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span>📸</span> Upload Resolution Proof
                    </h4>
                    <input
                      type="file"
                      onChange={(e) => setAfterImage(e.target.files[0])}
                      className="text-[10px] block w-full file:bg-emerald-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-full"
                    />
                    <textarea
                      placeholder="Describe the repair work done..."
                      className="w-full p-4 text-xs rounded-2xl border-none outline-none shadow-sm h-24 placeholder:italic"
                      onChange={(e) => setResNote(e.target.value)}
                    />
                    <button
                      onClick={() => handleResolveWithProof(viewDetails.id)}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                    >
                      Submit & Mark Resolved
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <label className="text-[11px] font-black text-blue-700 uppercase block mb-3">
                      Official Resolution Note
                    </label>
                    <p className="text-sm italic text-blue-900 leading-relaxed font-medium">
                      "{viewDetails.resolution_note || "No note provided."}"
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                    Quick Actions
                  </label>
                  <select
                    disabled={viewDetails.status === "resolved"}
                    value={
                      viewDetails.status === "in_progress"
                        ? "in_progress"
                        : viewDetails.status
                    }
                    onChange={(e) =>
                      handleStatusChange(viewDetails.id, e.target.value)
                    }
                    className="w-full border-2 rounded-2xl p-4 text-xs font-black bg-white outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option value="pending">⏳ Set to Pending</option>
                    <option value="in_progress">🏗️ Mark In Progress</option>
                    <option value="rejected">🚫 Reject Issue</option>
                  </select>
                </div>
              </div>

              <div className="space-y-8">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                  Visual Comparison
                </label>
                {/* Before/After Visualizer */}
                {viewDetails.status === "resolved" ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-lg shadow-xl">
                        BEFORE REPAIR
                      </span>
                      <img
                        src={
                          viewDetails.image?.startsWith("http")
                            ? viewDetails.image
                            : `http://127.0.0.1:8000${viewDetails.image}`
                        }
                        className="w-full h-40 object-cover rounded-[2rem] border-4 border-white shadow-lg"
                        alt="Before"
                      />
                    </div>
                    <div className="relative group">
                      <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-lg shadow-xl">
                        AFTER REPAIR
                      </span>
                      <img
                        src={
                          viewDetails.after_image?.startsWith("http")
                            ? viewDetails.after_image
                            : `http://127.0.0.1:8000${viewDetails.after_image}`
                        }
                        className="w-full h-40 object-cover rounded-[2rem] border-4 border-white shadow-lg"
                        alt="After"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={
                        viewDetails.image?.startsWith("http")
                          ? viewDetails.image
                          : `http://127.0.0.1:8000${viewDetails.image}`
                      }
                      className="w-full h-64 object-cover rounded-[2.5rem] border-4 border-white shadow-2xl"
                      alt="Initial Evidence"
                    />
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                      Initial Evidence Photo
                    </p>
                  </div>
                )}
                <a
                  href={
                    viewDetails.formatted_address ||
                    `http://maps.google.com/?q=${viewDetails.latitude},${viewDetails.longitude}`
                  }
                  target="_blank"
                  className="block w-full bg-slate-800 text-white p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all"
                >
                  📍 Launch GPS Navigation
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedbacks Section */}
      <div className="pt-10 border-t border-slate-200">
        <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] mb-10 text-center italic">
          Service Excellence Reviews
        </h2>
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.map((f) => (
              <div
                key={f.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black bg-blue-600 text-white px-4 py-1 rounded-full shadow-lg shadow-blue-100">
                      {f.rating} / 5 ⭐
                    </span>
                    <span className="text-[9px] text-slate-300 font-bold tracking-widest uppercase">
                      CASE #{f.grievance}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 italic font-medium leading-loose">
                    "{f.comment || "Citizen appreciated the resolution."}"
                  </p>
                </div>
                <p className="text-[9px] font-black text-slate-300 mt-8 text-right tracking-widest uppercase">
                  {new Date(f.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 opacity-50">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
              No citizen feedback received yet. Keep resolving!
            </p>
          </div>
        )}
      </div>

      {/* Global Image Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-slate-900/95 z-[9999] flex items-center justify-center p-10 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={selectedImg}
            className="max-w-full max-h-[90vh] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 border-8 border-white/10"
            alt="Full View"
          />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div
    className={`${color} text-white p-8 rounded-[2.5rem] shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group`}
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
  let bgClass = "bg-amber-50 text-amber-600 border-amber-100";
  if (s === "resolved")
    bgClass =
      "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50";
  if (s === "rejected") bgClass = "bg-red-50 text-red-600 border-red-100";
  if (s === "in_progress" || s === "in progress")
    bgClass = "bg-blue-50 text-blue-600 border-blue-100 animate-pulse";
  return (
    <span
      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${bgClass}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

export default MunicipalDashboard;
