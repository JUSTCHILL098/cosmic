/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { useAuth } from "@/src/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Copy, LogOut, Send, Crown, X, Link2, Smile, Check,
} from "lucide-react";

const EMOJIS = ["😂","😭","🔥","💀","👀","🤯","😍","🥺","💯","👏","🎉","😤","🤔","😎","🥹","❤️","✨","🫡"];

function Avatar({ name, src, size = 7 }) {
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6"];
  const color  = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-white`}
      style={{ background: color, border: "1px solid rgba(255,255,255,0.15)" }}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
    </div>
  );
}

export default function WatchTogether({ playerRef }) {
  const { user } = useAuth();
  const {
    isInRoom, roomCode, isHost, members, chat,
    createRoom, joinRoom, leaveRoom, sendChat,
  } = useMultiplayer();

  const [open,       setOpen]       = useState(false);
  const [joinInput,  setJoinInput]  = useState("");
  const [msg,        setMsg]        = useState("");
  const [copied,     setCopied]     = useState(false);
  const [showEmoji,  setShowEmoji]  = useState(false);
  const [tab,        setTab]        = useState("chat"); // chat | members
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const send = () => {
    if (!msg.trim()) return;
    sendChat(msg.trim());
    setMsg("");
    setShowEmoji(false);
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const handleCreate = () => { createRoom(); setOpen(true); };
  const handleJoin   = () => { if (joinInput.trim()) { joinRoom(joinInput.trim()); setOpen(true); setJoinInput(""); } };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 right-4 z-[9999] flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs font-semibold transition-all"
        style={{
          background: isInRoom ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)",
          border: isInRoom ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.12)",
          color: isInRoom ? "#a5b4fc" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Users className="w-3.5 h-3.5" />
        {isInRoom ? `Room ${roomCode}` : "Watch Together"}
        {isInRoom && members.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center font-bold">
            {members.length}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 z-[9999] flex flex-col"
            style={{
              width: "min(92vw, 320px)",
              height: 460,
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            {!isInRoom ? (
              /* ── Setup screen ── */
              <div className="flex flex-col gap-4 p-5 h-full justify-center">
                <div className="text-center mb-2">
                  <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <h3 className="text-white font-mono font-bold text-base">Watch Together</h3>
                  <p className="text-white/30 font-mono text-xs mt-1">Sync playback with friends in real-time</p>
                </div>

                <button onClick={handleCreate}
                  className="w-full py-2.5 rounded-xl font-mono text-sm font-semibold transition-all"
                  style={{ background: "#fff", color: "#000" }}>
                  Create Room
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="text-white/20 font-mono text-[10px]">or join</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>

                <div className="flex gap-2">
                  <input
                    value={joinInput}
                    onChange={e => setJoinInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handleJoin()}
                    placeholder="Room code"
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white font-mono outline-none placeholder:text-white/20"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <button onClick={handleJoin} disabled={!joinInput.trim()}
                    className="px-4 py-2.5 rounded-xl font-mono text-sm transition-all disabled:opacity-30"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                    Join
                  </button>
                </div>
              </div>
            ) : (
              /* ── Room screen ── */
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2">
                    {isHost && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
                    <span className="text-white font-mono text-sm font-semibold">{roomCode}</span>
                    <span className="text-white/25 font-mono text-[10px]">{members.length} watching</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={copy} title="Copy invite link"
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: copied ? "#86efac" : "rgba(255,255,255,0.4)" }}>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={leaveRoom} title="Leave room"
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#fca5a5" }}>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setOpen(false)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["chat","members"].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className="flex-1 py-2 text-xs font-mono font-semibold capitalize transition-all"
                      style={{ color: tab === t ? "#fff" : "rgba(255,255,255,0.3)", borderBottom: tab === t ? "1px solid #fff" : "1px solid transparent" }}>
                      {t === "members" ? `Members (${members.length})` : "Chat"}
                    </button>
                  ))}
                </div>

                {/* Members tab */}
                {tab === "members" && (
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                    {members.map((m, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Avatar name={m.name} src={m.avatar} />
                        <span className="text-sm text-white font-mono flex-1 truncate">{m.name}</span>
                        {m.is_host && <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                      </div>
                    ))}
                    {members.length === 0 && (
                      <p className="text-white/20 font-mono text-xs text-center py-8">Waiting for others to join...</p>
                    )}
                  </div>
                )}

                {/* Chat tab */}
                {tab === "chat" && (
                  <>
                    <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
                      {chat.length === 0 && (
                        <p className="text-white/15 font-mono text-xs text-center py-8">No messages yet</p>
                      )}
                      {chat.map((m) => (
                        <div key={m.id} className="flex items-start gap-2">
                          <Avatar name={m.name} src={m.avatar} size={6} />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-white/35">{m.name}</span>
                            <p className="text-sm text-white/80 leading-relaxed break-words">{m.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={bottomRef} />
                    </div>

                    {/* Emoji picker */}
                    <AnimatePresence>
                      {showEmoji && (
                        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                          className="flex flex-wrap gap-1 px-3 py-2 flex-shrink-0"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => setMsg(v => v + e)}
                              className="text-lg hover:scale-125 transition-transform">
                              {e}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input */}
                    <div className="px-3 py-2.5 flex-shrink-0 flex items-center gap-2"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <button onClick={() => setShowEmoji(v => !v)}
                        className="text-white/30 hover:text-white transition-colors flex-shrink-0">
                        <Smile className="w-4 h-4" />
                      </button>
                      <input
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        onKeyDown={onKey}
                        placeholder="Say something..."
                        className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder:text-white/20"
                      />
                      <button onClick={send} disabled={!msg.trim()}
                        className="text-white/30 hover:text-white transition-colors disabled:opacity-20 flex-shrink-0">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
