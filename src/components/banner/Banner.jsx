// weeb/src/components/banner/Banner.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faInfoCircle, faStar, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* small helpers for tags/colors */
const TAGS = ["Popular", "Classic", "New Season", "Trending", "Fantasy", "TV"];
const TAG_COLORS = {
  Popular: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Classic: "bg-slate-700/20 text-slate-200 border-slate-600/20",
  "New Season": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Trending: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  Fantasy: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  TV: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
};

function TagPill({ tag }) {
  const cls = TAG_COLORS[tag] ?? "bg-white/10 text-white border-white/10";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold border ${cls}`}>
      {tag}
    </span>
  );
}

export default function Banner({ item, index = 0 }) {
  const { language } = useLanguage();
  if (!item) return null;

  // stable tag logic
  const tag = item.tag ?? TAGS[(Number(item.id ?? index) % TAGS.length + TAGS.length) % TAGS.length];

  const title = language === "EN" ? item.title || item.japanese_title : item.japanese_title || item.title;
  const episodes = item.tvInfo?.episodes ?? item.episodes ?? item.episodeCount ?? "??";
  const rating = item.rating ?? item.score ?? "90%";
  const year = item.tvInfo?.releaseDate ?? item.year ?? "----";

  // DEV: set this to 0 to instantly remove the banner overlay (if you need to debug)
  const OVERLAY_OPACITY = 65; // number means percentage; set 0 to remove overlay: bg-black/0

  return (
    // TOP-LEVEL container is RELATIVE so overlay can't escape to document body
    <section className="w-full relative">
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-transparent">
        {/* explicit fixed height container so overlay's bounds are correct */}
        <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">

          {/* Background image - contained in the same positioned container */}
          <img src={item.poster} alt={title} className="absolute inset-0 w-full h-full object-cover z-[10]" />

          {/* SOLID overlay scoped inside the relative container only */}
          <div
            className={`absolute inset-0 z-[20] pointer-events-none bg-black/${OVERLAY_OPACITY}`}
            aria-hidden="true"
          />

          {/* CONTENT (above overlay) */}
          <div className="absolute inset-0 flex items-end z-[30]">
            <div className="p-4 sm:p-6 lg:p-10 space-y-4 max-w-2xl pb-6 sm:pb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <TagPill tag={tag} />

                <div className="flex items-center gap-4 text-xs sm:text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 h-4 w-4 opacity-80" />
                    <span>{rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 opacity-70" />
                    <span>{year}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlay} className="h-4 w-4 opacity-70" />
                    <span>{episodes} eps</span>
                  </div>
                </div>
              </div>

              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)] leading-tight">
                {title}
              </h2>

              {item.description && (
                <p className="text-white/70 text-xs sm:text-sm lg:text-base max-w-[70%] line-clamp-3">
                  {item.description}
                </p>
              )}

              <div className="flex flex-row gap-3 mt-2">
                <Link to={`/watch/${item.id}`} className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold shadow hover:opacity-95 transition">
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Watch Now</span>
                </Link>

                <Link to={`/${item.id}`} className="inline-flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-md hover:bg-white/5 transition">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Details</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
