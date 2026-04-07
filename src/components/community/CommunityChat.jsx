import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Hash, Users } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";

const CHANNELS = ["general", "anime-talk", "recommendations", "spoilers"];

const userColor = (name = "") => {
  const palette = ["#f472b6","#818cf8","#34d399","#fb923c","#a78bfa","#60a5fa","#f87171","#4ade80"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % palette.length;
  return palette[h];
};

const fmt = (ts) => {
  try { return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
};

export default function CommunityChat() {
  const { user, profile } = useAuth();
  const [channel,  setChannel]  = useState("general");
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [online,   setOnline]   = useState(0);
  const [error,    setError]    = useState(null);
  const bottomRef  = useRef(null);
  const channelRef = useRef(channel);
  channelRef.current = channel;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages
  const loadMessages = useCallback(async (ch) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("community_chat")
        .select("id, user_id, channel, content, created_at")
        .eq("channel", ch)
        .order("created_at", { ascending: true })
        .limit(100);

      if (err) throw err;

      const msgs = data || [];
      // Batch fetch profiles
      const ids = [...new Set(msgs.map(m => m.user_id).filter(Boolean))];
      let profileMap = {};
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles").select("id, username, avatar_url").in("id", ids);
        (profs || []).forEach(p => { profileMap[p.id] = p; });
      }
      setMessages(msgs.map(m => ({ ...m, profiles: profileMap[m.user_id] || null })));
    } catch (e) {
      setError(e.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to realtime + load on channel change
  useEffect(() => {
    loadMessages(channel);

    // Unique channel name per subscription to avoid conflicts
    const subName = `chat_${channel}_${Math.random().toString(36).slice(2, 6)}`;
    const sub = supabase
      .channel(subName)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "community_chat",
        filter: `channel=eq.${channel}`,
      }, async (payload) => {
        // Only add if it's not already in the list (avoid duplicates from optimistic update)
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          // Fetch profile async
          supabase.from("profiles").select("id, username, avatar_url")
            .eq("id", payload.new.user_id).maybeSingle()
            .then(({ data: prof }) => {
              setMessages(p => p.map(m =>
                m.id === payload.new.id ? { ...m, profiles: prof } : m
              ));
            });
          return [...prev, { ...payload.new, profiles: null }];
        });
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("Chat realtime error — polling fallback");
        }
      });

    return () => { supabase.removeChannel(sub); };
  }, [channel, loadMessages]);

  // Presence
  useEffect(() => {
    const key = `u_${user?.id || Math.random().toString(36).slice(2, 8)}`;
    const ch = supabase.channel("community_presence_v2", {
      config: { presence: { key } },
    });
    ch.on("presence", { event: "sync" }, () => {
      setOnline(Object.keys(ch.presenceState()).length);
    }).subscribe(async (s) => {
      if (s === "SUBSCRIBED") await ch.track({ uid: user?.id || "anon", at: Date.now() });
    });
    return () => { supabase.removeChannel(ch); };
  }, [user?.id]);

  const send = async () => {
    const text = input.trim();
    if (!text || !user || sending) return;
    setSending(true);
    setInput("");

    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      id: tempId,
      user_id: user.id,
      channel: channelRef.current,
      content: text,
      created_at: new Date().toISOString(),
      profiles: { username: profile?.username || "You", avatar_url: profile?.avatar_url || null },
      _optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);

    const { data, error: err } = await supabase.from("community_chat").insert({
      user_id: user.id,
      channel: channelRef.current,
      content: text,
    }).select().single();

    if (err) {
      console.error("Send error:", err.message);
      setInput(text);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } else if (data) {
      // Replace optimistic with real
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...data, profiles: optimistic.profiles } : m
      ));
    }
    setSending(false);
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const displayName = (msg) => msg.profiles?.username || "Anonymous";
  const initials    = (msg) => displayName(msg)[0]?.toUpperCase() || "?";

  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex items-center gap-3 mb-5 px-1">
        <Hash className="w-4 h-4 text-white/30" />
        <h2 className="text-base font-bold text-white font-mono">Community Chat</h2>
        <span className="text-xs text-white/20 font-mono">{online} online</span>
      </div>

      <div className="flex rounded-xl overflow-hidden" style={{ height: 480, background: "#000", border: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Sidebar */}
        <div className="w-[150px] flex-shrink-0 flex flex-col" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Channels</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
            {CHANNELS.map(ch => (
              <button key={ch} onClick={() => setChannel(ch)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all"
                style={{
                  background: channel === ch ? "rgba(255,255,255,0.06)" : "transparent",
                  color: channel === ch ? "#fff" : "rgba(255,255,255,0.3)",
                }}>
                <Hash className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs font-mono truncate">{ch}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Hash className="w-3.5 h-3.5 text-white/25" />
            <span className="text-sm font-semibold text-white font-mono">{channel}</span>
            <div className="ml-auto flex items-center gap-1.5 text-white/20">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-mono">{online}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-5 h-5 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <p className="text-white/20 text-xs font-mono">Failed to load chat</p>
                <button onClick={() => loadMessages(channel)}
                  className="text-white/40 hover:text-white text-[10px] font-mono underline underline-offset-2 transition-colors">
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Hash className="w-8 h-8 text-white/8 mb-3" />
                <p className="text-white/20 text-xs font-mono">No messages in #{channel}</p>
                {!user && (
                  <p className="text-white/15 text-[10px] font-mono mt-1">
                    <a href="/login" className="text-white/35 hover:text-white underline underline-offset-2">Sign in</a> to chat
                  </p>
                )}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const name  = displayName(msg);
                  const color = userColor(name);
                  const isMe  = msg.user_id === user?.id;
                  return (
                    <motion.div key={msg.id}
                      initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.1 }}
                      className="flex items-start gap-2.5"
                      style={{ opacity: msg._optimistic ? 0.6 : 1 }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 overflow-hidden"
                        style={{ background: userColor(name) + "30", color: "#fff", border: `1px solid ${userColor(name)}40` }}>
                        {msg.profiles?.avatar_url
                          ? <img src={msg.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          : initials(msg)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-semibold font-mono" style={{ color: isMe ? "#fff" : color }}>{name}</span>
                          <span className="text-[9px] text-white/15 font-mono">{fmt(msg.created_at)}</span>
                        </div>
                        <p className="text-sm text-white/65 leading-relaxed break-words">{msg.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {user ? (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <input
                  type="text"
                  placeholder={`Message #${channel}`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder:text-white/20"
                />
                <button onClick={send} disabled={!input.trim() || sending}
                  className="transition-colors disabled:opacity-20 flex-shrink-0"
                  style={{ color: input.trim() && !sending ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
                  {sending
                    ? <div className="w-4 h-4 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <p className="text-center text-xs text-white/20 font-mono py-1">
                <a href="/login" className="text-white/40 hover:text-white transition-colors underline underline-offset-2">Sign in</a> to chat
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
