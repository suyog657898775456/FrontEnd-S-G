import React, { useEffect, useState } from "react";
import { fetchAllFeedbacks } from "../services/grievanceService";

export default function ViewFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const userDept = user?.department;

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchAllFeedbacks();

        // Safe Data Check
        const validData = Array.isArray(data) ? data : [];

        if (isAdmin) {
          // 1. Super Admin: Sab kuch dikhao
          setFeedbacks(validData);
        } else {
          // 2. Officer: Sirf apne dept ka dikhao
          // Yahan 'f.department' agar direct nahi mil raha, toh hum 'f.grievance_details.department' check karenge
          const filtered = validData.filter((f) => {
            const deptName =
              f.department || f.grievance_details?.department || "";
            return (
              deptName.toLowerCase().trim() === userDept?.toLowerCase().trim()
            );
          });
          setFeedbacks(filtered);
        }
      } catch (error) {
        console.error("Error loading feedbacks", error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, [isAdmin, userDept]);

  if (loading)
    return (
      <div className="p-20 text-center font-black text-blue-600 animate-pulse text-xl tracking-widest uppercase">
        Verifying Service Ratings...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
            {isAdmin ? "Citizen Feedback Audit" : `${userDept} Dept. Reviews`}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {isAdmin
              ? "Global oversight of municipal performance."
              : "Your department's performance ratings."}
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total Reviews
          </p>
          <p className="text-xl font-black text-blue-600">{feedbacks.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b">
            <tr>
              <th className="px-8 py-6">Complaint ID</th>
              {isAdmin && <th className="px-8 py-6">Department</th>}
              <th className="px-8 py-6">Rating</th>
              <th className="px-8 py-6">Comment</th>
              <th className="px-8 py-6">Resolved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {feedbacks.map((f) => (
              <tr key={f.id} className="hover:bg-blue-50/30 transition-all">
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-blue-600">
                    #{f.grievance}
                  </span>
                </td>

                {isAdmin && (
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-[9px] font-black uppercase">
                      {f.department || f.grievance_details?.department || "N/A"}
                    </span>
                  </td>
                )}

                <td className="px-8 py-6">
                  <span
                    className={`text-sm font-black ${f.rating >= 4 ? "text-emerald-600" : "text-amber-500"}`}
                  >
                    {f.rating} ★
                  </span>
                </td>

                <td className="px-8 py-6 text-sm text-slate-600 italic">
                  "{f.comment || "Great job!"}"
                </td>

                <td className="px-8 py-6 text-xs font-bold text-slate-800">
                  {f.officer_name || `Officer #${f.officer}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {feedbacks.length === 0 && (
          <div className="p-32 text-center">
            <p className="text-gray-400 font-black uppercase text-xs">
              No feedback records found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
