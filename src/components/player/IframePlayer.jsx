/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";

export default function IframePlayer({
  episodeId,
  serverName,
  servertype,
  animeInfo,
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
      (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
    )
  );

  const urlBuilders = {
    "hd-1": () => `${import.meta.env.VITE_BASE_IFRAME_URL}/${episodeId}/${servertype}`,
    "hd-2": () => `https://vidnest.fun/anime/${animeInfo?.id}/${episodeNum}/${servertype}`,
    "hd-3": () => `https://vidnest.fun/animepahe/${animeInfo?.id}/${episodeNum}/${servertype}`,
    // ✅ vidwish correct base:
    "hd-4": () => `${import.meta.env.VITE_BASE_IFRAME_URL_2}/${episodeId}/${servertype}`,
  };

  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);
    const url = urlBuilders[serverName?.toLowerCase()]?.();
    setIframeSrc(url || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, servertype, serverName, animeInfo, episodeNum]);

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  useEffect(() => {
    const handleMessage = (event) => {
      const { currentTime, duration } = event.data || {};
      if (typeof currentTime === "number" && typeof duration === "number") {
        if (
          currentTime >= duration &&
          currentEpisodeIndex < (episodes?.length ?? 0) - 1 &&
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
      const continueWatching = JSON.parse(localStorage.getItem("continueWatching")) || [];
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
      const i = continueWatching.findIndex((x) => x.data_id === newEntry.data_id);
      if (i !== -1) continueWatching[i] = newEntry;
      else continueWatching.push(newEntry);
      localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, servertype]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition-opacity duration-500 ${
        loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <BouncingLoader />
      </div>

      <iframe
        key={`${episodeId}-${servertype}-${serverName}-${iframeSrc}`}
        src={iframeSrc}
        allowFullScreen
        className={`w-full h-full transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => {
          setIframeLoaded(true);
          setTimeout(() => setLoading(false), 1000);
        }}
      />
    </div>
  );
}
