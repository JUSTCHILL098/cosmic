import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const MultiplayerContext = createContext();

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [members, setMembers] = useState([]);
  const [nickname, setNickname] = useState(""); // Added to track nickname
  const playerInstance = useRef(null);
  const isSyncing = useRef(false);

  useEffect(() => {
    // 1. Connect once and only once
    const newSocket = io("https://server-81ja.onrender.com", {
        transports: ['websocket'],
        upgrade: false,
        reconnectionAttempts: 5
    });

    newSocket.on("connect", () => console.log("✅ CONNECTED TO MULTIPLAYER!"));
    newSocket.on("connect_error", (err) => console.log("❌ CONNECTION ERROR:", err.message));

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
      // Host shouldn't be controlled by incoming actions
      if (!art || newSocket.id === art.hostId) return; 
      
      isSyncing.current = true;
      if (action === "play") art.play();
      if (action === "pause") art.pause();
      if (Math.abs(art.currentTime - time) > 2) art.currentTime = time;
      
      setTimeout(() => { isSyncing.current = false; }, 500);
    });

    setSocket(newSocket);
    
    return () => {
        newSocket.off("connect");
        newSocket.off("roomCreated");
        newSocket.off("roomJoined");
        newSocket.close();
    };
  }, []); // EMPTY ARRAY: This ensures we don't reconnect and drop the room

  const createRoom = (name) => {
    setNickname(name);
    socket.emit("createRoom", { nickname: name });
  };

  const joinRoom = (code, name) => {
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
      isInRoom: !!roomCode, roomCode, isHost, members, nickname,
      createRoom, joinRoom, syncVideoAction,
      setPlayerReference: (art) => { playerInstance.current = art; }
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
};
export const useMultiplayer = () => useContext(MultiplayerContext);
