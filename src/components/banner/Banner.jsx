// weeb/src/components/banner/Banner.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faInfoCircle, faStar, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* Tag Colors */
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
  return (
    <span
      className={`px-3 py-1 rounded-md text-xs font-semibold border ${TAG_COLORS[tag]}`}
    >
      {tag}
    </span>
  );
}

export default function Banner({ item, index }) {
  const { language } = useLanguage();

  // ⚠️ PLACEHOLDER because we don’t know your real API fields yet
  const poster = item.poster || item.image || item.bannerImage || item.cover;
  const rating = item.rating || item.score || "90%";
  const episodes = item.totalEpisodes || item.episodes || "??";
  const year = item.year || item.releaseDate || "----";
  const description = item.description || item.synopsis || "";
  const title = language === "EN" ? item.title : item.japanese_title || item.title;

  const tag = TAGS[(item.id ?? index) % TAGS.length];

  return (
    <section className="w-full relative">
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-card/30 backdrop-blur-sm">
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">

          {/* BG Image */}
          <img src={poster} className="absolute inset-0 w-full h-full object-cover z-[10]" />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-[20]" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end z-[30] p-6 lg:p-10">
            <div className="space-y-3 max-w-2xl">

              {/* Tags + Info Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <TagPill tag={tag} />

                <div className="flex items-center gap-4 text-white/70 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                    <span>{rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{year}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlay} />
                    <span>{episodes} eps</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                {title}
              </h2>

              {/* Description */}
              <p className="text-white/70 text-xs sm:text-sm lg:text-base line-clamp-3">
                {description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/watch/${item.id}`}
                  className="bg-white text-black px-4 py-2 rounded-md font-semibold flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  Watch Now
                </Link>

                <Link
                  to={`/${item.id}`}
                  className="border border-white/20 text-white px-4 py-2 rounded-md flex items-center gap-2"
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
