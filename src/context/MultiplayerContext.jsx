import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io as socketIO } from 'socket.io-client';

// FIX: Production builds sometimes lose 'global' or 'io' references
if (typeof window !== "undefined") {
    window.global = window;
}

const MultiplayerContext = createContext();

// Defensive helper to find the 'io' function regardless of build minification
const getIO = () => {
    if (typeof socketIO === 'function') return socketIO;
    if (socketIO && typeof socketIO.default === 'function') return socketIO.default;
    return socketIO;
};

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [members, setMembers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  
  const playerInstance = useRef(null);
  const isSyncing = useRef(false);

  useEffect(() => {
    let newSocket;
    try {
      const ioFunc = getIO();
      newSocket = ioFunc("https://server-81ja.onrender.com", {
        transports: ['websocket'],
        upgrade: false,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        console.log("✅ CONNECTED TO MULTIPLAYER!");
        setIsConnected(true);
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ CONNECTION ERROR:", err.message);
        setIsConnected(false);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("🔌 DISCONNECTED:", reason);
        setIsConnected(false);
        setRoomCode(null);
      });

      newSocket.on("roomCreated", (data) => {
        setRoomCode(data.roomCode);
        setIsHost(true);
        setMembers(data.members);
      });

      newSocket.on("roomJoined", (data) => {
        setRoomCode(data.roomCode);
        setIsHost(false);
        setMembers(data.members);
      });

      newSocket.on("userJoined", (data) => {
        setMembers(data.members);
      });

      newSocket.on("videoAction", ({ action, time }) => {
        const art = playerInstance.current;
        if (!art || isSyncing.current) return;
        
        isSyncing.current = true;
        try {
          if (action === "play") art.play();
          if (action === "pause") art.pause();
          if (Math.abs(art.currentTime - time) > 2) art.currentTime = time;
        } catch (e) {
          console.error("Playback sync error:", e);
        }
        
        setTimeout(() => { isSyncing.current = false; }, 500);
      });

      setSocket(newSocket);

    } catch (error) {
      console.error("CRITICAL: Socket initialization failed", error);
    }
    
    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  // PRODUCTION-SAFE EMIT FUNCTION
  const safeEmit = useCallback((eventName, data) => {
    if (!socket || !isConnected) {
      console.error(`Cannot emit ${eventName}: Socket not connected`);
      return;
    }

    // This check prevents the "o is not a function" crash
    if (socket.emit && typeof socket.emit === 'function') {
      socket.emit(eventName, data);
    } else {
      console.error("CRITICAL: socket.emit is missing or not a function", socket);
    }
  }, [socket, isConnected]);

  const createRoom = useCallback((name) => {
    setNickname(name || "User");
    safeEmit("createRoom", { nickname: name || "User" });
  }, [safeEmit]);

  const joinRoom = useCallback((code, name) => {
    setNickname(name || "User");
    safeEmit("joinRoom", { roomCode: code, nickname: name || "User" });
  }, [safeEmit]);

  const syncVideoAction = useCallback((action, time) => {
    if (isHost && !isSyncing.current) {
      safeEmit("videoAction", { roomCode, action, time });
    }
  }, [safeEmit, roomCode, isHost]);

  const value = {
    isConnected,
    isInRoom: !!roomCode,
    roomCode,
    isHost,
    members,
    nickname,
    createRoom,
    joinRoom,
    syncVideoAction,
    setPlayerReference: (art) => { 
        playerInstance.current = art; 
    }
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => useContext(MultiplayerContext);
