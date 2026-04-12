/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Tv, Mic } from "lucide-react";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Servers({
  servers,
  episodeId,
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  setActiveServerType = () => {},
  setActiveServerName = () => {},
  serverLoading,
}) {
  const { isInRoom } = useMultiplayer();
  const [audio, setAudio] = useState("sub");
  const [open,  setOpen]  = useState(false);
  const ref = useRef(null);

  const activeServer = servers?.find(s => s.data_id === activeServerId);

  useEffect(() => {
    if (activeServer && activeServer.type !== audio) setAudio(activeServer.type);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeServerId]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
    setOpen(false);
  };

  const switchAudio = (type) => {
    setAudio(type);
    const pool = servers?.filter(s => s.type === type) || [];
    const pick = pool.find(s => s.serverName === "HD-2") || pool.find(s => s.serverName === "HD-1") || pool[0];
    if (pick) select(pick);
  };

  if (serverLoading) return (
    <div className="flex items-center gap-2 py-1">
      {[100, 80].map(w => (
        <div key={w} className="h-8 rounded-lg animate-pulse bg-white/[0.05]" style={{ width: w }} />
      ))}
    </div>
  );

  if (!servers || servers.length === 0) return (
    <span className="text-[11px] text-white/25 font-mono py-1 block">No servers available</span>
  );

  const hasSub = servers.some(s => s.type === "sub");
  const hasDub = servers.some(s => s.type === "dub");
  const audioServers = servers.filter(s => s.type === audio);

  const label = activeServer
    ? `${activeServer.type.toUpperCase()} · ${activeServer.serverName}`
    : "Select server";

  return (
    <div className="flex items-center gap-3 flex-wrap w-full">
      {/* Episode label */}
      {(activeEpisodeNum || episodeId) && (
        <span className="text-[10px] text-white/30 font-mono">
          {activeEpisodeNum ? `EP ${activeEpisodeNum}` : `EP ${episodeId}`}
        </span>
      )}

      {/* Single dropdown — SUB/DUB at top, servers below */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 h-8 px-3 rounded-lg text-[11px] font-mono transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            minWidth: 140,
          }}
        >
          <span className="flex-1 text-left truncate">{label}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5 text-white/50" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{    opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 bottom-full mb-1.5 z-50 rounded-xl overflow-hidden"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                minWidth: 180,
                boxShadow: "0 -8px 32px rgba(0,0,0,0.7)",
              }}
            >
              {/* SUB / DUB section at top */}
              {(hasSub || hasDub) && (
                <>
                  <div className="px-3 pt-2.5 pb-1">
                    <span className="text-[9px] text-white/25 uppercase tracking-widest font-mono">Audio</span>
                  </div>
                  <div className="flex gap-1 px-2 pb-2">
                    {hasSub && (
                      <button
                        onClick={() => switchAudio("sub")}
                        className="flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all"
                        style={{
                          background: audio === "sub" ? "#fff" : "rgba(255,255,255,0.06)",
                          color: audio === "sub" ? "#000" : "rgba(255,255,255,0.5)",
                          border: audio === "sub" ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Tv className="w-3 h-3" /> SUB
                      </button>
                    )}
                    {hasDub && (
                      <button
                        onClick={() => switchAudio("dub")}
                        className="flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all"
                        style={{
                          background: audio === "dub" ? "#fff" : "rgba(255,255,255,0.06)",
                          color: audio === "dub" ? "#000" : "rgba(255,255,255,0.5)",
                          border: audio === "dub" ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Mic className="w-3 h-3" /> DUB
                      </button>
                    )}
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                </>
              )}

              {/* Server list */}
              <div className="px-3 pt-2 pb-1">
                <span className="text-[9px] text-white/25 uppercase tracking-widest font-mono">Server</span>
              </div>
              {audioServers.length === 0 ? (
                <div className="px-3 pb-2.5 text-[11px] text-white/25 font-mono">
                  No {audio.toUpperCase()} servers
                </div>
              ) : (
                <div className="pb-1.5">
                  {audioServers.map(server => {
                    const isActive = server.data_id === activeServerId;
                    return (
                      <button
                        key={server.data_id}
                        onClick={() => select(server)}
                        className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-mono transition-all text-left"
                        style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <span>{server.serverName}</span>
                        {isActive && <Check className="w-3 h-3 text-green-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isInRoom && <span className="text-[10px] text-indigo-400 font-mono ml-auto">👥 Room</span>}
    </div>
  );
}
