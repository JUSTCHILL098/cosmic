/* eslint-disable react/prop-types */
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "./Player.css";
import { useRef, useEffect, useState, useCallback } from "react";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";
import { SkipForward } from "lucide-react";

export default function Player({
  streamUrl,
  subtitles = [],
  onMediaError,
  onTimeUpdate,
  intro,
  outro,
  autoSkipIntro = false,
  onPlayerReady,
}) {
  const playerRef   = useRef(null);
  const mediaElRef  = useRef(null);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);

  // Fetch VTT files and create blob URLs so subtitles load instantly (no network lag)
  const [blobSubs, setBlobSubs] = useState([]);

  useEffect(() => {
    if (!subtitles?.length) { setBlobSubs([]); return; }
    let cancelled = false;
    const urls = [];

    Promise.all(
      subtitles.map(async (t) => {
        try {
          const res = await fetch(t.file, { mode: "cors" });
          const text = await res.text();
          const blob = new Blob([text], { type: "text/vtt" });
          const url  = URL.createObjectURL(blob);
          urls.push(url);
          return { ...t, file: url };
        } catch {
          return t; // fallback to original URL on error
        }
      })
    ).then(resolved => {
      if (!cancelled) setBlobSubs(resolved);
    });

    return () => {
      cancelled = true;
      urls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [subtitles]);

  // Wire up timeupdate on the native video element
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onReady = () => {
      const el = player.nativeEl || player.el?.querySelector("video");
      if (!el) return;
      mediaElRef.current = el;
      if (onPlayerReady) onPlayerReady(el);

      const onTime = () => {
        const t = el.currentTime;
        setCurrentTime(t);
        if (onTimeUpdate && !el.paused && el.duration > 0) onTimeUpdate(t, el.duration);

        // Skip intro automatically
        if (autoSkipIntro && intro && t >= intro.start && t < intro.end) {
          el.currentTime = intro.end;
        }
      };
      el.addEventListener("timeupdate", onTime);
      return () => el.removeEventListener("timeupdate", onTime);
    };

    player.addEventListener?.("can-play", onReady);
    // Also try immediately in case already ready
    const cleanup = onReady();
    return () => {
      player.removeEventListener?.("can-play", onReady);
      cleanup?.();
    };
  }, [streamUrl, autoSkipIntro, intro, onTimeUpdate]);

  // Show/hide skip buttons based on time
  useEffect(() => {
    setShowSkipIntro(!!(intro && currentTime >= intro.start && currentTime < intro.end));
    setShowSkipOutro(!!(outro && currentTime >= outro.start && currentTime < outro.end));
  }, [currentTime, intro, outro]);

  const skipIntro = useCallback(() => {
    if (mediaElRef.current && intro) mediaElRef.current.currentTime = intro.end;
  }, [intro]);

  const skipOutro = useCallback(() => {
    if (mediaElRef.current && outro) mediaElRef.current.currentTime = outro.end;
  }, [outro]);

  if (!streamUrl) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <BouncingLoader />
      </div>
    );
  }

  return (
    <div key={streamUrl} className="w-full h-full bg-black overflow-hidden relative">
      <MediaPlayer
        ref={playerRef}
        src={streamUrl}
        className="w-full h-full"
        crossOrigin="anonymous"
        playsInline
        onError={onMediaError}
      >
        <MediaProvider>
          {(blobSubs.length ? blobSubs : subtitles).map((track, i) => (
            <Track
              key={track.file + i}
              src={track.file}
              label={track.label || "English"}
              kind="subtitles"
              lang={track.lang || "en-US"}
              default={track.default === true || i === 0}
            />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          noScrubGesture={false}
          slots={{ pipButton: null }}
        />
      </MediaPlayer>

      {/* Skip Intro button — translucent glass */}
      {showSkipIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-16 right-4 flex items-center gap-2 font-mono text-sm font-semibold transition-all"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#fff",
            zIndex: 50,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.55)"}
        >
          <SkipForward className="w-4 h-4" />
          Skip Intro
        </button>
      )}

      {/* Skip Outro / Ending button */}
      {showSkipOutro && (
        <button
          onClick={skipOutro}
          className="absolute bottom-16 right-4 flex items-center gap-2 font-mono text-sm font-semibold transition-all"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#fff",
            zIndex: 50,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.55)"}
        >
          <SkipForward className="w-4 h-4" />
          Skip Ending
        </button>
      )}
    </div>
  );
}
