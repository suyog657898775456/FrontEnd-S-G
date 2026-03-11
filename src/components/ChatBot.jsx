// // src/components/ChatBot.jsx
// import React, { useState, useEffect, useRef } from "react";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       text: "👋 Hi! I'm your Smart Grievance Assistant. How can I help you today?",
//       isBot: true,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(true);
//   const [isTyping, setIsTyping] = useState(false);
//   const scrollRef = useRef(null);

//   // Intent dataset based on Smart Grievance System
//   const intentDataset = [
//     {
//       intent: "what_is_system",
//       keywords: [
//         "what is",
//         "about",
//         "tell me about",
//         "system",
//         "project",
//         "smart grievance",
//       ],
//       response:
//         "📋 The Smart Grievance System is a digital platform that modernizes the grievance redressal process. It allows citizens to submit complaints online with AI-assisted routing, fraud detection, multilingual support, and real-time tracking. The system aims to make complaint resolution faster, transparent, and more efficient.",
//       quickReplies: ["How to file complaint?", "What features?", "AI features"],
//     },
//     {
//       intent: "file_complaint",
//       keywords: [
//         "file",
//         "submit",
//         "complaint",
//         "register",
//         "how to complain",
//         "raise",
//       ],
//       response:
//         "📝 To file a complaint:\n1. Log in to your account\n2. Click on 'Submit Complaint' in the dashboard\n3. Fill in complaint details (text, upload images if needed)\n4. Allow GPS location for precise address\n5. Submit the form\n\nYour complaint will be processed by our AI system for classification and priority assignment.",
//       quickReplies: ["What languages?", "Track complaint", "AI features"],
//     },
//     {
//       intent: "ai_work",
//       keywords: [
//         "ai",
//         "artificial intelligence",
//         "ml",
//         "machine learning",
//         "how ai works",
//         "classification",
//       ],
//       response:
//         "🤖 Our AI system performs multiple functions:\n• Classifies complaints into departments (Water, Electricity, Roads, etc.)\n• Predicts priority (High/Medium/Low) based on keywords & sentiment\n• Detects potential fraud or duplicate complaints\n• Summarizes long complaints automatically\n• Suggests resolution steps based on past similar complaints",
//       quickReplies: [
//         "Fraud detection",
//         "Sentiment analysis",
//         "Priority prediction",
//       ],
//     },
//     {
//       intent: "fraud_detection",
//       keywords: ["fraud", "fake", "spam", "duplicate", "detection", "scam"],
//       response:
//         "🛡️ Our system uses advanced algorithms to detect fraudulent complaints by:\n• Analyzing complaint patterns and keywords\n• Checking for duplicate submissions from same user/IP\n• Cross-referencing with historical data\n• Flagging suspicious language patterns\n• Verifying GPS location consistency\n\nFlagged complaints are reviewed by admins before routing.",
//       quickReplies: ["Citizen credibility", "How AI works", "Security"],
//     },
//     {
//       intent: "voice_complaint",
//       keywords: ["voice", "speak", "audio", "verbal", "talk", "record"],
//       response:
//         "🎤 Voice-based complaint registration is supported in 3 languages:\n• English\n• Hindi\n• Marathi\n\nSimply click on the microphone icon and speak your complaint. Our system converts speech to text and processes it automatically for classification and routing.",
//       quickReplies: ["Languages supported", "File complaint", "AI features"],
//     },
//     {
//       intent: "languages",
//       keywords: [
//         "language",
//         "languages",
//         "multilingual",
//         "hindi",
//         "marathi",
//         "english",
//         "translate",
//       ],
//       response:
//         "🌐 The Smart Grievance System supports multiple languages:\n• English (Default UI)\n• Hindi (हिन्दी)\n• Marathi (मराठी)\n\nBoth the user interface and voice complaint registration are available in these languages.",
//       quickReplies: ["Voice complaint", "File complaint", "How to use"],
//     },
//     {
//       intent: "track_complaint",
//       keywords: [
//         "track",
//         "status",
//         "update",
//         "progress",
//         "follow up",
//         "where is my complaint",
//       ],
//       response:
//         "🔍 To track your complaint:\n1. Log in to your citizen dashboard\n2. Go to 'My Complaints' section\n3. Click on any complaint to view:\n   • Current status (Pending/In Progress/Resolved)\n   • Assigned department\n   • Timeline of updates\n   • Expected resolution date\n\nYou'll also receive real-time notifications via SMS/email.",
//       quickReplies: ["Real-time tracking", "Dashboards", "Status"],
//     },
//     {
//       intent: "dashboards",
//       keywords: [
//         "dashboard",
//         "role",
//         "roles",
//         "admin",
//         "citizen",
//         "department head",
//         "head",
//       ],
//       response:
//         "📊 Three role-based dashboards are available:\n\n👤 Citizen Dashboard:\n• Submit complaints\n• Track status\n• View history & credibility score\n\n🏢 Department Head Dashboard:\n• View assigned complaints\n• Update status\n• Assign to team members\n\n👑 Admin Dashboard:\n• Monitor system analytics\n• Manage users\n• Review flagged complaints\n• Generate reports",
//       quickReplies: [
//         "Citizen credibility",
//         "Admin features",
//         "Track complaint",
//       ],
//     },
//     {
//       intent: "technology",
//       keywords: [
//         "tech",
//         "technology",
//         "stack",
//         "framework",
//         "database",
//         "backend",
//         "frontend",
//       ],
//       response:
//         "💻 Technology Stack:\n• Frontend: React.js\n• Backend: Django REST Framework\n• Database: PostgreSQL\n• AI Models: Complaint classification & priority prediction\n• Deployment: Cloud-based (Frontend + Backend)\n• Additional: GPS integration, Speech-to-text services",
//       quickReplies: ["AI features", "Security", "What is system?"],
//     },
//     {
//       intent: "routing",
//       keywords: [
//         "route",
//         "routing",
//         "assign",
//         "department",
//         "forward",
//         "transfer",
//       ],
//       response:
//         "🔄 Complaint routing workflow:\n1. AI analyzes complaint text and keywords\n2. System identifies relevant department (Water, Electricity, Roads, etc.)\n3. Priority is assigned based on urgency\n4. Complaint is automatically forwarded to department head\n5. Department head can reassign if incorrectly routed\n\nCross-department suggestions are provided for multi-faceted complaints.",
//       quickReplies: ["AI features", "Workflow", "Department head"],
//     },
//     {
//       intent: "credibility",
//       keywords: [
//         "credibility",
//         "score",
//         "trust",
//         "reputation",
//         "rating",
//         "citizen score",
//       ],
//       response:
//         "⭐ Citizen Credibility Scoring:\n• Each user gets a credibility score based on complaint history\n• Positive factors: Genuine complaints, timely updates, constructive feedback\n• Negative factors: Frequent false complaints, spam submissions\n• Higher scores may lead to faster processing\n• Low-scoring users' complaints undergo additional verification",
//       quickReplies: ["Fraud detection", "Dashboards", "Features"],
//     },
//     {
//       intent: "unique_features",
//       keywords: [
//         "unique",
//         "special",
//         "different",
//         "usp",
//         "advantage",
//         "features",
//       ],
//       response:
//         "✨ What makes our system unique:\n• AI-powered complaint classification & priority prediction\n• Multi-language voice complaint registration\n• Fraud detection to prevent spam\n• Sentiment analysis for urgent cases\n• Automatic complaint summarization\n• Cross-department workflow suggestions\n• Citizen credibility scoring\n• Real-time tracking with notifications",
//       quickReplies: ["AI features", "Voice complaint", "Fraud detection"],
//     },
//     {
//       intent: "who_can_use",
//       keywords: ["who", "users", "eligible", "use", "citizen", "public"],
//       response:
//         "👥 The Smart Grievance System is designed for:\n• All citizens registered on the platform\n• Government department officials\n• System administrators\n\nAny citizen with a valid account can submit complaints and track their status.",
//       quickReplies: ["How to file?", "Dashboards", "Languages"],
//     },
//     {
//       intent: "real_time_tracking",
//       keywords: [
//         "real time",
//         "realtime",
//         "live",
//         "instant",
//         "immediate",
//         "notification",
//       ],
//       response:
//         "⚡ Real-time tracking features:\n• Live status updates as complaint progresses\n• Instant notifications via SMS/email\n• Timeline view with timestamps\n• Department response tracking\n• Estimated resolution time updates\n• Push notifications for mobile users",
//       quickReplies: ["Track complaint", "Notifications", "Status"],
//     },
//     {
//       intent: "security",
//       keywords: [
//         "security",
//         "secure",
//         "data",
//         "privacy",
//         "encryption",
//         "safe",
//         "protected",
//       ],
//       response:
//         "🔒 Data Security Measures:\n• Encrypted data transmission (HTTPS)\n• Secure PostgreSQL database with access controls\n• Role-based authentication for dashboards\n• Regular security audits\n• GDPR compliant data handling\n• No sharing of personal information with third parties\n• Complaints stored with user authentication",
//       quickReplies: ["Privacy", "Data storage", "Who can use?"],
//     },
//   ];

