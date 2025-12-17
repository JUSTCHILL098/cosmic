/* eslint-disable react/prop-types */
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import artplayerPluginChapter from "./artPlayerPluinChaper";
import autoSkip from "./autoSkip";
import artplayerPluginVttThumbnail from "./artPlayerPluginVttThumbnail";
import {
  backward10Icon,
  backwardIcon,
  captionIcon,
  forward10Icon,
  forwardIcon,
  fullScreenOffIcon,
  fullScreenOnIcon,
  loadingIcon,
  logo,
  muteIcon,
  pauseIcon,
  pipIcon,
  playIcon,
  playIconLg,
  settingsIcon,
  volumeIcon,
} from "./PlayerIcons";
import "./Player.css";
import website_name from "@/src/config/website";
import getChapterStyles from "./getChapterStyle";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import artplayerPluginUploadSubtitle from "./artplayerPluginUploadSubtitle";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

Artplayer.LOG_VERSION = false;
Artplayer.CONTEXTMENU = false;

export default function Player({
  streamUrl,
  subtitles,
  thumbnail,
  intro,
  outro,
  autoSkipIntro,
  autoPlay,
  autoNext,
  episodeId,
  episodes,
  playNext,
  animeInfo,
  episodeNum,
  streamInfo,
}) {
  const artRef = useRef(null);
  const artInstance = useRef(null);
  const leftAtRef = useRef(0);
  
  const {
    isInRoom,
    isHost,
    syncVideoAction,
    setPlayerReference
  } = useMultiplayer();

  const proxy = import.meta.env.VITE_PROXY_URL;
  const m3u8proxy = import.meta.env.VITE_M3U8_PROXY_URL?.split(",") || [];

  // Helper to play M3U8
  const playM3u8 = (video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }
  };

  useEffect(() => {
    if (!streamUrl || !artRef.current) return;

    const headers = { referer: new URL(streamInfo?.streamingLink?.iframe || window.location.origin).origin + "/" };
    
    const art = new Artplayer({
      url: m3u8proxy[Math.floor(Math.random() * m3u8proxy?.length)] + encodeURIComponent(streamUrl) + "&headers=" + encodeURIComponent(JSON.stringify(headers)),
      container: artRef.current,
      type: "m3u8",
      autoplay: autoPlay,
      volume: 1,
      // Restriction: Joiners cannot control player, only Host
      setting: !isInRoom || isHost,
      playbackRate: !isInRoom || isHost,
      hotkey: !isInRoom || isHost,
      lock: true,
      plugins: [
        artplayerPluginHlsControl({ quality: { setting: true, getName: (l) => l.height + "P", title: "Quality", auto: "Auto" } }),
        artplayerPluginUploadSubtitle(),
        artplayerPluginChapter({ chapters: [
            ...(intro?.end ? [{ start: intro.start, end: intro.end, title: "Intro" }] : []),
            ...(outro?.end ? [{ start: outro.start, end: outro.end, title: "Outro" }] : [])
        ]}),
      ],
      icons: { play: playIcon, pause: pauseIcon, setting: settingsIcon, volume: volumeIcon, pip: pipIcon, loading: loadingIcon, fullscreenOn: fullScreenOnIcon, fullscreenOff: fullScreenOffIcon },
      customType: { m3u8: playM3u8 },
    });

    art.on("ready", () => {
      artInstance.current = art;
      setPlayerReference(art); // Connect to MultiplayerContext

      // Handle Host Actions
      if (isInRoom && isHost) {
        art.on("video:play", () => syncVideoAction("play", art.currentTime));
        art.on("video:pause", () => syncVideoAction("pause", art.currentTime));
        art.on("video:seeked", () => syncVideoAction("seek", art.currentTime));
      }
    });

    return () => {
      if (art && art.destroy) art.destroy();
    };
  }, [streamUrl, episodeId, isInRoom, isHost]);

  return <div ref={artRef} className="w-full h-full"></div>;
}
