import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const MultiplayerContext = createContext();

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [members, setMembers] = useState([]);
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || 'Guest');
  
  const playerRef = useRef(null);
  const isBlockingRemoteEvents = useRef(false);

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Replace with your deployed server URL later
    setSocket(newSocket);

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
    newSocket.on("userLeft", (data) => setMembers(data.members));

    newSocket.on("videoAction", ({ action, time }) => {
      if (!playerRef.current) return;
      
      isBlockingRemoteEvents.current = true;
      if (action === "play") playerRef.current.play();
      if (action === "pause") playerRef.current.pause();
      
      if (Math.abs(playerRef.current.currentTime - time) > 1.5) {
        playerRef.current.currentTime = time;
      }
      
      setTimeout(() => { isBlockingRemoteEvents.current = false; }, 500);
    });

    return () => newSocket.close();
  }, []);

  const syncVideoAction = (action, time) => {
    if (socket && roomCode && isHost && !isBlockingRemoteEvents.current) {
      socket.emit("videoAction", { roomCode, action, time });
    }
  };

  const createRoom = (name) => socket.emit("createRoom", { nickname: name });
  const joinRoom = (code, name) => socket.emit("joinRoom", { roomCode: code, nickname: name });

  return (
    <MultiplayerContext.Provider value={{ 
      socket, roomCode, isHost, members, nickname, setNickname,
      createRoom, joinRoom, syncVideoAction,
      setPlayerReference: (ref) => { playerRef.current = ref; }
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => useContext(MultiplayerContext);