//   // Auto-scroll to bottom whenever messages change
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   // Find matching intent based on user input
//   const findIntent = (input) => {
//     const lowerInput = input.toLowerCase();

//     for (const intent of intentDataset) {
//       for (const keyword of intent.keywords) {
//         if (lowerInput.includes(keyword.toLowerCase())) {
//           return intent;
//         }
//       }
//     }
//     return null;
//   };

//   const handleSend = async (e, textOverride = null) => {
//     if (e) e.preventDefault();

//     const messageText = textOverride || input;
//     if (!messageText.trim()) return;

//     // Add User Message
//     const userMsg = { text: messageText, isBot: false };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setShowSuggestions(false);
//     setIsTyping(true);

//     // Simulate typing delay for natural feel
//     setTimeout(() => {
//       const matchedIntent = findIntent(messageText);
//       let botResponse = "";
//       let quickReplies = [];

//       if (matchedIntent) {
//         botResponse = matchedIntent.response;
//         quickReplies = matchedIntent.quickReplies || [];
//       } else {
//         botResponse =
//           "I'm here to help with Smart Grievance System related queries. Please ask about complaint submission, AI features, tracking, or system workflow. 😊";
//         quickReplies = [
//           "What is Smart Grievance?",
//           "How to file?",
//           "Track complaint",
//           "AI features",
//         ];
//       }

