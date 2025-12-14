import { Play, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";

/* GENRE → COLOR MAP */
const GENRE_COLORS = {
  Action: "#DC2626",      // red
  Adventure: "#D97706",   // orange
  Fantasy: "#2563EB",     // blue
  Drama: "#059669",       // green
  Comedy: "#D97706",
  Romance: "#2563EB",
  Horror: "#DC2626",
  SciFi: "#2563EB",
  Default: "#2563EB",
};

export default function Banner({ item }) {
  const { language } = useLanguage();
  if (!item) return null;

  const title =
    language === "EN"
      ? item.title
      : item.japanese_title ?? item.title;

  const genre =
    Array.isArray(item.genres) && item.genres.length > 0
      ? item.genres[0]
      : "Default";

  const tagColor = GENRE_COLORS[genre] || GENRE_COLORS.Default;

  const rating = item.rating || item.score || null;
  const episodes =
    item.episodeCount ||
    item.tvInfo?.episodeInfo?.sub ||
    item.tvInfo?.episodeInfo?.dub ||
    null;

  const year =
    item.tvInfo?.releaseDate ||
    item.airedDate ||
    null;

  return (
    <section className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* IMAGE */}
      <img
        src={item.poster}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* DARK SOLID GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-[1]" />

      {/* CONTENT */}
      <div className="absolute left-0 bottom-14 z-[2]
                      w-[55%] px-10
                      max-lg:w-[70%]
                      max-md:w-[90%]
                      max-md:bottom-10">

        {/* META ROW */}
        <div className="flex items-center gap-4 h-8 text-sm text-white/80">

          {/* GENRE TAG */}
          <span
            className="px-3 py-1 rounded-md text-xs font-semibold text-white"
            style={{ backgroundColor: tagColor }}
          >
            {genre}
          </span>

          {/* RATING */}
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{rating}</span>
            </div>
          )}

          {/* DATE */}
          {year && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{year}</span>
            </div>
          )}

          {/* EPISODES */}
          {episodes && (
            <div className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              <span>{episodes} eps</span>
            </div>
          )}
        </div>

        {/* TITLE */}
        <h2 className="mt-4 text-4xl font-bold text-white leading-tight
                       max-md:text-2xl">
          {title}
        </h2>

        {/* DESCRIPTION */}
        {item.description && (
          <p className="mt-3 max-w-xl text-sm text-white/70 line-clamp-3">
            {item.description}
          </p>
        )}

        {/* BUTTONS (SHADCN STYLE) */}
        <div className="mt-6 flex gap-4">

          {/* WATCH NOW */}
          <Link
            to={`/watch/${item.id}`}
            className="inline-flex items-center justify-center gap-2
                       whitespace-nowrap text-sm font-medium
                       h-10 px-8 rounded-md
                       bg-primary text-primary-foreground
                       shadow hover:bg-primary/90
                       transition-colors"
          >
            <Play className="h-4 w-4" />
            Watch Now
          </Link>

          {/* DETAILS */}
          <Link
            to={`/${item.id}`}
            className="inline-flex items-center justify-center gap-2
                       whitespace-nowrap text-sm font-medium
                       h-10 px-8 rounded-md
                       bg-black/40 text-white
                       border border-white/20
                       hover:bg-black/60
                       transition-colors"
          >
            Details
          </Link>

        </div>
      </div>
    </section>
  );
}
