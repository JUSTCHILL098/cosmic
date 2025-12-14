// weeb/src/components/banner/Banner.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faCalendar,
  faClock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";

function Banner({ item }) {
  const { language } = useLanguage();

  if (!item) return null;

  return (
    <section className="w-full h-full">
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm">

        {/* Background Image */}
        <img
          src={item.poster}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        />

        {/* Featured-style Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-[2]" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end z-[3]">
          <div className="p-4 sm:p-6 lg:p-10 space-y-4 max-w-2xl">

            {/* TAGS + META (Qtip style) */}
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm text-muted-foreground">

              {/* TYPE */}
              {item.tvInfo?.showType && (
                <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold">
                  {item.tvInfo.showType}
                </span>
              )}

              {/* DURATION */}
              {item.tvInfo?.duration && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                  <span>{item.tvInfo.duration}</span>
                </div>
              )}

              {/* YEAR */}
              {item.tvInfo?.releaseDate && (
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                  <span>{item.tvInfo.releaseDate}</span>
                </div>
              )}

              {/* QUALITY */}
              {item.tvInfo?.quality && (
                <span className="px-2 py-[2px] rounded-md bg-white/10 text-white text-xs font-bold">
                  {item.tvInfo.quality}
                </span>
              )}

              {/* SUB / DUB / EP COUNT */}
              {item.tvInfo?.episodeInfo && (
                <div className="flex rounded-md overflow-hidden">

                  {item.tvInfo.episodeInfo.sub && (
                    <div className="flex items-center gap-1 px-2 py-[2px] bg-[#B0E3AF] text-black text-xs font-semibold">
                      <FontAwesomeIcon icon={faClosedCaptioning} />
                      {item.tvInfo.episodeInfo.sub}
                    </div>
                  )}

                  {item.tvInfo.episodeInfo.dub && (
                    <div className="flex items-center gap-1 px-2 py-[2px] bg-[#B9E7FF] text-black text-xs font-semibold">
                      <FontAwesomeIcon icon={faMicrophone} />
                      {item.tvInfo.episodeInfo.dub}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TITLE */}
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
              {language === "EN" ? item.title : item.japanese_title}
            </h2>

            {/* DESCRIPTION */}
            {item.description && (
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base line-clamp-3">
                {item.description}
              </p>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                to={`/watch/${item.id}`}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-semibold"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Watch Now
              </Link>

              <Link
                to={`/${item.id}`}
                className="inline-flex items-center justify-center border border-input bg-background/40 hover:bg-background/60 px-6 py-3 rounded-md font-semibold"
              >
                Details
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
