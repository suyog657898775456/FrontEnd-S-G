import { useEffect, useState } from "react";
import { fetchUserComplaints } from "../services/grievanceService";
import { useNavigate } from "react-router-dom";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null); // ✨ डिटेल पॉपअपसाठी स्टेट
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchUserComplaints(); // GET /api/grievances/citizen/
      setComplaints(data || []);
    } catch (error) {
      console.error("Failed to load complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints
    .filter((c) =>
      (c.description || "").toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const grouped = {
    pending: filtered.filter((c) =>
      ["pending", "submitted"].includes(c.status?.toLowerCase()),
    ),
    inProgress: filtered.filter((c) =>
      ["in progress", "in_progress", "assigned"].includes(
        c.status?.toLowerCase(),
      ),
    ),
    resolved: filtered.filter((c) => c.status?.toLowerCase() === "resolved"),
    rejected: filtered.filter((c) => c.status?.toLowerCase() === "rejected"),
  };

  if (loading)
    return (
      <div className="p-20 text-center text-blue-600 font-black animate-pulse">
        SYNCING YOUR REPORTS...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:items-center text-center gap-4">
        <h2 className="text-4xl font-black text-[#0F2A44] tracking-tighter uppercase">
          My Reports
        </h2>
        <p className="text-slate-500 font-medium">
          Track the real-time progress of your grievances
        </p>
        <input
          placeholder="Search your reports..."
          className="rounded-2xl border-2 border-slate-100 px-6 py-4 text-sm focus:border-blue-500 outline-none shadow-xl bg-white w-full max-w-md transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Complaint Groups */}
      <div className="space-y-12">
        <ComplaintGroup
          title="🕒 Pending"
          data={grouped.pending}
          color="blue"
          onCardClick={setSelectedComplaint}
        />
        <ComplaintGroup
          title="⏳ In Progress"
          data={grouped.inProgress}
          color="amber"
          onCardClick={setSelectedComplaint}
        />
        <ComplaintGroup
          title="✅ Resolved"
          data={grouped.resolved}
          color="emerald"
          onCardClick={setSelectedComplaint}
        />
        <ComplaintGroup
          title="🚫 Rejected"
          data={grouped.rejected}
          color="red"
          onCardClick={setSelectedComplaint}
        />
      </div>

      {/* ✨ Detail Popup Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[5000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                  Report ID: #{selectedComplaint.id}
                </p>
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  Complaint Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-3xl"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
              {/* Description & Timeline */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                  Summary
                </label>
                <p className="text-slate-700 font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100 italic leading-relaxed">
                  "{selectedComplaint.description}"
                </p>
                <StatusTimeline status={selectedComplaint.status} />
              </div>

              {/* ✨ Visual Comparison (Before vs After) */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                  Work Evidence
                </label>
                {selectedComplaint.status?.toLowerCase() === "resolved" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="block mb-2 text-red-600 text-[10px] font-black uppercase tracking-wider">
                         ● Initial Photo
                      </span>
                      <img
                        src={`http://127.0.0.1:8000${selectedComplaint.image}`}
                        className="w-full h-48 object-cover rounded-3xl border-4 border-white shadow-lg"
                        alt="Before"
                      />
                    </div>
                    <div>
                      <span className="block mb-2 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                         ● Fixed Photo
                      </span>
                      <img
                        src={`http://127.0.0.1:8000${selectedComplaint.after_image}`}
                        className="w-full h-48 object-cover rounded-3xl border-4 border-white shadow-lg"
                        alt="After"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="block mb-2 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                       ● Reported Image
                    </span>
                    <img
                      src={`http://127.0.0.1:8000${selectedComplaint.image}`}
                      className="w-full h-64 object-cover rounded-[2.5rem] border-4 border-white shadow-xl"
                      alt="Reported"
                    />
                  </div>
                )}
              </div>

              {/* Resolution Note */}
              {selectedComplaint.status?.toLowerCase() === "resolved" && (
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <label className="text-[11px] font-black text-emerald-700 uppercase block mb-2">
                    Municipal Note
                  </label>
                  <p className="text-sm font-bold text-emerald-800 italic">
                    "
                    {selectedComplaint.resolution_note ||
                      "Issue resolved as per the report."}
                    "
                  </p>
                </div>
              )}

              {/* Map & Feedback Button */}
              <div className="flex flex-col gap-4">
                {selectedComplaint.latitude && (
                  <a
                    href={
                      selectedComplaint.formatted_address ||
                      `https://www.google.com/maps?q=${selectedComplaint.latitude},${selectedComplaint.longitude}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-800 text-white p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all"
                  >
                    📍 Track Exact Map Location
                  </a>
                )}

                {selectedComplaint.status?.toLowerCase() === "resolved" && (
                  <button
                    onClick={() =>
                      navigate("/feedback", {
                        state: {
                          grievanceId: selectedComplaint.id,
                          officerId: selectedComplaint.assigned_to || 1,
                        },
                      })
                    }
                    className="w-full bg-emerald-600 text-white p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                  >
                    ⭐ Rate Service Quality
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplaintGroup({ title, data, color, onCardClick }) {
  if (data.length === 0) return null;
  const borderColors = {
    blue: "border-l-blue-500",
    amber: "border-l-amber-500",
    emerald: "border-l-emerald-500",
    red: "border-l-red-500",
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((c) => (
          <div
            key={c.id}
            onClick={() => onCardClick(c)}
            className={`bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:scale-[1.02] cursor-pointer transition-all border-l-[8px] ${borderColors[color]}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-black text-slate-800 text-lg leading-tight truncate flex-1 pr-4">
                {c.description}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${color === "emerald" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"}`}
              >
                {c.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <span className="text-blue-500">#{c.id}</span>
              <span>{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔹 Timeline (Keep existing logic) */
function StatusTimeline({ status }) {
  const steps = ["Assigned", "Pending", "In progress", "Resolved"];
  const currentStatus = status?.toLowerCase();
  let activeIndex = 0;
  if (["pending", "submitted"].includes(currentStatus)) activeIndex = 1;
  if (["assigned", "in progress", "in_progress"].includes(currentStatus))
    activeIndex = 3;
  if (currentStatus === "resolved") activeIndex = 4;

  if (currentStatus === "rejected")
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center border border-red-100 animate-pulse">
        Report Rejected
      </div>
    );

  return (
    <div className="py-4 px-2">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-blue-500 -translate-y-1/2 z-0 transition-all duration-700"
          style={{ width: `${(activeIndex - 1) * 33.33}%` }}
        />
        {steps.map((step, index) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${index + 1 <= activeIndex ? "bg-blue-600 text-white" : "bg-white border-2 border-slate-200 text-slate-300"}`}
            >
              {index + 1 < activeIndex ? (
                "✓"
              ) : (
                <span className="text-[8px]">{index + 1}</span>
              )}
            </div>
            <p className="absolute -bottom-5 text-[8px] font-black uppercase whitespace-nowrap opacity-60">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}