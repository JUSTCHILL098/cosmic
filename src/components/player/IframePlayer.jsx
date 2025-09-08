/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";

export default function IframePlayer({
  episodeId,
  serverName,
  servertype = "sub",
  animeInfo = {},
  episodeNum,
  episodes,
  playNext,
  autoNext,
}) {
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex(
      (ep) => ep.id.match(/ep=(\d+)/)?.[1] === episodeId
    )
  );

  const getEpisodeNumber = () => {
    if (episodeNum) return String(episodeNum);
    if (!episodeId) return "";
    const match = String(episodeId).match(/ep=(\d+)/);
    if (match) return match[1];
    if (/^\d+$/.test(String(episodeId))) return String(episodeId);
    return "";
  };

  const buildIframeUrl = (server, epNum, info, type) => {
    const dataId = info?.data_id;
    const anilistId = info?.anilistId;
    const ep = String(epNum || "");

    switch (server.toLowerCase()) {
      case "hd-1": // MEGAPLAY
        if (dataId && ep) return `https://megaplay.buzz/stream/${dataId}-${ep}`;
        break;
      case "hd-2": // VIDNEST
        if (anilistId && ep) return `https://vidnest.fun/animepahe/${anilistId}/${ep}/${type}`;
        break;
      case "hd-3": // VIDEASY
        if (anilistId && ep) return `https://slay-knight.xyz/player/${anilistId}/${ep}/${type}?autoplay=true`;
        break;
      case "hd-4": // VIDWISH
        if (dataId && ep) return `https://vidwish.live/stream/${dataId}-${ep}`;
        break;
      default:
        return "";
    }
    return "";
  };

  useEffect(() => {
    const epNum = getEpisodeNumber();
    const url = buildIframeUrl(serverName, epNum, animeInfo, servertype);

    console.log("Iframe URL:", url); // debug
    setLoading(true);
    setIframeLoaded(false);
    setIframeSrc(url);
  }, [episodeId, servertype, serverName, animeInfo]);

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (ep) => ep.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  useEffect(() => {
    const handleMessage = (event) => {
      const { currentTime, duration } = event.data;
      if (typeof currentTime === "number" && typeof duration === "number") {
        if (
          currentTime >= duration &&
          currentEpisodeIndex < episodes?.length - 1 &&
          autoNext
        ) {
          playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [autoNext, currentEpisodeIndex, episodes, playNext]);

  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);
    return () => {
      const continueWatching =
        JSON.parse(localStorage.getItem("continueWatching")) || [];
      const newEntry = {
        id: animeInfo?.id,
        data_id: animeInfo?.data_id,
        episodeId,
        episodeNum,
        adultContent: animeInfo?.adultContent,
        poster: animeInfo?.poster,
        title: animeInfo?.title,
        japanese_title: animeInfo?.japanese_title,
      };
      if (!newEntry.data_id) return;
      const existingIndex = continueWatching.findIndex(
        (item) => item.data_id === newEntry.data_id
      );
      if (existingIndex !== -1) {
        continueWatching[existingIndex] = newEntry;
      } else {
        continueWatching.push(newEntry);
      }
      localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
    };
  }, [episodeId, servertype]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loader Overlay */}
      <div
        className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition-opacity duration-500 ${
          loading
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <BouncingLoader />
      </div>

      <iframe
        key={`${episodeId}-${servertype}-${serverName}-${iframeSrc}`}
        src={iframeSrc}
        allowFullScreen
        className={`w-full h-full transition-opacity duration-500 ${
          iframeLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIframeLoaded(true);
          setTimeout(() => setLoading(false), 1000);
        }}
      ></iframe>
    </div>
  );
}
