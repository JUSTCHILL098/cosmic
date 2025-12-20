import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const MultiplayerContext = createContext();

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
    const newSocket = io("https://server-81ja.onrender.com", {
      transports: ['websocket'],
      upgrade: false,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("✅ CONNECTED TO MULTIPLAYER!");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (err) => {
      console.log("❌ CONNECTION ERROR:", err.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setRoomCode(null); // Clear room on disconnect
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

    newSocket.on("userJoined", (data) => setMembers(data.members));

    newSocket.on("videoAction", ({ action, time }) => {
      const art = playerInstance.current;
      if (!art || isSyncing.current) return;
      
      isSyncing.current = true;
      if (action === "play") art.play();
      if (action === "pause") art.pause();
      if (Math.abs(art.currentTime - time) > 2) art.currentTime = time;
      
      setTimeout(() => { isSyncing.current = false; }, 500);
    });

    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

  // SAFE FUNCTIONS using useCallback
  const createRoom = useCallback((name) => {
    if (socket && isConnected) {
      setNickname(name);
      socket.emit("createRoom", { nickname: name });
    } else {
      console.warn("Cannot create room: Socket not connected");
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback((code, name) => {
    if (socket && isConnected) {
      setNickname(name);
      socket.emit("joinRoom", { roomCode: code, nickname: name });
    }
  }, [socket, isConnected]);

  const syncVideoAction = useCallback((action, time) => {
    if (socket && roomCode && isHost && !isSyncing.current) {
      socket.emit("videoAction", { roomCode, action, time });
    }
  }, [socket, roomCode, isHost]);

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
    setPlayerReference: (art) => { playerInstance.current = art; }
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => useContext(MultiplayerContext);
