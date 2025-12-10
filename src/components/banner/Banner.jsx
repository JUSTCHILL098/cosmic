// weeb/src/components/banner/Banner.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faInfoCircle, faStar, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* Tag list + colors */
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
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${cls}`}>
      {tag}
    </span>
  );
}

export default function Banner({ item, index = 0 }) {
  const { language } = useLanguage();
  if (!item) return null;

  // Stable tag (based on id or index)
  const tagIndex = item.id ? Number(item.id) : index;
  const tag = item.tag ?? TAGS[tagIndex % TAGS.length];

  const title =
    language === "EN"
      ? item.title || item.japanese_title
      : item.japanese_title || item.title;

  const episodes =
    item.tvInfo?.episodes ?? item.episodes ?? item.episodeCount ?? "??";

  const rating = item.rating ?? item.score ?? "90%";
  const year = item.tvInfo?.releaseDate ?? item.year ?? "----";

  return (
    <section className="w-full relative">
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/20">
        <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">

          {/* Background Image */}
          <img
            src={item.poster}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover z-[10]"
          />

          {/* Solid Overlay - Safe Inline Style */}
          <div
            className="absolute inset-0 z-[20] pointer-events-none"
            style={{ backgroundColor: "rgba(0,0,0,0.60)" }}
          />

          {/* CONTENT (Moved Up) */}
          <div className="absolute inset-0 flex items-center z-[30] pt-6">
            <div className="p-4 sm:p-6 lg:p-10 space-y-4 max-w-2xl">

              {/* Tag + Info */}
              <div className="flex items-center gap-3 flex-wrap">
                <TagPill tag={tag} />

                <div className="flex items-center gap-4 text-xs sm:text-sm text-white/70">
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

              {/* Title */}
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-xl">
                {title}
              </h2>

              {/* Description */}
              {item.description && (
                <p className="text-white/70 text-xs sm:text-sm lg:text-base max-w-[75%] line-clamp-3">
                  {item.description}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-3">
                <Link
                  to={`/watch/${item.id}`}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-md font-semibold shadow hover:opacity-90 transition"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  Watch Now
                </Link>

                <Link
                  to={`/${item.id}`}
                  className="flex items-center gap-2 border border-white/30 text-white px-5 py-2 rounded-md hover:bg-white/10 transition"
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Details
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
