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
import { Link, useNavigate } from "react-router-dom";

function Qtip({ id, poster }) {
  const [qtip, setQtip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
        w-[320px]
        h-fit
        rounded-xl
        overflow-hidden
        bg-black
        shadow-2xl
        z-50
        pointer-events-auto
        animate-qtip-in
      "
    >
      {loading || error || !qtip ? (
        <div className="p-6 flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : (
        <>
          {/* IMAGE — EXACT SAME STRUCTURE AS BANNER */}
          {poster && (
            <div className="relative w-full h-[90px]">
              <img
                src={poster}
                alt={qtip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>
          )}

          {/* CONTENT WRAPPER */}
          <div className="w-full flex flex-col justify-start gap-y-2 p-4">

            {/* TITLE */}
            <h1 className="text-xl font-semibold text-white text-[13px] leading-6">
              {qtip.title}
            </h1>

            {/* RATING */}
            <div className="w-full flex items-center relative mt-1">
              {qtip?.rating && (
                <div className="flex gap-x-2 items-center">
                  <FontAwesomeIcon icon={faStar} className="text-[#ffc107]" />
                  <p className="text-[#b7b7b8] text-[13px]">
                    {qtip.rating}
                  </p>
                </div>
              )}
            </div>

            {/* QUALITY / SUB / DUB / EPS / TYPE */}
            <div className="flex flex-wrap gap-x-[4px] gap-y-[4px] mt-1">

              {qtip?.quality && (
                <div className="bg-white/25 backdrop-blur-md px-[7px] py-[1px] rounded text-white">
                  <p className="text-[12px] font-semibold">
                    {qtip.quality}
                  </p>
                </div>
              )}

              {qtip?.subCount && (
                <div className="flex gap-x-1 items-center bg-white/20 backdrop-blur-md px-[7px] py-[1px] rounded text-white">
                  <FontAwesomeIcon
                    icon={faClosedCaptioning}
                    className="text-[12px]"
                  />
                  <p className="text-[12px] font-semibold">
                    {qtip.subCount}
                  </p>
                </div>
              )}

              {qtip?.dubCount && (
                <div className="flex gap-x-1 items-center bg-white/20 backdrop-blur-md px-[7px] py-[1px] rounded text-white">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[12px]"
                  />
                  <p className="text-[12px] font-semibold">
                    {qtip.dubCount}
                  </p>
                </div>
              )}

              {qtip?.episodeCount && (
                <div className="flex gap-x-1 items-center bg-white/20 backdrop-blur-md px-[7px] py-[1px] rounded text-white">
                  <p className="text-[12px] font-semibold">
                    {qtip.episodeCount} eps
                  </p>
                </div>
              )}

              {qtip?.type && (
                <div className="flex gap-x-1 items-center bg-white/30 backdrop-blur-md px-[7px] py-[1px] rounded text-white">
                  <p className="text-[12px] font-semibold">
                    {qtip.type}
                  </p>
                </div>
              )}
            </div>

            {/* SYNOPSIS (ORIGINAL DESCRIPTION — NOT REMOVED) */}
            {qtip?.description && (
              <p className="text-[#d7d7d8] text-[13px] leading-4 font-light line-clamp-3 mt-1">
                {qtip.description}
              </p>
            )}

            {/* EXTRA INFO — ALL ORIGINAL FIELDS */}
            <div className="flex flex-col mt-1 gap-y-[2px]">

              {qtip?.japaneseTitle && (
                <div className="leading-4">
                  <span className="text-[#b7b7b8] text-[13px]">
                    Japanese:&nbsp;
                  </span>
                  <span className="text-[13px] text-white">
                    {qtip.japaneseTitle}
                  </span>
                </div>
              )}

              {qtip?.Synonyms && (
                <div className="leading-4">
                  <span className="text-[#b7b7b8] text-[13px]">
                    Synonyms:&nbsp;
                  </span>
                  <span className="text-[13px] text-white">
                    {qtip.Synonyms}
                  </span>
                </div>
              )}

              {qtip?.airedDate && (
                <div className="leading-4">
                  <span className="text-[#b7b7b8] text-[13px]">
                    Aired:&nbsp;
                  </span>
                  <span className="text-[13px] text-white">
                    {qtip.airedDate}
                  </span>
                </div>
              )}

              {qtip?.status && (
                <div className="leading-4">
                  <span className="text-[#b7b7b8] text-[13px]">
                    Status:&nbsp;
                  </span>
                  <span className="text-[13px] text-white">
                    {qtip.status}
                  </span>
                </div>
              )}

              {qtip?.genres && (
                <div className="leading-4 flex flex-wrap text-wrap">
                  <span className="text-[#b7b7b8] text-[13px]">
                    Genres:&nbsp;
                  </span>
                  {qtip.genres.map((genre, index) => (
                    <Link
                      to={`/genre/${genre}`}
                      key={index}
                      className="text-[13px] text-white hover:underline"
                    >
                      {genre}
                      {index === qtip.genres.length - 1 ? "" : ", "}
                    </Link>
                  ))}
                </div>
              )}

            </div>

            {/* WATCH NOW — CLICK SAFE */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                navigate(qtip.watchLink);
              }}
              className="
                w-full
                mt-4
                inline-flex items-center justify-center gap-2
                h-10 px-8 rounded-md
                bg-white text-black
                text-sm font-medium
                shadow-lg shadow-white/40
                hover:bg-gray-200 transition
              "
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Now
            </button>

          </div>
        </>
      )}

      {/* SCALE + FADE IN ANIMATION */}
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
