// weeb/src/components/banner/Banner.jsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faCalendar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// ✅ FIXED: This path now works in Vercel
import { useLanguage } from "../../context/LanguageContext";

function Banner({ item, index }) {
  const { language } = useLanguage();

  if (!item) return null;

  const titleToShow =
    language === "EN"
      ? item.title || item.japanese_title
      : item.japanese_title || item.title;

  return (
    <section className="w-full h-full relative rounded-2xl overflow-hidden">
      {/* Background image */}
      <img
        src={item.poster}
        alt={item.title}
        className="absolute inset-0 object-cover w-full h-full rounded-2xl"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-[1]" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="p-4 sm:p-6 lg:p-10 space-y-3 sm:space-y-4 max-w-2xl">

          {/* Spotlight label */}
          <p className="text-[#b67fff] font-semibold text-sm sm:text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            #{index + 1} Spotlight
          </p>

          {/* Title */}
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {titleToShow}
          </h2>

          {/* Info Row */}
          {item.tvInfo && (
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/80 mt-2">
              {item.tvInfo.showType && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="text-[10px] bg-white/10 text-white px-[4px] py-[3px] rounded-full"
                  />
                  <span>{item.tvInfo.showType}</span>
                </div>
              )}

              {item.tvInfo.duration && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="text-[12px]" />
                  <span>{item.tvInfo.duration}</span>
                </div>
              )}

              {item.tvInfo.releaseDate && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendar} className="text-[12px]" />
                  <span>{item.tvInfo.releaseDate}</span>
                </div>
              )}

              {item.tvInfo.quality && (
                <span className="bg-white/10 px-2 py-[2px] rounded text-[11px] font-bold">
                  {item.tvInfo.quality}
                </span>
              )}

              {(item.tvInfo.episodeInfo?.sub || item.tvInfo.episodeInfo?.dub) && (
                <div className="flex overflow-hidden rounded">
                  {item.tvInfo.episodeInfo?.sub && (
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-[2px]">
                      <FontAwesomeIcon icon={faClosedCaptioning} className="text-[12px]" />
                      <span className="text-[12px] font-bold">
                        {item.tvInfo.episodeInfo.sub}
                      </span>
                    </div>
                  )}
                  {item.tvInfo.episodeInfo?.dub && (
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-[2px]">
                      <FontAwesomeIcon icon={faMicrophone} className="text-[12px]" />
                      <span className="text-[12px] font-semibold">
                        {item.tvInfo.episodeInfo.dub}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Description (desktop only) */}
          {item.description && (
            <p className="text-white/70 text-xs sm:text-sm lg:text-base mt-2 line-clamp-3 max-md:hidden drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {item.description}
            </p>
          )}

          {/* Mobile buttons */}
          <div className="flex gap-3 mt-3 w-full md:hidden">
            <Link
              to={`/watch/${item.id}`}
              className="bg-white/90 hover:bg-white text-black font-medium px-5 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shadow-md"
            >
              <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
              <span>Watch Now</span>
            </Link>

            <Link
              to={`/${item.id}`}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium px-5 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <span>Details</span>
            </Link>
          </div>
        </div>

        {/* Desktop buttons */}
        <div className="absolute bottom-10 right-10 gap-4 hidden md:flex">
          <Link
            to={`/watch/${item.id}`}
            className="bg-white/90 hover:bg-white text-black font-medium px-7 py-2 rounded-lg transition-all duration-200 flex items-center gap-2.5 shadow-lg shadow-black/10 backdrop-blur-sm hover:translate-y-[-1px]"
          >
            <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
            <span>Watch Now</span>
          </Link>

          <Link
            to={`/${item.id}`}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium px-7 py-2 rounded-lg transition-all duration-200 flex items-center gap-2.5 backdrop-blur-sm hover:translate-y-[-1px]"
          >
            <span>Details</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Banner;
