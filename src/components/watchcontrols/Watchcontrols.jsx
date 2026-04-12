/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { SkipBack, SkipForward } from "lucide-react";

function Toggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-mono text-xs"
      style={{
        background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
        border: active ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
        color: active ? "#fff" : "rgba(255,255,255,0.35)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
        style={{ background: active ? "#fff" : "rgba(255,255,255,0.15)" }} />
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
    if (episodes?.length > 0)
      setIdx(episodes.findIndex(ep => ep.id.match(/ep=(\d+)/)?.[1] === episodeId));
  }, [episodeId, episodes]);

  const canPrev = idx > 0 && (!isInRoom || isHost);
  const canNext = idx < (episodes?.length ?? 0) - 1 && (!isInRoom || isHost);

  const prev = () => canPrev && onButtonClick(episodes[idx - 1].id.match(/ep=(\d+)/)?.[1]);
  const next = () => canNext && onButtonClick(episodes[idx + 1].id.match(/ep=(\d+)/)?.[1]);

  return (
    <div className="w-full flex items-center justify-between gap-3 px-3 py-2.5 flex-wrap"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <Toggle label="Auto Play"  active={autoPlay}      onClick={() => setAutoPlay(v => !v)} />
        <Toggle label="Skip Intro" active={autoSkipIntro} onClick={() => setAutoSkipIntro(v => !v)} />
        <Toggle label="Auto Next"  active={autoNext}      onClick={() => setAutoNext(v => !v)} />
      </div>
      <div className="flex items-center gap-1">
        <button onClick={prev} disabled={!canPrev} title="Previous episode"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color: canPrev ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)", cursor: canPrev ? "pointer" : "not-allowed" }}>
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <button onClick={next} disabled={!canNext} title="Next episode"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color: canNext ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)", cursor: canNext ? "pointer" : "not-allowed" }}>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
