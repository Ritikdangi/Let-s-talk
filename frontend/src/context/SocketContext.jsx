import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth.jsx";
import { SocketContext } from "./Createcontext.jsx";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser,,] = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const userId = authUser?.user?._id;
    console.log("🔍 Auth state changed. User ID:", userId);

    // Cleanup function
    const cleanup = () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setOnlineUsers([]);
      }
    };

    // Initialize socket if we have a userId
    if (userId) {
      console.log("🔄 Initializing socket connection for user:", userId);
      
      // Clean up any existing connection first
      cleanup();

      // Create new socket connection
      const newSocket = io("http://localhost:4000", {
        withCredentials: true,
        query: { userId },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      // Socket event handlers
      newSocket.on("connect", () => {
        console.log("✅ Socket connected successfully. Socket ID:", newSocket.id);
        newSocket.emit("requestOnlineUsers");
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
      });

      newSocket.on("getOnlineUsers", (users) => {
        console.log("📢 Received online users:", users);
        setOnlineUsers(users);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
        setOnlineUsers(prev => prev.filter(u => u !== userId));
      });

      // Store socket reference and update state
      socketRef.current = newSocket;
      setSocket(newSocket);
    } else {
      console.log("⚠️ No user ID available, skipping socket initialization");
      cleanup();
    }

    // Cleanup on unmount or when auth state changes
    return cleanup;
  }, [authUser?.user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};