//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         { text: botResponse, isBot: true, quickReplies },
//       ]);
//     }, 1000);
//   };

//   const handleQuickReply = (reply) => {
//     handleSend(null, reply);
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] font-sans">
//       {/* Floating Button with Pulse Animation */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group relative ${!isOpen && "animate-pulse"}`}
//       >
//         {isOpen ? (
//           <span className="text-xl font-bold transition-transform duration-300 rotate-90">
//             ✕
//           </span>
//         ) : (
//           <div className="flex items-center gap-2">
//             <span className="text-2xl animate-bounce">💬</span>
//             <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-medium">
//               Help?
//             </span>
//           </div>
//         )}
//       </button>

//       {/* Chat Window - Normal Window Size */}
//       {isOpen && (
//         <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
//           {/* Header with Gradient */}
//           <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                 <div className="w-3 h-3 bg-green-400 rounded-full absolute top-0 animate-ping opacity-75"></div>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-base flex items-center gap-2">
//                   Smart Grievance Assistant
//                   <span className="bg-indigo-500 px-2 py-0.5 rounded-full text-xs">
//                     Beta
//                   </span>
//                 </h3>
//                 <p className="text-xs text-indigo-100">
//                   Ask me anything about the system
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="hover:bg-indigo-500 p-1 rounded-full transition-colors"
//               >
//                 <span className="text-base">🗕</span>
//               </button>
//             </div>
//           </div>

//           {/* Chat Messages Area */}
//           <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4 scroll-smooth">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
//               >
//                 <div
//                   className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-base ${
//                     msg.isBot
//                       ? "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none"
//                       : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none"
//                   }`}
//                 >
//                   <div className="whitespace-pre-line leading-relaxed">
//                     {msg.text}
//                   </div>

//                   {/* Quick Reply Buttons */}
//                   {msg.isBot &&
//                     msg.quickReplies &&
//                     msg.quickReplies.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-3">
//                         {msg.quickReplies.map((reply, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => handleQuickReply(reply)}
//                             className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all duration-200 hover:scale-105"
//                           >
//                             {reply}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                 </div>
//               </div>
//             ))}

