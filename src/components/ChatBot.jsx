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

  // Enhanced intent dataset with more comprehensive training data
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
        "explain",
        "overview",
        "introduction",
        "what does it do",
        "purpose",
        "what's this",
        "what can it do",
        "describe",
        "information",
      ],
      response:
        "📋 The Smart Grievance System is a comprehensive digital platform that revolutionizes how citizens file and track complaints. Here's what makes it special:\n\n🏛️ **Key Features:**\n• AI-powered automatic complaint classification\n• Smart routing to appropriate departments\n• Real-time tracking and notifications\n• Multi-language support (English, Hindi, Marathi)\n• Voice-based complaint registration\n• Fraud detection and prevention\n• Citizen credibility scoring\n\n🎯 **Main Benefits:**\n• Faster resolution times\n• Transparent complaint handling\n• Reduced manual intervention\n• Data-driven decision making\n• 24/7 accessibility\n\n💡 **Who It Serves:** Citizens, Government Departments, and Administrators",
      quickReplies: [
        "How to file complaint?",
        "What features?",
        "AI capabilities",
      ],
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
        "lodge",
        "post",
        "create",
        "new complaint",
        "add complaint",
        "report issue",
      ],
      response:
        "📝 **Step-by-Step Complaint Filing Process:**\n\n1️⃣ **Login/Access:**\n   • Visit the Smart Grievance System portal\n   • Login with your credentials\n   • New users can register for free\n\n2️⃣ **Submit Complaint:**\n   • Click 'Submit Complaint' button\n   • Provide complaint title and detailed description\n   • Upload supporting images/videos (optional)\n   • Allow GPS location for accurate address mapping\n   • Select complaint category if known\n\n3️⃣ **AI Processing:**\n   • System analyzes your complaint\n   • Automatically classifies department\n   • Assigns priority level\n   • Detects potential duplicates\n\n4️⃣ **Confirmation:**\n   • Receive unique complaint ID\n   • Get estimated resolution timeline\n   • Option to save draft\n\n✨ **Pro Tips:**\n• Be specific about location and issue\n• Add clear photos for better understanding\n• Provide contact details for follow-ups\n• Check similar complaints before submitting",
      quickReplies: [
        "What languages?",
        "Track complaint",
        "AI features",
        "Documents needed",
      ],
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
        "ai model",
        "technology",
        "algorithm",
        "how does ai",
      ],
      response:
        "🤖 **Advanced AI Capabilities in Detail:**\n\n🔍 **Complaint Classification:**\n• Natural Language Processing (NLP) analyzes text\n• Identifies department (Water, Electricity, Roads, Sanitation, etc.)\n• Accuracy rate: 85-90% with continuous improvement\n• Learns from historical complaint data\n\n⚡ **Priority Prediction:**\n• Analyzes urgency indicators\n• Identifies critical keywords (emergency, hazard, immediate)\n• Considers sentiment analysis for emotional distress\n• Assigns High/Medium/Low priority levels\n\n🛡️ **Fraud Detection:**\n• Pattern recognition for spam\n• Duplicate complaint identification\n• Cross-reference with user history\n• Flagging suspicious submissions\n\n📊 **Smart Features:**\n• Automatic complaint summarization (reduces 200+ words to key points)\n• Sentiment analysis for emotional context\n• Cross-department suggestion for complex issues\n• Resolution suggestion based on similar past complaints\n\n🎯 **Continuous Learning:**\n• Feedback loop improves accuracy\n• Regular model retraining\n• Adaptation to new complaint types",
      quickReplies: [
        "Fraud detection",
        "Sentiment analysis",
        "Priority prediction",
        "Accuracy rates",
      ],
    },
    {
      intent: "fraud_detection",
      keywords: [
        "fraud",
        "fake",
        "spam",
        "duplicate",
        "detection",
        "scam",
        "false complaint",
        "misuse",
        "abuse",
        "authenticity",
        "verification",
      ],
      response:
        "🛡️ **Comprehensive Fraud Detection System:**\n\n🔎 **Detection Methods:**\n1. **Pattern Analysis:**\n   • Identifies repetitive complaint patterns\n   • Flags mass submissions from same user\n   • Detects automated bot submissions\n\n2. **Content Verification:**\n   • Cross-checks with historical data\n   • Identifies copied/duplicate content\n   • Verifies location consistency with GPS\n\n3. **User Behavior Analysis:**\n   • Tracks submission frequency\n   • Monitors complaint patterns\n   • Analyzes credibility score history\n\n📋 **Review Process:**\n• Flagged complaints go to admin queue\n• Manual verification when needed\n• User notified of review status\n• Appeal process available\n\n⚖️ **Consequences:**\n• Credibility score reduction for fraud\n• Account restrictions for repeat offenders\n• Education about proper usage\n• Positive reinforcement for genuine complaints",
      quickReplies: ["Citizen credibility", "How AI works", "Appeal process"],
    },
    {
      intent: "voice_complaint",
      keywords: [
        "voice",
        "speak",
        "audio",
        "verbal",
        "talk",
        "record",
        "microphone",
        "speech",
        "say",
        "tell",
        "oral",
      ],
      response:
        "🎤 **Voice-Based Complaint Registration:**\n\n🌍 **Supported Languages:**\n• English\n• Hindi (हिन्दी)\n• Marathi (मराठी)\n\n🎙️ **How It Works:**\n1. Click the microphone icon in complaint form\n2. Select preferred language\n3. Speak clearly about your issue\n4. System converts speech to text in real-time\n5. Review and edit transcribed text\n6. Submit your complaint\n\n✅ **Best Practices:**\n• Speak slowly and clearly\n• Include location details\n• Describe the issue chronologically\n• Avoid background noise when possible\n• Keep recordings under 2 minutes for optimal accuracy\n\n🔧 **Technical Details:**\n• Speech-to-text accuracy: ~90%\n• Automatic language detection\n• Punctuation and formatting added\n• Text can be edited before submission",
      quickReplies: [
        "Languages supported",
        "File complaint",
        "Speech accuracy",
      ],
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
        "translation",
        "lang",
        "বাংলা",
        "తెలుగు",
      ],
      response:
        "🌐 **Multi-Language Support Details:**\n\n📱 **Interface Languages:**\n• English (Default)\n• Hindi (हिन्दी)\n• Marathi (मराठी)\n\n🎤 **Voice Support:**\n• English (US/UK/Indian accent)\n• Hindi (Standard)\n• Marathi (Standard)\n\n📝 **Features:**\n• Automatic UI translation\n• Language toggle on dashboard\n• Complaint forms in all supported languages\n• Notifications in preferred language\n• Admin interfaces available in multiple languages\n\n🔄 **Translation Process:**\n• Machine translation with human verification\n• Maintains context and technical terms\n• Preserves complaint details across languages\n\n🌍 **Future Additions:**\n• Tamil, Telugu, Bengali coming soon\n• Regional language support expanding",
      quickReplies: [
        "Voice complaint",
        "File complaint",
        "How to switch language",
      ],
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
        "check",
        "view",
        "monitor",
        "timeline",
        "current status",
        "resolution status",
      ],
      response:
        "🔍 **Real-Time Complaint Tracking:**\n\n📊 **How to Track:**\n1. Login to your citizen dashboard\n2. Navigate to 'My Complaints'\n3. View all your complaints with:\n   • **Complaint ID** (unique identifier)\n   • **Status** (Pending/In Progress/Resolved/Rejected)\n   • **Assigned Department**\n   • **Priority Level**\n   • **Submission Date**\n   • **Expected Resolution Date**\n\n📱 **Tracking Features:**\n• **Detailed View:** Click any complaint for full history\n• **Timeline:** See all updates chronologically\n• **Department Notes:** View officer comments\n• **Resolution Details:** See how issue was resolved\n• **Feedback Option:** Rate resolution quality\n\n📧 **Notifications:**\n• Real-time SMS alerts\n• Email notifications\n• In-app notifications\n• Status change alerts\n\n⏱️ **Resolution Timelines:**\n• High Priority: 24-48 hours\n• Medium Priority: 3-5 days\n• Low Priority: 7-10 days",
      quickReleases: [
        "Real-time tracking",
        "Notifications",
        "Resolution time",
        "Feedback",
      ],
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
        "view",
        "interface",
        "panel",
        "different users",
      ],
      response:
        "📊 **Three Specialized Dashboards:**\n\n👤 **Citizen Dashboard:**\n• Submit new complaints\n• Track existing complaints\n• View credibility score\n• Update profile information\n• See complaint history\n• Provide feedback\n• Download complaint reports\n\n🏢 **Department Head Dashboard:**\n• View assigned complaints\n• Filter by priority/status\n• Update complaint status\n• Assign to team members\n• Add resolution notes\n• View department analytics\n• Generate department reports\n\n👑 **Admin Dashboard:**\n• Monitor system-wide analytics\n• User management\n• Department management\n• Review flagged complaints\n• AI model performance metrics\n• System health monitoring\n• Generate comprehensive reports\n• Manage user permissions\n\n📈 **Analytics Available:**\n• Resolution rates\n• Average response time\n• Department performance\n• User satisfaction scores\n• Peak complaint times\n• Common complaint categories",
      quickReplies: [
        "Citizen credibility",
        "Admin features",
        "Analytics",
        "Reports",
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
        "architecture",
        "built with",
        "software",
        "development",
      ],
      response:
        "💻 **Complete Technology Stack:**\n\n🎨 **Frontend:**\n• React.js 18+ with Hooks\n• Tailwind CSS for styling\n• Responsive design\n• Real-time updates with WebSockets\n• Progressive Web App (PWA) support\n\n⚙️ **Backend:**\n• Django REST Framework (Python 3.10+)\n• JWT authentication\n• RESTful APIs\n• WebSocket for real-time notifications\n• Celery for background tasks\n\n🗄️ **Database:**\n• PostgreSQL for main data\n• Redis for caching and real-time features\n• Elasticsearch for search functionality\n\n🤖 **AI/ML:**\n• Custom NLP models for classification\n• Scikit-learn for ML algorithms\n• Transformers for advanced NLP\n• TensorFlow for deep learning\n\n☁️ **Infrastructure:**\n• Docker containerization\n• Nginx web server\n• AWS/GCP cloud hosting\n• CI/CD with GitHub Actions\n\n🔒 **Security:**\n• HTTPS encryption\n• SQL injection prevention\n• XSS protection\n• Rate limiting\n• Input validation\n• Regular security audits",
      quickReplies: ["AI features", "Security", "Deployment", "APIs"],
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
        "allocation",
        "distribution",
        "workflow",
        "assignment",
      ],
      response:
        "🔄 **Intelligent Complaint Routing System:**\n\n🎯 **Routing Process:**\n1. **AI Analysis:**\n   • Scans complaint text for keywords\n   • Analyzes location information\n   • Identifies issue category\n\n2. **Department Identification:**\n   • **Water Department:** Water supply, drainage issues\n   • **Electricity Department:** Power outages, transformers\n   • **Roads Department:** Potholes, road conditions\n   • **Sanitation Department:** Garbage collection, cleanliness\n   • **Municipal Corporation:** Property tax, building issues\n   • **Police Department:** Safety concerns, crime reporting\n\n3. **Priority Assignment:**\n   • High: Safety hazards, emergencies\n   • Medium: Service disruptions\n   • Low: Routine issues\n\n4. **Automatic Forwarding:**\n   • Direct to department head\n   • Automatic assignment to appropriate team\n   • Cross-department routing for complex issues\n\n🔄 **Manual Override:**\n• Department heads can reassign\n• Admin can correct misrouting\n• Feedback loop improves AI accuracy\n\n📊 **Routing Analytics:**\n• Track routing accuracy\n• Identify common misrouting patterns\n• Continuous AI improvement",
      quickReplies: [
        "AI features",
        "Workflow",
        "Departments list",
        "Priority system",
      ],
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
        "points",
        "ranking",
        "trust score",
        "reliability",
      ],
      response:
        "⭐ **Citizen Credibility Scoring System:**\n\n📊 **How It Works:**\nEvery registered citizen gets a credibility score (0-100) based on:\n\n✅ **Positive Factors (+points):**\n• Genuine complaints (verified resolved) +5\n• Timely updates and responses +3\n• Constructive feedback +2\n• High-resolution uploads +1\n• Consistent location accuracy +2\n\n❌ **Negative Factors (-points):**\n• False complaints detected -10\n• Spam submissions -5\n• Duplicate complaints -3\n• Inappropriate content -4\n• Frequent withdrawals -2\n\n🎯 **Score Benefits:**\n• **90+ (Trusted):** Priority processing, faster response\n• **70-89 (Reliable):** Standard processing\n• **50-69 (Average):** Additional verification\n• **Below 50 (Caution):** Enhanced review required\n\n📈 **Improving Your Score:**\n• File genuine complaints only\n• Provide detailed, accurate information\n• Add supporting evidence (photos)\n• Respond to queries promptly\n• Give constructive feedback\n• Help others with similar issues\n\n🔄 **Score Reset:**\n• Resets after 6 months of positive behavior\n• Appeal available for disputed negative marks\n• Continuous improvement tracked",
      quickReplies: [
        "Fraud detection",
        "How to improve",
        "Score benefits",
        "Appeal process",
      ],
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
        "benefits",
        "why choose",
        "best features",
        "key features",
      ],
      response:
        "✨ **Unique Features & Advantages:**\n\n🎯 **What Sets Us Apart:**\n\n1. **AI-Powered Intelligence**\n   • Automatic classification with 85%+ accuracy\n   • Smart priority prediction\n   • Pattern recognition for fraud\n   • Sentiment analysis for urgent cases\n\n2. **Multi-Language Voice Support**\n   • 3 languages with speech-to-text\n   • Rural-friendly interface\n   • Accessibility for all citizens\n\n3. **Real-Time Everything**\n   • Live tracking updates\n   • Instant notifications\n   • Real-time analytics\n   • Live dashboard metrics\n\n4. **Smart Fraud Prevention**\n   • Duplicate detection\n   • Pattern analysis\n   • Credibility scoring\n   • Automated flagging\n\n5. **Cross-Department Integration**\n   • Seamless department handoff\n   • Inter-department suggestions\n   • Unified tracking\n   • Single point of truth\n\n6. **Citizen-Centric Design**\n   • Simplified interface\n   • Multiple submission methods\n   • Transparent tracking\n   • Feedback loops\n\n7. **Data-Driven Insights**\n   • Analytics for departments\n   • Performance metrics\n   • Trend analysis\n   • Predictive analytics\n\n8. **Scalable Architecture**\n   • Handles thousands of complaints\n   • Cloud-based deployment\n   • 99.9% uptime guarantee\n   • Mobile-responsive design",
      quickReplies: [
        "AI features",
        "Voice complaint",
        "Fraud detection",
        "Real-time tracking",
      ],
    },
    {
      intent: "who_can_use",
      keywords: [
        "who",
        "users",
        "eligible",
        "use",
        "citizen",
        "public",
        "access",
        "permission",
        "available to",
        "target audience",
      ],
      response:
        "👥 **System Accessibility & Users:**\n\n🎯 **Primary Users:**\n\n1. **Citizens (General Public)**\n   • Any Indian citizen with valid ID\n   • Free registration\n   • Access to all complaint features\n   • No limit on complaints\n   • Dashboard access\n   • Mobile and web access\n\n2. **Government Officials**\n   • Department heads\n   • Complaint officers\n   • Resolution teams\n   • Verified government email required\n   • Role-based access\n   • Training provided\n\n3. **Administrators**\n   • System administrators\n   • Super users\n   • IT support team\n   • Full system access\n   • Configuration rights\n   • User management\n\n📋 **Registration Requirements:**\n• Valid mobile number (OTP verification)\n• Email address\n• Government ID proof (for verification)\n• Address proof\n\n🏢 **Institutional Access:**\n• Government departments can request bulk accounts\n• NGOs can register as support organizations\n• Municipal corporations integrated access\n\n🌍 **Geographic Availability:**\n• Currently available nationwide\n• Rural and urban areas\n• Remote access capabilities",
      quickReplies: [
        "How to register?",
        "Registration process",
        "Documents needed",
      ],
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
        "alerts",
        "updates",
        "push notifications",
      ],
      response:
        "⚡ **Real-Time Tracking & Notifications:**\n\n📱 **Live Tracking Features:**\n\n1. **Status Updates:**\n   • Real-time status changes\n   • Live timeline view\n   • Department updates as they happen\n   • Resolution progress tracking\n\n2. **Notification System:**\n   • **SMS:** Instant alerts on status changes\n   • **Email:** Detailed updates with links\n   • **In-App:** Dashboard notifications\n   • **Push:** Mobile app notifications\n\n3. **Timeline Visualization:**\n   • Timestamp for each update\n   • Officer comments visible\n   • Department actions logged\n   • Resolution details recorded\n\n4. **What You Can Track:**\n   • Complaint received confirmation\n   • AI classification result\n   • Department assignment\n   • Priority determination\n   • Assigned officer details\n   • Investigation status\n   • Resolution completion\n   • Feedback request\n\n5. **Real-Time Analytics:**\n   • Estimated wait time\n   • Department response time\n   • Similar complaints status\n   • Resolution trends\n\n📊 **Update Frequency:**\n• Status changes: Instant\n• Timeline: Real-time\n• Analytics: Every 5 minutes\n• Reports: Daily summary",
      quickReplies: ["Track complaint", "Notifications", "Status updates"],
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
        "confidential",
        "gdpr",
        "data protection",
      ],
      response:
        "🔒 **Enterprise-Grade Security Measures:**\n\n🛡️ **Data Protection:**\n\n1. **Encryption:**\n   • AES-256 for data at rest\n   • TLS 1.3 for data in transit\n   • End-to-end encryption for sensitive data\n   • Encrypted backups\n\n2. **Authentication:**\n   • Two-Factor Authentication (2FA)\n   • Biometric login option\n   • JWT with short expiry\n   • Session management\n   • IP-based restrictions\n\n3. **Access Control:**\n   • Role-Based Access Control (RBAC)\n   • Principle of least privilege\n   • Audit logs for all actions\n   • Regular access reviews\n\n4. **Data Privacy:**\n   • GDPR compliant\n   • No third-party data sharing\n   • User consent management\n   • Data minimization practices\n   • Right to deletion\n\n5. **Infrastructure Security:**\n   • Regular penetration testing\n   • DDoS protection\n   • Web Application Firewall (WAF)\n   • Automated threat detection\n   • 24/7 monitoring\n\n6. **Compliance:**\n   • Indian IT Act compliance\n   • ISO 27001 certified\n   • Regular security audits\n   • Incident response plan\n   • Data breach notification process\n\n7. **User Controls:**\n   • Privacy settings dashboard\n   • Data export option\n   • Account deletion\n   • Notification preferences\n   • Login history view",
      quickReplies: [
        "Privacy policy",
        "Data storage",
        "2FA setup",
        "Breach protocol",
      ],
    },
    {
      intent: "resolution_time",
      keywords: [
        "resolution time",
        "how long",
        "time taken",
        "duration",
        "waiting period",
        "processing time",
        "expected time",
        "timeline",
        "when resolved",
      ],
      response:
        "⏱️ **Complaint Resolution Timelines:**\n\n📅 **Priority-Based Timelines:**\n\n🔴 **High Priority (Critical Issues):**\n• Response time: < 2 hours\n• Resolution target: 24-48 hours\n• Examples: Safety hazards, accidents, health emergencies\n\n🟡 **Medium Priority (Service Disruptions):**\n• Response time: < 24 hours\n• Resolution target: 3-5 days\n• Examples: Water supply issues, power outages, garbage pile-up\n\n🟢 **Low Priority (Routine Issues):**\n• Response time: < 48 hours\n• Resolution target: 7-10 days\n• Examples: Streetlight issues, road maintenance, general inquiries\n\n📊 **Factors Affecting Timeline:**\n• Department workload\n• Complexity of issue\n• Availability of resources\n• Weather conditions\n• Required approvals\n• Public holidays\n\n📈 **Average Resolution Times (System Data):**\n• Water Department: 2-3 days\n• Electricity Department: 1-2 days\n• Roads Department: 5-7 days\n• Sanitation: 1-2 days\n• Municipal: 7-10 days\n\n🎯 **Expedited Processing:**\n• Verified emergencies get priority\n• High credibility score users\n• Critical infrastructure issues\n• Public safety concerns\n\n⏰ **What If Delayed:**\n• Automatic escalation after timeline exceeded\n• Notification to department head\n• Option to escalate complaint\n• Regular status updates",
      quickReplies: [
        "Escalation process",
        "Track complaint",
        "Priority levels",
      ],
    },
    {
      intent: "escalation",
      keywords: [
        "escalate",
        "escalation",
        "complaint not resolved",
        "unsatisfied",
        "appeal",
        "higher authority",
        "supervisor",
        "complaint process",
      ],
      response:
        "📢 **Complaint Escalation Process:**\n\n🚀 **When to Escalate:**\n• Resolution exceeds timeline\n• Unsatisfactory resolution\n• No response from department\n• Wrongfully closed complaint\n• Critical issue not addressed\n\n📋 **Escalation Levels:**\n\n**Level 1: Department Review**\n• Request review from department head\n• Provide additional evidence\n• Timeline: 24-48 hours\n\n**Level 2: Department Supervisor**\n• Escalate to senior officer\n• Include all communication history\n• Timeline: 2-3 days\n\n**Level 3: Admin Intervention**\n• System admin review\n• Cross-department evaluation\n• Timeline: 3-5 days\n\n**Level 4: Ombudsman**\n• External review committee\n• Final authority decision\n• Timeline: 7-10 days\n\n📝 **How to Escalate:**\n1. Go to 'My Complaints'\n2. Select the complaint\n3. Click 'Escalate' button\n4. Select escalation reason\n5. Provide justification\n6. Submit for review\n\n✅ **Escalation Benefits:**\n• Priority review\n• Higher authority attention\n• Detailed investigation\n• Transparent process\n\n⚠️ **Note:**\n• False escalations affect credibility score\n• Maximum 3 escalations per complaint\n• Escalation decision is final",
      quickReplies: ["Resolution time", "Track complaint", "Credibility score"],
    },
    {
      intent: "mobile_app",
      keywords: [
        "mobile app",
        "app",
        "android",
        "ios",
        "smartphone",
        "download",
        "play store",
        "app store",
        "mobile version",
        "phone app",
      ],
      response:
        "📱 **Mobile Application Information:**\n\n📲 **Availability:**\n• **Android:** Google Play Store (Coming Soon)\n• **iOS:** Apple App Store (Coming Soon)\n• **PWA:** Available now via browser\n\n✨ **Mobile App Features:**\n• Push notifications\n• GPS-enabled location\n• Camera integration for photos\n• Voice complaint recording\n• Offline complaint drafting\n• Biometric login\n• Mobile-optimized interface\n\n📱 **Progressive Web App (Current):**\n• No download required\n• Works on any smartphone\n• App-like experience\n• Offline capabilities\n• Home screen installation\n\n🚀 **App Benefits:**\n• Faster complaint submission\n• Real-time location tagging\n• Photo/video upload\n• Voice input support\n• Quick status checks\n• Notification center\n\n📋 **Mobile-Specific Features:**\n• One-tap complaint filing\n• Location-based department suggestion\n• Photo evidence capture\n• Offline complaint saving\n• Battery optimization\n• Data-saving mode\n\n🔜 **Upcoming:**\n• Dark mode\n• Widget support\n• Voice assistant integration\n• AR for location marking",
      quickReplies: ["PWA setup", "Features", "Download instructions"],
    },
    {
      intent: "feedback",
      keywords: [
        "feedback",
        "satisfaction",
        "rate",
        "rating",
        "review",
        "suggestions",
        "improvement",
        "comments",
        "experience",
      ],
      response:
        "⭐ **Feedback & Satisfaction System:**\n\n📊 **Providing Feedback:**\n\n1. **After Resolution:**\n   • Rate resolution (1-5 stars)\n   • Leave detailed comments\n   • Suggest improvements\n   • Rate officer interaction\n\n2. **In-App Feedback:**\n   • Go to 'My Complaints'\n   • Select resolved complaint\n   • Click 'Provide Feedback'\n   • Fill satisfaction survey\n\n🎯 **What We Ask:**\n• Was issue resolved?\n• Timeliness of response\n• Officer professionalism\n• Resolution quality\n• Overall satisfaction\n\n📈 **How Feedback Helps:**\n• Improves system algorithms\n• Identifies training needs\n• Enhances service quality\n• Recognizes good performers\n• Guides policy changes\n\n🏆 **Feedback Benefits:**\n• +5 credibility points\n• Priority for future complaints\n• Recognition badges\n• Invitation to user groups\n\n💡 **Suggestion Box:**\n• System improvement ideas\n• Feature requests\n• Accessibility feedback\n• Language improvements\n\n📊 **Public Ratings:**\n• Department performance metrics\n• Officer ratings\n• System satisfaction scores\n• Transparent reporting",
      quickReplies: [
        "Credibility score",
        "System improvements",
        "Feature requests",
      ],
    },
  ];

  // Enhanced intent matching with fuzzy matching and context awareness
  const findIntent = (input) => {
    const lowerInput = input.toLowerCase();

    // Remove common stop words for better matching
    const stopWords = [
      "a",
      "an",
      "the",
      "is",
      "are",
      "was",
      "were",
      "am",
      "be",
      "been",
    ];
    const processedInput = lowerInput
      .split(" ")
      .filter((word) => !stopWords.includes(word) && word.length > 2)
      .join(" ");

    let bestMatch = null;
    let highestScore = 0;

    for (const intent of intentDataset) {
      let score = 0;

      for (const keyword of intent.keywords) {
        if (lowerInput.includes(keyword.toLowerCase())) {
          // Exact keyword match
          score += 3;
        } else if (processedInput.includes(keyword.toLowerCase())) {
          // Partial match after stop word removal
          score += 1;
        }
      }

      // Check for intent-specific patterns
      if (
        intent.intent === "file_complaint" &&
        (lowerInput.includes("how") ||
          lowerInput.includes("way") ||
          lowerInput.includes("method"))
      ) {
        score += 2;
      }

      if (
        intent.intent === "track_complaint" &&
        (lowerInput.includes("where") || lowerInput.includes("status"))
      ) {
        score += 2;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent;
      }
    }

    return bestMatch;
  };

  // Enhanced response with personalization
  const generatePersonalizedResponse = (intent, userInput) => {
    if (!intent) {
      return {
        text: "I understand you're asking about something related to the Smart Grievance System. Could you please rephrase your question? I can help with:\n\n• Complaint filing and tracking\n• AI features and how they work\n• System capabilities and benefits\n• Department information\n• Voice and language support\n\nWhat specific information are you looking for? 😊",
        quickReplies: [
          "What is Smart Grievance?",
          "How to file?",
          "Track complaint",
          "AI features",
        ],
      };
    }

    // Add personalization based on user input
    let personalizedResponse = intent.response;

    // Add contextual tips based on intent
    if (
      intent.intent === "file_complaint" &&
      (userInput.includes("image") ||
        userInput.includes("photo") ||
        userInput.includes("picture"))
    ) {
      personalizedResponse +=
        "\n\n📸 **Photo Tip:** When uploading images, ensure they clearly show the issue. Good lighting and multiple angles help authorities understand the problem better!";
    }

    if (
      intent.intent === "track_complaint" &&
      (userInput.includes("delay") ||
        userInput.includes("late") ||
        userInput.includes("waiting"))
    ) {
      personalizedResponse +=
        "\n\n⏰ **If Delayed:** If your complaint exceeds the expected timeline, you can use the escalation feature to request priority review.";
    }

    if (
      intent.intent === "ai_work" &&
      (userInput.includes("accuracy") || userInput.includes("reliable"))
    ) {
      personalizedResponse +=
        "\n\n📊 **Accuracy Note:** Our AI models are continuously trained on real complaint data, achieving 85-90% accuracy in department classification. We're constantly improving!";
    }

    if (
      intent.intent === "languages" &&
      (userInput.includes("add") ||
        userInput.includes("more") ||
        userInput.includes("other"))
    ) {
      personalizedResponse +=
        "\n\n🌍 **Coming Soon:** We're actively working to add Tamil, Telugu, Bengali, and Kannada support in the next release!";
    }

    if (
      intent.intent === "credibility" &&
      (userInput.includes("improve") ||
        userInput.includes("increase") ||
        userInput.includes("boost"))
    ) {
      personalizedResponse +=
        "\n\n💡 **Quick Tip:** The fastest way to boost your score is to file genuine complaints with detailed descriptions and supporting photos. Each resolved genuine complaint adds up to 5 points!";
    }

    return {
      text: personalizedResponse,
      quickReplies: intent.quickReplies,
    };
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
      const { text: botResponse, quickReplies } = generatePersonalizedResponse(
        matchedIntent,
        messageText,
      );

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
                  "Resolution time",
                  "Mobile app",
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
