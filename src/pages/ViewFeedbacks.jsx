import React, { useEffect, useState } from "react";
import { fetchAllFeedbacks } from "../services/grievanceService";

export default function ViewFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const userDept = user?.department; // e.g., "Road"

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchAllFeedbacks();

        // 1. Array check (backend might send .results or direct array)
        const validData = Array.isArray(data) ? data : data?.results || [];

        if (isAdmin) {
          // 2. Admin sees everything
          setFeedbacks(validData);
        } else {
          // 3. Officer logic:
          // Your backend Serializer sends 'department' directly now.
          const filtered = validData.filter((f) => {
            const feedbackDept = f.department || "";
            return (
              feedbackDept.toLowerCase().trim() ===
              userDept?.toLowerCase().trim()
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
        Syncing Departmental Reviews...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
            {isAdmin
              ? "Global Feedback Audit"
              : `${userDept} Performance Reviews`}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {isAdmin
              ? "Full departmental transparency and citizen satisfaction metrics."
              : `Analyzing service quality for the ${userDept} department.`}
          </p>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total Feedback
          </p>
          <p className="text-2xl font-black text-blue-600">
            {feedbacks.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b">
            <tr>
              <th className="px-8 py-6">Grievance ID</th>
              {isAdmin && <th className="px-8 py-6">Department</th>}
              <th className="px-8 py-6">Rating</th>
              <th className="px-8 py-6">Comment</th>
              <th className="px-8 py-6">Resolved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {feedbacks.map((f) => (
              <tr
                key={f.id}
                className="hover:bg-blue-50/30 transition-all group"
              >
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    #{f.grievance}
                  </span>
                </td>

                {isAdmin && (
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                      {f.department || "General"}
                    </span>
                  </td>
                )}

                <td className="px-8 py-6">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-black ${f.rating >= 4 ? "text-emerald-600" : f.rating <= 2 ? "text-red-500" : "text-amber-500"}`}
                    >
                      {f.rating}.0
                    </span>
                    <span className="text-amber-400">★</span>
                  </div>
                </td>

                <td className="px-8 py-6">
                  <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                    "{f.comment || "Citizen appreciated the quick resolution."}"
                  </p>
                </td>

                <td className="px-8 py-6 text-xs font-bold text-slate-800">
                  {f.officer_name || `Officer #${f.officer}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {feedbacks.length === 0 && (
          <div className="p-32 text-center bg-white">
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
              No departmental feedback found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