//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
//                 <div className="bg-white text-gray-700 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none px-5 py-4">
//                   <div className="flex gap-1.5">
//                     <span
//                       className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0ms" }}
//                     ></span>
//                     <span
//                       className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "150ms" }}
//                     ></span>
//                     <span
//                       className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "300ms" }}
//                     ></span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Welcome Suggestions */}
//             {messages.length === 1 && showSuggestions && (
//               <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                 {[
//                   "What is Smart Grievance?",
//                   "How to file complaint?",
//                   "How does AI work?",
//                   "Track my complaint",
//                   "Languages supported",
//                   "Voice complaint",
//                 ].map((action) => (
//                   <button
//                     key={action}
//                     onClick={() => handleSend(null, action)}
//                     className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all duration-200 hover:scale-105"
//                   >
//                     {action}
//                   </button>
//                 ))}
//               </div>
//             )}
//             <div ref={scrollRef} />
//           </div>

//           {/* Input Area with Microphone Icon */}
//           <form
//             onSubmit={handleSend}
//             className="p-4 bg-white border-t flex items-center gap-2"
//           >
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your question..."
//               className="flex-1 bg-gray-100 border-none rounded-lg px-5 py-3 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//             />
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 hover:scale-105 shadow-md"
//               disabled={!input.trim()}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="22" y1="2" x2="11" y2="13"></line>
//                 <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//               </svg>
//             </button>
//             <button
//               type="button"
//               className="bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
//               title="Voice input coming soon"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
//                 <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
//                 <line x1="12" y1="19" x2="12" y2="23"></line>
//                 <line x1="8" y1="23" x2="16" y2="23"></line>
//               </svg>
//             </button>
//           </form>

//           {/* Footer Hint */}
//           <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
//             <p className="text-xs text-gray-500 text-center">
//               Smart Grievance System • AI Assistant • 24/7 Support
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;





