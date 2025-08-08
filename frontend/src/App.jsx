import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/UseAuthStore";
import { useThemeStore } from "./store/UseThemeStore";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    if (authUser && socketRef.current) {
      socketRef.current.emit("setup", authUser._id);
      console.log("Emitted setup for:", authUser._id);
    }
  }, [authUser]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("message received", (newMessage) => {
      console.log("📩 New message received:", newMessage);
    });

    return () => {
      socketRef.current.off("message received");
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage socket={socketRef.current} /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
