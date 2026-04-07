/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { SkipBack, SkipForward, Play, SkipForward as SkipIntroIcon, ChevronRight } from "lucide-react";

function Toggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-mono text-xs"
      style={{
        background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
        border: active ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
        color: active ? "#fff" : "rgba(255,255,255,0.4)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
        style={{ background: active ? "#fff" : "rgba(255,255,255,0.2)" }}
      />
      {label}
    </button>
  );
}

export default function Watchcontrols({
  autoPlay, setAutoPlay,
  autoSkipIntro, setAutoSkipIntro,
  autoNext, setAutoNext,
  episodeId, episodes = [],
  onButtonClick,
  isInRoom = false, isHost = false,
}) {
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (episodes?.length > 0) {
      setIdx(episodes.findIndex(ep => ep.id.match(/ep=(\d+)/)?.[1] === episodeId));
    }
  }, [episodeId, episodes]);

  const canPrev = idx > 0 && (!isInRoom || isHost);
  const canNext = idx < (episodes?.length ?? 0) - 1 && (!isInRoom || isHost);

  const prev = () => canPrev && onButtonClick(episodes[idx - 1].id.match(/ep=(\d+)/)?.[1]);
  const next = () => canNext && onButtonClick(episodes[idx + 1].id.match(/ep=(\d+)/)?.[1]);

  return (
    <div
      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 flex-wrap"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Toggles */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Toggle label="Auto Play"   active={autoPlay}      onClick={() => setAutoPlay(v => !v)} />
        <Toggle label="Skip Intro"  active={autoSkipIntro} onClick={() => setAutoSkipIntro(v => !v)} />
        <Toggle label="Auto Next"   active={autoNext}      onClick={() => setAutoNext(v => !v)} />
      </div>

      {/* Prev / Next */}
      <div className="flex items-center gap-1">
        <button
          onClick={prev} disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: canPrev ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
            cursor: canPrev ? "pointer" : "not-allowed",
          }}
          title="Previous episode"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={next} disabled={!canNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: canNext ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
            cursor: canNext ? "pointer" : "not-allowed",
          }}
          title="Next episode"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
