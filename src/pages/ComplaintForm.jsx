import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/grievances/citizen/";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: null,
  });

  // ---------------- WORD VALIDATION HELPER ----------------
  const getWordCount = (str) => str.trim().split(/\s+/).filter(Boolean).length;

  // ---------------- IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ---------------- GPS ----------------
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        () => alert("Location is mandatory. Please enable GPS permissions."),
      );
    }
  }, []);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Word Count Checks
    if (getWordCount(formData.title) > 25)
      return alert("Title is too long! Keep it under 25 words.");
    if (getWordCount(formData.description) > 70)
      return alert("Description is too long! Keep it under 70 words.");

    if (!image) return alert("Please upload a photo of the issue.");
    if (!formData.location)
      return alert("Waiting for location. Please wait a moment.");

    setIsSubmitting(true);

    try {
      const data = new FormData();
      // Saara text data append karein
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      // Image file append karein
      if (image) data.append("image", image);

      const res = await API.post("grievances/citizen/", data);

      alert("✅ Complaint Submitted Successfully!");

      // Optional: Form reset logic yahan daal sakte hain
      // setFormData(initialState);
      // setImage(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // 🚨 Blocked User check: Backend se aaya message dikhayega
        alert(
          `🚫 ACCESS DENIED: ${error.response.data.error || "Submission Failed"}`,
        );
      } else {
        alert(
          "❌ Error: Something went wrong. Please check your internet connection.",
        );
        console.error("Submission Error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("description", formData.description.trim());
    data.append("image", image);
    data.append("latitude", formData.location.lat);
    data.append("longitude", formData.location.lng);

    const token = localStorage.getItem("access");

    try {
      await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsSuccess(true);
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (error) {
      console.error("Backend Error Details:", error.response?.data);
      alert("Submission failed. Check your connection or server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- VOICE FEATURE (AUTOMATED) ----------------
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  // ✨ Effect: Mic band hote hi text auto-fill ho jayega
  useEffect(() => {
    if (!listening && transcript) {
      const words = transcript.trim().split(/\s+/);
      const validDesc = words.slice(0, 70).join(" ");
      const validTitle = words.slice(0, 5).join(" ");

      setFormData((prev) => ({
        ...prev,
        description: validDesc,
        title: prev.title || validTitle, // Agar title khali hai tabhi fill karega
      }));

      // Voice data handle karne ke baad transcript clear kar dein
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-10 text-center font-bold text-red-500 bg-red-50 rounded-3xl">
        ⚠️ Browser does not support speech recognition.
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[60vh] text-center bg-white rounded-3xl shadow-sm mx-4 mt-10 border border-green-100">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-[#0F2A44]">Report Received</h2>
        <p className="text-slate-500 mt-2">Thank you for your contribution.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-[#0F2A44] p-8 text-white relative">
          <h2 className="text-2xl font-bold tracking-tight uppercase">
            New Report
          </h2>
          <p className="text-blue-200 text-xs mt-1 opacity-80 font-black uppercase tracking-widest">
            Civic Intelligence Portal
          </p>

          <div
            className={`absolute top-8 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
              formData.location
                ? "bg-green-500/20 border-green-400 text-green-400"
                : "bg-orange-500/20 border-orange-400 text-orange-400 animate-pulse"
            }`}
          >
            {formData.location ? "● GPS Locked" : "○ Localizing..."}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Professional Voice Assistant Bar */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${listening ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100"}`}
          >
            <div className="flex flex-col">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${listening ? "text-red-500" : "text-blue-500"}`}
              >
                {listening ? "Recording Live..." : "Voice Dictation"}
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                Speak to fill the form
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* ❌ "Apply Text" button yahan se remove kar diya hai kyunki ab auto-fill hoga */}

              <button
                type="button"
                onClick={
                  listening ? SpeechRecognition.stopListening : startListening
                }
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                  listening
                    ? "bg-red-500 animate-pulse ring-4 ring-red-100"
                    : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"
                }`}
              >
                {listening ? (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-4 bg-white animate-bounce"></div>
                    <div className="w-1.5 h-4 bg-white animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-4 bg-white animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Issue Title */}
          <div className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                Issue Title
              </label>
              {/* Live Counter for Title */}
              <div
                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all duration-300 ${
                  getWordCount(formData.title) > 25
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {getWordCount(formData.title)} / 25 Words
              </div>
            </div>
            <input
              type="text"
              placeholder="Brief summary of the issue..."
              required
              value={formData.title}
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all text-slate-800 text-sm font-bold ${
                getWordCount(formData.title) > 25
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-100 focus:border-blue-500 focus:bg-white"
              }`}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Detailed Description */}
          <div className="group relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                Description
              </label>
              {/* Live Counter for Description */}
              <div
                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all duration-300 ${
                  getWordCount(formData.description) > 70
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {getWordCount(formData.description)} / 70 Words
              </div>
            </div>
            <textarea
              placeholder="Explain the situation in detail..."
              required
              value={formData.description}
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl h-32 outline-none transition-all text-slate-800 text-sm font-medium resize-none ${
                getWordCount(formData.description) > 70
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-100 focus:border-blue-500 focus:bg-white"
              }`}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {/* Warning Hint */}
            {(getWordCount(formData.title) > 25 ||
              getWordCount(formData.description) > 70) && (
              <p className="text-[10px] text-red-500 font-bold mt-2 animate-bounce">
                ⚠️ Limit exceeded! Please shorten your text to submit.
              </p>
            )}
          </div>
          {/* Photo Evidence */}
          <div className="group">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Evidence Photo
            </label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden min-h-[140px] flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                required
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover z-10"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="text-2xl mb-1 opacity-30">📸</div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Capture Issue
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.location}
            className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
              isSubmitting || !formData.location
                ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Secure Submission"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;
