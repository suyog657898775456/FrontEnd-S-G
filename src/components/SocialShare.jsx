import React, { useState } from "react";
import { getSocialShareContent } from "../services/grievanceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faFacebookF,
  faXTwitter,
} from "@fortawesome/free-brands-icons";

const SocialShare = ({ complaintId, status }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform) => {
    try {
      setIsSharing(true);
      // Fetch dynamic content from backend
      const { message, link } = await getSocialShareContent(complaintId);

      const encodedMsg = encodeURIComponent(message);
      const encodedLink = encodeURIComponent(link);

      let url = "";
      switch (platform) {
        case "whatsapp":
          // WhatsApp uses 'text' parameter for both message and link
          url = `https://api.whatsapp.com/send?text=${encodedMsg}%20${encodedLink}`;
          break;
        case "twitter":
          // X (Twitter) works best with text and url separated
          url = `https://twitter.com/intent/tweet?text=${encodedMsg}&url=${encodedLink}`;
          break;
        case "facebook":
          // Facebook primarily shares the URL and scrapes metadata
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
          break;
        default:
          break;
      }

      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      alert("System Error: Could not generate shareable link.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mt-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Social Redressal Terminal
        </p>
        <h4 className="text-xs font-bold text-slate-600 mt-1">
          {status === "resolved"
            ? "Share the success with your community"
            : "Mobilize public support for this issue"}
        </h4>
      </div>

      <div className="flex justify-center gap-4">
        {/* WhatsApp Button */}
        <button
          onClick={() => handleShare("whatsapp")}
          disabled={isSharing}
          className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-green-100 hover:scale-110 active:scale-90 transition-all disabled:opacity-50"
          title="Share on WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
        </button>

        {/* Twitter / X Button */}
        <button
          onClick={() => handleShare("twitter")}
          disabled={isSharing}
          className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg shadow-slate-200 hover:scale-110 active:scale-90 transition-all disabled:opacity-50"
          title="Share on X (Twitter)"
        >
          <FontAwesomeIcon icon={faXTwitter} className="text-xl" />
        </button>

        {/* Facebook Button */}
        <button
          onClick={() => handleShare("facebook")}
          disabled={isSharing}
          className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-110 active:scale-90 transition-all disabled:opacity-50"
          title="Share on Facebook"
        >
          <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
        </button>
      </div>

      {isSharing && (
        <p className="text-[8px] text-blue-500 font-bold text-center mt-3 animate-pulse uppercase tracking-widest">
          Generating Secure Share Link...
        </p>
      )}
    </div>
  );
};

export default SocialShare;
