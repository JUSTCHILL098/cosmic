/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
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

  const activeServer = servers?.find(
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

  useEffect(() => {
    if (!activeServer && servers?.length) {
      handleSelect(servers[0]);
    }
    // eslint-disable-next-line
  }, [servers]);

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

      {/* STREAM OPTIONS */}
      <div className="flex items-center gap-4 flex-wrap overflow-visible">
        {/* PROVIDER */}
        <div
          ref={wrapperRef}
          className="relative flex items-center gap-2 overflow-visible"
        >
          <span className="text-xs text-muted-foreground">
            Provider:
          </span>

          {/* GLASS BUTTON */}
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="
              justify-center gap-2 whitespace-nowrap font-medium
              transition-colors focus-visible:outline-none
              focus-visible:ring-1 focus-visible:ring-ring
              disabled:pointer-events-none disabled:opacity-50
              [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
              rounded-md flex items-center space-x-1.5
              h-7 px-2.5 text-xs

              border border-white/10
              bg-white/10 backdrop-blur-md
              text-indigo-200
              hover:bg-white/20
            "
          >
            <span>{activeServer?.serverName || "Select"}</span>
            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
          </button>

          {/* DROPDOWN (OPENS UPWARD, OUTSIDE CONTAINER) */}
          {open && (
            <div
              className="
                absolute bottom-full left-0 mb-2
                z-[9999] w-44
                rounded-md border border-white/10
                bg-black/70 backdrop-blur-xl
                shadow-2xl
              "
            >
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-300">
                Select Provider
              </div>

              <div className="-mx-1 my-1 h-px bg-white/10" />

              {servers.map((server) => {
                const active = server.data_id === activeServerId;

                return (
                  <div
                    key={server.data_id}
                    onClick={() => handleSelect(server)}
                    className={`
                      relative flex cursor-pointer select-none
                      items-center gap-2 rounded-sm px-2 py-1.5 text-sm
                      transition-colors
                      ${
                        active
                          ? "bg-indigo-900/40 text-indigo-300"
                          : "hover:bg-white/10 text-gray-200"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span>{server.serverName}</span>

                        <span
                          className="
                            inline-flex items-center rounded-md
                            text-[10px] px-1 py-0
                            bg-purple-900/40 text-purple-300
                          "
                        >
                          {server.type.toUpperCase()}
                        </span>
                      </div>

                      {active && (
                        <FontAwesomeIcon
                          icon={faEye}
                          className="h-3 w-3"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
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
