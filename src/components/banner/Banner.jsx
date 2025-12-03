// weeb/src/components/banner/Banner.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faCalendar,
  faClock,
  faInfoCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function Pill({ children, className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-semibold " +
        className
      }
    >
      {children}
    </span>
  );
}

export default function Banner({ item, index = 0 }) {
  const { language } = useLanguage();

  if (!item) return null;

  const title =
    language === "EN" ? item.title || item.japanese_title : item.japanese_title || item.title;

  return (
    <section className="w-full">
      {/* Outer card visual (uses Tailwind utilities — replace if you use a UI Card) */}
      <div className="relative rounded-2xl overflow-hidden border-0 bg-black/0">
        {/* height - same as your featured example */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">

          {/* Background image */}
          <div className="absolute inset-0 z-10">
            <img
              src={item.poster}
              alt={title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* SOLID overlay (not gradient) */}
          {/* Use bg-black/60 or adjust to your theme color; this is a semitransparent solid */}
          <div className="absolute inset-0 bg-black/60 z-20 backdrop-blur-sm"></div>

          {/* Content placed above overlay */}
          <div className="absolute inset-0 flex items-end z-30">
            <div className="p-4 sm:p-6 lg:p-10 space-y-3 sm:space-y-4 max-w-2xl">
              {/* Top row: Badge + small info */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Badge (Popular) */}
                <Pill className="bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Popular
                </Pill>

                {/* Info mini row */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-[14px]" />
                    <span>90%</span>
                  </div>

                  {item.tvInfo?.releaseDate && (
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendar} className="text-[14px]" />
                      <span>{item.tvInfo.releaseDate}</span>
                    </div>
                  )}

                  {item.tvInfo?.episodes && (
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faPlay} className="text-[14px]" />
                      <span>{item.tvInfo.episodes} eps</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Title */}
              <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold">
                {title}
              </h2>

              {/* Short description */}
              {item.description && (
                <p className="text-white/70 text-xs sm:text-sm lg:text-base line-clamp-2 lg:line-clamp-3 max-w-[70%]">
                  {item.description}
                </p>
              )}

              {/* Buttons — mobile / small screens inside main content */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                <Link
                  to={`/watch/${item.id}`}
                  className="inline-flex items-center gap-2 bg-white text-black font-medium px-4 py-2 rounded-md shadow hover:opacity-95 transition"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Watch Now</span>
                </Link>

                <Link
                  to={`/${item.id}`}
                  className="inline-flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-md hover:bg-white/5 transition"
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Details</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop floating action buttons (bottom-right) */}
          <div className="absolute bottom-[30px] right-[30px] z-40 hidden md:flex gap-3">
            <Link
              to={`/watch/${item.id}`}
              className="flex items-center gap-2 bg-white text-black font-medium px-5 py-2 rounded-lg shadow-lg hover:translate-y-[-2px] transition"
            >
              <FontAwesomeIcon icon={faPlay} />
              <span>Watch Now</span>
            </Link>

            <Link
              to={`/${item.id}`}
              className="flex items-center gap-2 border border-white/20 text-white px-5 py-2 rounded-lg hover:bg-white/5 transition"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
