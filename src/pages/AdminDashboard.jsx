// // import React, { useEffect, useState } from "react";
// // import {
// //   fetchAllComplaints,
// //   updateComplaintStatus,
// //   fetchAllFeedbacks,
// // } from "../services/grievanceService";
// // import API from "../services/api";

// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   Cell,
// // } from "recharts";

// // export default function AdminDashboard() {
// //   const [complaints, setComplaints] = useState([]);
// //   const [feedbacks, setFeedbacks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filter, setFilter] = useState("All");
// //   const [sortByStatus, setSortByStatus] = useState("None");
// //   const [searchQuery, setSearchQuery] = useState("");

// //   // ✅ १. इमेज स्टेट डॅशबोर्ड फंक्शनच्या आत हलवली
// //   const [selectedImg, setSelectedImg] = useState(null);

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const loadData = async () => {
// //     try {
// //       const [complaintsData, feedbacksData] = await Promise.all([
// //         fetchAllComplaints(),
// //         fetchAllFeedbacks(),
// //       ]);
// //       setComplaints(complaintsData || []);
// //       setFeedbacks(feedbacksData || []);
// //     } catch (error) {
// //       console.error("Admin data error", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleStatusUpdate = async (id, newStatus) => {
// //     try {
// //       let statusToBackend = newStatus.toLowerCase();
// //       if (statusToBackend === "in progress") statusToBackend = "in_progress";
// //       await updateComplaintStatus(id, statusToBackend);
// //       setComplaints((prev) =>
// //         prev.map((c) => (c.id === id ? { ...c, status: statusToBackend } : c)),
// //       );
// //     } catch (error) {
// //       alert("Status update failed. Complaint might be already resolved.");
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Are you sure you want to delete this complaint?")) {
// //       try {
// //         await API.delete(`grievances/admin/${id}/`);
// //         setComplaints((prev) => prev.filter((c) => c.id !== id));
// //       } catch (error) {
// //         alert("Delete failed.");
// //       }
// //     }
// //   };

// //   const stats = {
// //     total: complaints.length,
// //     awaiting: complaints.filter((c) =>
// //       ["pending", "assigned", "in_progress", "escalated"].includes(
// //         c.status?.toLowerCase(),
// //       ),
// //     ).length,
// //     resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved")
// //       .length,
// //     rejected: complaints.filter((c) => c.status?.toLowerCase() === "rejected")
// //       .length,
// //   };

// //   const getDeptStats = () => {
// //     const deptMap = {};
// //     const officialDepts = ["Light", "Road", "Sewage", "Water", "Garbage"];
// //     officialDepts.forEach((d) => (deptMap[d] = 0));
// //     complaints.forEach((c) => {
// //       if (officialDepts.includes(c.department)) {
// //         deptMap[c.department] += 1;
// //       }
// //     });
// //     return Object.keys(deptMap).map((key) => ({
// //       name: key,
// //       count: deptMap[key],
// //     }));
// //   };

// //   const filteredComplaints = complaints
// //     .filter((c) => {
// //       const matchesFilter =
// //         filter === "All" || c.status?.toLowerCase() === filter.toLowerCase();
// //       const displayName = c.citizen_name || c.username || `User #${c.user}`;
// //       return (
// //         matchesFilter &&
// //         (displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //           c.id.toString().includes(searchQuery))
// //       );
// //     })
// //     .sort((a, b) => {
// //       if (sortByStatus !== "None") {
// //         if (a.status === sortByStatus && b.status !== sortByStatus) return -1;
// //         if (a.status !== sortByStatus && b.status === sortByStatus) return 1;
// //       }
// //       const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
// //       return (weight[b.priority] || 0) - (weight[a.priority] || 0);
// //     });

// //   if (loading)
// //     return (
// //       <div className="p-20 text-center font-bold text-blue-600 animate-pulse text-xl">
// //         Syncing Admin Records...
// //       </div>
// //     );

// //   return (
// //     <div className="space-y-10 p-6 bg-[#F8FAFC] min-h-screen font-sans relative">
// //       <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">
// //         SUPER ADMIN DASHBOARD
// //       </h1>

// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //         <StatBox
// //           title="Total Reports"
// //           value={stats.total}
// //           icon="📊"
// //           color="blue"
// //         />
// //         <StatBox
// //           title="Active Tasks"
// //           value={stats.awaiting}
// //           icon="⏳"
// //           color="amber"
// //         />
// //         <StatBox
// //           title="Resolved"
// //           value={stats.resolved}
// //           icon="✅"
// //           color="green"
// //         />
// //         <StatBox
// //           title="Rejected"
// //           value={stats.rejected}
// //           icon="🚫"
// //           color="red"
// //         />
// //       </div>

// //       <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
// //         <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
// //           <span>📈</span> Department Performance Overview
// //         </h2>
// //         <div style={{ width: "100%", height: "350px", minHeight: "350px" }}>
// //           <ResponsiveContainer width="100%" height="100%">
// //             <BarChart data={getDeptStats()}>
// //               <XAxis
// //                 dataKey="name"
// //                 axisLine={false}
// //                 tickLine={false}
// //                 fontSize={12}
// //                 fontWeight="bold"
// //               />
// //               <YAxis hide />
// //               <Tooltip
// //                 cursor={{ fill: "#f1f5f9" }}
// //                 contentStyle={{
// //                   borderRadius: "15px",
// //                   border: "none",
// //                   boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
// //                 }}
// //               />
// //               <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
// //                 {getDeptStats().map((entry, index) => (
// //                   <Cell
// //                     key={`cell-${index}`}
// //                     fill={
// //                       ["#2563eb", "#f59e0b", "#10b981", "#ef4444"][index % 4]
// //                     }
// //                   />
// //                 ))}
// //               </Bar>
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       <div className="space-y-4">
// //         <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
// //           <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
// //             <span>📝</span> Reports Management
// //           </h2>
// //           <div className="flex flex-wrap gap-3 w-full md:w-auto">
// //             <input
// //               placeholder="Search Citizen or ID..."
// //               className="border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm flex-1"
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //             />
// //             <select
// //               className="border rounded-xl text-sm px-3 py-2 font-bold bg-white outline-none shadow-sm"
// //               value={filter}
// //               onChange={(e) => setFilter(e.target.value)}
// //             >
// //               <option value="All">Filter: All</option>
// //               <option value="Pending">Pending</option>
// //               <option value="In Progress">In Progress</option>
// //               <option value="Resolved">Resolved</option>
// //               <option value="Rejected">Rejected</option>
// //               <option value="Escalated">Escalated</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-left">
// //               <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
// //                 <tr>
// //                   <th className="px-6 py-5">ID</th>
// //                   <th className="px-6 py-5">Citizen & Location</th>
// //                   <th className="px-6 py-5">Image</th>
// //                   <th className="px-6 py-5">Department</th>
// //                   <th className="px-6 py-5 text-center">Priority</th>
// //                   <th className="p-5">Description</th>
// //                   <th className="px-6 py-5 text-center">Status</th>
// //                   <th className="px-6 py-5">Manage</th>
// //                   <th className="px-6 py-5 text-center">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-50">
// //                 {filteredComplaints.map((c) => (
// //                   <tr
// //                     key={c.id}
// //                     className="hover:bg-blue-50/10 transition-colors"
// //                   >
// //                     <td className="px-6 py-4 font-mono font-bold text-gray-400 text-xs">
// //                       #{c.id}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <p className="text-sm font-bold text-gray-800">
// //                         {c.citizen_name || c.username}
// //                       </p>
// //                       <a
// //                         href={c.formatted_address}
// //                         target="_blank"
// //                         rel="noreferrer"
// //                         className="text-[9px] text-emerald-600 font-black hover:underline uppercase"
// //                       >
// //                         📍 Open Map
// //                       </a>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       {c.image ? (
// //                         <img
// //                           src={
// //                             c.image.startsWith("http")
// //                               ? c.image
// //                               : c.image.startsWith("/")
// //                                 ? `http://127.0.0.1:8000${c.image}`
// //                                 : `http://127.0.0.1:8000/${c.image}`
// //                           }
// //                           alt="Evidence"
// //                           className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 border border-gray-200"
// //                           onClick={() =>
// //                             setSelectedImg(
// //                               c.image.startsWith("http")
// //                                 ? c.image
// //                                 : c.image.startsWith("/")
// //                                   ? `http://127.0.0.1:8000${c.image}`
// //                                   : `http://127.0.0.1:8000/${c.image}`,
// //                             )
// //                           }
// //                           onError={(e) => {
// //                             e.target.onerror = null;
// //                             e.target.src =
// //                               "https://placehold.co/150?text=No+Image";
// //                           }}
// //                         />
// //                       ) : (
// //                         <span className="text-[10px] text-gray-300 italic">
// //                           No Image
// //                         </span>
// //                       )}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase border border-blue-100">
// //                         {c.department }
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4 text-center">
// //                       <span
// //                         className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${c.priority === "CRITICAL" || c.priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
// //                       >
// //                         {c.priority}
// //                       </span>
// //                     </td>
// //                     <td
// //                       className="p-5 text-gray-600 text-xs max-w-xs truncate"
// //                       title={c.description}
// //                     >
// //                       {c.description || "No details provided"}
// //                     </td>
// //                     <td className="px-6 py-4 text-center">
// //                       <span
// //                         className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border transition-all ${c.status?.includes("resolved") ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}
// //                       >
// //                         {c.status?.replace("_", " ")}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <select
// //                         disabled={c.status === "resolved"}
// //                         value={
// //                           c.status === "in_progress" ? "in_progress" : c.status
// //                         }
// //                         onChange={(e) =>
// //                           handleStatusUpdate(c.id, e.target.value)
// //                         }
// //                         className="text-[11px] font-bold border rounded-lg p-1.5 bg-white outline-none disabled:opacity-50"
// //                       >
// //                         <option value="pending">Pending</option>
// //                         <option value="in_progress">InProgress</option>
// //                         <option value="resolved">Resolved</option>
// //                         <option value="rejected">Rejected</option>
// //                         <option value="escalated">Escalated</option>
// //                       </select>
// //                     </td>
// //                     <td className="px-6 py-5 text-center">
// //                       <button
// //                         onClick={() => handleDelete(c.id)}
// //                         className="text-red-300 hover:text-red-600 transition"
// //                       >
// //                         🗑️
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ✅ २. इमेज ओव्हरले (Modal) - हा मुख्य return च्या शेवटी हलवला */}
// //       {selectedImg && (
// //         <div
// //           className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-10 backdrop-blur-md cursor-zoom-out"
// //           onClick={() => setSelectedImg(null)}
// //         >
// //           <button className="absolute top-10 right-10 text-white text-4xl font-black">
// //             ×
// //           </button>
// //           <img
// //             src={selectedImg}
// //             className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in duration-300 object-contain"
// //             alt="Full View"
// //             onClick={(e) => e.stopPropagation()}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ✅ ३. StatBox कॉम्पोनंटला बाहेर काढले आणि क्लीन केले
// // function StatBox({ title, value, icon, color }) {
// //   const styles = {
// //     blue: "bg-blue-600",
// //     amber: "bg-amber-500",
// //     green: "bg-green-600",
// //     red: "bg-red-600",
// //   };
// //   return (
// //     <div
// //       className={`p-6 rounded-3xl shadow-lg text-white ${styles[color]} transform hover:scale-105 transition-all`}
// //     >
// //       <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">
// //         {title}
// //       </p>
// //       <div className="flex justify-between items-center mt-2">
// //         <p className="text-4xl font-black">{value}</p>
// //         <span className="text-2xl opacity-40">{icon}</span>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import {
//   fetchAllComplaints,
//   updateComplaintStatus,
//   fetchAllFeedbacks,
// } from "../services/grievanceService";
// import API from "../services/api";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
//   LabelList,
// } from "recharts";

