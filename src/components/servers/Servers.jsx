/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  setActiveServerType,
  setActiveServerName,
  serverLoading,
}) {
  const { isInRoom } = useMultiplayer();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  /* 🔊 AUDIO STATE (REAL SOURCE OF TRUTH) */
  const [audio, setAudio] = useState(
    () => localStorage.getItem("audio") || "SUB"
  );

  const toggleAudio = () => {
    const next = audio === "SUB" ? "DUB" : "SUB";
    setAudio(next);
    localStorage.setItem("audio", next);
  };

  /* ✅ FILTER SERVERS BY AUDIO */
  const filteredServers = servers?.filter(
    (s) => s.type === audio.toLowerCase()
  );

  const activeServer = filteredServers?.find(
    (s) => s.data_id === activeServerId
  );

  const handleSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);

    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
    localStorage.setItem("server_data_id", server.data_id);

    setOpen(false);
  };

  /* AUTO-SWITCH SERVER WHEN AUDIO CHANGES */
  useEffect(() => {
    if (filteredServers?.length) {
      handleSelect(filteredServers[0]);
    }
    // eslint-disable-next-line
  }, [audio, servers]);

  // close on outside click
  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (serverLoading) return null;

  return (
    <div className="w-full bg-[#0b0b0b] p-4 rounded-lg relative overflow-visible">
      {/* INFO */}
      <p className="text-sm text-gray-300 mb-3">
        You are watching{" "}
        <span className="font-semibold">
          Episode {activeEpisodeNum}
        </span>
      </p>

      <div className="flex items-center gap-4 flex-wrap overflow-visible">
        {/* PROVIDER */}
        <div
          ref={wrapperRef}
          className="relative flex items-center gap-2"
        >
          <span className="text-xs font-medium text-gray-400">
            Provider
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              flex items-center gap-2
              h-7 px-2.5 text-xs rounded-md
              border border-indigo-400/20
              bg-indigo-950/40 backdrop-blur-md
              text-indigo-200
              hover:bg-indigo-900/50
            "
          >
            {activeServer?.serverName || "Select"}
            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
          </button>

          {open && (
            <div className="
              absolute bottom-full left-0 mb-2
              z-[9999] w-44
              rounded-md border border-white/10
              bg-black/70 backdrop-blur-xl
            ">
              {filteredServers.map((server) => (
                <div
                  key={server.data_id}
                  onClick={() => handleSelect(server)}
                  className="
                    px-2 py-1.5 text-sm cursor-pointer
                    hover:bg-white/10 text-gray-200
                  "
                >
                  {server.serverName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔊 AUDIO BUTTON (NOW FUNCTIONAL) */}
        <button
          onClick={toggleAudio}
          className="
            flex items-center gap-2
            h-7 px-2.5 text-xs rounded-md
            border border-indigo-400/20
            bg-indigo-950/40 backdrop-blur-md
            text-indigo-200
            hover:bg-indigo-900/50
          "
        >
          {audio}
          <FontAwesomeIcon icon={faVolumeHigh} className="h-3 w-3" />
        </button>

        {isInRoom && (
          <span className="text-xs text-blue-400">
            👥 Multiplayer mode
          </span>
        )}
      </div>
    </div>
  );
}

export default Servers;
