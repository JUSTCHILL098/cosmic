import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { io as socketIO } from "socket.io-client";

if (typeof window !== "undefined") {
  window.global = window;
}

const MultiplayerContext = createContext();

export const MultiplayerProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [members, setMembers] = useState([]);
  const [nickname, setNickname] = useState("");

  const [chat, setChat] = useState([]);
  const [roomError, setRoomError] = useState(null);

  const playerRef = useRef(null);
  const isSyncing = useRef(false);

  /* ---------------------------------- SOCKET INIT ---------------------------------- */
  useEffect(() => {
    const socketInstance = socketIO("https://server-81ja.onrender.com", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      resetRoom();
    });

    socketInstance.on("roomCreated", ({ roomCode, members }) => {
      setRoomCode(roomCode);
      setMembers(members);
      setIsHost(true);
      setChat([]);
    });

    socketInstance.on("roomJoined", ({ roomCode, members }) => {
      setRoomCode(roomCode);
      setMembers(members);
      setIsHost(false);
      setChat([]);
    });

    socketInstance.on("userJoined", ({ members }) => {
      setMembers(members);
    });

    socketInstance.on("userLeft", ({ members }) => {
      setMembers(members);
    });

    socketInstance.on("chatMessage", (message) => {
      setChat((prev) => [...prev, message]);
    });

    socketInstance.on("roomError", (err) => {
      setRoomError(err);
    });

    socketInstance.on("videoAction", ({ action, time }) => {
      if (!playerRef.current || isSyncing.current) return;

      isSyncing.current = true;
      try {
        if (action === "play") playerRef.current.play();
        if (action === "pause") playerRef.current.pause();
        if (Math.abs(playerRef.current.currentTime - time) > 1.5) {
          playerRef.current.currentTime = time;
        }
      } finally {
        setTimeout(() => (isSyncing.current = false), 500);
      }
    });

    socketInstance.on("episodeChange", ({ episodeId }) => {
      window.dispatchEvent(
        new CustomEvent("multiplayer-episode-change", {
          detail: episodeId,
        })
      );
    });

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  /* ---------------------------------- HELPERS ---------------------------------- */
  const safeEmit = (event, payload) => {
    if (socket && socket.connected) {
      socket.emit(event, payload);
    }
  };

  const resetRoom = () => {
    setRoomCode(null);
    setIsHost(false);
    setMembers([]);
    setChat([]);
  };

  /* ---------------------------------- API ---------------------------------- */
  const createRoom = () => {
    safeEmit("createRoom", { nickname });
  };

  const joinRoom = (code, name = nickname) => {
    setNickname(name);
    safeEmit("joinRoom", { roomCode: code, nickname: name });
  };

  const leaveRoom = () => {
    safeEmit("leaveRoom");
    resetRoom();
  };

  const sendChatMessage = (message) => {
    safeEmit("chatMessage", { message });
  };

  const syncVideoAction = (action, time) => {
    if (!isHost || isSyncing.current) return;
    safeEmit("videoAction", { roomCode, action, time });
  };

  const syncEpisodeChange = (episodeId) => {
    if (isHost) {
      safeEmit("episodeChange", { roomCode, episodeId });
    }
  };

  return (
    <MultiplayerContext.Provider
      value={{
        isConnected,
        isInRoom: !!roomCode,
        roomCode,
        isHost,
        members,
        nickname,
        setNickname,

        chat,
        roomError,

        createRoom,
        joinRoom,
        leaveRoom,
        sendChatMessage,

        syncVideoAction,
        syncEpisodeChange,

        setPlayerReference: (player) => {
          playerRef.current = player;
        },
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => useContext(MultiplayerContext);
