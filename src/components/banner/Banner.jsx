import { Play, Star, Calendar, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";

/* RANDOM TAGS */
const TAGS = [
  { label: "Classic", cls: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { label: "Trending", cls: "bg-red-500/10 text-red-600 border-red-500/20" },
  { label: "New Season", cls: "bg-green-500/10 text-green-600 border-green-500/20" },
  { label: "Fantasy", cls: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { label: "Popular", cls: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
];

/* pick stable random tag per banner */
function pickTag(seed) {
  return TAGS[seed % TAGS.length];
}

export default function Banner({ item, index = 0 }) {
  const { language } = useLanguage();
  if (!item) return null;

  const title =
    language === "EN"
      ? item.title
      : item.japanese_title ?? item.title;

  const tag = pickTag(index);

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

      {/* DARK GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-[1]" />

      {/* CONTENT */}
      <div className="absolute left-0 bottom-14 z-[2]
                      w-[55%] px-10
                      max-lg:w-[70%]
                      max-md:w-[90%]
                      max-md:bottom-10">

        {/* TAG + META */}
        <div className="flex items-center gap-4 h-8 text-sm">

          {/* TAG (GLASSY, SHADCN STYLE) */}
          <div
            className={`inline-flex items-center rounded-md px-2.5 py-0.5
                        font-semibold border shadow
                        backdrop-blur-sm text-xs sm:text-sm
                        ${tag.cls}`}
          >
            {tag.label}
          </div>

          {/* RATING */}
          {rating && (
            <div className="flex items-center gap-1 text-white/80">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{rating}</span>
            </div>
          )}

          {/* YEAR */}
          {year && (
            <div className="flex items-center gap-1 text-white/70">
              <Calendar className="h-4 w-4" />
              <span>{year}</span>
            </div>
          )}

          {/* EPS */}
          {episodes && (
            <div className="flex items-center gap-1 text-white/70">
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

        {/* BUTTONS */}
        <div className="mt-6 flex gap-4">

          {/* WATCH NOW (WHITE) */}
          <Link
            to={`/watch/${item.id}`}
            className="inline-flex items-center justify-center gap-2
                       h-10 px-8 rounded-md
                       bg-white text-black
                       text-sm font-medium
                       shadow hover:bg-gray-200
                       transition-colors"
          >
            <Play className="h-4 w-4" />
            Watch Now
          </Link>

          {/* DETAILS (GLASS) */}
          <Link
            to={`/${item.id}`}
            className="inline-flex items-center justify-center gap-2
                       h-10 px-8 rounded-md
                       bg-black/40 backdrop-blur-sm
                       border border-white/20
                       text-white text-sm font-medium
                       hover:bg-black/60
                       transition-colors"
          >
            <Info className="h-4 w-4" />
            Details
          </Link>

        </div>
      </div>
    </section>
  );
}
