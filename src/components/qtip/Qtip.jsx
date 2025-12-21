import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import getQtip from "@/src/utils/getQtip.utils";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStar,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

function Qtip({ id }) {
  const [qtip, setQtip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQtipInfo = async () => {
      setLoading(true);
      try {
        const data = await getQtip(id);
        setQtip(data);
      } catch (err) {
        console.error("Error fetching anime info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQtipInfo();
  }, [id]);

  return (
    <div
      className="
        w-[320px] rounded-xl overflow-hidden
        bg-black
        backdrop-blur-xl
        shadow-2xl
        z-50
        animate-qtip-in
      "
    >
      {loading || error || !qtip ? (
        <div className="p-6 flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : (
        <>
          {/* SMALL BANNER IMAGE (LIKE BANNER, BUT COMPACT) */}
          <div className="relative h-[90px] w-full">
            <img
              src={qtip.poster}
              alt={qtip.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col gap-y-2">
            {/* TITLE */}
            <h1 className="text-white font-semibold text-[14px] leading-5">
              {qtip.title}
            </h1>

            {/* RATING + META */}
            <div className="w-full flex items-center gap-x-3 mt-1">
              {qtip?.rating && (
                <div className="flex gap-x-1 items-center text-white/80">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-400 text-[13px]"
                  />
                  <p className="text-[13px]">{qtip.rating}</p>
                </div>
              )}
            </div>

            {/* TRANSLUCENT PILLS */}
            <div className="flex flex-wrap gap-1 mt-1">
              {qtip?.quality && (
                <div className="px-2 py-[2px] rounded bg-white/25 backdrop-blur-md text-white text-[12px] font-semibold">
                  {qtip.quality}
                </div>
              )}

              {qtip?.subCount && (
                <div className="flex items-center gap-x-1 px-2 py-[2px] rounded bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold">
                  <FontAwesomeIcon icon={faClosedCaptioning} />
                  {qtip.subCount}
                </div>
              )}

              {qtip?.dubCount && (
                <div className="flex items-center gap-x-1 px-2 py-[2px] rounded bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold">
                  <FontAwesomeIcon icon={faMicrophone} />
                  {qtip.dubCount}
                </div>
              )}

              {qtip?.episodeCount && (
                <div className="px-2 py-[2px] rounded bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold">
                  {qtip.episodeCount} eps
                </div>
              )}

              {qtip?.type && (
                <div className="px-2 py-[2px] rounded bg-white/30 backdrop-blur-md text-white text-[12px] font-semibold">
                  {qtip.type}
                </div>
              )}
            </div>

            {/* SYNOPSIS (ORIGINAL DESCRIPTION) */}
            {qtip?.description && (
              <p className="text-white/70 text-[13px] leading-4 line-clamp-3 mt-1">
                {qtip.description}
              </p>
            )}

            {/* ORIGINAL EXTRA INFO (NOT REMOVED) */}
            <div className="flex flex-col gap-y-[2px] mt-1">
              {qtip?.japaneseTitle && (
                <p className="text-[12px] text-white/60">
                  Japanese:{" "}
                  <span className="text-white">
                    {qtip.japaneseTitle}
                  </span>
                </p>
              )}

              {qtip?.Synonyms && (
                <p className="text-[12px] text-white/60">
                  Synonyms:{" "}
                  <span className="text-white">{qtip.Synonyms}</span>
                </p>
              )}

              {qtip?.airedDate && (
                <p className="text-[12px] text-white/60">
                  Aired:{" "}
                  <span className="text-white">{qtip.airedDate}</span>
                </p>
              )}

              {qtip?.status && (
                <p className="text-[12px] text-white/60">
                  Status:{" "}
                  <span className="text-white">{qtip.status}</span>
                </p>
              )}

              {qtip?.genres && (
                <div className="text-[12px] text-white/60 flex flex-wrap">
                  Genres:&nbsp;
                  {qtip.genres.map((genre, index) => (
                    <Link
                      to={`/genre/${genre}`}
                      key={index}
                      className="hover:text-white"
                    >
                      {genre}
                      {index === qtip.genres.length - 1 ? "" : ", "}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* WHITE GLOW BUTTON */}
            <Link to={qtip.watchLink} className="mt-4">
              <button
                className="
                  inline-flex items-center justify-center gap-2
                  h-10 w-full px-8 rounded-md
                  bg-white text-black
                  text-sm font-medium
                  shadow-lg shadow-white/40
                  hover:bg-gray-200 transition
                  focus-visible:outline-none focus-visible:ring-1
                "
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Now
              </button>
            </Link>
          </div>
        </>
      )}

      {/* ENTER ANIMATION */}
      <style>{`
        @keyframes qtipIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-qtip-in {
          animation: qtipIn 0.18s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Qtip;