// export default function AdminDashboard() {
//   const [complaints, setComplaints] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("All");
//   const [sortByStatus, setSortByStatus] = useState("None");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedImg, setSelectedImg] = useState(null);

//   // ✨ नवीन स्टेट: सध्या निवडलेला विभाग (Default: Road)
//   const [activeDept, setActiveDept] = useState("Road");

//   const departments = ["Road", "Light", "Water", "Sewage", "Garbage"];

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [complaintsData, feedbacksData] = await Promise.all([
//         fetchAllComplaints(),
//         fetchAllFeedbacks(),
//       ]);
//       setComplaints(complaintsData || []);
//       setFeedbacks(feedbacksData || []);
//     } catch (error) {
//       console.error("Admin data error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✨ निवडलेल्या विभागानुसार स्टेटस मोजणारे फंक्शन
//   const getActiveDeptStats = () => {
//     const stats = [
//       { name: "Pending", count: 0, color: "#2563eb" },
//       { name: "In Progress", count: 0, color: "#f59e0b" },
//       { name: "Resolved", count: 0, color: "#10b981" },
//       { name: "Rejected", count: 0, color: "#ef4444" },
//     ];

//     complaints.forEach((c) => {
//       if (c.department === activeDept) {
//         const status = c.status?.toLowerCase();
//         if (status === "pending") stats[0].count += 1;
//         else if (status === "in_progress" || status === "in progress")
//           stats[1].count += 1;
//         else if (status === "resolved") stats[2].count += 1;
//         else if (status === "rejected") stats[3].count += 1;
//       }
//     });
//     return stats;
//   };

//   const handleStatusUpdate = async (id, newStatus) => {
//     try {
//       let statusToBackend = newStatus.toLowerCase();
//       if (statusToBackend === "in progress") statusToBackend = "in_progress";
//       await updateComplaintStatus(id, statusToBackend);
//       setComplaints((prev) =>
//         prev.map((c) => (c.id === id ? { ...c, status: statusToBackend } : c)),
//       );
//     } catch (error) {
//       alert("Status update failed.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this complaint?")) {
//       try {
//         await API.delete(`grievances/admin/${id}/`);
//         setComplaints((prev) => prev.filter((c) => c.id !== id));
//       } catch (error) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   const stats = {
//     total: complaints.length,
//     awaiting: complaints.filter((c) =>
//       ["pending", "assigned", "in_progress", "escalated"].includes(
//         c.status?.toLowerCase(),
//       ),
//     ).length,
//     resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved")
//       .length,
//     rejected: complaints.filter((c) => c.status?.toLowerCase() === "rejected")
//       .length,
//   };

//   const filteredComplaints = complaints
//     .filter((c) => {
//       const matchesFilter =
//         filter === "All" || c.status?.toLowerCase() === filter.toLowerCase();
//       const displayName = c.citizen_name || c.username || `User #${c.user}`;
//       return (
//         matchesFilter &&
//         (displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.id.toString().includes(searchQuery))
//       );
//     })
//     .sort((a, b) => {
//       if (sortByStatus !== "None") {
//         if (a.status === sortByStatus && b.status !== sortByStatus) return -1;
//         if (a.status !== sortByStatus && b.status === sortByStatus) return 1;
//       }
//       const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
//       return (weight[b.priority] || 0) - (weight[a.priority] || 0);
//     });

//   if (loading)
//     return (
//       <div className="p-20 text-center font-bold text-blue-600 animate-pulse text-xl">
//         Syncing Records...
//       </div>
//     );

//   return (
//     <div className="space-y-10 p-6 bg-[#F8FAFC] min-h-screen font-sans relative">
//       <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">
//         SUPER ADMIN DASHBOARD
//       </h1>

//       {/* ✨ Section 2: Department-wise Status Filter & Chart */}
//       <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
//               <span>📉</span> Department Insights
//             </h2>
//             <p className="text-lg font-bold text-slate-700">
//               Status breakdown for {activeDept}
//             </p>
//           </div>

//           {/* Department Selection Buttons */}
//           <div className="flex flex-wrap gap-2">
//             {departments.map((dept) => (
//               <button
//                 key={dept}
//                 onClick={() => setActiveDept(dept)}
//                 className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
//                   activeDept === dept
//                     ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105"
//                     : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-500"
//                 }`}
//               >
//                 {dept}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div style={{ width: "100%", height: "350px", minHeight: "350px" }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={getActiveDeptStats()}
//               margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
//             >
//               <XAxis
//                 dataKey="name"
//                 axisLine={false}
//                 tickLine={false}
//                 fontSize={12}
//                 fontWeight="bold"
//               />
//               <YAxis hide />
//               <Tooltip
//                 cursor={{ fill: "#f8fafc" }}
//                 contentStyle={{
//                   borderRadius: "15px",
//                   border: "none",
//                   boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
//                 }}
//               />
//               <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={60}>
//                 {getActiveDeptStats().map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//                 <LabelList
//                   dataKey="count"
//                   position="top"
//                   style={{ fill: "#64748b", fontWeight: "bold" }}
//                 />
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Section 3: Reports Table */}
//       <div className="space-y-4">
//         <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
//           <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
//             <span>📝</span> Reports Management
//           </h2>
//           <div className="flex flex-wrap gap-3 w-full md:w-auto">
//             <input
//               placeholder="Search Citizen or ID..."
//               className="border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm flex-1"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <select
//               className="border rounded-xl text-sm px-3 py-2 font-bold bg-white outline-none shadow-sm"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//             >
//               <option value="All">Filter: All</option>
//               <option value="Pending">Pending</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
//                 <tr>
//                   <th className="px-6 py-5">ID</th>
//                   <th className="px-6 py-5">Citizen & Location</th>
//                   <th className="px-6 py-5">Image</th>
//                   <th className="p-5">Description</th>
//                   <th className="px-6 py-5 text-center">Priority</th>
//                   <th className="px-6 py-5 text-center">Status</th>
//                   <th className="px-6 py-5">Manage</th>
//                   <th className="px-6 py-5 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {filteredComplaints.map((c) => (
//                   <tr
//                     key={c.id}
//                     className="hover:bg-blue-50/10 transition-colors"
//                   >
//                     <td className="px-6 py-4 font-mono font-bold text-gray-400 text-xs">
//                       #{c.id}
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm font-bold text-gray-800">
//                         {c.citizen_name || c.username}
//                       </p>
//                       <a
//                         href={c.formatted_address}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-[9px] text-emerald-600 font-black hover:underline uppercase"
//                       >
//                         📍 Open Map
//                       </a>
//                     </td>
//                     <td className="px-6 py-4">
//                       {c.image ? (
//                         <img
//                           src={
//                             c.image.startsWith("http")
//                               ? c.image
//                               : `http://127.0.0.1:8000${c.image}`
//                           }
//                           alt="Evidence"
//                           className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 border border-gray-200"
//                           onClick={() =>
//                             setSelectedImg(
//                               c.image.startsWith("http")
//                                 ? c.image
//                                 : `http://127.0.0.1:8000${c.image}`,
//                             )
//                           }
//                         />
//                       ) : (
//                         <span className="text-[10px] text-gray-300 italic">
//                           No Image
//                         </span>
//                       )}
//                     </td>
//                     <td
//                       className="p-5 text-gray-600 text-xs max-w-xs truncate"
//                       title={c.description}
//                     >
//                       {c.description || "No details provided"}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span
//                         className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${c.priority === "CRITICAL" ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-emerald-50 text-emerald-600"}`}
//                       >
//                         {c.priority}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border transition-all ${c.status?.includes("resolved") ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}
//                       >
//                         {c.status?.replace("_", " ")}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <select
//                         disabled={c.status === "resolved"}
//                         value={
//                           c.status === "in_progress" ? "in_progress" : c.status
//                         }
//                         onChange={(e) =>
//                           handleStatusUpdate(c.id, e.target.value)
//                         }
//                         className="text-[11px] font-bold border rounded-lg p-1.5 bg-white outline-none"
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="in_progress">In Progress</option>
//                         <option value="resolved">Resolved</option>
//                         <option value="rejected">Rejected</option>
//                       </select>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => handleDelete(c.id)}
//                         className="text-red-300 hover:text-red-600 transition"
//                       >
//                         🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//       {selectedImg && (
//         <div
//           className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-10 backdrop-blur-md cursor-zoom-out"
//           onClick={() => setSelectedImg(null)}
//         >
//           <button className="absolute top-10 right-10 text-white text-4xl font-black">
//             ×
//           </button>
//           <img
//             src={selectedImg}
//             className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in duration-300 object-contain"
//             alt="Full View"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// function StatBox({ title, value, icon, color }) {
//   const styles = {
//     blue: "bg-blue-600",
//     amber: "bg-amber-500",
//     green: "bg-green-600",
//     red: "bg-red-600",
//   };
//   return (
//     <div
//       className={`p-6 rounded-3xl shadow-lg text-white ${styles[color]} transform hover:scale-105 transition-all`}
//     >
//       <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">
//         {title}
//       </p>
//       <div className="flex justify-between items-center mt-2">
//         <p className="text-4xl font-black">{value}</p>
//         <span className="text-2xl opacity-40">{icon}</span>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  fetchAllComplaints,
  updateComplaintStatus,
  fetchAllFeedbacks,
} from "../services/grievanceService";
import API from "../services/api";

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

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortByStatus, setSortByStatus] = useState("None");
  const [searchQuery, setSearchQuery] = useState("");

  // States for Modals
  const [selectedImg, setSelectedImg] = useState(null);
  const [viewDetails, setViewDetails] = useState(null); // ✨ Detail Popup State

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

  const getActiveDeptStats = () => {
    const stats = [
      { name: "Pending", count: 0, color: "#2563eb" },
      { name: "In Progress", count: 0, color: "#f59e0b" },
      { name: "Resolved", count: 0, color: "#10b981" },
      { name: "Rejected", count: 0, color: "#ef4444" },
    ];
    complaints.forEach((c) => {
      if (c.department === activeDept) {
        const status = c.status?.toLowerCase();
        if (status === "pending") stats[0].count += 1;
        else if (status === "in_progress" || status === "in progress")
          stats[1].count += 1;
        else if (status === "resolved") stats[2].count += 1;
        else if (status === "rejected") stats[3].count += 1;
      }
    });
    return stats;
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      let statusToBackend = newStatus.toLowerCase();
      if (statusToBackend === "in progress") statusToBackend = "in_progress";
      await updateComplaintStatus(id, statusToBackend);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: statusToBackend } : c)),
      );
      if (viewDetails?.id === id)
        setViewDetails({ ...viewDetails, status: statusToBackend });
    } catch (error) {
      alert("Status update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await API.delete(`grievances/admin/${id}/`);
        setComplaints((prev) => prev.filter((c) => c.id !== id));
        setViewDetails(null);
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  const stats = {
    total: complaints.length,
    awaiting: complaints.filter((c) =>
      ["pending", "assigned", "in_progress", "escalated"].includes(
        c.status?.toLowerCase(),
      ),
    ).length,
    resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved")
      .length,
    rejected: complaints.filter((c) => c.status?.toLowerCase() === "rejected")
      .length,
  };

  const filteredComplaints = complaints
    .filter((c) => {
      const matchesFilter =
        filter === "All" || c.status?.toLowerCase() === filter.toLowerCase();
      const displayName = c.citizen_name || c.username || `User #${c.user}`;
      return (
        matchesFilter &&
        (displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toString().includes(searchQuery))
      );
    })
    .sort((a, b) => {
      const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (weight[b.priority] || 0) - (weight[a.priority] || 0);
    });

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-blue-600 animate-pulse text-xl tracking-widest">
        LOADING SECURE ACCESS...
      </div>
    );

  return (

   
    <div className="space-y-10 p-6 bg-[#F8FAFC] min-h-screen font-sans relative">
      <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">
        SUPER ADMIN DASHBOARD
      </h1>
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
      {/* Department Insights Graph (Untouched Logic) */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
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
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeDept === dept ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-gray-400 border-gray-100 hover:text-blue-500"}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <div style={{ width: "100%", height: "350px", minHeight: "350px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getActiveDeptStats()}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
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
                  style={{ fill: "#64748b", fontWeight: "bold" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Reports Table (Modernized & Compact) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span>📝</span> Incoming Grievances
          </h2>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <input
              placeholder="Search Username..."
              className="border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border rounded-xl text-sm px-3 py-2 font-bold bg-white outline-none shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
              <tr>
                <th className="px-8 py-5">Citizen Username</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5 text-center">Current Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setViewDetails(c)}
                  className="group hover:bg-blue-50/40 cursor-pointer transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase">
                        {(c.citizen_name || c.username || "U")[0]}
                      </div>
                      <p className="text-sm font-bold text-gray-800">
                        {c.citizen_name || c.username}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-blue-500 uppercase tracking-tighter">
                    {c.department || "General"}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${c.status?.includes("resolved") ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}
                    >
                      {c.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-600 underline">
                      View Details →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Detail Popup Modal (✨ Modern Layout) */}
      {viewDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                  Grievance Record #{viewDetails.id}
                </p>
                <h3 className="text-xl font-bold">
                  {viewDetails.citizen_name || viewDetails.username}
                </h3>
              </div>
              <button
                onClick={() => setViewDetails(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              {/* Left Side: Info */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Issue Description
                  </label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {viewDetails.description || "No description provided."}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Department
                    </label>
                    <p className="font-bold text-blue-600">
                      {viewDetails.department}
                    </p>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Priority Level
                    </label>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${viewDetails.priority === "CRITICAL" ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}
                    >
                      {viewDetails.priority}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Update Status
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={
                        viewDetails.status === "in_progress"
                          ? "in_progress"
                          : viewDetails.status
                      }
                      onChange={(e) =>
                        handleStatusUpdate(viewDetails.id, e.target.value)
                      }
                      className="flex-1 border rounded-xl p-3 text-sm font-bold bg-slate-50 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDelete(viewDetails.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-100"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Media & Location */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Evidence Photo
                  </label>
                  {viewDetails.image ? (
                    <img
                      src={
                        viewDetails.image.startsWith("http")
                          ? viewDetails.image
                          : `http://127.0.0.1:8000${viewDetails.image}`
                      }
                      className="w-full h-48 object-cover rounded-3xl border shadow-sm cursor-zoom-in"
                      alt="Evidence"
                      onClick={() =>
                        setSelectedImg(
                          viewDetails.image.startsWith("http")
                            ? viewDetails.image
                            : `http://127.0.0.1:8000${viewDetails.image}`,
                        )
                      }
                    />
                  ) : (
                    <div className="h-48 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-bold italic">
                      No Photo
                    </div>
                  )}
                </div>

                <a
                  href={viewDetails.formatted_address}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-emerald-500 text-white p-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
                >
                  📍 Open Live Map Location
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Image Modal (Full Screen) */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-10 cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-10 right-10 text-white text-4xl font-black">
            ×
          </button>
          <img
            src={selectedImg}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 object-contain"
            alt="Full View"
          />
        </div>
      )}
      // Detail Popup ke andar (AdminDashboard.jsx)
      {viewDetails.status !== "resolved" && (
        <div className="mt-8 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-inner">
          <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>📸</span> Submit Resolution Proof
          </h4>

          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setResolvedFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            />

            <button
              onClick={() => handleResolveWithPhoto(viewDetails.id)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              Verify & Mark as Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  
  );
}

function StatBox({ title, value, icon, color }) {
  const styles = {
    blue: "bg-blue-600",
    amber: "bg-amber-500",
    green: "bg-green-600",
    red: "bg-red-600",
  };
  return (
    <div
      className={`p-6 rounded-3xl shadow-lg text-white ${styles[color]} transform hover:scale-105 transition-all`}
    >
      <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">
        {title}
      </p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-4xl font-black">{value}</p>
        <span className="text-2xl opacity-40">{icon}</span>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import {
  fetchAllComplaints,
  updateComplaintStatus,
  fetchAllFeedbacks,
} from "../services/grievanceService";
import API from "../services/api";

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

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Modals
  const [selectedImg, setSelectedImg] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  
  // ✨ Resolution States
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

  // ✅ Officer Update Proof Logic
  const handleResolveWithPhoto = async (id) => {
    if (!resolvedFile || !resNote) return alert("Please provide After Image and Resolution Note!");

    const formData = new FormData();
    formData.append("status", "resolved");
    formData.append("after_image", resolvedFile); // As per your API spec
    formData.append("resolution_note", resNote);

    try {
      await API.patch(`grievances/officer/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
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

  const getActiveDeptStats = () => {
    const stats = [
      { name: "Pending", count: 0, color: "#2563eb" },
      { name: "In Progress", count: 0, color: "#f59e0b" },
      { name: "Resolved", count: 0, color: "#10b981" },
      { name: "Rejected", count: 0, color: "#ef4444" },
    ];
    complaints.forEach((c) => {
      if (c.department === activeDept) {
        const status = c.status?.toLowerCase();
        if (status === "pending") stats[0].count += 1;
        else if (status === "in_progress" || status === "in progress") stats[1].count += 1;
        else if (status === "resolved") stats[2].count += 1;
        else if (status === "rejected") stats[3].count += 1;
      }
    });
    return stats;
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      let statusToBackend = newStatus.toLowerCase();
      if (statusToBackend === "in progress") statusToBackend = "in_progress";
      await updateComplaintStatus(id, statusToBackend);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: statusToBackend } : c))
      );
      if (viewDetails?.id === id) setViewDetails({ ...viewDetails, status: statusToBackend });
    } catch (error) {
      alert("Status update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await API.delete(`grievances/admin/${id}/`);
        setComplaints((prev) => prev.filter((c) => c.id !== id));
        setViewDetails(null);
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  const stats = {
    total: complaints.length,
    awaiting: complaints.filter((c) => ["pending", "in_progress"].includes(c.status?.toLowerCase())).length,
    resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved").length,
    rejected: complaints.filter((c) => c.status?.toLowerCase() === "rejected").length,
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter = filter === "All" || c.status?.toLowerCase() === filter.toLowerCase();
    const displayName = c.citizen_name || c.username || `User #${c.user}`;
    return matchesFilter && (displayName.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toString().includes(searchQuery));
  });

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse text-xl">LOADING...</div>;

  return (
    <div className="space-y-10 p-6 bg-[#F8FAFC] min-h-screen font-sans relative">
      <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">SUPER ADMIN DASHBOARD</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox title="Total Reports" value={stats.total} icon="📊" color="blue" />
        <StatBox title="Active Tasks" value={stats.awaiting} icon="⏳" color="amber" />
        <StatBox title="Resolved" value={stats.resolved} icon="✅" color="green" />
        <StatBox title="Rejected" value={stats.rejected} icon="🚫" color="red" />
      </div>

      {/* Graph Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><span>📉</span> Department Insights</h2>
            <p className="text-lg font-bold text-slate-700">Status breakdown for {activeDept}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button key={dept} onClick={() => setActiveDept(dept)} className={`px-4 py-2 rounded-xl text-xs font-black border ${activeDept === dept ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-400"}`}>{dept}</button>
            ))}
          </div>
        </div>
        <div style={{ width: "100%", height: "350px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getActiveDeptStats()}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
              <YAxis hide />
              <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "15px", border: "none" }} />
              <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={60}>
                {getActiveDeptStats().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                <LabelList dataKey="count" position="top" style={{ fill: "#64748b", fontWeight: "bold" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mt-8">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
            <tr>
              <th className="px-8 py-5">Citizen</th>
              <th className="px-8 py-5">Department</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredComplaints.map((c) => (
              <tr key={c.id} onClick={() => setViewDetails(c)} className="hover:bg-blue-50/40 cursor-pointer transition-all">
                <td className="px-8 py-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase">{(c.citizen_name || c.username || "U")[0]}</div>
                  <p className="text-sm font-bold text-gray-800">{c.citizen_name || c.username}</p>
                </td>
                <td className="px-8 py-6 text-sm font-black text-blue-500 uppercase">{c.department}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${c.status === "resolved" ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}>{c.status?.replace("_", " ")}</span>
                </td>
                <td className="px-8 py-6 text-right underline text-blue-400 text-xs">View Details →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Popup Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{viewDetails.citizen_name || viewDetails.username}</h3>
              <button onClick={() => setViewDetails(null)} className="text-2xl">×</button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{viewDetails.description}</p>
                </div>

                {/* ✨ RESOLUTION LOGIC */}
                {viewDetails.status !== "resolved" ? (
                  <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-inner space-y-4">
                    <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2"><span>📸</span> Submit Proof</h4>
                    <input type="file" onChange={(e) => setResolvedFile(e.target.files[0])} className="text-[10px] block w-full" />
                    <textarea placeholder="Resolution note..." className="w-full p-3 text-xs rounded-xl h-20 outline-none" onChange={(e) => setResNote(e.target.value)} />
                    <button onClick={() => handleResolveWithPhoto(viewDetails.id)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest">Mark as Resolved</button>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <label className="text-[10px] font-black text-blue-700 uppercase block mb-2">Resolution Note</label>
                    <p className="text-xs italic text-blue-900">"{viewDetails.resolution_note || "Repaired successfully."}"</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Visual Evidence</label>
                
                {/* Comparison View if Resolved */}
                {viewDetails.status === "resolved" ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded">BEFORE</span>
                      <img src={`http://127.0.0.1:8000${viewDetails.image}`} className="w-full h-32 object-cover rounded-2xl border" alt="Before" />
                    </div>
                    <div className="relative">
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded">AFTER</span>
                      <img src={`http://127.0.0.1:8000${viewDetails.after_image}`} className="w-full h-32 object-cover rounded-2xl border" alt="After" />
                    </div>
                  </div>
                ) : (
                  <img src={`http://127.0.0.1:8000${viewDetails.image}`} className="w-full h-48 object-cover rounded-3xl border shadow-sm" alt="Evidence" />
                )}
                <a href={viewDetails.formatted_address} target="_blank" className="block w-full bg-slate-800 text-white p-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest">📍 View Map</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-10 cursor-zoom-out" onClick={() => setSelectedImg(null)}>
          <button className="absolute top-10 right-10 text-white text-4xl">×</button>
          <img src={selectedImg} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" alt="Full" />
        </div>
      )}
    </div>
  );
}

function StatBox({ title, value, icon, color }) {
  const styles = { blue: "bg-blue-600", amber: "bg-amber-500", green: "bg-green-600", red: "bg-red-600" };
  return (
    <div className={`p-6 rounded-3xl shadow-lg text-white ${styles[color]} transform hover:scale-105 transition-all`}>
      <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">{title}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-4xl font-black">{value}</p>
        <span className="text-2xl opacity-40">{icon}</span>
      </div>
    </div>
  );
}