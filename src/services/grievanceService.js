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

// Citizen: Swataha chya तक्रारी बघणे
export const fetchUserComplaints = async () => {
  const response = await API.get("grievances/citizen/");
  return response.data.results || response.data;
};

// Admin: Srv तक्रारी बघणे
export const fetchAllComplaints = async () => {
  const response = await API.get("grievances/admin/");
  return response.data.results || response.data;
};

// Officer: Swataha chya Dept chya तक्रari baghne
export const fetchMunicipalData = async () => {
  const grievancesRes = await API.get("grievances/officer/");
  const statsRes = await API.get("dashboard/officer/");
  return {
    complaints: grievancesRes.data.results || grievancesRes.data,
    stats: statsRes.data,
  };
};

export const updateComplaintStatus = async (id, status) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const rolePath = savedUser?.role === "ADMIN" ? "admin" : "officer";

  let backendStatus = status.toLowerCase();
  if (backendStatus === "in progress") backendStatus = "in_progress";

  try {
    const response = await API.patch(`grievances/${rolePath}/${id}/`, {
      status: backendStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Payload mismatch error:", { sent: backendStatus });
    throw error;
  }
};

export const fetchAllFeedbacks = async () => {
  try {
    const response = await API.get("feedback/admin/");

    console.log("Raw Feedback Response:", response.data);

    return response.data.results || response.data;
  } catch (error) {
    console.error("Feedback Fetch Error Status:", error.response?.status);
    console.error("Full Error Response:", error.response?.data);
    return [];
  }
};

export const resolveGrievanceWithPhoto = async (id, photoFile) => {
  const formData = new FormData();
  formData.append("status", "resolved");
  formData.append("resolved_image", photoFile); // ✨ After photo bhej rahe hain

  try {
    const response = await API.patch(`grievances/admin/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Mandatory for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error resolving grievance", error);
    throw error;
  }
};