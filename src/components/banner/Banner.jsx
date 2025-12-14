import {
  Play,
  Info,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";

const GENRE_COLORS = {
  Action: "bg-red-600",
  Adventure: "bg-orange-600",
  Fantasy: "bg-purple-600",
  Drama: "bg-blue-600",
  Romance: "bg-pink-600",
  Comedy: "bg-yellow-500 text-black",
  Horror: "bg-emerald-600",
  SciFi: "bg-cyan-600",
  Isekai: "bg-indigo-600",
  Default: "bg-zinc-700",
};

export default function Banner({ item }) {
  const { language } = useLanguage();
  if (!item) return null;

  const title =
    language === "EN" ? item.title : item.japanese_title ?? item.title;

  const genre = item.genres?.[0] ?? "Default";
  const tagColor = GENRE_COLORS[genre] || GENRE_COLORS.Default;

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
      <div className="absolute left-0 bottom-12 z-[2] w-[55%] px-8
                      max-lg:w-[70%]
                      max-md:w-[90%]
                      max-md:bottom-8">

        {/* META ROW (FIXED HEIGHT) */}
        <div className="flex items-center gap-3 h-8 text-sm text-white/80">

          {/* GENRE TAG */}
          <span
            className={`px-3 py-1 rounded-md font-semibold text-xs text-white ${tagColor}`}
          >
            {genre}
          </span>

          {/* RATING */}
          {item.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{item.rating}</span>
            </div>
          )}

          {/* YEAR */}
          {item.tvInfo?.releaseDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{item.tvInfo.releaseDate}</span>
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

        {/* BUTTONS (LUCIDE, SAME HEIGHT) */}
        <div className="mt-6 flex gap-4">

          <Link
            to={`/watch/${item.id}`}
            className="h-11 px-6 inline-flex items-center gap-2
                       bg-white text-black rounded-lg font-semibold
                       hover:bg-gray-200 transition"
          >
            <Play className="h-4 w-4" />
            Watch Now
          </Link>

          <Link
            to={`/${item.id}`}
            className="h-11 px-6 inline-flex items-center gap-2
                       bg-zinc-800 border border-zinc-700
                       text-white rounded-lg
                       hover:bg-zinc-700 transition"
          >
            <Info className="h-4 w-4" />
            Details
          </Link>
        </div>
      </div>
    </section>
  );
}
