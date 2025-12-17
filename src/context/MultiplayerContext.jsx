import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const MultiplayerContext = createContext();

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [members, setMembers] = useState([]);
  const playerInstance = useRef(null);
  const isSyncing = useRef(false);

  useEffect(() => {
    const newSocket = io("https://server-81ja.onrender.com");
    setSocket(newSocket);

    // FIX: Listen for roomJoined to update the Joiner's UI
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

    newSocket.on("userLeft", (data) => {
      setMembers(data.members);
    });

    newSocket.on("videoAction", ({ action, time }) => {
      const art = playerInstance.current;
      if (!art || isHost) return;

      isSyncing.current = true;
      if (action === "play") art.play();
      if (action === "pause") art.pause();
      if (Math.abs(art.currentTime - time) > 2) {
        art.currentTime = time;
      }
      setTimeout(() => { isSyncing.current = false; }, 500);
    });

    return () => newSocket.close();
  }, [isHost]);

  const createRoom = (name) => socket.emit("createRoom", { nickname: name });
  const joinRoom = (code, name) => socket.emit("joinRoom", { roomCode: code, nickname: name });

  const syncVideoAction = (action, time) => {
    if (socket && roomCode && isHost && !isSyncing.current) {
      socket.emit("videoAction", { roomCode, action, time });
    }
  };

  return (
    <MultiplayerContext.Provider value={{ 
      isInRoom: !!roomCode, 
      roomCode, 
      isHost, 
      members,
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
