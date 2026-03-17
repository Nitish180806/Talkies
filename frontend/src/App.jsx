// App.jsx - WITH PROTECTED ROUTES
import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditName from "./pages/EditName";
import EditAbout from "./pages/EditAbout";
import UserInfo from "./pages/UserInfo";
import WelcomePage from "./pages/WelcomePage";
import AddStatus from "./pages/AddStatus";
import ViewStatus from "./pages/ViewStatus";
import StatusViewers from "./pages/StatusViewers";
import useCurrentUser from "./customHooks/getCurrentUser";
import useOtherUser from "./customHooks/getOtherUser";

import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, setSocket } from "./redux/UserSlice";

import { io } from "socket.io-client";
import { ServerUrl } from "./main";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user || {});

  if (!userData) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

// ✅ Public Route Component (redirects to home if logged in)
const PublicRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user || {});

  if (userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user || {});

  // ✅ USE REF to prevent dependency issues
  const socketRef = useRef(null);
  const userIdRef = useRef(null);

  // ✅ STEP 1: Fetch current user
  useCurrentUser();

  // ✅ STEP 2: Fetch other users (waits for userData)
  useOtherUser();

  // ✅ STEP 3: Socket connection (ONE TIME SETUP)
  useEffect(() => {
    // Skip if no userData
    if (!userData?._id) {
      console.log("❌ No userData, skipping socket");
      return;
    }

    // Skip if already connected for same user
    if (socketRef.current && userIdRef.current === userData._id) {
      console.log("✅ Socket already connected for this user");
      return;
    }

    // Disconnect old socket if exists
    if (socketRef.current) {
      console.log("🔌 Disconnecting old socket");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("🔌 Connecting new socket for:", userData._id);

    const socketio = io(`${ServerUrl}`, {
      query: { userId: userData._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketio;
    userIdRef.current = userData._id;
    dispatch(setSocket(socketio));

    socketio.on("connect", () => {
      console.log("✅ Socket connected:", socketio.id);
    });

    socketio.on("getOnlineUsers", (users) => {
      console.log("👥 Online users:", users);
      dispatch(setOnlineUsers(users || []));
    });

    socketio.on("userOnline", (id) => {
      console.log("🟢 User online:", id);
      dispatch(
        setOnlineUsers((prev) => {
          if (!Array.isArray(prev)) return [id];
          return prev.includes(id) ? prev : [...prev, id];
        }),
      );
    });

    socketio.on("userOffline", (id) => {
      console.log("🔴 User offline:", id);
      dispatch(
        setOnlineUsers((prev) => {
          if (!Array.isArray(prev)) return [];
          return prev.filter((uid) => uid !== id);
        }),
      );
    });

    // ✅ Cleanup ONLY on unmount or user change
    return () => {
      console.log("🔌 Cleaning up socket");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      userIdRef.current = null;
      dispatch(setSocket(null));
    };
  }, [userData?._id, dispatch]); // ✅ ONLY depend on userData._id

  return (
    <Routes>
      {/* ✅ PUBLIC ROUTES - Redirect to / if logged in */}
      <Route
        path="/welcome"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* ✅ PROTECTED ROUTES - Redirect to /welcome if not logged in */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editName"
        element={
          <ProtectedRoute>
            <EditName />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editAbout"
        element={
          <ProtectedRoute>
            <EditAbout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userinfo/:id"
        element={
          <ProtectedRoute>
            <UserInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/status/add"
        element={
          <ProtectedRoute>
            <AddStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/status/view/:userId"
        element={
          <ProtectedRoute>
            <ViewStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/status/viewers/:statusId"
        element={
          <ProtectedRoute>
            <StatusViewers />
          </ProtectedRoute>
        }
      />

      {/* ✅ FALLBACK - Redirect to welcome or home based on auth */}
      <Route
        path="*"
        element={<Navigate to={userData ? "/" : "/welcome"} replace />}
      />
    </Routes>
  );
};

export default App;
