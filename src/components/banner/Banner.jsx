// weeb/src/components/banner/Banner.jsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faInfoCircle,
  faStar,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Banner({ item, index }) {
  const { language } = useLanguage();

  const title =
    language === "EN"
      ? item.title || item.japanese_title
      : item.japanese_title || item.title;

  return (
    <section className="w-full">
      <div className="rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">

          {/* Background image */}
          <img
            src={item.poster}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover z-[2]"
          />

          {/* Solid dark overlay (same as your example) */}
          <div className="absolute inset-0 bg-background/80 z-[3]"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-end z-[4]">
            <div className="p-4 sm:p-6 lg:p-10 space-y-4 max-w-2xl">

              {/* Popular + info row (copy of your design) */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* Popular Badge */}
                <span className="px-2 py-[2px] bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-md text-xs sm:text-sm font-semibold">
                  Popular
                </span>

                {/* Info row */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-white/70">

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-400 h-4 w-4"
                    />
                    <span>90%</span>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                    <span>{item.tvInfo?.releaseDate || "----"}</span>
                  </div>

                  {/* Episode count */}
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
                    <span>{item.tvInfo?.episodes || "??"} eps</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white drop-shadow-md">
                {title}
              </h2>

              {/* Description */}
              <p className="text-white/70 text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-3">
                {item.description}
              </p>

              {/* Buttons (copy of your card UI) */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  to={`/watch/${item.id}`}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow"
                >
                  <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
                  Watch Now
                </Link>

                <Link
                  to={`/${item.id}`}
                  className="border border-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition"
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4" />
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
