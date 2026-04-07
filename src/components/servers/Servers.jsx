/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Check, Tv, Mic } from "lucide-react";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

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

  const activeServer = servers?.find(s => s.data_id === activeServerId);

  // Keep audio tab in sync with the active server
  useEffect(() => {
    if (activeServer && activeServer.type !== audio) {
      setAudio(activeServer.type);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeServerId]);

  const select = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
  };

  const switchAudio = (type) => {
    setAudio(type);
    // Auto-select best server of that type: prefer HD-2, then HD-1, then first
    const pool = servers?.filter(s => s.type === type) || [];
    const pick =
      pool.find(s => s.serverName === "HD-2") ||
      pool.find(s => s.serverName === "HD-1") ||
      pool[0];
    if (pick) select(pick);
  };

  if (serverLoading) return (
    <div className="flex items-center gap-2 px-1 py-2">
      {[80, 64, 72].map(w => (
        <div key={w} className="h-7 rounded-md animate-pulse bg-white/[0.05]" style={{ width: w }} />
      ))}
    </div>
  );

  if (!servers || servers.length === 0) return (
    <div className="px-1 py-2">
      <span className="text-[11px] text-white/25 font-mono">No servers available</span>
    </div>
  );

  const hasSub = servers.some(s => s.type === "sub");
  const hasDub = servers.some(s => s.type === "dub");
  const audioServers = servers.filter(s => s.type === audio);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Episode label */}
      <p className="text-[10px] text-white/25 font-mono px-0.5">
        {activeEpisodeNum
          ? <>Episode <span className="text-white/50">{activeEpisodeNum}</span></>
          : episodeId
            ? <>Ep <span className="text-white/50">{episodeId}</span></>
            : null}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {/* SUB / DUB toggle */}
        {(hasSub || hasDub) && (
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.03)" }}>
            {hasSub && (
              <button
                onClick={() => switchAudio("sub")}
                className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded-md transition-all"
                style={{
                  background: audio === "sub" ? "#fff" : "transparent",
                  color: audio === "sub" ? "#000" : "rgba(255,255,255,0.4)",
                  fontWeight: audio === "sub" ? 700 : 400,
                }}
              >
                <Tv className="w-3 h-3" /> SUB
              </button>
            )}
            {hasDub && (
              <button
                onClick={() => switchAudio("dub")}
                className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded-md transition-all"
                style={{
                  background: audio === "dub" ? "#fff" : "transparent",
                  color: audio === "dub" ? "#000" : "rgba(255,255,255,0.4)",
                  fontWeight: audio === "dub" ? 700 : 400,
                }}
              >
                <Mic className="w-3 h-3" /> DUB
              </button>
            )}
          </div>
        )}

        {/* Server buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          {audioServers.length === 0 ? (
            <span className="text-[10px] text-white/20 font-mono">No {audio.toUpperCase()} servers</span>
          ) : (
            audioServers.map(server => {
              const isActive = server.data_id === activeServerId;
              return (
                <button
                  key={server.data_id}
                  onClick={() => select(server)}
                  className="flex items-center gap-1.5 h-7 px-3 text-[11px] font-mono rounded-md border transition-all"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                    border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#fff"; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}}
                >
                  {isActive && <Check className="w-2.5 h-2.5" />}
                  {server.serverName}
                </button>
              );
            })
          )}
        </div>

        {isInRoom && (
          <span className="text-[10px] text-indigo-400 font-mono ml-auto">👥 Room</span>
        )}
      </div>
    </div>
  );
}
