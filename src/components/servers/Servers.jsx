/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFilm,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  serverLoading,
  setActiveServerType,
  setActiveServerName,
}) {
  const { isInRoom } = useMultiplayer();

  const [providerOpen, setProviderOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);

  const providerRef = useRef(null);
  const audioRef = useRef(null);

  const activeServer = servers?.find(
    (s) => s.data_id === activeServerId
  );

  const handleServerSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);

    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
    localStorage.setItem("server_data_id", server.data_id);

    setProviderOpen(false);
    setAudioOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        providerRef.current &&
        !providerRef.current.contains(e.target)
      ) {
        setProviderOpen(false);
      }
      if (
        audioRef.current &&
        !audioRef.current.contains(e.target)
      ) {
        setAudioOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!activeServer && servers?.length) {
      handleServerSelect(servers[0]);
    }
    // eslint-disable-next-line
  }, [servers]);

  if (serverLoading) return null;

  return (
    <div className="w-full bg-[#0f0f0f] p-4 rounded-lg">
      {/* INFO */}
      <p className="text-sm text-gray-300 mb-3">
        You are watching{" "}
        <span className="font-semibold">
          Episode {activeEpisodeNum}
        </span>
      </p>

      {/* STREAM OPTIONS */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* PROVIDER */}
        <div ref={providerRef} className="relative flex items-center gap-2">
          <span className="text-xs text-gray-400">Provider:</span>

          <button
            onClick={() => setProviderOpen((v) => !v)}
            className="h-7 px-2.5 text-xs rounded-md flex items-center gap-1.5
              bg-indigo-100 text-indigo-700
              dark:bg-indigo-900/30 dark:text-indigo-300
              hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
          >
            <span>{activeServer?.serverName || "Select"}</span>
            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
          </button>

          {providerOpen && (
            <Dropdown
              title="Select Provider"
              items={servers || []}
              activeId={activeServerId}
              onSelect={handleServerSelect}
            />
          )}
        </div>

        <div className="h-6 w-px bg-gray-700" />

        {/* AUDIO */}
        <div ref={audioRef} className="relative flex items-center gap-2">
          <span className="text-xs text-gray-400">Audio:</span>

          <button
            onClick={() => setAudioOpen((v) => !v)}
            className="h-7 px-2.5 text-xs rounded-md flex items-center gap-1.5
              bg-indigo-100 text-indigo-700
              dark:bg-indigo-900/30 dark:text-indigo-300
              hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
          >
            <span>{activeServer?.type?.toUpperCase()}</span>
            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
          </button>

          {audioOpen && (
            <Dropdown
              title="Select Audio"
              items={servers || []}
              activeId={activeServerId}
              onSelect={handleServerSelect}
            />
          )}
        </div>

        {/* SUBTITLES */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Subtitles:</span>
          <button
            className="h-7 px-2.5 text-xs rounded-md flex items-center gap-1.5
              bg-amber-100 text-amber-700
              dark:bg-amber-900/30 dark:text-amber-300
              hover:bg-amber-200 dark:hover:bg-amber-900/50"
          >
            <span>Add Custom Subtitle</span>
            <FontAwesomeIcon icon={faFilm} className="h-3 w-3" />
          </button>
        </div>

        {/* PRIORITY */}
        <button
          className="h-7 px-2.5 text-xs rounded-md flex items-center gap-1.5
            bg-red-100 text-red-700
            dark:bg-red-900/30 dark:text-red-300
            hover:bg-red-200 dark:hover:bg-red-900/50"
        >
          <FontAwesomeIcon icon={faSliders} className="h-3 w-3" />
          <span>Priority Settings</span>
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

/* ========================= */
/* DROPDOWN COMPONENT */
/* ========================= */

function Dropdown({ title, items, activeId, onSelect }) {
  return (
    <div
      className="absolute top-9 left-0 z-50 w-40
        rounded-md border border-gray-700
        bg-[#121212] shadow-lg"
    >
      <div className="px-2 py-1.5 text-sm font-semibold text-gray-300">
        {title}
      </div>

      <div className="h-px bg-gray-700 my-1" />

      {items.map((item) => {
        const active = item.data_id === activeId;

        return (
          <div
            key={item.data_id}
            onClick={() => onSelect(item)}
            className={`px-2 py-1.5 text-sm cursor-pointer rounded-sm
              flex items-center justify-between
              ${
                active
                  ? "bg-indigo-900/30 text-indigo-300"
                  : "hover:bg-gray-800 text-gray-200"
              }`}
          >
            <div className="flex items-center gap-2">
              <span>{item.serverName}</span>
              <span className="text-[10px] px-1 rounded bg-purple-900/40 text-purple-300">
                {item.type.toUpperCase()}
              </span>
            </div>

            {active && (
              <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
            )}
          </div>
        );
      })}
    </div>
  );
}