// src/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi! I'm your Smart Grievance Assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Intent dataset based on Smart Grievance System
  const intentDataset = [
    {
      intent: "what_is_system",
      keywords: [
        "what is",
        "about",
        "tell me about",
        "system",
        "project",
        "smart grievance",
      ],
      response:
        "📋 The Smart Grievance System is a digital platform that modernizes the grievance redressal process. It allows citizens to submit complaints online with AI-assisted routing, fraud detection, multilingual support, and real-time tracking. The system aims to make complaint resolution faster, transparent, and more efficient.",
      quickReplies: ["How to file complaint?", "What features?", "AI features"],
    },
    {
      intent: "file_complaint",
      keywords: [
        "file",
        "submit",
        "complaint",
        "register",
        "how to complain",
        "raise",
      ],
      response:
        "📝 To file a complaint:\n1. Log in to your account\n2. Click on 'Submit Complaint' in the dashboard\n3. Fill in complaint details (text, upload images if needed)\n4. Allow GPS location for precise address\n5. Submit the form\n\nYour complaint will be processed by our AI system for classification and priority assignment.",
      quickReplies: ["What languages?", "Track complaint", "AI features"],
    },
    {
      intent: "ai_work",
      keywords: [
        "ai",
        "artificial intelligence",
        "ml",
        "machine learning",
        "how ai works",
        "classification",
      ],
      response:
        "🤖 Our AI system performs multiple functions:\n• Classifies complaints into departments (Water, Electricity, Roads, etc.)\n• Predicts priority (High/Medium/Low) based on keywords & sentiment\n• Detects potential fraud or duplicate complaints\n• Summarizes long complaints automatically\n• Suggests resolution steps based on past similar complaints",
      quickReplies: [
        "Fraud detection",
        "Sentiment analysis",
        "Priority prediction",
      ],
    },
    {
      intent: "fraud_detection",
      keywords: ["fraud", "fake", "spam", "duplicate", "detection", "scam"],
      response:
        "🛡️ Our system uses advanced algorithms to detect fraudulent complaints by:\n• Analyzing complaint patterns and keywords\n• Checking for duplicate submissions from same user/IP\n• Cross-referencing with historical data\n• Flagging suspicious language patterns\n• Verifying GPS location consistency\n\nFlagged complaints are reviewed by admins before routing.",
      quickReplies: ["Citizen credibility", "How AI works", "Security"],
    },
    {
      intent: "voice_complaint",
      keywords: ["voice", "speak", "audio", "verbal", "talk", "record"],
      response:
        "🎤 Voice-based complaint registration is supported in 3 languages:\n• English\n• Hindi\n• Marathi\n\nSimply click on the microphone icon and speak your complaint. Our system converts speech to text and processes it automatically for classification and routing.",
      quickReplies: ["Languages supported", "File complaint", "AI features"],
    },
    {
      intent: "languages",
      keywords: [
        "language",
        "languages",
        "multilingual",
        "hindi",
        "marathi",
        "english",
        "translate",
      ],
      response:
        "🌐 The Smart Grievance System supports multiple languages:\n• English (Default UI)\n• Hindi (हिन्दी)\n• Marathi (मराठी)\n\nBoth the user interface and voice complaint registration are available in these languages.",
      quickReplies: ["Voice complaint", "File complaint", "How to use"],
    },
    {
      intent: "track_complaint",
      keywords: [
        "track",
        "status",
        "update",
        "progress",
        "follow up",
        "where is my complaint",
      ],
      response:
        "🔍 To track your complaint:\n1. Log in to your citizen dashboard\n2. Go to 'My Complaints' section\n3. Click on any complaint to view:\n   • Current status (Pending/In Progress/Resolved)\n   • Assigned department\n   • Timeline of updates\n   • Expected resolution date\n\nYou'll also receive real-time notifications via SMS/email.",
      quickReplies: ["Real-time tracking", "Dashboards", "Status"],
    },
    {
      intent: "dashboards",
      keywords: [
        "dashboard",
        "role",
        "roles",
        "admin",
        "citizen",
        "department head",
        "head",
      ],
      response:
        "📊 Three role-based dashboards are available:\n\n👤 Citizen Dashboard:\n• Submit complaints\n• Track status\n• View history & credibility score\n\n🏢 Department Head Dashboard:\n• View assigned complaints\n• Update status\n• Assign to team members\n\n👑 Admin Dashboard:\n• Monitor system analytics\n• Manage users\n• Review flagged complaints\n• Generate reports",
      quickReplies: [
        "Citizen credibility",
        "Admin features",
        "Track complaint",
      ],
    },
    {
      intent: "technology",
      keywords: [
        "tech",
        "technology",
        "stack",
        "framework",
        "database",
        "backend",
        "frontend",
      ],
      response:
        "💻 Technology Stack:\n• Frontend: React.js\n• Backend: Django REST Framework\n• Database: PostgreSQL\n• AI Models: Complaint classification & priority prediction\n• Deployment: Cloud-based (Frontend + Backend)\n• Additional: GPS integration, Speech-to-text services",
      quickReplies: ["AI features", "Security", "What is system?"],
    },
    {
      intent: "routing",
      keywords: [
        "route",
        "routing",
        "assign",
        "department",
        "forward",
        "transfer",
      ],
      response:
        "🔄 Complaint routing workflow:\n1. AI analyzes complaint text and keywords\n2. System identifies relevant department (Water, Electricity, Roads, etc.)\n3. Priority is assigned based on urgency\n4. Complaint is automatically forwarded to department head\n5. Department head can reassign if incorrectly routed\n\nCross-department suggestions are provided for multi-faceted complaints.",
      quickReplies: ["AI features", "Workflow", "Department head"],
    },
    {
      intent: "credibility",
      keywords: [
        "credibility",
        "score",
        "trust",
        "reputation",
        "rating",
        "citizen score",
      ],
      response:
        "⭐ Citizen Credibility Scoring:\n• Each user gets a credibility score based on complaint history\n• Positive factors: Genuine complaints, timely updates, constructive feedback\n• Negative factors: Frequent false complaints, spam submissions\n• Higher scores may lead to faster processing\n• Low-scoring users' complaints undergo additional verification",
      quickReplies: ["Fraud detection", "Dashboards", "Features"],
    },
    {
      intent: "unique_features",
      keywords: [
        "unique",
        "special",
        "different",
        "usp",
        "advantage",
        "features",
      ],
      response:
        "✨ What makes our system unique:\n• AI-powered complaint classification & priority prediction\n• Multi-language voice complaint registration\n• Fraud detection to prevent spam\n• Sentiment analysis for urgent cases\n• Automatic complaint summarization\n• Cross-department workflow suggestions\n• Citizen credibility scoring\n• Real-time tracking with notifications",
      quickReplies: ["AI features", "Voice complaint", "Fraud detection"],
    },
    {
      intent: "who_can_use",
      keywords: ["who", "users", "eligible", "use", "citizen", "public"],
      response:
        "👥 The Smart Grievance System is designed for:\n• All citizens registered on the platform\n• Government department officials\n• System administrators\n\nAny citizen with a valid account can submit complaints and track their status.",
      quickReplies: ["How to file?", "Dashboards", "Languages"],
    },
    {
      intent: "real_time_tracking",
      keywords: [
        "real time",
        "realtime",
        "live",
        "instant",
        "immediate",
        "notification",
      ],
      response:
        "⚡ Real-time tracking features:\n• Live status updates as complaint progresses\n• Instant notifications via SMS/email\n• Timeline view with timestamps\n• Department response tracking\n• Estimated resolution time updates\n• Push notifications for mobile users",
      quickReplies: ["Track complaint", "Notifications", "Status"],
    },
    {
      intent: "security",
      keywords: [
        "security",
        "secure",
        "data",
        "privacy",
        "encryption",
        "safe",
        "protected",
      ],
      response:
        "🔒 Data Security Measures:\n• Encrypted data transmission (HTTPS)\n• Secure PostgreSQL database with access controls\n• Role-based authentication for dashboards\n• Regular security audits\n• GDPR compliant data handling\n• No sharing of personal information with third parties\n• Complaints stored with user authentication",
      quickReplies: ["Privacy", "Data storage", "Who can use?"],
    },
  ];

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Find matching intent based on user input
  const findIntent = (input) => {
    const lowerInput = input.toLowerCase();

    for (const intent of intentDataset) {
      for (const keyword of intent.keywords) {
        if (lowerInput.includes(keyword.toLowerCase())) {
          return intent;
        }
      }
    }
    return null;
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();

    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    // Add User Message
    const userMsg = { text: messageText, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const matchedIntent = findIntent(messageText);
      let botResponse = "";
      let quickReplies = [];

      if (matchedIntent) {
        botResponse = matchedIntent.response;
        quickReplies = matchedIntent.quickReplies || [];
      } else {
        botResponse =
          "I'm here to help with Smart Grievance System related queries. Please ask about complaint submission, AI features, tracking, or system workflow. 😊";
        quickReplies = [
          "What is Smart Grievance?",
          "How to file?",
          "Track complaint",
          "AI features",
        ];
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: botResponse, isBot: true, quickReplies },
      ]);
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    handleSend(null, reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Button with Pulse Animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group relative ${!isOpen && "animate-pulse"}`}
      >
        {isOpen ? (
          <span className="text-xl font-bold transition-transform duration-300 rotate-90">
            ✕
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">💬</span>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-medium">
              Help?
            </span>
          </div>
        )}
      </button>

      {/* Chat Window - Normal Window Size */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[500px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full absolute top-0 animate-ping opacity-75"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base flex items-center gap-2">
                  Smart Grievance Assistant
                  <span className="bg-indigo-500 px-2 py-0.5 rounded-full text-xs">
                    Beta
                  </span>
                </h3>
                <p className="text-xs text-indigo-100">
                  Ask me anything about the system
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-indigo-500 p-1 rounded-full transition-colors"
              >
                <span className="text-base">🗕</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4 scroll-smooth">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-base ${
                    msg.isBot
                      ? "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none"
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Quick Reply Buttons */}
                  {msg.isBot &&
                    msg.quickReplies &&
                    msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all duration-200 hover:scale-105"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white text-gray-700 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none px-5 py-4">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Suggestions */}
            {messages.length === 1 && showSuggestions && (
              <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {[
                  "What is Smart Grievance?",
                  "How to file complaint?",
                  "How does AI work?",
                  "Track my complaint",
                  "Languages supported",
                  "Voice complaint",
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSend(null, action)}
                    className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all duration-200 hover:scale-105"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area with Microphone Icon */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-gray-100 border-none rounded-lg px-5 py-3 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 hover:scale-105 shadow-md"
              disabled={!input.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
            
          </form>

          {/* Footer Hint */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Smart Grievance System • AI Assistant • 24/7 Support
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
