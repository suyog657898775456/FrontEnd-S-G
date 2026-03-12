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

        if (isAdmin) {
          // 1. Super Admin sees every single feedback
          setFeedbacks(data || []);
        } else {
          // 2. Department Officer sees only their specific department
          // Added .toLowerCase() and .trim() to prevent matching errors
          const filtered = data.filter(
            (f) =>
              f.department?.toLowerCase().trim() ===
              userDept?.toLowerCase().trim(),
          );
          setFeedbacks(filtered || []);
        }
      } catch (error) {
        console.error("Error loading feedbacks", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, [isAdmin, userDept]);

  if (loading)
    return (
      <div className="p-20 text-center font-black text-blue-600 animate-pulse text-xl tracking-widest uppercase">
        Analyzing Feedback Data...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
            {isAdmin
              ? "Global Citizen Insights"
              : `${userDept} Performance Review`}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {isAdmin
              ? "Comprehensive overview of all departmental service ratings."
              : `Customer satisfaction reports for the ${userDept} department.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Reviews
            </p>
            <p className="text-xl font-black text-blue-600">
              {feedbacks.length}
            </p>
          </div>
          {!isAdmin && (
            <span className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
              Dept. Secured
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b">
            <tr>
              <th className="px-8 py-6">Case ID</th>
              {isAdmin && <th className="px-8 py-6">Department</th>}
              <th className="px-8 py-6">Service Rating</th>
              <th className="px-8 py-6">Citizen Comment</th>
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
                  <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">
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
                  <p className="text-sm text-slate-600 italic font-medium leading-relaxed max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-none transition-all">
                    "{f.comment || "Citizen appreciated the resolution."}"
                  </p>
                </td>

                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                      {(f.officer_name || "O")[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {f.officer_name || `Officer #${f.officer}`}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {feedbacks.length === 0 && (
          <div className="p-32 text-center bg-white rounded-3xl">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
              No feedback entries found{" "}
              {isAdmin ? "globally" : `for ${userDept}`}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
