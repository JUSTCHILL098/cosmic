/* eslint-disable react/prop-types */
import {
  faClosedCaptioning,
  faFile,
  faMicrophone,
  faLanguage,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import "./Servers.css";
import { useEffect, useState } from "react";
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

  /* ---------------- AUDIO STATE (NEW) ---------------- */
  const [audioType, setAudioType] = useState(
    () => localStorage.getItem("audio_type") || "SUB"
  );

  const handleAudioSelect = (type) => {
    setAudioType(type);
    localStorage.setItem("audio_type", type);
  };

  /* ---------------- SERVER LOGIC (UNCHANGED) ---------------- */
  const handleServerSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
    localStorage.setItem("server_data_id", server.data_id);
  };

  const isIframeCompatible = (server) =>
    server.type === "slay" || server.isVidapi || server.isPahe;

  const filteredServers = isInRoom
    ? servers?.filter(isIframeCompatible) || []
    : servers || [];

  const subServers = filteredServers.filter((s) => s.type === "sub");
  const dubServers = filteredServers.filter((s) => s.type === "dub");
  const rawServers = filteredServers.filter((s) => s.type === "raw");
  const multiServers = filteredServers.filter((s) => s.type === "multi");
  const slayServers = filteredServers.filter((s) => s.type === "slay");

  useEffect(() => {
    if (servers && servers.length > 0 && !activeServerId) {
      handleServerSelect(servers[0]);
    }
    // eslint-disable-next-line
  }, [servers]);

  return (
    <div className="relative bg-[#111111] p-4 w-full min-h-[100px] flex justify-center items-center">
      {serverLoading ? (
        <BouncingLoader />
      ) : (
        <div className="w-full h-full rounded-lg grid grid-cols-[30%,70%] overflow-hidden max-[600px]:flex max-[600px]:flex-col">

          {/* LEFT INFO */}
          <div className="bg-[#e0e0e0] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:text-white">
            <p className="text-center font-medium text-[14px]">
              You are watching
              <br />
              <span className="font-semibold">
                Episode {activeEpisodeNum}
              </span>
            </p>

            {/* 🔊 AUDIO SELECTOR (NEW, BUTTON ONLY) */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs opacity-80">Audio:</span>

              <button
                onClick={() =>
                  handleAudioSelect(audioType === "SUB" ? "DUB" : "SUB")
                }
                className="
                  flex items-center gap-2
                  px-3 py-1 text-xs rounded-md
                  border border-indigo-400/20
                  bg-indigo-950/40 backdrop-blur-md
                  text-indigo-200
                  hover:bg-indigo-900/50
                  transition
                "
              >
                {audioType}
                <FontAwesomeIcon
                  icon={faVolumeHigh}
                  className="text-[11px]"
                />
              </button>
            </div>
          </div>

          {/* RIGHT SERVERS (UNCHANGED) */}
          <div className="bg-[#1f1f1f] flex flex-col">

            {/* RAW */}
            {rawServers.length > 0 && (
              <ServerRow
                icon={faFile}
                label="RAW"
                servers={rawServers}
                activeServerId={activeServerId}
                onSelect={handleServerSelect}
              />
            )}

            {/* SUB */}
            {subServers.length > 0 && (
              <ServerRow
                icon={faClosedCaptioning}
                label="SUB"
                servers={subServers}
                activeServerId={activeServerId}
                onSelect={handleServerSelect}
              />
            )}

            {/* DUB */}
            {dubServers.length > 0 && (
              <ServerRow
                icon={faMicrophone}
                label="DUB"
                servers={dubServers}
                activeServerId={activeServerId}
                onSelect={handleServerSelect}
              />
            )}

            {/* MULTI */}
            {multiServers.length > 0 && (
              <ServerRow
                icon={faLanguage}
                label="MULTI"
                servers={multiServers}
                activeServerId={activeServerId}
                onSelect={handleServerSelect}
              />
            )}

            {/* SLAY */}
            {slayServers.length > 0 && (
              <ServerRow
                icon={faMicrophone}
                label="SLAY"
                servers={slayServers}
                activeServerId={activeServerId}
                onSelect={handleServerSelect}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- REUSABLE ROW (UNCHANGED STYLE) ---------------- */
function ServerRow({ icon, label, servers, activeServerId, onSelect }) {
  return (
    <div className="servers px-2 flex items-center flex-wrap gap-y-1 ml-2">
      <div className="flex items-center gap-x-2 min-w-[65px]">
        <FontAwesomeIcon icon={icon} className="text-[#e0e0e0] text-[13px]" />
        <p className="font-bold text-[14px]">{label}:</p>
      </div>

      <div className="flex gap-1.5 ml-2 flex-wrap">
        {servers.map((item) => (
          <div
            key={item.data_id}
            className={`px-6 py-[5px] rounded-lg cursor-pointer ${
              activeServerId === item.data_id
                ? "bg-[#e0e0e0] text-black"
                : "bg-[#373737] text-white"
            }`}
            onClick={() => onSelect(item)}
          >
            <p className="text-[13px] font-semibold">
              {item.serverName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servers;
