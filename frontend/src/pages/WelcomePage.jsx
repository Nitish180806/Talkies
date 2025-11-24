import React, { useState } from "react";
import logo from "../assets/logo.png";
import {
  FiMessageSquare,
  FiImage,
  FiMic,
  FiUsers,
  FiCheck,
  FiDatabase,
  FiServer,
  FiCode,
  FiLayers,
  FiZap,
  FiClock,
  FiEdit3,
  FiArrowRight,
  FiSmartphone,
  FiGlobe,
  FiShield,
} from "react-icons/fi";
import { LuMessageCircleMore } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { TiMessageTyping } from "react-icons/ti";

const WelcomePage = () => {
  const [activeSection, setActiveSection] = useState("features");

  const handleGetStarted = () => {
    // In your actual app, use React Router's useNavigate or Link
    window.location.href = "/signup";
  };

  const TechStackItem = ({ name, purpose, color }) => (
    <div className="group bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-gray-100 hover:border-[#21C4D3]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#21C4D3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-center gap-3 mb-2">
        <div
          className="w-4 h-4 rounded-full group-hover:scale-150 transition-all duration-300 shadow-lg"
          style={{ backgroundColor: color }}
        ></div>
        <h4 className="font-bold text-gray-800 group-hover:text-[#189AA7] transition-colors flex-1">
          {name}
        </h4>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed relative">
        {purpose}
      </p>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
    <div
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent overflow-hidden hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 50%, transparent 100%)`,
        }}
      ></div>

      <div
        className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}
      ></div>

      <div className="relative flex items-start gap-4">
        <div
          className="p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md relative overflow-hidden"
          style={{ backgroundColor: `${color}20` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Icon size={28} style={{ color }} className="relative z-10" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-[#189AA7] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out"
        style={{ backgroundColor: color }}
      ></div>

      <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute top-0 right-0 w-full h-full rounded-bl-full"
          style={{ backgroundColor: `${color}10` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero Section */}
      {/* Enhanced Hero Section */}
      <div className="min-h-[500px] relative overflow-hidden bg-gradient-to-br from-[#21C4D3] via-[#189AA7] to-[#157A85]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* App Logo */}
          <div
            className="flex justify-center mb-6 animate-fadeIn"
            style={{ animationDelay: "0.05s" }}
          >
            <img src={logo} alt="" className="w-20 h-20 rounded-full" />
          </div>

          <div className="text-center">
            {/* Main Heading */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-white drop-shadow-lg">Welcome to</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white relative">
                Talkies
                <div className="absolute -inset-1 bg-white/20 blur-2xl -z-10"></div>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl sm:text-2xl md:text-3xl mb-6 text-white/90 font-light max-w-3xl mx-auto animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              A Real Time Chat Application
            </p>

            <p
              className="text-base md:text-lg mb-12 text-white/70 max-w-2xl mx-auto animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              Experience seamless communication with voice messages, instant
              image sharing, live status updates, and lightning-fast
              synchronization
            </p>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center gap-3 bg-white text-[#189AA7] px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 overflow-hidden animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Get Started</span>
              <FiArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Project Overview Section - NEW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#189AA7] to-[#21C4D3] bg-clip-text text-transparent mb-4">
            Talkies
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#21C4D3] to-[#189AA7] mx-auto rounded-full"></div>
        </div>

        {/* Project Description */}
        <div className="space-y-8">
          {/* Main Description */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-[#189AA7] mb-4 flex items-center gap-3">
              <img
                src={logo}
                alt="Talkies Logo"
                className="w-10 h-10 font-bold rounded-full"
              />
              What is Talkies?
            </h3>

            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              <strong className="text-[#189AA7]">Talkies</strong> is a modern
              Full-stack real-time chat application built using{" "}
              <strong>MERN Stack</strong>
              (MongoDB, Express, React, and Node.js) along with{" "}
              <strong>Socket.IO</strong> .It provides advanced features such as
              instant messaging, voice notes, image sharing, and live typing
              indicators, offering a fast, seamless, and interactive
              communication experience.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {["features", "tech", "workflow", "api", "security", "socket"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${
                    activeSection === tab
                      ? "text-[#21C4D3] border-b-4 border-[#21C4D3]"
                      : "text-gray-600 hover:text-[#21C4D3] hover:bg-gray-50"
                  }`}
                >
                  {tab === "features" && "✨ Features"}
                  {tab === "tech" && "⚙️ Technology Used"}
                  {tab === "workflow" && "🔄 Workflow"}
                  {tab === "api" && "🔌 API Endpoints"}
                  {tab === "security" && "🔒 Security Features"}
                  {tab === "socket" && "⚡ Socket.IO"}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Features Section */}
        {activeSection === "features" && (
          <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
            <FeatureCard
              icon={LuMessageCircleMore}
              title="Real-time Messaging"
              description="Messages update instantly through Socket.IO without any refresh. Typing indicators and message receipts work seamlessly in real time."
              color="#21C4D3"
              delay={0}
            />
            <FeatureCard
              icon={GoFileMedia}
              title="Media Sharing"
              description="Images upload to Cloudinary with a full-screen preview modal and smooth zoom support."
              color="#189AA7"
              delay={100}
            />
            <FeatureCard
              icon={MdOutlineKeyboardVoice}
              title="Voice Messages"
              description="The built-in recorder lets you send clear voice messages in WebM audio format."
              color="#FF6B6B"
              delay={200}
            />
            <FeatureCard
              icon={MdOutlineManageAccounts}
              title="Contact Management"
              description="Add, delete, and search contacts effortlessly with an automatically sorted contact list."
              color="#4ECDC4"
              delay={300}
            />
            <FeatureCard
              icon={FiCheck}
              title="Online Status"
              description="Real-time online and offline indicators powered by Socket.IO events."
              color="#95E1D3"
              delay={400}
            />
            <FeatureCard
              icon={MdOutlineEdit}
              title="Profile Editing"
              description="Profile picture, about, and name update instantly across all devices through socket sync."
              color="#F38181"
              delay={500}
            />
            <FeatureCard
              icon={FiClock}
              title="Timestamps"
              description="Clean AM/PM timestamps with smart ‘yesterday’ detection."
              color="#AA96DA"
              delay={600}
            />
            <FeatureCard
              icon={TiMessageTyping}
              title="Typing Indicators"
              description="Smooth 3-dot typing animation and a red pulsing indicator for voice recording."
              color="#F38189"
              delay={700}
            />
          </div>
        )}

        {/* Technology  Section */}
        {activeSection === "tech" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-[#21C4D3] to-[#189AA7] rounded-xl shadow-lg">
                  <FiServer size={28} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#189AA7] to-[#21C4D3] bg-clip-text text-transparent">
                  Backend Technologies
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TechStackItem
                  name="Node.js + Express.js"
                  purpose="Builds REST APIs and backend logic."
                  color="#68A063"
                />
                <TechStackItem
                  name="MongoDB + Mongoose"
                  purpose="Provides a flexible NoSQL database with schema modeling."
                  color="#47A248"
                />
                <TechStackItem
                  name="Socket.io"
                  purpose="Enables real-time, bidirectional communication."
                  color="#000"
                />
                <TechStackItem
                  name="JWT"
                  purpose="Handles secure user authentication."
                  color="#FB015B"
                />
                <TechStackItem
                  name="Bcrypt.js"
                  purpose="Encrypts and safely hashes user passwords."
                  color="#338033"
                />
                <TechStackItem
                  name="Cloudinary"
                  purpose="Manages media uploads, storage, and optimization."
                  color="#3448C5"
                />
                <TechStackItem
                  name="Multer"
                  purpose="Processes and handles file uploads on the server."
                  color="#FF6B00"
                />
                <TechStackItem
                  name="Cookie-parser"
                  purpose="Parses and manages JWT cookies for authentication."
                  color="#C73866"
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-[#189AA7] to-[#21C4D3] rounded-xl shadow-lg">
                  <FiCode size={28} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#21C4D3] to-[#189AA7] bg-clip-text text-transparent">
                  Frontend Technologies
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TechStackItem
                  name="React 18"
                  purpose="Modern component-based UI."
                  color="#61DAFB"
                />
                <TechStackItem
                  name="Redux Toolkit"
                  purpose="Global state management."
                  color="#764ABC"
                />
                <TechStackItem
                  name="React Router"
                  purpose="Navigation & routing."
                  color="#CA4245"
                />
                <TechStackItem
                  name="Axios"
                  purpose="API calls with credentials."
                  color="#5A29E4"
                />
                <TechStackItem
                  name="Socket.io Client"
                  purpose="Real-time event handling."
                  color="#000"
                />
                <TechStackItem
                  name="Tailwind CSS"
                  purpose="Utility-first modern styling."
                  color="#06B6D4"
                />
                <TechStackItem
                  name="React Icons"
                  purpose="Icon support."
                  color="#E91E63"
                />
                <TechStackItem
                  name="Emoji Picker"
                  purpose="Emoji input support."
                  color="#FFD700"
                />
              </div>
            </div>
          </div>
        )}

        {/* WorkFlow Section */}
        {activeSection === "workflow" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#21C4D3] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Authentication Flow</h4>
                  <p className="text-sm">
                    User signup/login → JWT token generation → Cookie storage →
                    Protected routes access
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#21C4D3] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Real-time Communication</h4>
                  <p className="text-sm">
                    Socket.IO connection → User online/offline tracking →
                    Real-time message delivery → Typing indicators
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#21C4D3] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Message Sending Flow</h4>
                  <p className="text-sm">
                    User types/records → File upload (if any) → Cloudinary
                    processing → MongoDB save → Socket emit to receiver →
                    Real-time UI update
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#21C4D3] text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">State Management</h4>
                  <p className="text-sm">
                    Redux Toolkit → UserSlice (userData, otherUsers,
                    selectedUser, socket, onlineUsers) → MessageSlice (messages)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#21C4D3] text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold">File Upload System</h4>
                  <p className="text-sm">
                    Multer middleware → Temporary local storage → Cloudinary
                    upload → URL return → Temp file deletion
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Endpoints Section */}
        {activeSection === "api" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl mb-4 text-[#21C4D3]">
                Complete REST API endpoints for authentication, messaging, and
                user management
              </h2>
            </div>

            {/* API Endpoints */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#189AA7] mb-2">
                    Auth Routes
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        POST /api/auth/signup
                      </code>{" "}
                      - New user registration
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        POST /api/auth/login
                      </code>{" "}
                      - User login
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        GET /api/auth/logout
                      </code>{" "}
                      - User logout
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#189AA7] mb-2">
                    User Routes
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        GET /api/user/current
                      </code>{" "}
                      - Get current logged-in user
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        PUT /api/user/profile
                      </code>{" "}
                      - Update profile
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        GET /api/user/others
                      </code>{" "}
                      - Get all other users
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#189AA7] mb-2">
                    Message Routes
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        POST /api/message/send/:receiver
                      </code>{" "}
                      - Send message
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        GET /api/message/get/:receiver
                      </code>{" "}
                      - Get messages
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Features Section */}
        {activeSection === "security" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#21C4D3] mb-4">
                Security Features
              </h2>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: "🛡️",
                    title: "Password Hashing",
                    desc: "Bcrypt encryption",
                  },
                  {
                    icon: "🔑",
                    title: "JWT Auth",
                    desc: "7-day token validity",
                  },
                  {
                    icon: "🍪",
                    title: "HTTP-only Cookies",
                    desc: "XSS protection",
                  },
                  {
                    icon: "🚪",
                    title: "Protected Routes",
                    desc: "Middleware auth",
                  },
                  {
                    icon: "✅",
                    title: "Input Validation",
                    desc: "Email & password checks",
                  },
                  {
                    icon: "🌐",
                    title: "CORS Protection",
                    desc: "Allowed origins only",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Socket Events Section */}
        {activeSection === "socket" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#21C4D3] mb-6">
              Socket.IO Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#21C4D3] rounded-lg p-4">
                <h3 className="font-semibold text-[#189AA7] mb-2">
                  Client → Server
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>
                    • <code>typing</code> - User typing status
                  </li>
                  <li>
                    • <code>voiceRecording</code> - Voice recording status
                  </li>
                  <li>
                    • <code>logout</code> - User logout event
                  </li>
                  <li>
                    • <code>disconnect</code> - Connection close
                  </li>
                </ul>
              </div>

              <div className="border border-[#189AA7] rounded-lg p-4">
                <h3 className="font-semibold text-[#189AA7] mb-2">
                  Server → Client
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>
                    • <code>newMessage</code> - New message received
                  </li>
                  <li>
                    • <code>getOnlineUsers</code> - Online users list
                  </li>
                  <li>
                    • <code>userOnline</code> - User came online
                  </li>
                  <li>
                    • <code>userOffline</code> - User went offline
                  </li>
                  <li>
                    • <code>typing</code> - Typing indicator
                  </li>
                  <li>
                    • <code>voiceRecording</code> - Recording indicator
                  </li>
                  <li>
                    • <code>profileUpdated</code> - Profile update notification
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
          {/* Logo + Title */}
          <div className="flex items-center gap-1 text-sm">
            <img
              src={logo}
              alt="Talkies logo"
              className="w-4 rounded-full"
            />
            <span>Talkies - Real-Time Chat Application</span>
          </div>

          {/* Subtitle */}
          <p className="text-xs mt-2">Built using MERN STACK</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
