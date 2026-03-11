import React, { useEffect, useState } from "react";
import { fetchAllFeedbacks } from "../services/grievanceService";

export default function ViewFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const userDept = user?.department; // e.g., "Road", "Light"

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchAllFeedbacks();

        // ✨ LOGIC: Filter data based on Role
        if (isAdmin) {
          setFeedbacks(data || []); // Admin sees everything
        } else {
          // Officer sees only their department feedback
          const filtered = data.filter((f) => f.department === userDept);
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
      <div className="p-20 text-center font-bold text-blue-600 animate-pulse">
        Loading Feedbacks...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
          {isAdmin ? "Global Citizen Feedbacks" : `${userDept} Dept Feedbacks`}
        </h2>
        {!isAdmin && (
          <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
            Departmental View
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
            <tr>
              <th className="px-6 py-4">Grievance ID</th>
              {/* ✨ Admin column to show which department got feedback */}
              {isAdmin && <th className="px-6 py-4">Department</th>}
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4">Resolved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {feedbacks.map((f) => (
              <tr key={f.id} className="hover:bg-blue-50/10 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-600">
                  #{f.grievance}
                </td>

                {/* ✨ Department label for Admin */}
                {isAdmin && (
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase">
                      {f.department || "General"}
                    </span>
                  </td>
                )}

                <td
                  className={`px-6 py-4 font-black ${f.rating >= 4 ? "text-emerald-600" : f.rating <= 2 ? "text-red-500" : "text-amber-500"}`}
                >
                  {f.rating} / 5 ⭐
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 italic font-medium">
                  "{f.comment || "No comment provided."}"
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-800">
                  {f.officer_name || `Officer #${f.officer}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {feedbacks.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
            No feedback found for your department.
          </div>
        )}
      </div>
    </div>
  );
}
