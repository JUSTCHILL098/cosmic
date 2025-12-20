import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const MultiplayerContext = createContext();

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [members, setMembers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [isConnected, setIsConnected] = useState(false); // 1. ADD THIS STATE
  
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
        setIsConnected(true); // 2. UPDATE STATE TO TRUE
    });

    newSocket.on("connect_error", (err) => {
        console.log("❌ CONNECTION ERROR:", err.message);
        setIsConnected(false); // 3. UPDATE STATE TO FALSE
    });

    newSocket.on("disconnect", () => {
        setIsConnected(false); // 4. UPDATE STATE TO FALSE
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

  const createRoom = (name) => {
    if (!socket) return;
    setNickname(name);
    socket.emit("createRoom", { nickname: name });
  };

  const joinRoom = (code, name) => {
    if (!socket) return;
    setNickname(name);
    socket.emit("joinRoom", { roomCode: code, nickname: name });
  };

  const syncVideoAction = (action, time) => {
    if (socket && roomCode && isHost && !isSyncing.current) {
      socket.emit("videoAction", { roomCode, action, time });
    }
  };

  return (
    <MultiplayerContext.Provider value={{ 
      isConnected, // 5. PASS THE ACTUAL CONNECTION STATE
      isInRoom: !!roomCode, 
      roomCode, 
      isHost, 
      members, 
      nickname,
      createRoom, 
      joinRoom, 
      syncVideoAction,
      setPlayerReference: (art) => { playerInstance.current = art; }
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => useContext(MultiplayerContext);
