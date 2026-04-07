/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";

const Ctx = createContext(null);

// Generate a short room code
const mkCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export const MultiplayerProvider = ({ children }) => {
  const { user, profile } = useAuth();

  const [roomCode,  setRoomCode]  = useState(null);
  const [isHost,    setIsHost]    = useState(false);
  const [members,   setMembers]   = useState([]);
  const [chat,      setChat]      = useState([]);
  const [roomError, setRoomError] = useState(null);

  const channelRef  = useRef(null);
  const isSyncing   = useRef(false);
  const playerRef   = useRef(null);
  const roomCodeRef = useRef(null);
  roomCodeRef.current = roomCode;

  const myName = profile?.username || user?.email?.split("@")[0] || "Guest";

  // ── Subscribe to a room channel ──────────────────────────────────────────
  const subscribe = useCallback((code, host) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const ch = supabase.channel(`room:${code}`, {
      config: { broadcast: { self: false }, presence: { key: user?.id || mkCode() } },
    });

    // Presence — member list
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const list = Object.values(state).flat().map(p => p);
      setMembers(list);
    });

    // Broadcast — video sync
    ch.on("broadcast", { event: "video_sync" }, ({ payload }) => {
      if (isSyncing.current || !playerRef.current) return;
      isSyncing.current = true;
      const el = playerRef.current;
      if (payload.action === "play")  { el.currentTime = payload.time; el.play?.(); }
      if (payload.action === "pause") { el.currentTime = payload.time; el.pause?.(); }
      if (payload.action === "seek")  { el.currentTime = payload.time; }
      setTimeout(() => { isSyncing.current = false; }, 600);
    });

    // Broadcast — episode change
    ch.on("broadcast", { event: "episode_change" }, ({ payload }) => {
      window.dispatchEvent(new CustomEvent("w2g_episode", { detail: payload.episodeId }));
    });

    // Broadcast — chat
    ch.on("broadcast", { event: "chat" }, ({ payload }) => {
      setChat(prev => [...prev, { ...payload, id: Date.now() + Math.random() }]);
    });

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({
          user_id: user?.id || null,
          name: myName,
          avatar: profile?.avatar_url || null,
          is_host: host,
          joined_at: Date.now(),
        });
      }
    });

    channelRef.current = ch;
  }, [user, profile, myName]);

  // ── Create room ──────────────────────────────────────────────────────────
  const createRoom = useCallback(() => {
    const code = mkCode();
    setRoomCode(code);
    setIsHost(true);
    setChat([]);
    setMembers([]);
    setRoomError(null);
    subscribe(code, true);
    return code;
  }, [subscribe]);

  // ── Join room ────────────────────────────────────────────────────────────
  const joinRoom = useCallback((code) => {
    const c = code.trim().toUpperCase();
    setRoomCode(c);
    setIsHost(false);
    setChat([]);
    setMembers([]);
    setRoomError(null);
    subscribe(c, false);
  }, [subscribe]);

  // ── Leave room ───────────────────────────────────────────────────────────
  const leaveRoom = useCallback(() => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = null;
    setRoomCode(null);
    setIsHost(false);
    setMembers([]);
    setChat([]);
  }, []);

  // ── Sync video (host only) ───────────────────────────────────────────────
  const syncVideo = useCallback((action, time) => {
    if (!isHost || !channelRef.current || isSyncing.current) return;
    channelRef.current.send({ type: "broadcast", event: "video_sync", payload: { action, time } });
  }, [isHost]);

  // ── Sync episode change (host only) ─────────────────────────────────────
  const syncEpisodeChange = useCallback((episodeId) => {
    if (!isHost || !channelRef.current) return;
    channelRef.current.send({ type: "broadcast", event: "episode_change", payload: { episodeId } });
  }, [isHost]);

  // ── Send chat message ────────────────────────────────────────────────────
  const sendChat = useCallback((text) => {
    if (!channelRef.current || !text.trim()) return;
    const msg = { name: myName, avatar: profile?.avatar_url || null, text: text.trim(), ts: Date.now(), id: Math.random() };
    setChat(prev => [...prev, msg]); // optimistic
    channelRef.current.send({ type: "broadcast", event: "chat", payload: msg });
  }, [myName, profile]);

  // Cleanup on unmount
  useEffect(() => () => { if (channelRef.current) supabase.removeChannel(channelRef.current); }, []);

  return (
    <Ctx.Provider value={{
      isInRoom: !!roomCode, roomCode, isHost, members, chat, roomError,
      // legacy compat
      isConnected: true, nickname: myName, setNickname: () => {},
      createRoom, joinRoom, leaveRoom, sendChat, sendChatMessage: sendChat,
      syncVideo, syncEpisodeChange,
      setPlayerReference: (el) => { playerRef.current = el; },
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useMultiplayer = () => useContext(Ctx);
