import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Interceptor: Token automatically pathavnyasathi
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- CITIZEN APIS ---
export const fetchUserComplaints = async () => {
  const response = await API.get("grievances/citizen/");
  return response.data.results || response.data;
};

// --- ADMIN APIS ---
export const fetchAllComplaints = async () => {
  // ✨ FIX: Role check logic added to prevent 403 for non-admins
  const response = await API.get("grievances/admin/");
  return response.data.results || response.data;
};

export const fetchAllFeedbacks = async () => {
  try {
    const response = await API.get("feedback/admin/");
    return response.data.results || response.data;
  } catch (error) {
    console.error("Feedback Fetch Error Status:", error.response?.status);
    return [];
  }
};

// --- OFFICER APIS ---
export const fetchMunicipalData = async () => {
  const grievancesRes = await API.get("grievances/officer/");
  const statsRes = await API.get("dashboard/officer/");
  return {
    complaints: grievancesRes.data.results || grievancesRes.data,
    stats: statsRes.data,
  };
};

// --- ACTION APIS ---

// ✨ DELETE: Strictly hits the admin endpoint
export const deleteGrievance = async (id) => {
  const response = await API.delete(`grievances/admin/${id}/`);
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  // ✨ Logic: Ensures Admin hits admin path, Officer hits officer path
  const rolePath = savedUser?.role === "ADMIN" ? "admin" : "officer";

  let backendStatus = status.toLowerCase();
  if (backendStatus === "in progress") backendStatus = "in_progress";

  try {
    const response = await API.patch(`grievances/${rolePath}/${id}/`, {
      status: backendStatus,
    });
    return response.data;
  } catch (error) {
    // Detailed error logging for debugging payload issues
    console.error("Update Status Failed:", error.response?.data);
    throw error;
  }
};

// --- ACTION APIS ---

// ✨ FIXED: Added better Multipart handling
export const resolveGrievanceWithPhoto = async (id, photoFile, note) => {
  const formData = new FormData();
  formData.append("status", "resolved");
  formData.append("after_image", photoFile); // Ensure backend expects 'after_image'
  formData.append("resolution_note", note || "Resolved by authority");

  try {
    const response = await API.patch(`grievances/admin/${id}/`, formData, {
      headers: {
        // Axios automatic boundary set karega, isliye manually 'multipart/form-data'
        // kabhi kabhi error deta hai. Leave it to Axios or use this:
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Resolution Upload Error Payload:", error.response?.data);
    throw error;
  }
};

// 🤖 AI/Admin Action Endpoint (Matches your Take Action Feature)
export const takeAdminAction = async (id, actionType, reason) => {
  try {
    const response = await API.post(`grievances/admin/take-action/${id}/`, {
      action_type: actionType, // "REASSIGN" or "WARNING"
      reason: reason,
    });
    return response.data;
  } catch (error) {
    console.error("Admin Action Failed:", error.response?.data);
    throw error;
  }
};
