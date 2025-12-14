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
import "./Banner.css";

const TAGS = ["Popular", "Trending", "New", "Classic", "TV", "Fantasy"];
const TAG_COLORS = {
  Popular: "bg-[#ffbade]/20 text-[#ffbade]",
  Trending: "bg-[#ff7a7a]/20 text-[#ff7a7a]",
  New: "bg-[#7affc4]/20 text-[#7affc4]",
  Classic: "bg-white/15 text-white",
  TV: "bg-[#7ab7ff]/20 text-[#7ab7ff]",
  Fantasy: "bg-[#c77aff]/20 text-[#c77aff]",
};

function Banner({ item, index }) {
  const { language } = useLanguage();
  if (!item) return null;

  const tag = TAGS[index % TAGS.length];

  return (
    <section className="spotlight w-full h-full relative rounded-2xl overflow-hidden">
      {/* IMAGE */}
      <img
        src={item.poster}
        alt={item.title}
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* DARK CINEMATIC GRADIENT (FIXED) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* CONTENT */}
      <div className="absolute left-0 bottom-14 w-[55%] p-6 z-[2]
                      max-[1120px]:w-[70%]
                      max-md:w-[90%]
                      max-md:bottom-8">

        {/* TAG + META */}
        <div className="flex items-center gap-3 flex-wrap text-sm text-white/70">

          {/* TAG */}
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${TAG_COLORS[tag]}`}
          >
            {tag}
          </span>

          {/* RATING */}
          {item.rating && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              <span>{item.rating}</span>
            </div>
          )}

          {/* YEAR */}
          {item.tvInfo?.releaseDate && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} />
              <span>{item.tvInfo.releaseDate}</span>
            </div>
          )}

          {/* DURATION */}
          {item.tvInfo?.duration && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} />
              <span>{item.tvInfo.duration}</span>
            </div>
          )}
        </div>

        {/* TITLE */}
        <h3 className="text-white text-4xl font-bold mt-4 leading-tight
                       max-md:text-2xl">
          {language === "EN" ? item.title : item.japanese_title}
        </h3>

        {/* DESCRIPTION */}
        {item.description && (
          <p className="text-white/70 mt-3 line-clamp-3 max-w-xl text-sm">
            {item.description}
          </p>
        )}

        {/* SUB / DUB / QUALITY */}
        {item.tvInfo && (
          <div className="flex items-center gap-3 mt-4">

            {item.tvInfo.quality && (
              <span className="bg-white/15 px-2 py-1 rounded text-xs font-bold">
                {item.tvInfo.quality}
              </span>
            )}

            {item.tvInfo.episodeInfo?.sub && (
              <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
                <FontAwesomeIcon icon={faClosedCaptioning} />
                {item.tvInfo.episodeInfo.sub}
              </span>
            )}

            {item.tvInfo.episodeInfo?.dub && (
              <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-xs">
                <FontAwesomeIcon icon={faMicrophone} />
                {item.tvInfo.episodeInfo.dub}
              </span>
            )}
          </div>
        )}

        {/* BUTTONS (FIXED — NO CUTTING) */}
        <div className="flex gap-4 mt-6">

          <Link
            to={`/watch/${item.id}`}
            className="inline-flex items-center gap-2
                       bg-white text-black px-6 py-3
                       rounded-lg font-semibold
                       hover:bg-gray-200 transition"
          >
            <FontAwesomeIcon icon={faPlay} />
            Watch Now
          </Link>

          <Link
            to={`/${item.id}`}
            className="inline-flex items-center gap-2
                       bg-white/10 border border-white/20
                       text-white px-6 py-3 rounded-lg
                       hover:bg-white/20 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Banner;
