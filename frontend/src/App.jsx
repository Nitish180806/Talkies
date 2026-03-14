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

const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user || {});
  if (!userData) return <Navigate to="/welcome" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user || {});
  if (userData) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user || {});
  const socketRef = useRef(null);
  const userIdRef = useRef(null);

  useCurrentUser();
  useOtherUser();

  useEffect(() => {
    if (!userData?._id) return;

    if (socketRef.current && userIdRef.current === userData._id) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socketio = io(`${ServerUrl}`, {
      query: { userId: userData._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketio;
    userIdRef.current = userData._id;
    dispatch(setSocket(socketio));

    socketio.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users || []));
    });

    socketio.on("userOnline", (id) => {
      dispatch(
        setOnlineUsers((prev) => {
          if (!Array.isArray(prev)) return [id];
          return prev.includes(id) ? prev : [...prev, id];
        }),
      );
    });

    socketio.on("userOffline", (id) => {
      dispatch(
        setOnlineUsers((prev) => {
          if (!Array.isArray(prev)) return [];
          return prev.filter((uid) => uid !== id);
        }),
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      userIdRef.current = null;
      dispatch(setSocket(null));
    };
  }, [userData?._id, dispatch]);

  return (
    <Routes>
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

      <Route
        path="*"
        element={<Navigate to={userData ? "/" : "/welcome"} replace />}
      />
    </Routes>
  );
};

export default App;
