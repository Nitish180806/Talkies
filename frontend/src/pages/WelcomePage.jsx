import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import {
  FiCheck,
  FiServer,
  FiCode,
  FiZap,
  FiClock,
  FiArrowRight,
  FiHeart,
  FiEye,
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiGithub,
  FiStar,
  FiUsers,
  FiMessageSquare,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import { LuMessageCircleMore } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";
import {
  MdOutlineKeyboardVoice,
  MdOutlineManageAccounts,
  MdOutlineEdit,
  MdOutlineSpeed,
} from "react-icons/md";
import { TiMessageTyping } from "react-icons/ti";
import { BsPinAngle } from "react-icons/bs";
import { RiEmojiStickerLine } from "react-icons/ri";

// ─── Tech Stack Item ─────────────────────────────────────────────
const TechStackItem = ({ name, purpose, color }) => (
  <div className="group bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-100 hover:border-[#21C4D3]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#21C4D3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative flex items-center gap-3 mb-2">
      <div
        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 group-hover:scale-150 transition-all duration-300 shadow-lg"
        style={{ backgroundColor: color }}
      ></div>
      <h4 className="font-bold text-sm sm:text-base text-gray-800 group-hover:text-[#189AA7] transition-colors flex-1 leading-snug">
        {name}
      </h4>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed relative pl-6 sm:pl-7">
      {purpose}
    </p>
  </div>
);

// ─── Feature Card ─────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <div
    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent overflow-hidden hover:-translate-y-1 sm:hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 50%, transparent 100%)`,
      }}
    ></div>
    <div className="relative flex items-start gap-3 sm:gap-4">
      <div
        className="p-2.5 sm:p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={22} style={{ color }} className="sm:w-7 sm:h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1.5 sm:mb-2 group-hover:text-[#189AA7] transition-colors duration-300 leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
    <div
      className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 group-hover:w-full transition-all duration-700 ease-out"
      style={{ backgroundColor: color }}
    ></div>
  </div>
);

// ─── Main WelcomePage ─────────────────────────────────────────────
const WelcomePage = () => {
  const [activeSection, setActiveSection] = useState("features");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/signup";
  };

  const tabs = [
    { key: "features", label: "✨ Features" },
    { key: "tech", label: "⚙️ Tech Stack" },
    { key: "api", label: "🔌 API" },
    { key: "security", label: "🔒 Security" },
    { key: "socket", label: "⚡ Socket.IO" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* ── HERO ── */}
      <div className="min-h-[480px] sm:min-h-[540px] md:min-h-[580px] relative overflow-hidden bg-gradient-to-br from-[#21C4D3] via-[#189AA7] to-[#157A85]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-28 sm:pb-36">
          {/* Logo */}
          <div className="flex justify-center mb-5 sm:mb-6 animate-fadeIn">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
              <img
                src={logo}
                alt=""
                className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-2xl ring-4 ring-white/30"
              />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight animate-fadeIn">
              <span className="text-white drop-shadow-lg">Welcome to</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                Talkies
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-white/90 font-light max-w-3xl mx-auto animate-fadeIn px-2">
              A Chatting App to make your connections good
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center animate-fadeIn px-4 sm:px-0">
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-[#189AA7] px-7 sm:px-10 py-3.5 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 w-full xs:w-auto max-w-xs"
              >
                <span className="relative">Get Started</span>
                <FiArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={() => (window.location.href = "/login")}
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-transparent text-white px-7 sm:px-10 py-3.5 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 overflow-hidden border-white border-2 w-full xs:w-auto max-w-xs"
              >
                <span className="relative">Login</span>
                <FiArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* ── PROJECT OVERVIEW ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-6 sm:pb-8 -mt-1">
        <div className="bg-gradient-to-br from-[#21C4D3]/10 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-[#21C4D3]/20">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <img
              src={logo}
              alt="Talkies Logo"
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex-shrink-0 shadow-md"
            />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#189AA7] mb-2 sm:mb-3">
                What are Talkies?
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                <strong className="text-[#189AA7]">Talkies</strong> is a modern
                Full-stack real-time chat application built using{" "}
                <strong>MERN Stack</strong> (MongoDB, Express, React, Node.js)
                and <strong>Socket.IO</strong>. It includes instant messaging,
                voice notes, image sharing, WhatsApp-style 24-hour statuses,
                read receipts, pinned chats, emoji picker, unread badges, and
                live typing indicators — for a fast, seamless, and interactive
                communication experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-30 bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={`px-3 sm:px-5 py-3.5 sm:py-4 font-semibold whitespace-nowrap transition-all text-xs sm:text-sm flex-shrink-0 ${
                  activeSection === tab.key
                    ? "text-[#21C4D3] border-b-4 border-[#21C4D3]"
                    : "text-gray-600 hover:text-[#21C4D3] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* FEATURES */}
        {activeSection === "features" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
            <FeatureCard
              icon={LuMessageCircleMore}
              title="Real-time Messaging"
              description="Messages update instantly through Socket.IO without requiring a refresh. Typing indicators and read receipts work in real time."
              color="#21C4D3"
              delay={0}
            />
            <FeatureCard
              icon={GoFileMedia}
              title="Media Sharing"
              description="Images are uploaded to Cloudinary with a full-screen preview modal. You can click on any image to zoom in and view it."
              color="#189AA7"
              delay={100}
            />
            <FeatureCard
              icon={MdOutlineKeyboardVoice}
              title="Voice Messages"
              description="Send clear voice messages in WebM format using the built-in recorder."
              color="#FF6B6B"
              delay={200}
            />
            <FeatureCard
              icon={MdOutlineManageAccounts}
              title="Contact Management"
              description="Add, delete, and search contacts easily. Contacts in the sidebar are automatically sorted based on the latest activity."
              color="#4ECDC4"
              delay={300}
            />
            <FeatureCard
              icon={FiCheck}
              title="Online Status"
              description="Real-time online/offline indicators are powered by Socket.IO events — visible on each contact and in the chat header."
              color="#95E1D3"
              delay={400}
            />
            <FeatureCard
              icon={MdOutlineEdit}
              title="Profile Editing"
              description="Profile picture, about, and name update instantly across all devices through socket synchronization."
              color="#F38181"
              delay={500}
            />
            <FeatureCard
              icon={FiClock}
              title="Smart Timestamps"
              description='Clean AM/PM timestamps appear on every message. In the sidebar, "Today", "Yesterday" or "Date" changes automatically.'
              color="#AA96DA"
              delay={600}
            />
            <FeatureCard
              icon={TiMessageTyping}
              title="Typing Indicators"
              description="A smooth 3-dot bouncing animation appear for message and a red pulsing dot appear for a voice message."
              color="#F38189"
              delay={700}
            />
            <FeatureCard
              icon={FiHeart}
              title="Read Receipts"
              description="Heart icons — an outlined heart means delivered, and a filled heart means the receiver has seen the message."
              color="#E91E63"
              delay={800}
            />
            <FeatureCard
              icon={BsPinAngle}
              title="Pin Chats"
              description="Right-click to pin or unpin any contact. Pinned chats always stay at the top of the sidebar."
              color="#FF9800"
              delay={900}
            />
            <FeatureCard
              icon={FiZap}
              title="WhatsApp-Style Statuses"
              description="Post 24-hour photo/caption statuses. They automatically delete after 24 hours."
              color="#4CAF50"
              delay={1000}
            />
            <FeatureCard
              icon={RiEmojiStickerLine}
              title="Emoji Picker"
              description="A built-in emoji picker is available in the chat input. Click to browse and insert emojis."
              color="#FFC107"
              delay={1100}
            />
            <FeatureCard
              icon={FiBell}
              title="Unread Message Badge"
              description="A live unread message count badge appears on each contact. It automatically clears when the conversation is opened."
              color="#F44336"
              delay={1200}
            />
            <FeatureCard
              icon={FiEye}
              title="Status Viewers & Likes"
              description="Status owners can see in real time who viewed and liked their status. A full viewers list is available with profile pictures."
              color="#9C27B0"
              delay={1300}
            />
          </div>
        )}

        {/* TECH STACK */}
        {activeSection === "tech" && (
          <div className="space-y-8 sm:space-y-10 animate-fadeIn">
            {/* Backend */}
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#21C4D3] to-[#189AA7] rounded-xl shadow-lg">
                  <FiServer size={22} className="text-white sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#189AA7] to-[#21C4D3] bg-clip-text text-transparent">
                  Backend Technologies
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <TechStackItem
                  name="Node.js + Express.js"
                  purpose="Builds REST APIs and handles backend logic."
                  color="#68A063"
                />
                <TechStackItem
                  name="MongoDB + Mongoose"
                  purpose="A flexible NoSQL database."
                  color="#47A248"
                />
                <TechStackItem
                  name="Socket.io"
                  purpose="Real-time bidirectional communication — messages, statuses, typing indicators, and read receipts."
                  color="#000"
                />
                <TechStackItem
                  name="JWT"
                  purpose="Secure user authentication with 7-day token validity."
                  color="#FB015B"
                />
                <TechStackItem
                  name="Bcrypt.js"
                  purpose="Safely hashes user passwords with salt rounds."
                  color="#338033"
                />
                <TechStackItem
                  name="Cloudinary"
                  purpose="Media storage and optimization for images and voice messages."
                  color="#3448C5"
                />
                <TechStackItem
                  name="Multer"
                  purpose="File uploads with a 10MB size limit and image/audio filtering."
                  color="#FF6B00"
                />
                <TechStackItem
                  name="Cookie-parser"
                  purpose="Parses JWT cookies for authentication."
                  color="#C73866"
                />
              </div>
            </div>

            {/* Frontend */}
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#189AA7] to-[#21C4D3] rounded-xl shadow-lg">
                  <FiCode size={22} className="text-white sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#21C4D3] to-[#189AA7] bg-clip-text text-transparent">
                  Frontend Technologies
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <TechStackItem
                  name="React 18"
                  purpose="Modern component-based UI with hooks."
                  color="#61DAFB"
                />
                <TechStackItem
                  name="Redux Toolkit"
                  purpose="Global state management — UserSlice, MessageSlice, and StatusSlice."
                  color="#764ABC"
                />
                <TechStackItem
                  name="React Router"
                  purpose="Navigation and routing with protected and public routes."
                  color="#CA4245"
                />
                <TechStackItem
                  name="Axios"
                  purpose="API calls with credentials and consistent error handling."
                  color="#5A29E4"
                />
                <TechStackItem
                  name="Socket.io Client"
                  purpose="Real-time events — messages, statuses, and user presence."
                  color="#000"
                />
                <TechStackItem
                  name="Tailwind CSS"
                  purpose="Utility-first modern responsive styling."
                  color="#06B6D4"
                />
                <TechStackItem
                  name="React Icons"
                  purpose="Icon support across all components."
                  color="#E91E63"
                />
                <TechStackItem
                  name="Emoji Picker React"
                  purpose="In-chat emoji picker."
                  color="#FFD700"
                />
              </div>
            </div>
          </div>
        )}

        {/* API */}
        {activeSection === "api" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#21C4D3] mb-2">
                REST API Endpoints
              </h2>
              <p className="text-gray-500 text-sm sm:text-base px-2">
                Complete endpoints for authentication, messaging, statuses, and
                user management.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="space-y-6">
                {[
                  {
                    title: "Auth Routes",
                    routes: [
                      {
                        method: "POST",
                        path: "/api/auth/signup",
                        desc: "New user registration.",
                      },
                      {
                        method: "POST",
                        path: "/api/auth/login",
                        desc: "User login",
                      },
                      {
                        method: "GET",
                        path: "/api/auth/logout",
                        desc: "Logout and cookie clear",
                      },
                    ],
                  },
                  {
                    title: "User Routes",
                    routes: [
                      {
                        method: "GET",
                        path: "/api/user/current",
                        desc: "Current logged-in user fetch",
                      },
                      {
                        method: "PUT",
                        path: "/api/user/profile",
                        desc: "Name, about, aur profile image update",
                      },
                      {
                        method: "GET",
                        path: "/api/user/others",
                        desc: "All other users.",
                      },
                      {
                        method: "GET",
                        path: "/api/user/:id",
                        desc: "Single user profile by ID",
                      },
                    ],
                  },
                  {
                    title: "Message Routes",
                    routes: [
                      {
                        method: "POST",
                        path: "/api/message/send/:receiver",
                        desc: "Text, image and voice message send",
                      },
                      {
                        method: "GET",
                        path: "/api/message/get/:receiver",
                        desc: "Complete message history with a user.",
                      },
                      {
                        method: "PUT",
                        path: "/api/message/read/:senderId",
                        desc: "Mark all unread messages as read.",
                      },
                    ],
                  },
                  {
                    title: "Conversation Routes",
                    routes: [
                      {
                        method: "GET",
                        path: "/api/conversation",
                        desc: "All conversations with the last message and timestamp.",
                      },
                    ],
                  },
                  {
                    title: "Contact Routes",
                    routes: [
                      {
                        method: "POST",
                        path: "/api/newcontact/create",
                        desc: "New contact create and add",
                      },
                      {
                        method: "DELETE",
                        path: "/api/newcontact/:id",
                        desc: "Delete contact",
                      },
                    ],
                  },
                  {
                    title: "Status Routes",
                    routes: [
                      {
                        method: "POST",
                        path: "/api/status/create",
                        desc: "New 24-hour status with image and caption.",
                      },
                      {
                        method: "GET",
                        path: "/api/status/my",
                        desc: "Active statuses of the current user.",
                      },
                      {
                        method: "GET",
                        path: "/api/status/all",
                        desc: "Statuses of all other users, grouped together.",
                      },
                      {
                        method: "GET",
                        path: "/api/status/:statusId",
                        desc: "Single status with viewers and likes.",
                      },
                      {
                        method: "POST",
                        path: "/api/status/:statusId/view",
                        desc: "Mark status as viewed.",
                      },
                      {
                        method: "POST",
                        path: "/api/status/:statusId/like",
                        desc: "Toggle status like/unlike.",
                      },
                      {
                        method: "DELETE",
                        path: "/api/status/:statusId",
                        desc: "Delete your status.",
                      },
                    ],
                  },
                ].map((group, gi) => (
                  <div key={gi}>
                    <h3 className="text-base sm:text-lg font-semibold text-[#189AA7] mb-2 sm:mb-3">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.routes.map((r, ri) => (
                        <div
                          key={ri}
                          className="flex flex-col xs:flex-row xs:items-center gap-1.5 xs:gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-[#f0fdff] transition-colors"
                        >
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded self-start flex-shrink-0 ${
                              r.method === "GET"
                                ? "bg-blue-100 text-blue-600"
                                : r.method === "POST"
                                  ? "bg-green-100 text-green-600"
                                  : r.method === "PUT"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                          >
                            {r.method}
                          </span>
                          <code className="text-xs sm:text-sm text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded break-all">
                            {r.path}
                          </code>
                          <span className="text-xs sm:text-sm text-gray-500 xs:flex-1">
                            {r.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeSection === "security" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#21C4D3] mb-2">
                Security Features
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Talkies mein implement ki gayi security layers
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    icon: "🛡️",
                    title: "Password Hashing",
                    desc: "Bcrypt encryption with salt rounds on every signup and contact creation.",
                  },
                  {
                    icon: "🔑",
                    title: "JWT Auth",
                    desc: "7-day token stored in an HttpOnly cookie, with the secure flag enabled in production.",
                  },
                  {
                    icon: "🍪",
                    title: "HTTP-only Cookies",
                    desc: "XSS protection — JavaScript in the browser cannot access the token cookie.",
                  },
                  {
                    icon: "🚪",
                    title: "Protected Routes",
                    desc: "IsAuth middleware is enforced on all private API endpoints.",
                  },
                  {
                    icon: "✅",
                    title: "Input Validation",
                    desc: "Email format regex and minimum password length checks on signup and login.",
                  },
                  {
                    icon: "🌐",
                    title: "CORS Protection",
                    desc: "Only whitelisted origins are allowed with credentials — unknown domains are blocked.",
                  },
                  {
                    icon: "🕵️",
                    title: "Generic Login Errors",
                    desc: 'Prevents user enumeration attacks by showing the same "Invalid email or password" message in both cases.',
                  },
                  {
                    icon: "📁",
                    title: "File Size Limit",
                    desc: "Multer enforces a 10MB maximum upload size, allowing only image and audio files.",
                  },
                  {
                    icon: "🔒",
                    title: "Flexible Token Verification",
                    desc: "IsAuth middleware accepts both HttpOnly cookies and the Authorization header.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-[#f0fdff] transition-colors"
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SOCKET */}
        {activeSection === "socket" && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 animate-fadeIn">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#21C4D3] mb-6 text-center">
              Socket.IO Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Client → Server */}
              <div className="border border-[#21C4D3] rounded-xl p-4 sm:p-5">
                <h3 className="font-semibold text-[#189AA7] mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#21C4D3]/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    📤
                  </span>
                  Client → Server
                </h3>
                <ul className="space-y-2.5 sm:space-y-3 text-sm text-gray-700">
                  {[
                    {
                      event: "typing",
                      desc: "Send typing status to the receiver",
                    },
                    {
                      event: "voiceRecording",
                      desc: "Send voice recording status to the receiver",
                    },
                    { event: "logout", desc: "Notify the server about logout" },
                    {
                      event: "disconnect",
                      desc: "Auto-fire on connection close",
                    },
                    {
                      event: "statusViewed",
                      desc: "Notify the status owner that it was viewed",
                    },
                    {
                      event: "statusLiked",
                      desc: "Notify the status owner about like/unlike",
                    },
                    {
                      event: "statusDeleted",
                      desc: "Broadcast deletion to all users",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <code className="bg-[#21C4D3]/10 text-[#189AA7] px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono flex-shrink-0 mt-0.5">
                        {item.event}
                      </code>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Server → Client */}
              <div className="border border-[#189AA7] rounded-xl p-4 sm:p-5">
                <h3 className="font-semibold text-[#189AA7] mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#189AA7]/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    📥
                  </span>
                  Server → Client
                </h3>
                <ul className="space-y-2.5 sm:space-y-3 text-sm text-gray-700">
                  {[
                    {
                      event: "newMessage",
                      desc: "Delivered to both receiver and sender",
                    },
                    {
                      event: "getOnlineUsers",
                      desc: "Full online users list on connect/disconnect",
                    },
                    {
                      event: "userOnline",
                      desc: "Notify all clients when a user connects",
                    },
                    {
                      event: "userOffline",
                      desc: "Notify all clients when a user disconnects",
                    },
                    {
                      event: "typing",
                      desc: "Forward typing status to the target user",
                    },
                    {
                      event: "voiceRecording",
                      desc: "Show recording indicator to the target user",
                    },
                    {
                      event: "profileUpdated",
                      desc: "Broadcast profile changes to all users",
                    },
                    {
                      event: "messagesRead",
                      desc: "Notify sender when the receiver reads messages",
                    },
                    {
                      event: "newStatus",
                      desc: "Broadcast new status to all users",
                    },
                    {
                      event: "statusRemoved",
                      desc: "Broadcast status deletion to all users",
                    },
                    {
                      event: "statusViewUpdate",
                      desc: "Real-time view count update to the status owner",
                    },
                    {
                      event: "statusLikeUpdate",
                      desc: "Real-time like update to the status owner",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <code className="bg-[#189AA7]/10 text-[#189AA7] px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono flex-shrink-0 mt-0.5">
                        {item.event}
                      </code>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="bg-gray-900 text-gray-400 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Talkies logo"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            />
            <span className="font-semibold text-white text-sm sm:text-base">
              Talkies
            </span>
          </div>
          <p className="text-xs sm:text-sm px-4 text-center">
            A Real Time Chat Application Built Using MERN Stack + Socket.IO
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs mt-1 sm:mt-2">
            <span className="flex items-center gap-1">
              <FiShield size={11} /> JWT Auth
            </span>
            <span className="flex items-center gap-1">
              <FiZap size={11} /> Real-Time
            </span>
            <span className="flex items-center gap-1">
              <FiUsers size={11} /> Multi-User
            </span>
          </div>
          <p className="text-xs mt-1 sm:mt-2 text-gray-600">
            Built with ❤️ using MERN Stack
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }

        /* Hide scrollbar for tab bar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* xs breakpoint for very small phones */
        @media (min-width: 480px) {
          .xs\\:flex-row { flex-direction: row; }
          .xs\\:w-auto { width: auto; }
          .xs\\:items-center { align-items: center; }
          .xs\\:gap-2 { gap: 0.5rem; }
          .xs\\:gap-3 { gap: 0.75rem; }
          .xs\\:flex-1 { flex: 1 1 0%; }
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
