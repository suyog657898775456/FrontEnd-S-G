import React, { useState } from "react";
import { getSocialShareContent } from "../services/grievanceService";

const SocialShare = ({ complaintId, status }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform) => {
    try {
      setIsSharing(true);
      const { message, link } = await getSocialShareContent(complaintId);
      const encodedMsg = encodeURIComponent(message);
      const encodedLink = encodeURIComponent(link);

      let url = "";
      if (platform === "whatsapp") {
        url = `https://api.whatsapp.com/send?text=${encodedMsg}%20${encodedLink}`;
      } else if (platform === "twitter") {
        url = `https://twitter.com/intent/tweet?text=${encodedMsg}&url=${encodedLink}`;
      } else if (platform === "facebook") {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
      }

      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert("Sharing failed. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mt-6 animate-in slide-in-from-bottom-2 duration-500">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-4">
        Share Complaint Progress
      </p>

      <div className="grid grid-cols-3 gap-3">
        {/* WhatsApp */}
        <button
          onClick={() => handleShare("whatsapp")}
          disabled={isSharing}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-green-100 hover:bg-green-50 transition-all group"
        >
          <span className="text-xl mb-1">💬</span>
          <span className="text-[9px] font-black text-green-600 uppercase">
            WhatsApp
          </span>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare("twitter")}
          disabled={isSharing}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all"
        >
          <span className="text-xl mb-1">🐦</span>
          <span className="text-[9px] font-black text-slate-800 uppercase">
            Twitter
          </span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare("facebook")}
          disabled={isSharing}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-blue-100 hover:bg-blue-50 transition-all"
        >
          <span className="text-xl mb-1">👥</span>
          <span className="text-[9px] font-black text-blue-600 uppercase">
            Facebook
          </span>
        </button>
      </div>

      {isSharing && (
        <p className="text-[8px] text-blue-500 font-bold text-center mt-3 animate-pulse uppercase">
          Generating Secure Link...
        </p>
      )}
    </div>
  );
};

export default SocialShare;
