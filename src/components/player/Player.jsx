/* eslint-disable react/prop-types */
import Hls from "hls.js";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import artplayerPluginChapter from "./artPlayerPluinChaper";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import artplayerPluginUploadSubtitle from "./artplayerPluginUploadSubtitle";
import { 
  playIcon, pauseIcon, settingsIcon, volumeIcon, pipIcon, 
  loadingIcon, fullScreenOnIcon, fullScreenOffIcon 
} from "./PlayerIcons";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

export default function Player({ streamUrl, intro, outro, autoPlay, streamInfo }) {
  const artRef = useRef(null);
  const { isInRoom, isHost, syncVideoAction, setPlayerReference } = useMultiplayer();
  const m3u8proxy = import.meta.env.VITE_M3U8_PROXY_URL?.split(",") || [];

  const playM3u8 = (video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }
  };

  useEffect(() => {
    if (!streamUrl || !artRef.current) return;

    const headers = { referer: new URL(streamInfo?.streamingLink?.iframe || window.location.origin).origin + "/" };
    const finalUrl = m3u8proxy[0] + encodeURIComponent(streamUrl) + "&headers=" + encodeURIComponent(JSON.stringify(headers));

    const art = new Artplayer({
      url: finalUrl,
      container: artRef.current,
      type: "m3u8",
      autoplay: autoPlay,
      // Only host gets controls in a room
      setting: !isInRoom || isHost,
      controls: [
        {
            position: 'right',
            html: isInRoom ? (isHost ? 'HOST' : 'WATCHER') : '',
            style: { color: '#ffad00', fontWeight: 'bold', marginRight: '10px' }
        }
      ],
      plugins: [
        artplayerPluginHlsControl({ quality: { setting: true, getName: (l) => l.height + "P", title: "Quality" } }),
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
      setPlayerReference(art);
      if (isInRoom && isHost) {
        art.on("video:play", () => syncVideoAction("play", art.currentTime));
        art.on("video:pause", () => syncVideoAction("pause", art.currentTime));
        art.on("video:seeked", () => syncVideoAction("seek", art.currentTime));
      }
    });

    return () => { if (art && art.destroy) art.destroy(); };
  }, [streamUrl, isInRoom, isHost]);

  return <div ref={artRef} className="w-full h-full min-h-[500px]"></div>;
}
