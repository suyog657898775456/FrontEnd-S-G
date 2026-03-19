import React, { useState, useEffect } from "react";

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState("en");

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिं" },
    { code: "mr", label: "मरा" },
  ];

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);

    let attempts = 0;
    const maxAttempts = 10; // 5 seconds tak try karega

    const executeChange = () => {
      const googleCombo = document.querySelector(".goog-te-combo");

      if (googleCombo) {
        googleCombo.value = langCode;
        googleCombo.dispatchEvent(new Event("change"));
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(
          `Connection Attempt ${attempts}: Waiting for Google Translate...`,
        );
        setTimeout(executeChange, 500); // Har 500ms mein check karega
      } else {
        console.error(
          "Google Translate failed to initialize. Check if blocked by browser.",
        );
      }
    };

    executeChange();
  };

  return (
    <div className="flex items-center p-1 bg-gray-900/5 backdrop-blur-md rounded-full border border-gray-200 shadow-inner w-fit">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`
            relative px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300
            ${
              currentLang === lang.code
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "text-slate-500 hover:text-blue-600 hover:bg-white/50"
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
