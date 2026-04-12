/* eslint-disable react/prop-types */
// Dedicated HLS player for movie streams (raffaellocdn etc.)
// Uses hls.js directly with xhrSetup to inject Referer header client-side
// This avoids server-side proxy which gets IP-blocked by the CDN
import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { SkipForward, Volume2, VolumeX, Maximize, Pause, Play as PlayIcon } from "lucide-react";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";

export default function MoviePlayer({
  streamUrl,
  subtitles = [],
  headers = {},
  onMediaError,
  onTimeUpdate,
}) {
  const videoRef    = useRef(null);
  const hlsRef      = useRef(null);
  const [ready,     setReady]     = useState(false);
  const [playing,   setPlaying]   = useState(false);
  const [muted,     setMuted]     = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [showCtrl,  setShowCtrl]  = useState(true);
  const hideTimer   = useRef(null);

  const referer = headers?.Referer || headers?.referer || "https://streameeeeee.site/";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setReady(false);
    setBuffering(true);
    setProgress(0);
    setDuration(0);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        // Inject Referer on every XHR request — this is what raffaellocdn checks
        xhrSetup: (xhr, url) => {
          xhr.setRequestHeader("Referer", referer);
        },
        fetchSetup: (context, initParams) => {
          initParams.headers = {
            ...(initParams.headers || {}),
            "Referer": referer,
          };
          return new Request(context.url, initParams);
        },
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setReady(true);
        setBuffering(false);
        video.play().catch(() => {});
        setPlaying(true);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setBuffering(false);
          onMediaError?.(data);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setReady(true);
        setBuffering(false);
        video.play().catch(() => {});
        setPlaying(true);
      });
    }

    const onWaiting  = () => setBuffering(true);
    const onPlaying  = () => { setBuffering(false); setPlaying(true); };
    const onPause    = () => setPlaying(false);
    const onTime     = () => {
      setProgress(video.currentTime);
      if (onTimeUpdate && !video.paused && video.duration > 0) {
        onTimeUpdate(video.currentTime, video.duration);
      }
    };
    const onMeta     = () => setDuration(video.duration);

    video.addEventListener("waiting",        onWaiting);
    video.addEventListener("playing",        onPlaying);
    video.addEventListener("pause",          onPause);
    video.addEventListener("timeupdate",     onTime);
    video.addEventListener("loadedmetadata", onMeta);

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeEventListener("waiting",        onWaiting);
      video.removeEventListener("playing",        onPlaying);
      video.removeEventListener("pause",          onPause);
      video.removeEventListener("timeupdate",     onTime);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [streamUrl, referer]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const seek = useCallback((e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  }, [duration]);

  const fullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  }, []);

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const showControls = () => {
    setShowCtrl(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowCtrl(false), 3000);
  };

  return (
    <div
      className="relative w-full h-full bg-black group"
      onMouseMove={showControls}
      onMouseLeave={() => { clearTimeout(hideTimer.current); hideTimer.current = setTimeout(() => setShowCtrl(false), 1000); }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        crossOrigin="anonymous"
      />

      {/* Subtitle tracks */}
      {subtitles.map((t, i) => (
        <track
          key={i}
          src={t.file}
          kind="subtitles"
          label={t.label || "English"}
          default={t.default || i === 0}
        />
      ))}

      {/* Buffering spinner */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <BouncingLoader />
        </div>
      )}

      {/* Controls overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end transition-opacity duration-300"
        style={{ opacity: showCtrl ? 1 : 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="px-4 pb-1 cursor-pointer" onClick={seek}>
          <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-full rounded-full bg-white transition-all"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={togglePlay} className="text-white hover:text-white/70 transition-colors">
            {playing ? <Pause className="w-5 h-5 fill-current" /> : <PlayIcon className="w-5 h-5 fill-current" />}
          </button>
          <button onClick={toggleMute} className="text-white hover:text-white/70 transition-colors">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-white/60 font-mono text-xs ml-1">
            {fmt(progress)} / {fmt(duration)}
          </span>
          <div className="flex-1" />
          <button onClick={fullscreen} className="text-white hover:text-white/70 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
