/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

function Servers({
  servers,
  audios = ["Sub", "Dub"],
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  setActiveServerType,
  setActiveServerName,
  activeAudio,
  setActiveAudio,
  serverLoading,
}) {
  const { isInRoom } = useMultiplayer();

  const [serverOpen, setServerOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);

  const serverRef = useRef(null);
  const audioRef = useRef(null);

  const activeServer = servers?.find(
    (s) => s.data_id === activeServerId
  );

  const selectServer = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);

    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
    localStorage.setItem("server_data_id", server.data_id);

    setServerOpen(false);
  };

  const selectAudio = (audio) => {
    setActiveAudio(audio);
    localStorage.setItem("audio_type", audio);
    setAudioOpen(false);
  };

  // outside click close
  useEffect(() => {
    const close = (e) => {
      if (serverRef.current && !serverRef.current.contains(e.target)) {
        setServerOpen(false);
      }
      if (audioRef.current && !audioRef.current.contains(e.target)) {
        setAudioOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!activeServer && servers?.length) {
      selectServer(servers[0]);
    }
    // eslint-disable-next-line
  }, [servers]);

  if (serverLoading) return null;

  return (
    <div className="w-full bg-[#070b1a] p-4 rounded-lg relative overflow-visible">
      <p className="text-sm text-gray-300 mb-3">
        You are watching{" "}
        <span className="font-semibold">
          Episode {activeEpisodeNum}
        </span>
      </p>

      <div className="flex items-center gap-5 flex-wrap overflow-visible">

        {/* ================= SERVER ================= */}
        <div ref={serverRef} className="relative overflow-visible">
          <span className="text-xs text-gray-400 mr-2">Provider:</span>

          {/* DARK BLUE GLASS BUTTON */}
          <button
            onClick={() => setServerOpen((v) => !v)}
            className="
              h-7 px-2.5 text-xs flex items-center gap-2 rounded-md
              border border-blue-400/10
              bg-blue-950/40 backdrop-blur-lg
              text-blue-200
              hover:bg-blue-900/50
              transition
            "
          >
            {activeServer?.serverName || "Select"}
            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
          </button>

          {/* SERVER DROPDOWN */}
          {serverOpen && (
            <div
              className="
                absolute bottom-full left-0 mb-2 z-[9999] w-48
                rounded-md border border-blue-400/10
                bg-blue-950/70 backdrop-blur-xl
                shadow-2xl
              "
            >
              <div className="px-2 py-1.5 text-sm font-semibold text-blue-200">
                Select Provider
              </div>

              <div className="h-px bg-blue-400/10 my-1" />

              {servers.map((server) => {
                const active = server.data_id === activeServerId;

                return (
                  <div
                    key={server.data_id}
                    onClick={() => selectServer(server)}
                    className={`
                      px-2 py-1.5 text-sm cursor-pointer rounded
                      flex items-center justify-between
                      ${
                        active
                          ? "bg-blue-900/50 text-blue-300"
                          : "hover:bg-blue-900/30 text-gray-200"
                      }
                    `}
                  >
                    <span>{server.serverName}</span>
                    <span className="text-[10px] px-1 rounded bg-indigo-900/40 text-indigo-300">
                      {server.type.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= AUDIO ================= */}
        <div ref={audioRef} className="relative overflow-visible">
          <span className="text-xs text-gray-400 mr-2">Audio:</span>

          <button
            onClick={() => setAudioOpen((v) => !v)}
            className="
              h-7 px-2.5 text-xs flex items-center gap-2 rounded-md
              border border-blue-400/10
              bg-blue-950/40 backdrop-blur-lg
              text-blue-200
              hover:bg-blue-900/50
              transition
            "
          >
            {activeAudio || "Sub"}
            <FontAwesomeIcon icon={faVolumeHigh} className="h-3 w-3" />
          </button>

          {/* AUDIO DROPDOWN */}
          {audioOpen && (
            <div
              className="
                absolute bottom-full left-0 mb-2 z-[9999] w-28
                rounded-md border border-blue-400/10
                bg-blue-950/70 backdrop-blur-xl
                shadow-2xl
              "
            >
              {audios.map((audio) => (
                <div
                  key={audio}
                  onClick={() => selectAudio(audio)}
                  className={`
                    px-2 py-1.5 text-sm cursor-pointer rounded
                    ${
                      audio === activeAudio
                        ? "bg-blue-900/50 text-blue-300"
                        : "hover:bg-blue-900/30 text-gray-200"
                    }
                  `}
                >
                  {audio}
                </div>
              ))}
            </div>
          )}
        </div>

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
