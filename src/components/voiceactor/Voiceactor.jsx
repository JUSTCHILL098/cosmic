import { useState } from "react";
import { ChevronRight } from "lucide-react";
import VoiceactorList from "../voiceactorlist/VoiceactorList";

function Voiceactor({ animeInfo = {}, className }) {
  const [showAll, setShowAll] = useState(false);
  const chars = Array.isArray(animeInfo?.charactersVoiceActors) ? animeInfo.charactersVoiceActors : [];

  return (
    <div className={`w-full flex flex-col gap-5 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold font-mono text-white/70 uppercase tracking-widest">
          Characters &amp; Voice Actors
        </h2>
        {chars.length > 6 && (
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07] hover:bg-white/[0.10] transition-all text-xs font-mono text-white/60 hover:text-white"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {chars.slice(0, 6).map((item, i) => {
          const char = item?.character;
          const va   = item?.voiceActors?.[0];
          return (
            <div key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-black border border-white/[0.06] hover:bg-zinc-900 hover:border-white/10 transition-all group">
              {/* Character */}
              <div className="flex items-center gap-2.5 w-[48%] min-w-0">
                <img
                  src={char?.poster || "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg"}
                  alt={char?.name}
                  onError={e => { e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg"; }}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate leading-tight">{char?.name}</p>
                  {char?.cast && <p className="text-[10px] text-white/40 font-mono truncate">{char.cast}</p>}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-white/[0.06] flex-shrink-0" />

              {/* Voice Actor */}
              {va && (
                <div className="flex items-center justify-end gap-2.5 w-[48%] min-w-0">
                  <div className="min-w-0 text-right">
                    <p className="text-xs font-semibold text-white/80 truncate leading-tight">{va.name}</p>
                    {va.cast && <p className="text-[10px] text-white/40 font-mono truncate">{va.cast}</p>}
                  </div>
                  <img
                    src={va.poster || "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg"}
                    alt={va.name}
                    onError={e => { e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg"; }}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors opacity-70 group-hover:opacity-100"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAll && animeInfo?.id && (
        <VoiceactorList id={animeInfo.id} isOpen={showAll} onClose={() => setShowAll(false)} />
      )}
    </div>
  );
}

export default Voiceactor;
