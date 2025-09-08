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

  // 🔹 Server → URL mapping
  const getBaseUrl = (serverName, animeInfo, episodeNum, servertype) => {
    const anilistId = animeInfo?.id;

    switch (serverName.toLowerCase()) {
      case "hd-1":
        // MEGAPLAY
        return `https://megaplay.buzz/embed/${anilistId}/${episodeNum}/${servertype}`;

      case "hd-2":
        // VIDNEST
        return `https://vidnest.fun/animepahe/${anilistId}/${episodeNum}/${servertype}`;

      case "hd-3":
        // VIDEASY
        return `https://slay-knight.xyz/player/${anilistId}/${episodeNum}/${servertype}?autoplay=true`;

      case "hd-4":
        // VIDWISH
        return `https://vidwish.live/embed/${anilistId}/${episodeNum}/${servertype}`;

      default:
        return undefined;
    }
  };

  // 🔹 Update iframe when server/episode changes
  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);
    setIframeSrc("");

    const url = getBaseUrl(serverName, animeInfo, episodeNum, servertype);
    setIframeSrc(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, servertype, serverName, animeInfo, episodeNum]);

  // 🔹 Update episode index
  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  // 🔹 Auto-next on finish
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
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [autoNext, currentEpisodeIndex, episodes, playNext]);

  // 🔹 Save continue watching
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
